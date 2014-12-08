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
    f6f0791   = path.resolve(projectsDirectory, 'f6f0791'),
    d396f42   = path.resolve(projectsDirectory, 'd396f42'),
    _00456a8   = path.resolve(projectsDirectory, '00456a8'),
    _93b0c2d   = path.resolve(projectsDirectory, '93b0c2d'),
    cd9afd9   = path.resolve(projectsDirectory, 'cd9afd9'),
    eba192b   = path.resolve(projectsDirectory, 'eba192b'),
    b586bfd   = path.resolve(projectsDirectory, 'b586bfd'),
    f0904cf   = path.resolve(projectsDirectory, 'f0904cf'),
    _6acc73f   = path.resolve(projectsDirectory, '6acc73f'),
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

  describe('Updating to each revision and testing:', function() {
    describe('b6f4d4b to e6ece7d', function() {
      it('should select 15 regression tests', function(done) {
        var promiseP1 = getAngularProject(b6f4d4b),
            promiseP2 = getAngularProject(e6ece7d);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(15)
                                     .notify(done);
      });
    });
    
    describe('e6ece7d to f6f0791', function() {
      it('should select 18 regression tests', function(done) {
        var promiseP1 = getAngularProject(e6ece7d),
            promiseP2 = getAngularProject(f6f0791);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(18)
                                     .notify(done);
      });
    });
    
    describe('f6f0791 to d396f42', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(f6f0791),
            promiseP2 = getAngularProject(d396f42);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });
    
    describe('d396f42 to _00456a8', function() {
      it('should select 11 regression tests', function(done) {
        var promiseP1 = getAngularProject(d396f42),
            promiseP2 = getAngularProject(_00456a8);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(11)
                                     .notify(done);
      });
    });
    
    describe('_00456a8 to _93b0c2d', function() {
      it('should select 12 regression tests', function(done) {
        var promiseP1 = getAngularProject(_00456a8),
            promiseP2 = getAngularProject(_93b0c2d);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(12)
                                     .notify(done);
      });
    });
    
    describe('_93b0c2d to cd9afd9', function() {
      it('should select 17 regression tests', function(done) {
        var promiseP1 = getAngularProject(_93b0c2d),
            promiseP2 = getAngularProject(cd9afd9);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(17)
                                     .notify(done);
      });
    });
    
    describe('cd9afd9 to eba192b', function() {
      it('should select 19 regression tests', function(done) {
        var promiseP1 = getAngularProject(cd9afd9),
            promiseP2 = getAngularProject(eba192b);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(19)
                                     .notify(done);
      });
    });
    
    describe('eba192b to b586bfd', function() {
      it('should select 21 regression tests', function(done) {
        var promiseP1 = getAngularProject(eba192b),
            promiseP2 = getAngularProject(b586bfd);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(21)
                                     .notify(done);
      });
    });
    
    describe('b586bfd to f0904cf', function() {
      it('should select 11 regression tests', function(done) {
        var promiseP1 = getAngularProject(b586bfd),
            promiseP2 = getAngularProject(f0904cf);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(11)
                                     .notify(done);
      });
    });
    
    describe('f0904cf to _6acc73f', function() {
      it('should select 7 regression tests', function(done) {
        var promiseP1 = getAngularProject(f0904cf),
            promiseP2 = getAngularProject(_6acc73f);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(7)
                                     .notify(done);
      });
    });
    
    describe('_6acc73f to fef0cfc', function() {
      it('should select 20 regression tests', function(done) {
        var promiseP1 = getAngularProject(_6acc73f),
            promiseP2 = getAngularProject(fef0cfc);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(20)
                                     .notify(done);
      });
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

  // Helper method for selecting tests
  function selectTestSuites(projects) {
    // tests: selectTests, diffProjects
    return selectTests(projects[0], projects[1]);
  }

});