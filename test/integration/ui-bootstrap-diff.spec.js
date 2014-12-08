/*
 * angular-js-diff.spec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Peter Ingulli
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
    diffProjects  = require('../../src/helper/diff-projects'),
    selectTests   = require('../../src/helper/select-tests'),  
    retrospec     = require('../../src/retrospec.js'),
    srcExtractor  = require('../../src/extractors/angular-module-extractor'),
    testExtractor = require('../../src/extractors/angular-karma-test-suite-extractor');

// Directory containing code snippets used in our tests
var codeSnippetDirectory = path.resolve(__dirname, '../input/code-snippets');

// Directory containing some real projects we can use for our tests
var projectsDirectory = path.resolve(__dirname, '../input/projects/ui-bootstrap'),
    _03b7c69   = path.resolve(projectsDirectory, '03b7c69'),
    _03b7c69_2 = path.resolve(projectsDirectory, '03b7c69_2'), // accordion change
    _03b7c69_3 = path.resolve(projectsDirectory, '03b7c69_3'), // transition change
    _03b7c69_4 = path.resolve(projectsDirectory, '03b7c69_4'), // changed test
    _88cd454   = path.resolve(projectsDirectory, '88cd454'),
    _bc23d1c   = path.resolve(projectsDirectory, 'bc23d1c'),
    _0b31e86   = path.resolve(projectsDirectory, '0b31e86'),
    _a81d6f9   = path.resolve(projectsDirectory, 'a81d6f9'),
    _45f568d   = path.resolve(projectsDirectory, '45f568d'),
    _15e255d   = path.resolve(projectsDirectory, '15e255d'),
    _9205a57   = path.resolve(projectsDirectory, '9205a57'),
    _9dbc239   = path.resolve(projectsDirectory, '9dbc239'),
    _3e5f796   = path.resolve(projectsDirectory, '3e5f796'),
    _ceb396f   = path.resolve(projectsDirectory, 'ceb396f'),
    _23a3226   = path.resolve(projectsDirectory, '23a3226');

describe('ui-bootstrap-diff.spec.js', function() {

  describe('03b7c69 to 03b7c69, same revision', function() {
    it('should select 0 regression tests', function(done) {
      var promiseP1 = getAngularProject(_03b7c69),
          promiseP2 = getAngularProject(_03b7c69);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(0)
                                   .notify(done);
    });
  });

  describe('03b7c69 to 03b7c69_2, changed 1 module (accordion)', function() {
    it('should select 1 regression test', function(done) {
      var promiseP1 = getAngularProject(_03b7c69),
          promiseP2 = getAngularProject(_03b7c69_2);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(1)
                                   .notify(done);
    });
  });

  describe('03b7c69 to 03b7c69_2, changed 1 module that others depend on (transition)', function() {
    it('should select 7 regression tests', function(done) {
      var promiseP1 = getAngularProject(_03b7c69),
          promiseP2 = getAngularProject(_03b7c69_3);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(7)
                                   .notify(done);
    });
  });

  describe('03b7c69 to 03b7c69_2, changed 1 test (dropdown)', function() {
    it('should select 1 regression test', function(done) {
      var promiseP1 = getAngularProject(_03b7c69),
          promiseP2 = getAngularProject(_03b7c69_4);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(1)
                                   .notify(done);
    });
  });

  describe('03b7c69 to 88cd454, close revisions', function() {
    it('should select 2 regression tests', function(done) {
      var promiseP1 = getAngularProject(_03b7c69),
          promiseP2 = getAngularProject(_88cd454);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(2)
                                   .notify(done);
    });
  });

  describe('03b7c69 to 23a3226, far revisions', function() {
    it('should select 15 regression tests', function(done) {
      var promiseP1 = getAngularProject(_03b7c69),
          promiseP2 = getAngularProject(_23a3226);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(15)
                                   .notify(done);
    });
  });

  describe('Updating to each revision and testing:', function() {
    describe('03b7c69 to 88cd454', function() {
      it('should select 2 regression tests', function(done) {
        var promiseP1 = getAngularProject(_03b7c69),
            promiseP2 = getAngularProject(_88cd454);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(2)
                                     .notify(done);
      });
    });
    describe('88cd454 to bc23d1c', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(_88cd454),
            promiseP2 = getAngularProject(_bc23d1c);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });
    describe('bc23d1c to a81d6f9', function() {
      it('should select 13 regression tests', function(done) {
        var promiseP1 = getAngularProject(_bc23d1c),
            promiseP2 = getAngularProject(_a81d6f9);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(13)
                                     .notify(done);
      });
    });
    describe('a81d6f9 to 45f568d', function() {
      it('should select 24 regression tests', function(done) {
        var promiseP1 = getAngularProject(_a81d6f9),
            promiseP2 = getAngularProject(_45f568d);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(24)
                                     .notify(done);
      });
    });
    describe('45f568d to 15e255d', function() {
      it('should select 15 regression tests', function(done) {
        var promiseP1 = getAngularProject(_45f568d),
            promiseP2 = getAngularProject(_15e255d);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(15)
                                     .notify(done);
      });
    });
    describe('15e255d to 9205a57', function() {
      it('should select 15 regression tests', function(done) {
        var promiseP1 = getAngularProject(_15e255d),
            promiseP2 = getAngularProject(_9205a57);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(15)
                                     .notify(done);
      });
    });
    describe('9205a57 to 9dbc239', function() {
      it('should select 19 regression tests', function(done) {
        var promiseP1 = getAngularProject(_9205a57),
            promiseP2 = getAngularProject(_9dbc239);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(19)
                                     .notify(done);
      });
    });
    describe('9dbc239 to 3e5f796', function() {
      it('should select 15 regression tests', function(done) {
        var promiseP1 = getAngularProject(_9dbc239),
            promiseP2 = getAngularProject(_3e5f796);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(15)
                                     .notify(done);
      });
    });
    describe('3e5f796 to ceb396f', function() {
      it('should select 13 regression tests', function(done) {
        var promiseP1 = getAngularProject(_3e5f796),
            promiseP2 = getAngularProject(_ceb396f);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(13)
                                     .notify(done);
      });
    });
    describe('ceb396f to 23a3226', function() {
      it('should select 10 regression tests', function(done) {
        var promiseP1 = getAngularProject(_ceb396f),
            promiseP2 = getAngularProject(_23a3226);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(10)
                                     .notify(done);
      });
    });
    describe('23a3226 to 88cd454', function() {
      it('should select 26 regression tests', function(done) {
        var promiseP1 = getAngularProject(_23a3226),
            promiseP2 = getAngularProject(_88cd454);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(26)
                                     .notify(done);
      });
    });
  });

  function getAngularProject(projectDir) {
    var srcDirPath  = path.resolve(projectDir, 'src'),
        testDirPath = path.resolve(projectDir, ''),
        srcBlobs    = ['*/*.js'],
        testBlobs   = ['src/*/test/*.spec.js'];

    // tests: buildProject
    return buildProject(srcExtractor, srcDirPath, srcBlobs, testExtractor, testDirPath, testBlobs);
  }

  // Helper method for selecting tests
  function selectTestSuites(projects) {
    // tests: selectTests, diffProjects
    return selectTests(projects[0], projects[1]);
  }

});