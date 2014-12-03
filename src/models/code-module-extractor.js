/*
 * code-module-extractor.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var FS          = require('fs'),                    // file system
    Q           = require('q'),                     // `kriskowal/q` promises
    path        = require('path'),                  // utils for resolving file paths
    arrayHelper = require('../misc/array-helper'),  // array helper methods
    astHelper   = require('../misc/ast-helper'),    // AST helper methods
    fsHelper    = require('../misc/fs-helper'),     // file system helper methods
    CodeModule  = require('../models/code-module'); // represents a "module" of code

// exports
module.exports = CodeModuleExtractor;

// aliases
var readFile = Q.nfbind(FS.readFile),  // add Q promise support to FS.readile
    isArray  = Array.isArray;

/**
 * Constructs an object that provides methods for extracting code modules from JavaScript text. 
 * 
 * @param {String}   types    - array of supported module loaders (e.g. AngularJS, RequireJS, CommonJS)
 * @param {Function} fromText - function that extracts code modules from text
 */
function CodeModuleExtractor(types, fromText) {

  // ensure that this function is invoked with the 'new' operator
  if(this instanceof CodeModuleExtractor === false) {
    console.log('[warn] forgot to use "new" operator when invoking CodeModuleExtractor(): ' + types);
    return new CodeModuleExtractor(types, fromText);
  }

  // validate arguments
  if(!isArray(types))       throw new Error('[error] invalid argument "types" = ' + types);
  if(!isFunction(fromText)) throw new Error('[error] invalid argument "fromText"     = ' + fromText);

  // maintain a reference to `this`
  var self = this;

  /**
   * Parses JavaScript text and produces an array of `CodeModule` objects, one for each module defined in the text.
   * 
   * @param {String} filePath     - relative path of the JavaScript file
   * @param {String} fileContents - the JavaScript text
   * 
   * @return {Array} An array of `CodeModule` objects.
   */
  this.fromText = function(filePath, fileContents) {
    // validate arguments
    if(!isString(filePath))     throw new Error('[error] invalid argument "filePath" = ' + filePath);
    if(!isString(fileContents)) throw new Error('[error] invalid argument "text" = ' + fileContents);

    // invoke the client's extraction function
    return fromText(filePath, fileContents);
  };

  /**
   * Parses a JavaScript file and produces an array of `CodeModule` objects, one for each module defined in the files.
   *
   * @param {String}   filePath - relative path of the JavaSript file to parse
   * @param {String}   cwd      - directory that `filePath` is relative to (defaults to process.cwd())
   * @param {String}   encoding - the file's encoding (e.g. "utf-8")
   * @param {Function} callback - (optional) callback to invoke with the final result
   *
   * @return {Promise} A promise to produce an array of `CodeModule` objects.
   */
  this.fromFile = function(filePath, cwd, encoding, callback) {
    // validate arguments
    if(!isString(filePath)) throw new Error('[error] invalid argument "filePath" = ' + filePath);

    // set optional arguments to default values (if not provided)
    cwd      = cwd      || process.cwd();
    encoding = encoding || 'utf-8';

    // initiate module extraction
    var absolutePath = path.resolve(cwd, filePath),
        promise      = readFile(absolutePath, encoding).then(extractCodeModules);

    function extractCodeModules(text) {
      return self.fromText(filePath, text);
    }

    // make this function work with both promises and nodejs callbacks
    promise.nodeify(callback);
    return promise;
  };

  /**
   * Parses JavaScript file(s) and produces an array of `CodeModule` objects, one for each module defined in the file(s).
   *
   * @param {Array}    filePaths - relative paths of the JavaSript file(s) to parse
   * @param {String}   cwd       - directory that `filePaths` are relative to (defaults to process.cwd())
   * @param {String}   encoding  - the encoding of the files (defaults to "utf-8")
   * @param {Function} callback  - (optional) callback to invoke with the final result
   *
   * @return {Promise} A promise to produce an array of `CodeModule` objects.
   */
  this.fromFiles = function(filePaths, cwd, encoding, callback) {
    // validate arguments
    if(!isArray(filePaths)) throw new Error('[error] invalid argument "filePaths" = ' + filePaths);

    // set optional arguments to default values (if not provided)
    cwd      = cwd      || process.cwd();
    encoding = encoding || 'utf-8';

    // initiate module extraction and collect the promises
    var promises = [];
    filePaths.forEach(function(filePath) {
      promises.push(self.fromFile(filePath, cwd, encoding));
    });

    // combine promises and flatten results into a single array
    var promise = Q.all(promises).then(arrayHelper.flatten);

    // make this function work with both promises and nodejs callbacks
    promise.nodeify(callback);
    return promise;
  };

  /**
   * Parses all files matched via the provided glob patterns in the specified directory and
   * produces an array of `CodeModule` objects, one for each module defined in the files.
   *
   * @param {Array}    patterns - an array of glob patterns for matching files
   * @param {String}   cwd      - the directory to search in for files (defaults to process.cwd())
   * @param {String}   encoding - the encoding of the files (e.g. "utf-8")
   * @param {Function} callback - (optional) callback to invoke with the final result
   *
   * @return {Promise} A promise to produce an array of `CodeModule` objects.
   */
  this.fromDirectory = function(patterns, cwd, encoding, callback) {
    // set arguments to default values if not provided
    cwd      = cwd      || process.cwd();
    patterns = patterns || ['**/*.js'];
    encoding = encoding || 'utf-8';
    
    // initiate module extraction
    var promise = fsHelper.locateFiles(patterns, cwd).then(extractCodeModules);

    function extractCodeModules(filePaths) {
      return self.fromFiles(filePaths, cwd, encoding);
    }

    // make this function work with both promises and nodejs callbacks
    promise.nodeify(callback);
    return promise;
  };

}

/**
 * Checks if an object is a Function. Pure duck-typing implementation by Underscore.js
 * 
 * @param  {Object}  object - might be a Function
 * 
 * @return {Boolean} True if `object` is a Function. False otherwise.
 */
function isFunction(o) {
  return !!(o && o.constructor && o.call && o.apply);
}

/**
 * Checks if an object is a String.
 * 
 * @param  {Object}  object - might be a String
 * 
 * @return {Boolean} True if `object` is a String. False otherwise.
 */
function isString(o) {
  return (Object.prototype.toString.call(o) === '[object String]');
}