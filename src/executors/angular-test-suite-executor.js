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
    exec = require('child-process-promise').exec;

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
  filePaths = ArrayHelper.getUnique(filePaths);

  filePaths.forEach(function(filePath) {
    var cmd = baseCmd + testDirectory + "\\" + filePath;
  
    log.info(cmd);

    exec(cmd).then(
      function(result) {
        log.info('success!');
        log.info(result);
      },
      function(a,b,c) {
        log.info('fail');
        log.info(a);
        log.info(b);
        log.info(c);
      });
  });
}