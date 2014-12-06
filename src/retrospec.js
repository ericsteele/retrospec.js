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
// TODO: require extractors as needed, not like this
var angExtractor = require('./extractors/angular-module-extractor'),
    rjsExtractor = require('./extractors/requirejs-module-extractor');

// export the module
module.exports = retrospec;

function retrospec(config) {
  // 1. validate config and set default values as needed (probably using extend)
  // 2. choose the appropriate module extractors based on config input
  // 3. use extractor to find all modules
  // 4. use extractor to find all test suites
  // 5. construct project model
  // 6. read saved project model from file
  // 7. diff project models and get changes
}

var project = {
  modules: {
    'ngAnimateMock': {
      'path': 'src/ngAnimate/animate.js',
      'dependencies': ['ng', 'ngAnimate'],
      'hash': '...'
    }
  }
  testSuites: [
    {
      'path': 'test/ngMessages/messagesSpec.js',
      'dependencies': ['ngMessages', 'ngAnimate', 'ngAnimateMock'],
      'hash': '...'
    }
  ]
};

/**
 * [selectTestSuites description]
 * 
 * @param  {[type]} diffs [description]
 * 
 * @return {[type]} [description]
 */
function selectTestSuites(modules, testSuites, diffs) {
  var newTests        = selectNewTests(diffs),
      regressionTests = selectRegressionTests(modules, testSuites, diffs);

  return newTests.concat(regressionTests);
}

/**
 * [selectNewTests description]
 * @param  {[type]} diffs [description]
 * @return {[type]}       [description]
 */
function selectNewTests(diffs) {
  var newTests = {};

  diffs.testSuites.forEach(function(testSuite) { 
    if(testSuite.change === 'ADD') {
      newTests[testSuite.name] = 1;
    }
  });

  return newTests;
}

/**
 * [selectRegressionTests description]
 * @param  {[type]} modules    [description]
 * @param  {[type]} testSuites [description]
 * @param  {[type]} diffs      [description]
 * @return {[type]}            [description]
 */
function selectRegressionTests(modules, testSuites, diffs) {
  var regressionTests = {};

  diffs.modules.forEach(function(module) {
    if(module.change === 'ADD' || module.change === 'EDIT' || module.change === 'MOVE') {
      var module = modules[module.name];
          tests  = selectRegressionTestsForModule(module, modules, testSuites);

      for (var testSuiteName in tests) {
        if (tests.hasOwnProperty(testSuiteName) {
          regressionTests[testSuiteName] = 1;
        }
      }
    }
  });

  return regressionTests;
}

/**
 * [selectRegressionTestsForModule description]
 * 
 * @param  {String} module     [description]
 * @param  {Object} modules    [description]
 * @param  {Object} testSuites [description]
 * 
 * @return {Array} [description]
 */
function selectRegressionTestsForModule(module, modules, testSuites) {
  var tests  = {};

  // select all tests that depend on the module
  for (var testSuiteName in testSuites) {
    if (testSuites.hasOwnProperty(testSuiteName) {
      var testSuite = testSuites[testSuiteName];
      testSuite.dependencies.forEach(function(dependency) {
        if(dependency === moduleName) {
          tests[testSuiteName] = 1;
        }
      });
    }
  }

  // find all modules that depend on the module
  var dependents = findModuleDependents(module, modules);

  // select all tests for modules that depend on this module
  dependents.forEach(function(dependent) {
    tests = tests.concat(selectRegressionTestsForModule(dependent, modules, testSuites));
  });

  return tests;
}

/**
 * [findModuleDependents description]
 * @param  {[type]} moduleName [description]
 * @param  {[type]} modules    [description]
 * @return {[type]}            [description]
 */
function findModuleDependents(module, modules) {
  var dependents = [];

  for (var moduleName in modules) {
    if (modules.hasOwnProperty(moduleName) {
      var module = modules[moduleName];
      if(module.dependencies.indexOf(module.name) !== -1) {
        dependents.push(module);
      }
    }
  }

  return dependents;
}

/**
 * [diffProjects description]
 * 
 * @param  {Object} projectA [description]
 * @param  {Object} projectB [description]
 * 
 * @return {Object} [description]
 */
function diffProjects(projectA, projectB) {
  var moduleChanges    = fileMapDiff(projectA.modules,    projectB.modules),
      testSuiteChanges = fileMapDiff(projectA.testSuites, projectB.testSuites);

  return { modules: moduleChanges, testSuites: testSuiteChanges };
}

/**
 * [diffMaps description]
 * 
 * @param  {Object} mapA [description]
 * @param  {Object} mapB [description]
 * 
 * @return {Object} [description]
 */
function fileMapDiff(mapA, mapB) {
  var diffs = [];

  for (var key in mapA) {
    if (mapA.hasOwnProperty(key) && mapB.hasOwnProperty(key)) {
      var fileA = mapA[key],
          fileB = mapB[key];

      if(fileA.hash === fileB.hash) {
        if(fileA.path === fileB.path) {
          diffs.push({ name: property, change: 'None'});
        }
        else {
          diffs.push({ name: property, change: 'Move'});
        }
      }
      else {
        diffs.push({ name: property, change: 'Edit'});
      }
    }
    else {
      diffs.push({ name: property, change: 'Delete'});
    }
  }

  for (var property in mapB.modules) {
    if(mapB.hasOwnProperty(property) && !changes.hasOwnProperty(property)) {
      diffs.push({ name: property, change: 'Add'});
    }
  }

  return diffs;
}