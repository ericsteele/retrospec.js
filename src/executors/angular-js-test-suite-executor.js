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
var Q           = require('q'),                      // `kriskowal/q` promises
    path        = require('path'),                   // utils for transforming file paths
    ArrayHelper = require('../helper/array-helper'), // array util methods
    exec        = require('child_process').exec,     // util for creating child processes
    FS          = require('fs');                     // file system

// retrospec's interface for pluggable test execution logic
var TestSuiteExecutor = require('./test-suite-executor');

// exports
module.exports = new TestSuiteExecutor('angular-js-test-suite-executor', executeTests);

/**
 * Executes the selected jQuery Mobile tests.
 * 
 * @param {Array} filePaths - relative paths of the tests to execute
 * @param {String} projectDir - The absolute path to the project directory
 * 
 * @return {Promise} A promise that will resolve to the output of the test execution command
 */
function executeTests(filePaths, projectDir) {
  var deferred = Q.defer();

  generateKarmaConfig(filePaths, projectDir);

  var cmd     = 'grunt test:retrospec',
      options = { cwd: projectDir, maxBuffer: 1024 * 5000 };
  
  exec(cmd, options, function(error, stdout, stderr) {
    if (error !== null) {
      console.log(stdout)
      console.log(stderr)
      deferred.reject(error);
    } else {
      console.log(stdout)
      deferred.resolve(stdout);
    }
  });

  return deferred.promise
}

/**
 * Generates the retrospec-karma.conf.js file with the appropriate test files included.
 *
 * @param {Array} filePaths - relative paths of the tests to execute
 * @param {String} projectDir - The absolute path to the project directory
 */
function generateKarmaConfig(filePaths, projectDir) {
  var filepathString = transformFilepathsToKarmaReadable(filePaths);

  var templateConfigPath = path.resolve(projectDir, 'angularFiles.template.js'),
      configPath = path.resolve(projectDir, 'angularFiles.js');

  console.log("TempaltePath: " + templateConfigPath);
  console.log("ConfigPath: " + configPath);

  var fileContents = FS.readFileSync(templateConfigPath, 'utf-8');
  fileContents = fileContents.replace("'${testSuiteList}'", filepathString);

  FS.writeFileSync(configPath, fileContents);
}

/**
 * Transforms an array of filepaths into a single, comma-delimited string.  Transforms
 * backslashes into forward slashes.
 *
 * @param {Array} filePaths - relative paths of the tests to execute
 *
 * @return {String} The filepaths to be input into the karma config file.
 */
function transformFilepathsToKarmaReadable(filePaths) {
  var transformedPaths = "";

  filePaths.forEach(function(fp) {
    transformedPaths += "'" + fp.replace(/\\/g,"/") + "',";
  });

  return transformedPaths.slice(0,-1);
}
