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
    testExtractor = require('../../src/extractors/jqm-test-suite-extractor');

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

//Consecutive revisions
var _3a22e02 = path.resolve(projectsDirectory,  '1-3a22e02'),
    _2e1bb85 = path.resolve(projectsDirectory,  '2-2e1bb85'),
    _277d379 = path.resolve(projectsDirectory,  '3-277d379'),
    _044a3f8 = path.resolve(projectsDirectory,  '4-044a3f8'),
     aea0f99 = path.resolve(projectsDirectory,  '5-aea0f99'),
     eb8d2ba = path.resolve(projectsDirectory,  '6-eb8d2ba'),
     b9b25ba = path.resolve(projectsDirectory,  '7-b9b25ba'),
    _1651544 = path.resolve(projectsDirectory,  '8-1651544'),
    _7378b55 = path.resolve(projectsDirectory,  '9-7378b55'),
    _7b31cee = path.resolve(projectsDirectory, '10-7b31cee'),
     bc4d8e2 = path.resolve(projectsDirectory, '11-bc4d8e2'),
    _468d221 = path.resolve(projectsDirectory, '12-468d221'),
    _5f34b77 = path.resolve(projectsDirectory, '13-5f34b77'),
    _0e6bf28 = path.resolve(projectsDirectory, '14-0e6bf28'),
    _2d5b272 = path.resolve(projectsDirectory, '15-2d5b272'),
    _1ff2d3a = path.resolve(projectsDirectory, '16-1ff2d3a'),
     bbb3bd5 = path.resolve(projectsDirectory, '17-bbb3bd5'),
    _40d4cb8 = path.resolve(projectsDirectory, '18-40d4cb8'),
    _87453e0 = path.resolve(projectsDirectory, '19-87453e0'),
    _4b66652 = path.resolve(projectsDirectory, '20-4b66652');

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
    it('should select 101 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev131),
          promiseP2 = getJqmProject(jqmRev145);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(101)
                                   .notify(done);
    });
  });

  describe('1.4.4 to 1.4.5', function() {
    it('should select 75 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev144),
          promiseP2 = getJqmProject(jqmRev145);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(75)
                                   .notify(done);
    });
  });

  describe('1.4.5 to 1.4.5 (3 module edits)', function() {
    // diffs: widget/dialog, transitions/handlers, buttonMarkup
    it('should select 25 regression tests', function(done) {
      var promiseP1 = getJqmProject(jqmRev145),
          promiseP2 = getJqmProject(jqmRev145_v2);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(25)
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
      it('should select 32 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev131),
            promiseP2 = getJqmProject(jqmRev132);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(32)
                                     .notify(done);
      });
    });
    
    describe('1.3.2 to 1.4.0-rc1', function() {
      it('should select 73 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev132),
            promiseP2 = getJqmProject(jqmRev140rc1);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(73)
                                     .notify(done);
      });
    });
    
    describe('1.4.0-rc1 to 1.4.0', function() {
      it('should select 50 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev140rc1),
            promiseP2 = getJqmProject(jqmRev140);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(50)
                                     .notify(done);
      });
    });
    
    describe('1.4.0 to 1.4.0.x', function() {
      it('should select 48 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev140),
            promiseP2 = getJqmProject(jqmRev140x);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(48)
                                     .notify(done);
      });
    });
    
    describe('1.4.0.x to 1.4.1', function() {
      it('should select 76 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev140x),
            promiseP2 = getJqmProject(jqmRev141);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(76)
                                     .notify(done);
      });
    });
    
    describe('1.4.1 to 1.4.1.x', function() {
      it('should select 47 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev141),
            promiseP2 = getJqmProject(jqmRev141x);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(47)
                                     .notify(done);
      });
    });
    
    describe('1.4.1.x to 1.4.2', function() {
      it('should select 54 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev141x),
            promiseP2 = getJqmProject(jqmRev142);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(54)
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
      it('should select 68 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev143),
            promiseP2 = getJqmProject(jqmRev143x);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(68)
                                     .notify(done);
      });
    });
    
    describe('1.4.3.x to 1.4.4', function() {
      it('should select 72 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev143x),
            promiseP2 = getJqmProject(jqmRev144);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(72)
                                     .notify(done);
      });
    });
    
    describe('1.4.4 to 1.4.5', function() {
      it('should select 75 regression tests', function(done) {
        var promiseP1 = getJqmProject(jqmRev144),
            promiseP2 = getJqmProject(jqmRev145);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(75)
                                     .notify(done);
      });
    });
  });


  //Consecutive revisions
  describe('Consecutive revisions', function() {
    describe('3a22e02 to 2e1bb85', function() {
      it('should select 63 regression tests', function(done) {
        var promiseP1 = getJqmProject(_3a22e02),
            promiseP2 = getJqmProject(_2e1bb85);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(63)
                                     .notify(done);
      });
    });
    
    describe('2e1bb85 to 277d379', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_2e1bb85),
            promiseP2 = getJqmProject(_277d379);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('277d379 to 044a3f8', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getJqmProject(_277d379),
            promiseP2 = getJqmProject(_044a3f8);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });
    
    describe('044a3f8 to aea0f99', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_044a3f8),
            promiseP2 = getJqmProject(aea0f99);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('aea0f99 to eb8d2ba', function() {
      it('should select 13 regression tests', function(done) {
        var promiseP1 = getJqmProject(aea0f99),
            promiseP2 = getJqmProject(eb8d2ba);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(13)
                                     .notify(done);
      });
    });
    
    describe('eb8d2ba to b9b25ba', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(eb8d2ba),
            promiseP2 = getJqmProject(b9b25ba);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('b9b25ba to 1651544', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(b9b25ba),
            promiseP2 = getJqmProject(_1651544);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('1651544 to 7378b55', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_1651544),
            promiseP2 = getJqmProject(_7378b55);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('7378b55 to 7b31cee', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_7378b55),
            promiseP2 = getJqmProject(_7b31cee);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('7b31cee to bc4d8e2', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_7b31cee),
            promiseP2 = getJqmProject(bc4d8e2);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('bc4d8e2 to 468d221', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(bc4d8e2),
            promiseP2 = getJqmProject(_468d221);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('468d221 to 5f34b77', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_468d221),
            promiseP2 = getJqmProject(_5f34b77);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('5f34b77 to 0e6bf28', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_5f34b77),
            promiseP2 = getJqmProject(_0e6bf28);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('0e6bf28 to 2d5b272', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_0e6bf28),
            promiseP2 = getJqmProject(_2d5b272);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('2d5b272 to 1ff2d3a', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_2d5b272),
            promiseP2 = getJqmProject(_1ff2d3a);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('1ff2d3a to bbb3bd5', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_1ff2d3a),
            promiseP2 = getJqmProject(bbb3bd5);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('bbb3bd5 to 40d4cb8', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(bbb3bd5),
            promiseP2 = getJqmProject(_40d4cb8);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('40d4cb8 to 87453e0', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_40d4cb8),
            promiseP2 = getJqmProject(_87453e0);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('87453e0 to 4b66652', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getJqmProject(_87453e0),
            promiseP2 = getJqmProject(_4b66652);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
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

// Helper method for selecting tests
function selectTestSuites(projects) {
  // tests: selectTests, diffProjects
  var tests = selectTests(projects[0], projects[1]);
  return tests;
}