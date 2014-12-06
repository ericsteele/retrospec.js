/*
 * test-suite.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var hashFile = require('../misc/hash-file');

// module to be exported
module.exports = TestSuite;

/**
 * Constructs an object that represents a suite of tests that validate one or more code modules. 
 * 
 * @param {Array}  modulesUnderTest - array of code module names that the test suite validates
 * @param {String} path             - relative path of the file that defines the test suite
 * @param {String} fileContents     - the contents of the file
 */
function TestSuite(modulesUnderTest, path, fileContents) {
  // this is a special object and it deserves to be called with "new" damn it!
  if(this instanceof TestSuite === false) {
    console.log('[warn] forgot to use "new" operator when invoking TestSuite():' + path);
    return new TestSuite(modulesUnderTest, path);
  }

  this.dependencies = modulesUnderTest || [];
  this.path         = path || '';
  this.hash         = hashFile(fileContents);
}