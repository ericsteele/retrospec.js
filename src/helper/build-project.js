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
 * @param  {FileContentExtractor} codeModuleExtractor [description]
 * @param  {String}               srcDir              [description]
 * @param  {Array}                srcBlobs            [description]
 * @param  {FileContentExtractor} testSuiteExtractor  [description]
 * @param  {String}               testDirPath         [description]
 * @param  {Array}                testBlobs           [description]
 * 
 * @return {Object} a new instance of `Project`
 */
function buildProject(codeModuleExtractor, srcDirPath, srcBlobs, testSuiteExtractor, testDirPath, testBlobs) {
  var srcPromise  = codeModuleExtractor.fromDirectory(srcBlobs, srcDirPath),
      testPromise = testSuiteExtractor.fromDirectory(testBlobs, testDirPath);

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