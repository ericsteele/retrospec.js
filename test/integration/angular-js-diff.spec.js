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
var projectsDirectory = path.resolve(__dirname, '../input/projects/angular.js'),
    b6f4d4b   = path.resolve(projectsDirectory, 'b6f4d4b'),
    b6f4d4b_2 = path.resolve(projectsDirectory, 'b6f4d4b_2'), // ngTouch change
    b6f4d4b_3 = path.resolve(projectsDirectory, 'b6f4d4b_3'), // ngAria change
    b6f4d4b_4 = path.resolve(projectsDirectory, 'b6f4d4b_4'), // changed test
    e6ece7d   = path.resolve(projectsDirectory, 'e6ece7d'),
    fef0cfc   = path.resolve(projectsDirectory, 'fef0cfc');

describe('angular-js-diff.spec.js', function() {

  describe('b6f4d4b to b6f4d4b, same revision', function() {
    it('should select 0 regression tests', function(done) {
      var promiseP1 = getAngularProject(b6f4d4b),
          promiseP2 = getAngularProject(b6f4d4b);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(0)
                                   .notify(done);
    });
  });

  describe('b6f4d4b to b6f4d4b w/ changed test', function() {
    it('should select 1 regression tests', function(done) {
      var promiseP1 = getAngularProject(b6f4d4b),
          promiseP2 = getAngularProject(b6f4d4b_4);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(1)
                                   .notify(done);
    });
  });

  describe('b6f4d4b to b6f4d4b w/ changed ngTouch', function() {
    it('should select 3 regression tests', function(done) {
      var promiseP1 = getAngularProject(b6f4d4b),
          promiseP2 = getAngularProject(b6f4d4b_2);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(3)
                                   .notify(done);
    });
  });

  describe('b6f4d4b to b6f4d4b w/ changed ngAria', function() {
    it('should select 1 regression tests', function(done) {
      var promiseP1 = getAngularProject(b6f4d4b),
          promiseP2 = getAngularProject(b6f4d4b_3);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(1)
                                   .notify(done);
    });
  });

  describe('b6f4d4b to e6ece7d, close revisions', function() {
    it('should select 15 regression tests', function(done) {
      var promiseP1 = getAngularProject(b6f4d4b),
          promiseP2 = getAngularProject(e6ece7d);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(15)
                                   .notify(done);
    });
  });

  describe('b6f4d4b to fef0cfc, far revisions', function() {
    it('should select 22 regression tests', function(done) {
      var promiseP1 = getAngularProject(b6f4d4b),
          promiseP2 = getAngularProject(fef0cfc);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(22)
                                   .notify(done);
    });
  });

  function getAngularProject(projectDir) {
    var srcDirPath  = path.resolve(projectDir, 'src'),
        testDirPath = path.resolve(projectDir, 'test'),
        srcBlobs    = ['*/*.js'],
        testBlobs   = ['**/*Spec.js'];

    // tests: buildProject
    return buildProject(srcExtractor, srcDirPath, srcBlobs, testExtractor, testDirPath, testBlobs);
  }

  function selectTestSuites(projects) {
    // tests: diffProjects
    var diffs = diffProjects(projects[0], projects[1]);
    // tests: selectTests
    return selectTests(projects[1], diffs);
  }

});