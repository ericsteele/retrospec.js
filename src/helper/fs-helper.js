/*
 * fs-helper.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var FS          = require('fs'),             // file system
    OS          = require('os'),             // operating system info
    Q           = require('q'),              // `kriskowal/q` promises
    glob        = require('glob'),           // file globbing
    arrayHelper = require('./array-helper'); // array helper methods

// exports
module.exports = {
  exists:      exists,
  locateFiles: locateFiles
};

/**
 * Gets the relatives paths of all files in a directory that match one or more glob patterns.
 * 
 * @param  {Array}  patterns - Array of glob patterns that will be used to match/locate files
 * @param  {String} cwd      - Absolute path of the directory to search in (defaults to process.cwd())
 * 
 * @return {Promise} A promise to produce an array of absolute file paths (one path per matched file).
 */
function locateFiles(patterns, cwd) {
  // validate arguments
  if(!Array.isArray(patterns)) throw new Error('invalid argument "patterns" = ' + patterns);

  // set `cwd` to default value if not provided
  cwd = cwd || process.cwd();

  // initiate the search for files and collect the promises
  var promises = [];
  for(var i = 0, iEnd = patterns.length; i < iEnd; i++) {
    promises.push(globWithPromises(patterns[i], { cwd: cwd }));
  }

  return Q.all(promises)                // combine promises
          .then(arrayHelper.flatten)    // flatten promise results into a single array
          .then(arrayHelper.getUnique)  // remove duplicate file paths (i.e. those matched by more than one glob pattern)
          .then(fixFilePathsForOS);
}  

/**
 * Wraps 'node-glob' with Q promise support.
 *
 * @param {String}   pattern  - A glob pattern
 * @param {Object}   options  - (optional) Options to pass to node-glob
 * @param {Function} callback - (optional) callback to invoke
 *
 * @return {Promise} A promise to produce an array of matched file names.
 */
function globWithPromises(pattern, options, callback) {
  var deferred = Q.defer();

  glob(pattern, options, function (error, files) {
    if(error) deferred.reject(error);
    deferred.resolve(files);
  });

  deferred.promise.nodeify(callback);
  return deferred.promise;
}

/**
 * Checks if a file or directory exists.
 * 
 * @param  {String} path - the absolute path of the file or directory
 * 
 * @return {Promise} A promise that will be resolved with true if the  
 *                   file or directory exists. False otherwise.
 */
function exists(path) {
  var deferred = Q.defer();

  FS.exists(path, function(exists) {
    deferred.resolve(exists);
  });

  return deferred.promise;
}

/**
 * Converts the POSIX paths output by node-glob into UNC paths if using a Windows OS.
 * 
 * @param  {Array} paths - the POSIX paths output by node-glob
 * 
 * @return {Array} UNC paths if using Windows OS, POSIX paths otherwise.
 */
function fixFilePathsForOS(paths) {
  if(OS.type().indexOf('Windows') > -1) {
    for(var i = 0, iEnd = paths.length; i < iEnd; i++) {
      paths[i] = paths[i].replace(/\//g,'\\');
    }
  }
  return paths;
}