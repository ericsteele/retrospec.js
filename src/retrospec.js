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
var Q    = require('q'),     // `kriskowal/q` promises
    path = require('path');  // utils for resolving file paths

// src
var buildProject = require('./helper/build-project'),   // function that "builds" projects
    metadata     = require('./helper/metadata'),        // project data storage
    diffProjects = require('./helper/diff-projects'),   // function that "diffs" projects
    selectTests  = require('./helper/select-tests');    // function that selects regression tests

// export the module
module.exports = retrospec;

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

// Example configuration for 'jquery-mobile'.
//
// retrospec: {
//   src: {
//     path:      './src',
//     blobs:     ['**/*.js'], 
//     extractor: retrospec.requirejs,
//     config:    './js/requirejs.config.js' // path or object
//   },
//   test: {
//     path:      './src',
//     blobs:     ['**/*.html'],
//     extractor: require('./jqm-test-extractor.js'),
//     executor:  require('./jqm-test-executor.js')
//   }
// }
// 

function retrospec(config) {
  validateConfig(config);

  var cwd = process.cwd();

  var projectInfo = {
    srcBlobs:      config.src.blobs, 
    testBlobs:     config.test.blobs,
    srcDirPath:    path.resolve(cwd, config.src.path), 
    testDirPath:   path.resolve(cwd, config.test.path), 
    srcExtractor:  config.src.exractor, 
    testExtractor: config.test.exractor
  };

  var original, modified;

  console.log(cwd);

  Q.all([
    metadata.read(cwd),
    buildProject(projectInfo)
  ])
  .then(function(projects) {
    original = projects[0];
    modified = projects[1];
    return selectTests(original, modified);
  })
  .then(function(testPaths) {
    return config.test.executor(testPaths);
  })
  .then(function() {
    metadata.store(modified, cwd);
  });
}

function validateConfig(config) {
  if(!config)                throw Error('missing argument "config"');
  if(!config.src)            throw Error('missing argument "config.src"');
  if(!config.src.path)       throw Error('missing argument "config.src.path"');
  if(!config.src.extractor)  throw Error('missing argument "config.src.extractor"');
  if(!config.src)            throw Error('missing argument "config.src"');
  if(!config.src.path)       throw Error('missing argument "config.src.path"');
  if(!config.test)           throw Error('missing argument "config.test"');
  if(!config.test.extractor) throw Error('missing argument "config.test.extractor"');
  if(!config.test.executor)  throw Error('missing argument "config.test.executor"');
}