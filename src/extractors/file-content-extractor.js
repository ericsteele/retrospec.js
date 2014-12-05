/*
 * file-content-extractor.js
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
    fsHelper    = require('../misc/fs-helper');     // file system helper methods

// aliases
var readFile = Q.nfbind(FS.readFile),  // add Q promise support to FS.readile
    isArray  = Array.isArray;

// exports
module.exports = FileContentExtractor;

/**
 * Constructs an object that provides methods for extracting content from a file's text. 
 * 
 * @param {String}   id          - a unique identifier for the extractor
 * @param {Function} extractorFn - function that extracts content from a file's text
 */
function FileContentExtractor(id, extractorFn) {

  // this is a special object and it deserves to be called with "new" damn it!
  if(this instanceof FileContentExtractor === false) {
    console.log('[warn] forgot to use "new" operator when invoking FileContentExtractor(): ' + id);
    return new FileContentExtractor(id, extractorFn);
  }

  // validate arguments
  if(!isString(id))            throw new Error('invalid argument "id" = ' + id);
  if(!isFunction(extractorFn)) throw new Error('invalid argument "extractorFn" = ' + extractorFn);

  // maintain a reference to `this`
  var self = this;

  // store arguments
  self.id          = id;
  self.extractorFn = extractorFn;

  /**
   * Parses a file's text and produces an array of objects containing data extracted from the text.
   * 
   * @param {String} fileContents - the file's text content
   * @param {String} filePath     - relative path of the file
   * @param {String} cwd          - directory that `filePath` is relative to (defaults to process.cwd())
   * 
   * @return {Array} An array of objects containing data extracted from the text.
   */
  this.fromText = function(fileContents, filePath, cwd) {
    // validate arguments
    if(!isString(filePath))     throw new Error('invalid argument "filePath" = ' + filePath);
    if(!isString(fileContents)) throw new Error('invalid argument "text" = ' + fileContents);

    // set optional arguments to default values (if not provided)
    cwd = cwd || process.cwd();

    // invoke the client's extraction function
    return self.extractorFn(fileContents, filePath, cwd);
  };

  /**
   * Reads a file and produces an array of objects containing data extracted from the file's text.
   *
   * @param {String}   filePath - relative path of the file to read
   * @param {String}   cwd      - directory that `filePath` is relative to (defaults to process.cwd())
   * @param {String}   encoding - the file's encoding (e.g. "utf-8")
   * @param {Function} callback - (optional) callback to invoke with the final result
   *
   * @return {Promise} A promise to produce an array of objects containing data extracted from the file's text.
   */
  this.fromFile = function(filePath, cwd, encoding, callback) {
    // validate arguments
    if(!isString(filePath)) throw new Error('invalid argument "filePath" = ' + filePath);

    // set optional arguments to default values (if not provided)
    cwd      = cwd      || process.cwd();
    encoding = encoding || 'utf-8';

    // initiate module extraction
    var absolutePath = path.resolve(cwd, filePath),
        promise      = readFile(absolutePath, encoding).then(extractDataFromText);

    function extractDataFromText(text) {
      return self.fromText(text, filePath, cwd);
    }

    // make this function work with both promises and nodejs callbacks
    promise.nodeify(callback);
    return promise;
  };

  /**
   * Reads multiple files and produces an array of objects containing data extracted from each file's text.
   *
   * @param {Array}    filePaths - relative paths of the file(s) to read
   * @param {String}   cwd       - directory that `filePaths` are relative to (defaults to process.cwd())
   * @param {String}   encoding  - encoding of the files (defaults to "utf-8")
   * @param {Function} callback  - (optional) callback to invoke with the final result
   *
   * @return {Promise} A promise to produce an array of objects containing data extracted from each file's text.
   */
  this.fromFiles = function(filePaths, cwd, encoding, callback) {
    // validate arguments
    if(!isArray(filePaths)) throw new Error('invalid argument "filePaths" = ' + filePaths);

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
   * Reads all files matched via the provided glob patterns in the specified directory and
   * produces an array of objects containing data extracted from each file's text.
   *
   * @param {Array}    patterns - array of glob patterns used to match files
   * @param {String}   cwd      - directory to search in for files (defaults to process.cwd())
   * @param {String}   encoding - encoding of the files (e.g. "utf-8")
   * @param {Function} callback - (optional) callback to invoke with the final result
   *
   * @return {Promise} A promise to produce an array of objects containing data extracted from each file's text.
   */
  this.fromDirectory = function(patterns, cwd, encoding, callback) {
    // set arguments to default values if not provided
    cwd      = cwd      || process.cwd();
    patterns = patterns || ['**/*.js'];
    encoding = encoding || 'utf-8';
    
    // initiate module extraction
    var promise = fsHelper.locateFiles(patterns, cwd).then(extractDataFromFiles);

    function extractDataFromFiles(relativefilePaths) {
      return self.fromFiles(relativefilePaths, cwd, encoding);
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