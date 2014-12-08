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
    testExtractor = require('../../src/extractors/jqm-test-suite-extractor'),
    testExecutor  = require('../../src/executors/jqm-test-suite-executor');

// Directory containing code snippets used in our tests
var codeSnippetDirectory = path.resolve(__dirname, '../input/code-snippets');

// Directory containing some real projects we can use for our tests
var projectsDirectory = path.resolve(__dirname, '../input/projects/jquery-mobile'),
    jqmRev131    = path.resolve(projectsDirectory, 'rev-1.3.1-74b4bec'),
    jqmRev132    = path.resolve(projectsDirectory, 'rev-1.3.2-528cf0e'),
    jqmRev140rc1 = path.resolve(projectsDirectory, 'rev-1.4.0-rc1-4b6462b'),
    jqmRev140    = path.resolve(projectsDirectory, 'rev-1.4.0-3e5ec40'),
    jqmRev140x   = path.resolve(projectsDirectory, 'rev-1.4.0.x-143bdae'),
    jqmRev141    = path.resolve(projectsDirectory, 'rev-1.4.1-3455ada'),
    jqmRev141x   = path.resolve(projectsDirectory, 'rev-1.4.1.x-5bbb46a'),
    jqmRev142    = path.resolve(projectsDirectory, 'rev-1.4.2-2b7935a'),
    jqmRev143    = path.resolve(projectsDirectory, 'rev-1.4.3-23eed85'),
    jqmRev143x   = path.resolve(projectsDirectory, 'rev-1.4.3.x-b33ec10'),
    jqmRev144    = path.resolve(projectsDirectory, 'rev-1.4.4-08241cc'),
    jqmRev145    = path.resolve(projectsDirectory, 'rev-1.4.5-2ef45a1'),
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

  describe('Updating to each revision and testing:', function() {
    describe('1.3.1 to 1.3.2', function() {
      it('should select 34 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev131),
            promiseP2 = getJqmProject(jqmRev132);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(34)
                                     .notify(done);
      });
    });
    
    describe('1.3.2 to 1.4.0-rc1', function() {
      it('should select 55 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev132),
            promiseP2 = getJqmProject(jqmRev140rc1);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(55)
                                     .notify(done);
      });
    });
    
    describe('1.4.0-rc1 to 1.4.0', function() {
      it('should select 52 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev140rc1),
            promiseP2 = getJqmProject(jqmRev140);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(52)
                                     .notify(done);
      });
    });
    
    describe('1.4.0 to 1.4.0.x', function() {
      it('should select 50 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev140),
            promiseP2 = getJqmProject(jqmRev140x);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(50)
                                     .notify(done);
      });
    });
    
    describe('1.4.0.x to 1.4.1', function() {
      it('should select 58 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev140x),
            promiseP2 = getJqmProject(jqmRev141);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(58)
                                     .notify(done);
      });
    });
    
    describe('1.4.1 to 1.4.1.x', function() {
      it('should select 49 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev141),
            promiseP2 = getJqmProject(jqmRev141x);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(49)
                                     .notify(done);
      });
    });
    
    describe('1.4.1.x to 1.4.2', function() {
      it('should select 56 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev141x),
            promiseP2 = getJqmProject(jqmRev142);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(56)
                                     .notify(done);
      });
    });
    
    describe('1.4.2 to 1.4.3', function() {
      it('should select 70 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev142),
            promiseP2 = getJqmProject(jqmRev143);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(70)
                                     .notify(done);
      });
    });
    
    describe('1.4.3 to 1.4.3.x', function() {
      it('should select 69 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev143),
            promiseP2 = getJqmProject(jqmRev143x);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(69)
                                     .notify(done);
      });
    });
    
    describe('1.4.3.x to 1.4.4', function() {
      it('should select 71 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev143x),
            promiseP2 = getJqmProject(jqmRev144);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(71)
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
  testExecutor.executeTests(tests);
  return tests;
}