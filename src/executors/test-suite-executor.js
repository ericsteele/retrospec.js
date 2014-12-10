/*
 * test-suite-executor.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var FS          = require('fs'),    // file system
    Q           = require('q'),     // `kriskowal/q` promises
    path        = require('path');  // utils for resolving file paths

// src
var arrayHelper = require('../helper/array-helper'), // array helper methods
    fsHelper    = require('../helper/fs-helper'),    // file system helper methods
    log         = require('../helper/logger');       // logging

// aliases
var readFile = Q.nfbind(FS.readFile),  // add Q promise support to FS.readfile
    isArray  = Array.isArray;

// exports
module.exports = TestSuiteExecutor;

/**
 * Constructs an object that provides methods for extracting content from a file's text. 
 * 
 * @param {String}   id              - a unique identifier for the executor
 * @param {Function} testExecutionFn - function that executes regression tests
 */
function TestSuiteExecutor(id, testExecutionFn) {

  // this is a special object and it deserves to be called with "new" damn it!
  if(this instanceof TestSuiteExecutor === false) {
    log.warn('forgot to use "new" operator when invoking TestSuiteExecutor(): ' + id);
    return new TestSuiteExecutor(id, testExecutionFn);
  }

  // validate arguments
  if(!isString(id))                throw new Error('invalid argument "id" = ' + id);
  if(!isFunction(testExecutionFn)) throw new Error('invalid argument "testExecutionFn" = ' + testExecutionFn);

  // maintain a reference to `this`
  var self = this;

  // store arguments
  self.id              = id;
  self.testExecutionFn = testExecutionFn;

  /**
   * Executes the tests contained in the specified files.
   *
   * @param {Array}  testFilePaths - relative paths of the test files to execute
   * @param {String} projectDir    - absolute path of the project under test
   * 
   * @type {Promise} A promise to execute all of the provided tests.
   */
  this.executeTests = function(testfilePaths, projectDir) {
    // validate arguments
    if(!isArray(testfilePaths)) throw new Error('invalid argument "testfilePaths" = ' + testfilePaths);

    // set optional arguments to default values (if not provided)
    projectDir = projectDir || process.cwd();

    // log how many tests will be ran
    log.info('running tests');

    // invoke the client's test execution function
    return self.testExecutionFn(testfilePaths, projectDir).then(function (result) {
      // log that the tests ran successfully
      log.info('finished running tests');
      // forward result to its intended receiver
      return result; 
    });
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