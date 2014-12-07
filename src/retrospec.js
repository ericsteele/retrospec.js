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
  // TASK PROGRESS
  // =============
  // √ extract RequireJS modules from 'jquery-mobile' 
  // √ extract AngularJS modules from 'angular' & 'angular-bootstrap'
  // √ extract QUnit tests from 'jquery-mobile'
  // √ extract Jasmine tests from 'angular' & 'angular-bootstrap'
  // √ extract RequireJS config from 'jquery-mobile'
  // √ extract inline comment test suite definitions 
  // √ detect changes to files by comparing hashes
  // √ build a project model using the extracted module and test data
  // √ store and retrieve project models in JSON files
  // √ diff project models
  // √ select regression tests
  //   execute selected tests <----- WE ARE HERE
}