/*
 * build-project.js
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
var Project = require('../models/project'); // generic representation of a project

// exports
module.exports = buildProject;

/**
 * Builds a new instance `Project` using the specified arguments.
 *
 * @param {Object} config - an object with the following properties:
 * 
 *   - {String}               srcDirPath    - project source directory
 *   - {Array}                srcBlobs      - src file blobs
 *   - {FileContentExtractor} srcExtractor  - extracts code modules
 *   - {String}               testDirPath   - project test directory
 *   - {Array}                testBlobs     - test file blobs
 *   - {FileContentExtractor} testExtractor - extracts test suites
 * 
 * @return {Object} a new instance of `Project`
 */
function buildProject(config) {
  validateConfig(config);

  var srcPromise  = config.srcExtractor.fromDirectory(config.srcBlobs, config.srcDirPath),
      testPromise = config.testExtractor.fromDirectory(config.testBlobs, config.testDirPath);

  return Q.all([srcPromise, testPromise]).then(createProject);

  function createProject(results) {
    var modules      = results[0], 
        testSuites   = results[1],
        moduleMap    = createModuleMap(modules),
        testSuiteMap = createTestSuiteMap(testSuites);

    return new Project(moduleMap, testSuiteMap);
  }
}

/**
 * Validates config options for the `buildProject` method;
 * 
 * @param  {Object} config [description]
 */
function validateConfig(config) {
  if(!config)               throw Error('missing argument "config"');
  if(!config.srcDirPath)    throw Error('missing argument "config.srcDirPath"');
  if(!config.srcBlobs)      throw Error('missing argument "config.srcBlobs"');
  if(!config.srcExtractor)  throw Error('missing argument "config.srcExtractor"');
  if(!config.testDirPath)   throw Error('missing argument "config.testDirPath"');
  if(!config.testBlobs)     throw Error('missing argument "config.testBlobs"');
  if(!config.testExtractor) throw Error('missing argument "config.testExtractor"');
}

/**
 * Creates an object map containing the provided `CodeModule` objects. 
 * 
 * @param  {Array} modules - the `CodeModule` objects
 * 
 * @return {Object} an object map containing the provided `CodeModule` objects.
 */
function createModuleMap(modules) {
  var map = {};

  modules.forEach(function(module) {
    map[module.id] = module;
  });

  return map;
}

/**
 * Creates an object map containing the provided `TestSuite` objects. 
 * 
 * @param  {Array} testSuites - the `TestSuite` objects
 * 
 * @return {Object} an object map containing the provided `TestSuite` objects.
 */
function createTestSuiteMap(testSuites) {
  var map = {};

  testSuites.forEach(function(testSuite) {
    map[testSuite.path] = testSuite;
  });

  return map;
}