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
var argv = require('argv'),  // CLI argument parser
    FS   = require('fs'),    // file system
    Q    = require('q'),     // `kriskowal/q` promises
    path = require('path');  // utils for resolving file paths

// aliases
var readFile = Q.nfbind(FS.readFile);  // add Q promise support to FS.readfile

// src
var buildProject = require('./helper/build-project'),   // function that "builds" projects
    metadata     = require('./helper/metadata'),        // project data storage
    diffProjects = require('./helper/diff-projects'),   // function that "diffs" projects
    selectTests  = require('./helper/select-tests');    // function that selects regression tests

var extractors = {
  // module
  'angular-module-extractor':            require('./extractors/angular-module-extractor'),
  'requirejs-module-extractor':          require('./extractors/requirejs-module-extractor'),
  // test suite
  'angular-karma-test-suite-extractor':  require('./extractors/angular-karma-test-suite-extractor'),
  'jqm-test-suite-extractor':            require('./extractors/jqm-test-suite-extractor'),
  'inline-comment-test-suite-extractor': require('./extractors/requirejs-module-extractor')
};

var executors = {
  'angular-test-suite-executor': require('./executors/angular-test-suite-executor'),
  'jqm-test-suite-executor-144': require('./executors/jqm-test-suite-executor-144'),
  'jqm-test-suite-executor-131': require('./executors/jqm-test-suite-executor-131')
};

// Example configuration for 'jquery-mobile'.
//
// retrospec: {
//   "src": {
//     "path":      "js",
//     "blobs":     ["**/*.js"], 
//     "extractor": "requirejs-module-extractor"
//   },
//   "test": {
//     "path":      "tests",
//     "blobs":     ["**/index.html", "**/*-tests.html"],
//     "extractor": "jqm-test-suite-extractor",
//     "executor":  "jqm-test-suite-executor-144"
//   }
// }

var options = [{
  name: 'config',
  short: 'c',
  type: 'path',
  description: 'Path to a retrospec config file',
  example: "'retrospec --config=value' or 'retrospec -c value'"
}];

console.log('\n==============\n');
console.log(' retrospec.js ');
console.log('\n==============');

var args = argv.option(options).run();
if(!args.options.config) console.log('no config provided, returning...');

var cwd = process.cwd();
console.log('[info] cwd:    ' + cwd);
console.log('[info] config: ' + args.options.config);
console.log('==============');
console.log('[info] reading config file...');

readFile(args.options.config, 'utf-8')
  .then(function(configJSON) {
    console.log('[info] config: ' + configJSON);
    var config = JSON.parse(configJSON);

    var projectInfo = {
      srcBlobs:      config.src.blobs, 
      testBlobs:     config.test.blobs,
      srcDirPath:    path.resolve(cwd, config.src.path), 
      testDirPath:   path.resolve(cwd, config.test.path), 
      srcExtractor:  getExtractor(config.src.extractor), 
      testExtractor: getExtractor(config.test.extractor)
    };

    var testExecutor = getExecutor(config.test.executor);

    var original, modified;

    console.log('==============');
    console.log('[info] reading metadata & building project');
    Q.all([
      metadata.read(cwd),
      buildProject(projectInfo)
    ])
    .then(function(projects) {
      original = projects[0];
      modified = projects[1];

      if(original) {
        console.log('==============');
        console.log('[info] selecting tests...');
        return selectTests(original, modified);
      }
      else {
        console.log('[info] no stored project model not found, cannot select tests');
        return [];
      }
    })
    .then(function(testPaths) {
      if(testPaths.length) {
        console.log('==============');
        console.log('[info] running ' + testPaths.length +' tests');
        return testExecutor.executeTests(testPaths);
      }
    })
    .then(function() {
      console.log('==============');
      console.log('[info] storing project metadata to file');
      metadata.store(modified, cwd);
    })
    .then(function() {
      console.log('[info] all tasks complete, returning...');
    });

  });

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

function getExtractor(id) {
  if(extractors.hasOwnProperty(id)) {
    return extractors[id];
  }
  throw new Error('could not find extractor "' + id + '"');
}

function getExecutor(id) {
  if(executors.hasOwnProperty(id)) {
    return executors[id];
  }
  throw new Error('could not find executor "' + id + '"');
}