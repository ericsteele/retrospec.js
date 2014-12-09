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
var path        = require('path'),
    ArrayHelper = require('../helper/array-helper'), // array util methods
    exec        = require('child-process-promise').exec;

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
 * Executes the selected jQuery Mobile tests.
 * 
 * @param  {Array} filePaths - relative paths of regression tests
 */
function executeTests(filePaths) {
  filePaths = ArrayHelper.getUnique(filePaths);

  filePaths.forEach(function(filePath) {
    var cmd = baseCmd + testDirectory + "\\" + filePath;
    exec(cmd).then(
      function(result) {
        console.log('success!');
        console.log(result);
      },
      function(a,b,c) {
        console.log('fail')
        console.log(a)
        console.log(b)
        console.log(c)
      })
  });
}