/*
 * retrospec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 *
 * A regression test selection tool for JavaScript.
 */
'use strict';

// exports
module.exports = retrospec;

// libs
var FS      = require('fs'),        // file system
    Q       = require('q'),         // `kriskowal/q` promises
    path    = require('path');      // file path transform utils

// src
var log          = require('./helper/logger'),        // message logger
    fsHelper     = require('./helper/fs-helper'),     // file system helper methods
    buildProject = require('./helper/build-project'), // function that "builds" projects
    diffProjects = require('./helper/diff-projects'), // function that "diffs" projects
    metadata     = require('./helper/metadata'),      // project data storage
    selectTests  = require('./helper/select-tests');  // function that selects regression tests

// metadata extraction plugins
var extractors = {
  // code module
  'angular-module-extractor':            require('./extractors/angular-module-extractor'),
  'requirejs-module-extractor':          require('./extractors/requirejs-module-extractor'),
  // test suite
  'inline-comment-test-suite-extractor': require('./extractors/requirejs-module-extractor'),
  'angular-karma-test-suite-extractor':  require('./extractors/angular-karma-test-suite-extractor'),
  'jqm-test-suite-extractor':            require('./extractors/jqm-test-suite-extractor')
};

// test execution plugins
var executors = {
  'angular-js-test-suite-executor': require('./executors/angular-js-test-suite-executor'),
  'jqm-test-suite-executor-144':    require('./executors/jqm-test-suite-executor-144'),
  'jqm-test-suite-executor-131':    require('./executors/jqm-test-suite-executor-131'),
  'ui-bootstrap-test-suite-executor': require('./executors/ui-bootstrap-test-suite-executor')
};

// add Q promise support to file system operations
var readFile = Q.nfbind(FS.readFile);

// current working directory
var cwd = process.cwd();

// CLI arguments
var cliArgs;

/**
 * Invoked by retrospec-cli.
 */
retrospec.cli = function(args) {
  cliArgs = args;

  // read config and run retrospec
  readFile(cliArgs.configPath, 'utf-8')
     .then(parseConfig, log.error)
     .then(retrospec, log.error);

  // parses the config JSON
  function parseConfig(configJSON) {
    return JSON.parse(configJSON);
  }
};

/**
 * Retrospec's public API.
 * 
 * @param  {Object} config - an object with the following structure:
 * 
 *  {
 *    "src": {
 *      "path":      {String}  - relative path of the project's source code folder
 *      "blobs":     {Array}   - blobs used to find source code files
 *      "extractor": {String}  - name of the code module extractor to use
 *    },
 *    "test": {
 *      "path":      {String}  - relative path of the project's test code folder
 *      "blobs":     {Array}   - blobs used to find test files
 *      "extractor": {String}  - name of the test suite extractor to use
 *      "executor":  {String}  - name of the test suite executor to use
 *    }
 *  }
 *   
 */
function retrospec(config) {
  printHeader(config);
  validateConfig(config);

  // for measuring execution time
  var retrospecStartTime = process.hrtime();

  // get the test executor
  var testExecutor = getExecutor(config.test.executor);

  // project metadata
  var original, // read from metadata in file 
      modified; // built from the project's files

  Q(cliArgs.options.reset)
  .then(function (reset) { if(reset) return metadata.reset(cwd); })  
  .then(getProjects)
  .then(getTests)
  .then(runTests)
  .then(storeMetadata)
  .then(logExecutionTime);

  function getProjects() {
    return Q.all([
      metadata.read(cwd),
      buildProject({
        srcBlobs:      config.src.blobs, 
        testBlobs:     config.test.blobs,
        srcDirPath:    path.resolve(cwd, config.src.path), 
        testDirPath:   path.resolve(cwd, config.test.path), 
        srcExtractor:  getExtractor(config.src.extractor), 
        testExtractor: getExtractor(config.test.extractor)
      })
    ]);
  }

  function getTests(projects) {
    original = projects[0];
    modified = projects[1];

    if(original) {
      var tests = selectTests(original, modified);
      printElapsed('test selection time: ', retrospecStartTime);
      return tests;
    }
  }

  function runTests(testPaths) {
    if(testPaths && testPaths.length > 0) {
      var testExecStart = process.hrtime(); 
      return testExecutor.executeTests(testPaths).then(function() {
        printElapsed('test execution time: ', testExecStart);
      });
    }
    else {
      log.info('test execution time: 0s 0ms');
    }
  }

  function storeMetadata() {
    if(cliArgs.options.save) {
      return metadata.store(modified, cwd);
    }
  }

  function logExecutionTime() {
    printElapsed('total execution time: ', retrospecStartTime);
  }

}

/**
 * Validates the arguments provided to retrospec.
 * 
 * @param  {Object} config - an object with the following structure:
 * 
 *  {
 *    "src": {
 *      "path":      {String}  - relative path of the project's source code folder
 *      "blobs":     {Array}   - blobs used to find source code files
 *      "extractor": {String}  - name of the code module extractor to use
 *    },
 *    "test": {
 *      "path":      {String}  - relative path of the project's test code folder
 *      "blobs":     {Array}   - blobs used to find test files
 *      "extractor": {String}  - name of the test suite extractor to use
 *      "executor":  {String}  - name of the test suite executor to use
 *    }
 *  }
 */
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

/**
 * [getExtractor description]
 * 
 * @param  {[type]} id [description]
 * 
 * @return {[type]}    [description]
 */
function getExtractor(id) {
  // TODO(Eric): need to handle arg as object or function
  if(extractors.hasOwnProperty(id)) {
    return extractors[id];
  }
  throw new Error('could not find extractor "' + id + '"');
}

/**
 * [getExecutor description]
 * 
 * @param  {[type]} id [description]
 * 
 * @return {[type]}    [description]
 */
function getExecutor(id) {
  // TODO(Eric): need to handle arg as object or function
  if(executors.hasOwnProperty(id)) {
    return executors[id];
  }
  throw new Error('could not find executor "' + id + '"');
}

/**
 * Prints the program header message.
 */
function printHeader(config) {
  log.divider();
  log.msg(' retrospec.js');
  log.divider();
  log.info('args: ' + JSON.stringify(cliArgs));
  log.info('config: ' + JSON.stringify(config));
}

/**
 * Prints the provided message followed by how much time has elapsed since `startTime` was created.
 * 
 * @param  {String} message   - message to print before displaying the elapsed time
 * @param  {Array}  startTime - the current high-resolution real time in a [seconds, nanoseconds] tuple Array
 */
function printElapsed(message, startTime) {
  var elapsed = process.hrtime(startTime),
      seconds = elapsed[0],
      ms      = elapsed[1]/1000000;
      
  log.info(message + seconds + 's ' + ms + 'ms');
}