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
    b6f4d4b_2 = path.resolve(projectsDirectory, 'b6f4d4b_2'),
    b6f4d4b_3 = path.resolve(projectsDirectory, 'b6f4d4b_3'),
    e6ece7d   = path.resolve(projectsDirectory, 'e6ece7d'),
    fef0cfc   = path.resolve(projectsDirectory, 'fef0cfc');

describe('angular-js-diff.spec.js', function() {

  it('same revisions: should select 0 regression tests', function(done) {
    var promiseP1 = getAngularProject(b6f4d4b),
        promiseP2 = getAngularProject(b6f4d4b);

    Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                 .should.eventually.have.length(0)
                                 .notify(done);
  });

  it('minor change: should select 3 regression tests', function(done) {
    var promiseP1 = getAngularProject(b6f4d4b),
        promiseP2 = getAngularProject(b6f4d4b_2);

    Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                 .should.eventually.have.length(3)
                                 .notify(done);
  });

  it('minor change: should select 1 regression tests', function(done) {
    var promiseP1 = getAngularProject(b6f4d4b),
        promiseP2 = getAngularProject(b6f4d4b_3);

    Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                 .should.eventually.have.length(1)
                                 .notify(done);
  });

  it('close revisions: should select 14 regression tests', function(done) {
    var promiseP1 = getAngularProject(b6f4d4b),
        promiseP2 = getAngularProject(e6ece7d);

    Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                 .should.eventually.have.length(14)
                                 .notify(done);
  });

  it('far revisions: should select 20 regression tests', function(done) {
    var promiseP1 = getAngularProject(b6f4d4b),
        promiseP2 = getAngularProject(fef0cfc);

    Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                 .should.eventually.have.length(20)
                                 .notify(done);
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