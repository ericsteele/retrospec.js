/*
 * jquery-mobile-rts.spec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// Load the Chai Assertion Library
var chai = require('chai');

// Extend Chai with assertions about promises
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

// Grab Chai's assert, expect, and should interfaces
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should(); // Note that should has to be executed

// libs
var path = require('path'), // utils for transforming file paths
    Q    = require('q');    // `kriskowal/q` promises

// src under test
var buildProject  = require('../../src/helper/build-project.js'),
    selectTests   = require('../../src/helper/select-tests'),  
    srcExtractor  = require('../../src/extractors/requirejs-module-extractor'),
    testExtractor = require('../../src/extractors/jqm-test-suite-extractor'),
    testExecutor  = require('../../src/executors/jqm-test-suite-executor-144');

// Directory containing code snippets used in our tests
var codeSnippetDirectory = path.resolve(__dirname, '../input/code-snippets');

// Directory containing some real projects we can use for our tests
var projectsDirectory = path.resolve(__dirname, '../input/projects/jquery-mobile'),
    jqmRev145    = path.resolve(projectsDirectory, 'rev-1.4.5-2ef45a1'),
    jqmRev145_v2 = path.resolve(projectsDirectory, 'rev-1.4.5-2ef45a1-v2');

describe.skip('jquery-mobile-rts.spec.js', function() {

  describe('2ef45a1 to 2ef45a1 (3 module edits, 1 test edit)', function() {
    // src  diff: "widget/dialog", "transitions/handlers", "buttonMarkup"
    // test diff: "init/weird file name-tests.html"
    it('should run 25 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev145),
          promiseP2 = getJqmProject(jqmRev145_v2);

      Q.all([promiseP1, promiseP2]).then(runTestSuites)
                                   .should.eventually.have.length(25)
                                   .notify(done);
    });
  });

});

// Helper method for bulding projects
function getJqmProject(projectDir) {
  var srcDirPath  = path.resolve(projectDir, 'js'),
      testDirPath = path.resolve(projectDir, 'tests'),
      srcBlobs    = ['**/*.js'],
      testBlobs   = ['**/index.html','**/*-tests.html'];

  // tests: buildProject
  return buildProject({
    srcDirPath: srcDirPath,
    srcBlobs: srcBlobs,
    srcExtractor: srcExtractor,
    testDirPath: testDirPath,
    testBlobs: testBlobs,
    testExtractor: testExtractor
  });
}

// Helper method for selecting and running tests
function runTestSuites(projects) {
  // console.log('ALL TEST SUITES');
  // for(var ts in projects[1].testSuiteMap) {
  //   if(projects[1].testSuiteMap.hasOwnProperty(ts)) {
  //     console.log(projects[1].testSuiteMap[ts].path);
  //   }
  // }

  var tests = selectTests(projects[0], projects[1]);

  // console.log('SELECTED TESTS');
  // tests.forEach(function(test) {
  //   console.log(test);
  // });

  return testExecutor.executeTests(tests).then(function(testResults) {
    return tests;
  });
}