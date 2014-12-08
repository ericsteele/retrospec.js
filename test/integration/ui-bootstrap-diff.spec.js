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