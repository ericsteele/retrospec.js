/*
 * jqm-test-executor.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var path        = require('path'),
    ArrayHelper = require('../helper/array-helper'); // array util methods

// retrospec's interface for pluggable test execution logic
var TestSuiteExecutor = require('./test-suite-executor');

// exports
module.exports = new TestSuiteExecutor('jqm-test-suite-executor', executeTests);

/**
 * Executes the selected jQuery Mobile tests.
 * 
 * @param  {Array} filePaths - relative paths of regression tests
 */
function executeTests(filePaths) {
  console.log(filePaths);

  for (var i = 0, iEnd = filePaths.length; i < iEnd; i++) {
    // remove the first folder in the path
    var iSeperator = filePaths[i].indexOf(path.sep);
    filePaths[i] = filePaths[i].slice(iSeperator + 1);

    // remove test file names with spaces
    if(filePaths.indexOf('.html') !== -1) {
      iSeperator = filePaths[i].lastIndexOf(path.sep);
      if(filePaths[i].slice(iSeperator + 1).indexOf(' ') !== -1) {
        filePaths[i] = filePaths[i].slice(iSeperator + 1);
      }
    }

  }

  console.log(filePaths);

  filePaths = ArrayHelper.getUnique(filePaths);

  console.log(filePaths);

}