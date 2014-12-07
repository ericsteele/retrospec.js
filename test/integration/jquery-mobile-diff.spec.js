/*
 * requirejs-diff.spec.js
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
var path = require('path'), // utils for handling and transforming file paths
    Q    = require('q');    // `kriskowal/q` promises

// src under test
var buildProject  = require('../../src/helper/build-project.js'),
    selectTests   = require('../../src/helper/select-tests'),  
    retrospec     = require('../../src/retrospec.js'),
    srcExtractor  = require('../../src/extractors/requirejs-module-extractor'),
    testExtractor = require('../../src/extractors/jquery-mobile-test-suite-extractor');

// Directory containing code snippets used in our tests
var codeSnippetDirectory = path.resolve(__dirname, '../input/code-snippets');

// Directory containing some real projects we can use for our tests
var projectsDirectory = path.resolve(__dirname, '../input/projects/jquery-mobile'),
    jqmRev131 = path.resolve(projectsDirectory, 'rev-1.3.1-74b4bec'),
    jqmRev144 = path.resolve(projectsDirectory, 'rev-1.4.4-08241cc'),
    jqmRev145 = path.resolve(projectsDirectory, 'rev-1.4.5-2ef45a1'),
    jqmRev145_v2 = path.resolve(projectsDirectory, 'rev-1.4.5-2ef45a1-v2'),
    jqmRev145_v3 = path.resolve(projectsDirectory, 'rev-1.4.5-2ef45a1-v3');

describe('jquery-mobile-diff.spec.js', function() {

  describe('1.3.1 to 1.3.1', function() {
    it('should select 0 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev131),
          promiseP2 = getJqmProject(jqmRev131);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(0)
                                   .notify(done);
    });
  });

  describe('1.4.4 to 1.4.4', function() {
    it('should select 0 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev144),
          promiseP2 = getJqmProject(jqmRev144);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(0)
                                   .notify(done);
    });
  });

  describe('1.4.5 to 1.4.5', function() {
    it('should select 0 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev145),
          promiseP2 = getJqmProject(jqmRev145);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(0)
                                   .notify(done);
    });
  });

  describe('1.3.1 to 1.4.5', function() {
    it('should select 84 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev131),
          promiseP2 = getJqmProject(jqmRev145);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(84)
                                   .notify(done);
    });
  });

  describe('1.4.4 to 1.4.5', function() {
    it('should select 76 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev144),
          promiseP2 = getJqmProject(jqmRev145);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(76)
                                   .notify(done);
    });
  });

  describe('1.4.5 to 1.4.5 (3 module edits)', function() {
    // diffs: widget/dialog, transitions/handlers, buttonMarkup
    it('should select 26 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev145),
          promiseP2 = getJqmProject(jqmRev145_v2);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(26)
                                   .notify(done);
    });
  });

  describe('1.4.5 to 1.4.5 (1 test edit)', function() {
    // diffs: widget/dialog, transitions/handlers, buttonMarkup
    it('should select 1 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev145),
          promiseP2 = getJqmProject(jqmRev145_v3);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(1)
                                   .notify(done);
    });
  });

});

// Helper method for bulding projects
function getJqmProject(projectDir) {
  var srcDirPath  = path.resolve(projectDir, 'js'),
      testDirPath = path.resolve(projectDir, 'tests'),
      srcBlobs    = ['**/*.js'],
      testBlobs   = ['**/*.html'];

  // tests: buildProject
  return buildProject(srcExtractor, srcDirPath, srcBlobs, testExtractor, testDirPath, testBlobs);
}

// Helper method for selecting tests
function selectTestSuites(projects) {
  // tests: selectTests, diffProjects
  var tests = selectTests(projects[0], projects[1]);
  return tests;
}