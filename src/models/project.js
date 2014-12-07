/*
 * project.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// module to be exported
module.exports = Project;

/**
 * Constructs an object that represents a project.
 * 
 * @param {Object} moduleMap    - object map [module_id : module] 
 * @param {Object} testSuiteMap - object map [test_suite_id : test_suite]
 *
 * @return {Object} new instance of `Project`
 */
function Project(moduleMap, testSuiteMap) {
  // this is a special object and it deserves to be called with "new"!
  if(this instanceof Project === false) {
    console.log('[warn] forgot to use "new" operator when invoking Project():');
    return new Project(moduleMap, testSuiteMap);
  }

  this.moduleMap    = moduleMap || {};
  this.testSuiteMap = testSuiteMap || {};
}