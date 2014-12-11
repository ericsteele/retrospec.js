/*
 * angular-test-executor.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var path = require('path'),
    exec = require('child_process').exec;  // util for creating child processes

// src
var log         = require('../helper/logger'),
    ArrayHelper = require('../helper/array-helper'); // array util methods

// retrospec's interface for pluggable test execution logic
var TestSuiteExecutor = require('./test-suite-executor');

// exports
module.exports = new TestSuiteExecutor('angular-test-suite-executor', executeTests);

// Base exec command
var baseCmd = 'karma ';

// Directories
var rootDirectory = path.resolve(__dirname, '../../');
var testDirectory = path.resolve(rootDirectory, 'test/input/projects/angular.js/b6f4d4b/test');

/**
 * Executes the selected angular.js tests.
 * 
 * @param  {Array}  filePaths  - relative paths of regression tests
 * @param  {String} projectDir - absolute path of the project under test
 */
function executeTests(filePaths, projectDir) {
  // var deferred = Q.defer(),
  //     cmd      = 'grunt test --force --suites=' + tests.toString(),
  //     options  = { cwd: projectDir };
  
  // log the test command for user to see
  // log.info(cmd);
  
  // execute the tests
  // var childProcess = exec(cmd, options, function(error, stdout, stderr) {
  //   if (error !== null) {
  //       log.error(error);
  //       deferred.reject(error);
  //   } else {
  //     deferred.resolve(stdout);
  //   }
  // });

  // pipe child process output to stdout
  // childProcess.stdout.pipe(process.stdout);
  
  // return deferred.promise;
}