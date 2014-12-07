/*
 * retrospec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var Q = require('q'); // `kriskowal/q` promises

// src
var buildProjects = require('./helper/build-project'), // function that "builds" projects
    diffProjects  = require('./helper/diff-projects'), // function that "diffs" projects
    selectTests   = require('./helper/select-tests');  // function that selects regression tests

// export the module
module.exports = retrospec;

function retrospec(config) {
  // 1. validate config and set default values as needed (probably using extend)
  // 2. choose the appropriate module extractors based on config input
  // 3. use extractor to find all modules
  // 4. use extractor to find all test suites
  // 5. create project model
  // 6. read saved project model from file
  // 7. diff project models and get changes
  // 8. use diff results to select tests
  // 9. execute selected tests 
}