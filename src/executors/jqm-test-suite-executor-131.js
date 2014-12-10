/*
 * jqm-test-suite-executor-131.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var Q     = require('q'),                   // `kriskowal/q` promises
    path  = require('path'),                // util for transforming file paths
    exec  = require('child_process').exec,  // util for creating child processes
    spawn = require('child_process').spawn; // util for spawning child processes

// src
var log         = require('../helper/logger'),
    ArrayHelper = require('../helper/array-helper'); // array util methods

// retrospec's interface for pluggable test execution logic
var TestSuiteExecutor = require('./test-suite-executor');

// exports
module.exports = new TestSuiteExecutor('jqm-test-suite-executor-131', executeTests);

/**
 * Executes the selected jQuery Mobile tests.
 * 
 * @param {Array} filePaths - relative paths of the tests to execute
 */
function executeTests(filePaths, projectDir) {
  var deferred = Q.defer(),
      tests    = getTests(filePaths),
      cmd      = 'grunt test --force --suites=' + tests.toString(),
      options  = { cwd: projectDir };
  
  // log the test command for user to see
  log.info(cmd);
  
  // execute the tests
  var childProcess = exec(cmd, options, function(error, stdout, stderr) {
    if (error !== null) {
        log.error(error);
        deferred.reject(error);
    } else {
      deferred.resolve(stdout);
    }
  });

  // pipe child process output to stdout
  childProcess.stdout.pipe(process.stdout);

  return deferred.promise;
}

/**
 * Gets an array of test names in a format that jquery-mobile can execute.
 * 
 * @param  {Array} filePaths - relative paths of jquery-mobile test files.
 * 
 * @return {Array} An array of test names in a format that jquery-mobile can execute.
 */
function getTests(filePaths) {
  var tests = [];

  filePaths.forEach(function(filePath) {
    tests.push(getTestSuite(filePath));
  });

  return ArrayHelper.getUnique(tests);
}

/**
 * Converts the given filePath into a valid test suite identifier (as per the JQM grunt test task).
 * 
 * @param  {String} filePath - a jquery-mobile test file path
 * 
 * @return {String} - a valid test suite identifier
 */
function getTestSuite(filePath) {
  return allForwardSlashes(removeFileName(removeTestCategoryFolder(filePath)));
}

/**
 * The jquery-mobile project divides tests into categories such as 'unit' and 'integration', storing
 * them in folders named for each category. However, the jquery-mobile project cannot execute tests
 * when this category folder is included in the test file path. We must therefore remove it.
 * 
 * @param  {String} filePath - path that is relative to a jquery-mobile test category folder
 * 
 * @return {String} - the `filePath` minus the category folder.
 */
function removeTestCategoryFolder(filePath) {
  var iFirstSep = filePath.indexOf(path.sep);
  return filePath.slice(iFirstSep + 1);
}

/**
 * Prior to version 1.4.4, jquery-mobile only allows developers to execute 'suites' of tests rather
 * than providing the ability to execute individual tests. For this reason, we must remove the names
 * of the test files from the file paths.
 * 
 * @param  {String} filePath - path that may contain spaces
 * 
 * @return {String} - the `filePath` wrapped in quotes if it contains any spaces.
 */
function removeFileName(filePath) {
  if(filePath.indexOf('.html') !== -1) {
    var iLastSep = filePath.lastIndexOf(path.sep);
    return filePath.slice(iLastSep);
  }
  return filePath;
}

/**
 * Test paths that end in "/index.html" should have it removed. 
 * 
 * @param  {String} filePath - a path that may end in "/index.html"
 * 
 * @return {String} - the `filePath` minus the "/index.html" ending.
 */
function removeFileName(filePath) {
  if(filePath.indexOf('.html') !== -1) {
    var iLastSep = filePath.lastIndexOf(path.sep);
    return filePath.substring(0 , iLastSep);
  }
}

/**
 * The jquery-mobile grunt test task expects test suite names to use forward slashes. This
 * function changes all occurances of '\' with a '/'
 * 
 * @param  {String} filePath - a path that may have backslashes.
 * 
 * @return {[type]} the `filePath` with forward slashes
 */
function allForwardSlashes(filePath) {
  return filePath.replace('\\', '/');
}