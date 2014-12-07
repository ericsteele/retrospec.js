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
var hashStr = require('../helper/hash-str');

// module to be exported
module.exports = TestSuite;

/**
 * Constructs an object that represents a suite of tests that validate one or more code modules. 
 * 
 * @param {Array}  deps         - array of code module ids that the test suite validates
 * @param {String} path         - relative path of the file that defines the test suite
 * @param {String} fileContents - the contents of the file
 */
function TestSuite(deps, path, fileContents) {
  // this is a special object and it deserves to be called with "new"!
  if(this instanceof TestSuite === false) {
    console.log('[warn] forgot to use "new" operator when invoking TestSuite():' + path);
    return new TestSuite(path, deps, path);
  }

  this.path         = path || '';
  this.dependencies = deps || [];
  this.hash         = hashStr(fileContents);
}