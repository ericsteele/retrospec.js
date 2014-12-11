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
chai.use(require('chai-as-promised'));

// Grab Chai's assert, expect, and should interfaces
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should(); // Note that should has to be executed

// libs
var path = require('path'), // utils for transforming file paths
    Q    = require('q');    // `kriskowal/q` promises

// turn off retrospec's logging
require('../../src/helper/logger').off();

// src under test
var buildProject  = require('../../src/helper/build-project.js'),
    selectTests   = require('../../src/helper/select-tests'),  
    srcExtractor  = require('../../src/extractors/angular-module-extractor'),
    testExtractor = require('../../src/extractors/angular-karma-test-suite-extractor'),
    testExecutor  = require('../../src/executors/ui-bootstrap-test-suite-executor');

// Directory containing some real projects we can use for our tests
var projectsDirectory = path.resolve(__dirname, '../input/projects/ui-bootstrap'),
   _1_d19b4c0 = path.resolve(projectsDirectory, 'd19b4c0'),
   _2_5ca23e9 = path.resolve(projectsDirectory, '5ca23e9');

describe.only('ui-bootstrap-rts.spec.js', function() {

  describe('2ef45a1 to 2ef45a1 (3 module edits, 1 test edit)', function() {
    // src  diff: "widget/dialog", "transitions/handlers", "buttonMarkup"
    // test diff: "init/weird file name-tests.html"
    it('should run 4 regression tests', function(done) {
      var promiseP1 = getAngularProject(_1_d19b4c0),
          promiseP2 = getAngularProject(_2_5ca23e9);

      Q.all([promiseP1, promiseP2]).then(runTestSuites)
                                   .should.eventually.have.length(4)
                                   .notify(done);
    });
  });
});

// Helper method for bulding projects
function getAngularProject(projectDir) {
  var srcDirPath  = path.resolve(projectDir, 'src'),
      testDirPath = path.resolve(projectDir, ''),
      srcBlobs    = ['*/*.js'],
      testBlobs   = ['src/*/test/*.spec.js'];

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
  var tests = selectTests(projects[0], projects[1]);

  return testExecutor.executeTests(tests, _2_5ca23e9).then(function(testResults) {
    return tests;
  });
}