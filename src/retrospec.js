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
    argv    = require('argv'),      // CLI argument parser

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
  'jqm-test-suite-extractor':            require('./extractors/jqm-test-suite-extractor'),
};

// test execution plugins
var executors = {
  'angular-test-suite-executor': require('./executors/angular-test-suite-executor'),
  'jqm-test-suite-executor-144': require('./executors/jqm-test-suite-executor-144'),
  'jqm-test-suite-executor-131': require('./executors/jqm-test-suite-executor-131')
};

// add Q promise support to file system operations
var readFile = Q.nfbind(FS.readFile);

// current working directory
var cwd = process.cwd();

// get CLI arguments
var args = parseArguments();

// start the program
main();

/**
 * Executes retrospec when ran via CLI.
 */
function main() {
  printHeader();
  log.info('args: ' + JSON.stringify(args));

  if(args.options.reset) {
    metadata.reset(cwd).then(bootstrap);
  } else {
    bootstrap();
  }
}

/**
 * Attempts to read the provided config file and run retrospec.
 */
function bootstrap() {
  // retrospec needs a configuration file to run
  var configFilePath = (args.targets.length >= 1) ? args.targets[0] : null;

  // read config and run retrospec
  if(configFilePath) {
    readFile(configFilePath, 'utf-8')
       .then(parseConfig, log.error)
       .then(retrospec, log.error);
  }

  function parseConfig(configJSON) {
    log.info('config: ' + configJSON);
    return JSON.parse(configJSON);
  }
}

/**
 * Parses CLI arguments with 'argv' and returns the result.
 * 
 * @return {Object} an object with the following properties:
 *
 *   - targets {Array}  - array of non-option arguments
 *   - options {Object} - object map from option name to its value
 */
function parseArguments() {
  // define a custom 'flag' CLI argument type
  argv.type('flag', function(value) {
    return true;
  });

  // define expected CLI arguments
  argv.option([{
    name: 'reset',
    short: 'r',
    type: 'flag',
    description: 'Deletes all existing retrospec metadata',
    example: "'retrospec --reset or 'retrospec -r'"
  }, {
    name: 'save',
    short: 's',
    type: 'flag',
    description: 'Indicates whether or not retrospec should save project metadata',
    example: "'retrospec --save or 'retrospec -s'"
  }]);

  // run the CLI argument parser
  return argv.run();
}

/**
 * This function is retrospec's public API.
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
  validateConfig(config);

  var testExecutor = getExecutor(config.test.executor);

  // project metadata
  var original, // read from metadata in file 
      modified; // built from the project's files

  Q.all([
    metadata.read(cwd),
    buildProject({
      srcBlobs:      config.src.blobs, 
      testBlobs:     config.test.blobs,
      srcDirPath:    path.resolve(cwd, config.src.path), 
      testDirPath:   path.resolve(cwd, config.test.path), 
      srcExtractor:  getExtractor(config.src.extractor), 
      testExtractor: getExtractor(config.test.extractor)
    })
  ])
  .then(function(projects) {
    original = projects[0];
    modified = projects[1];

    if(original) {
      return selectTests(original, modified);
    }
  })
  .then(function(testPaths) {
    if(testPaths && testPaths.length > 0) {
      return testExecutor.executeTests(testPaths);
    }
  })
  .then(function() {
    if(args.options.save) {
      metadata.store(modified, cwd);
    }
  });

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
function printHeader() {
  log.divider();
  console.log(' retrospec.js');
  log.divider();
}