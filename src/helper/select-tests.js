/*
 * select-tests.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// exports
module.exports = selectTests;

// src
var diffProjects = require('./diff-projects'),
    log          = require('./logger');

// globals
var tracedModules, // array of modules whose dependent tests have been traced
    selectedTests; // object map for tracking which tests have been selected

/**
 * Selects regression tests.
 * 
 * @param  {Project} original - the original `Project`
 * @param  {Project} modified - the modified `Project`
 * 
 * @return {Array} selected regression test paths for the modified `Project`
 */
function selectTests(original, modified) {
  var diffs = diffProjects(original, modified);

  // reset temp storage
  tracedModules = [];
  selectedTests = {};

  // select tests
  selectNewOrChangedTests(diffs.testSuites);
  selectRegressionTests(modified, diffs.modules);

  // convert test map to an array
  var tests = mapToArray(selectedTests);

  // log selection results for user
  var totalTests = countTests(modified);
  log.info(tests.length + '/' + totalTests + ' tests selected');

  return tests;
}

/**
 * Counts how many test suites are in the provided project.
 * 
 * @param  {Project} project - the project
 * 
 * @return {Number} the number of test suites in the provided project.
 */
function countTests(project) {
  var count = 0;

  for(var test in project.testSuiteMap) {
    if(project.testSuiteMap.hasOwnProperty(test)) {
      count += 1;
    }
  }

  return count;
}

/**
 * Selects a specific test.
 * 
 * @param  {String} test - the test's id/path
 */
function selectTest(test) {
  if(selectedTests[test] !== 1) {
    selectedTests[test] = 1;
  }
}

/**
 * Selects new and changed tests.
 * 
 * @param  {Object} testSuitesDiffs - diffs between the test suites of a modified Project and its original state.
 */
function selectNewOrChangedTests(testSuitesDiffs) {
  testSuitesDiffs.forEach(function(diff) { 
    if (diff.change === 'Add' || diff.change === 'Edit' || diff.change === 'Move') {
      selectTest(diff.id);
    }
  });
}

/**
 * Selects regression tests.
 * 
 * @param  {Project} project     - the project that has been modified
 * @param  {Object}  moduleDiffs - diffs between `project` and its original state
 */
function selectRegressionTests(project, moduleDiffs) {
  moduleDiffs.forEach(function(diff) {
    if (diff.change === 'Add' || diff.change === 'Edit' || diff.change === 'Move') {
      var module = project.moduleMap[diff.id];
      selectTestsForModule(module, project);
    }
  });
}

/**
 * Selects regression tests for a modified `CodeModule`.
 * 
 * @param  {CodeModule} module  - a modified `CodeModule`
 * @param  {Project}    project - the modified `Project` that contains `module`
 */
function selectTestsForModule(module, project) {
  // skip modules that we've already selected tests for 
  if(tracedModules.indexOf(module.id) !== -1) {
    return {};
  }

  // don't select tests `module` more than once
  tracedModules.push(module.id);

  // select all tests that depend on the module
  selectTestsThatDependOnModule(module, project.testSuiteMap);

  // select all tests for modules that depend on this module
  var dependentModules = getModuleDependents(module, project.moduleMap);
  selectTestsForModules(dependentModules, project);
}

/**
 * Selects regression tests for multiple modified `CodeModules`.
 * 
 * @param  {Array} modules - one or more modified `CodeModules`
 */
function selectTestsForModules(modules, project) {
  for(var i = 0, iEnd = modules.length; i < iEnd; i++) {
    selectTestsForModule(modules[i], project);
  }
}

/**
 * Selects tests that depend on the provided `CodeModule`.
 * 
 * @param  {CodeModule} module       - may have test suites that depend on it
 * @param  {Object}     testSuiteMap - map containing all of the project's test suites
 */
function selectTestsThatDependOnModule(module, testSuiteMap) {
  for (var key in testSuiteMap) {
    if (testSuiteMap.hasOwnProperty(key)) {
      var testSuite = testSuiteMap[key];
      for(var i = 0, iEnd = testSuite.dependencies.length; i < iEnd; i++) {
        var dependency = testSuite.dependencies[i];
        if (dependency === module.id) {
          selectTest(key);
        }
      }
    }
  }
}

/**
 * Gets an array containing all modules that depend on `module`.
 * 
 * @param  {String} module    - 
 * @param  {Object} moduleMap - map containing all of the project's test suites
 * 
 * @return {Array} contains all modules that depend on `module`.
 */
function getModuleDependents(module, moduleMap) {
  var dependents = [];

  for (var moduleName in moduleMap) {
    if (moduleMap.hasOwnProperty(moduleName)) {
      var mod = moduleMap[moduleName];
      if (mod.dependencies.indexOf(module.id) !== -1) {
        dependents.push(mod);
      }
    }
  }

  return dependents;
}

/**
 * Converts an object map to an array.
 * 
 * @param  {Object} map - an object map
 * 
 * @return {Array} an array whose elements are the object map's properties
 */
function mapToArray(map) {
  var array = [];

  // push all test names into an array
  for (var key in map) {
    if (map.hasOwnProperty(key)) {
      array.push(key);
    }
  }

  return array;
}