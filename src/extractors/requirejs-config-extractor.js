/*
 * requirejs-config-extractor.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var FS          = require('fs'),                   // file system
    fsHelper    = require('../misc/fs-helper'),    // file system helper
    arrayHelper = require('../misc/array-helper'), // array helper
    parse       = require('../../lib/r.js/parse'), // r.js parse lib
    Q           = require('q');                    // promises

// add Q promise support to FS.readile
var readFile = Q.nfbind(FS.readFile);

// export the module
module.exports = {
  fromDirectory: extractConfigObjectsFromDirectory,
  fromFiles:     extractConfigObjectsFromFiles,
  fromFile:      extractConfigObjectFromFile,
  fromText:      extractConfigObjectFromText
};

/**
 * Parses all files matched via the provided glob patterns and extracts any
 * RequireJS configuration objects found within. This includes calls to:
 * 
 *   1. require.config()
 *   2. requirejs.config()
 *   3. require({}, ...)
 *   4. requirejs({}, ...)
 *
 * @param {String}   cwd      - the directory to search in for files
 * @param {Array}    patterns - an array of glob patterns for matching files
 * @param {String}   encoding - the encoding of the files (e.g. "utf-8")
 * @param {Function} callback - (optional) callback to invoke
 *
 * @return {Promise} A promise to produce an array of objects with the following properties:
 * - config: {Object} the extracted RequireJS config object.
 * - path:   {String} the relative path of the file in which the config object was found
 * - range:  {Array}  the start index and end index in the contents where the config was found.
 */
function extractConfigObjectsFromDirectory(cwd, patterns, encoding, callback) {
  // set arguments to default values if not provided
  cwd      = cwd      || process.cwd();
  patterns = patterns || ['**/*.js'];
  encoding = encoding || 'utf-8';
  
  var promise = fsHelper.locateFiles(patterns, cwd).then(extractConfigObjects);

  function extractConfigObjects(filePaths) {
    return extractConfigObjectsFromFiles(filePaths, encoding);
  }

  promise.nodeify(callback);
  return promise;
}

/**
 * Parses multiple JS files and extracts any RequireJS configuration objects found
 * within. This includes calls to:
 * 
 *   1. require.config()
 *   2. requirejs.config()
 *   3. require({}, ...)
 *   4. requirejs({}, ...)
 *
 * @param {String}   filePaths - paths to the JavaSript files
 * @param {String}   encoding  - the encoding of the files (e.g. "utf-8")
 * @param {Function} callback  - (optional) callback to invoke with the final result
 *
 * @return {Promise} A promise to produce an array of objects with the following properties:
 * - config: {Object} the extracted RequireJS config object.
 * - path:   {String} the relative path of the file in which the config object was found
 * - range:  {Array}  the start index and end index in the contents where the config was found.
 */
function extractConfigObjectsFromFiles(filePaths, encoding, callback) {
  // validate arguments
  if(!filePaths) throw new Error('[error] invalid argument "filePaths" = ' + filePaths);

  // set arguments to default values if not provided
  encoding = encoding || 'utf-8';

  var promises = [];
  filePaths.forEach(function(filePath) {
    promises.push(extractConfigObjectFromFile(filePath, encoding));
  });

  // combine promises and remove null 
  var promise = Q.all(promises)                  // combine promises
                 .then(arrayHelper.removeNulls); // remove null values

  promise.nodeify(callback);
  return promise;
}

/**
 * Parses a single JS file and extracts a RequireJS configuration object. This includes calls to:
 * 
 *   1. require.config()
 *   2. requirejs.config()
 *   3. require({}, ...)
 *   4. requirejs({}, ...)
 *
 * @param {String}   filePath - path of the JavaSript file to read
 * @param {String}   encoding - the file's encoding (e.g. "utf-8")
 * @param {Function} callback - (optional) callback to invoke with the final result
 *
 * @return {Promise} A promise that will be resolved or rejected when the operation completes. If no
 *                   configuration object is found in the file, then the Promise will resolve null. 
 *                   Otherwise, it will resolve an object with the following properties:
 *                   
 * - config: {Object} the extracted RequireJS config object. Will be null if no config object is found.
 * - path:   {String} the relative path of the file in which the config object was found
 * - range:  {Array}  the start index and end index in the contents where the config was found.
 *
 * If no configuration object is found in the text, then the Promise will resolve null.
 */
function extractConfigObjectFromFile(filePath, encoding, callback) {
  // validate arguments
  if(!filePath) throw new Error('[error] invalid argument "filePath" = ' + filePath);

  // set arguments to default values if not provided
  encoding = encoding || 'utf-8';

  // extract code modules
  var promise = readFile(filePath, encoding).then(extractConfigObjects);

  function extractConfigObjects(text) {
    return extractConfigObjectFromText(filePath, text);
  }

  promise.nodeify(callback);
  return promise;
}

/**
 * Parses the specified JavaScript text and extracts a RequireJS configuration object. This includes calls to:
 * 
 *   1. require.config()
 *   2. requirejs.config()
 *   3. require({}, ...)
 *   4. requirejs({}, ...)
 * 
 * @param {String} filePath - relative path of the file from which the text originated
 * @param {String} text     - the JavaScript text 
 * 
 * @return {Object} If no configuration object is found in the text, then this function will return 
 *                  null, otherwise it will return an object with the following properties:
 *                  
 *   - config: {Object} the extracted RequireJS config object.
 *   - path:   {String} the relative path of the file in which the config object was found
 *   - range:  {Array}  the start index and end index in the contents where the config was found.
 */
function extractConfigObjectFromText(filePath, text) {
  // validate arguments
  if(!filePath) throw new Error('[error] invalid argument "filePath" = ' + filePath);
  if(!text)     throw new Error('[error] invalid argument "text" = ' + text);

  var result = parse.findConfig(text);

  if(result.config) {
    result.path = filePath;
  } else {
    result = null;
  }

  return result;
}