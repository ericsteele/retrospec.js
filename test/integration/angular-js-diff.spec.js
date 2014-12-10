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
    testExtractor = require('../../src/extractors/angular-karma-test-suite-extractor'),
    testExecutor  = require('../../src/executors/angular-test-suite-executor');

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
    _00456a8  = path.resolve(projectsDirectory, '00456a8'),
    _93b0c2d  = path.resolve(projectsDirectory, '93b0c2d'),
    cd9afd9   = path.resolve(projectsDirectory, 'cd9afd9'),
    eba192b   = path.resolve(projectsDirectory, 'eba192b'),
    b586bfd   = path.resolve(projectsDirectory, 'b586bfd'),
    f0904cf   = path.resolve(projectsDirectory, 'f0904cf'),
    _6acc73f  = path.resolve(projectsDirectory, '6acc73f'),
    fef0cfc   = path.resolve(projectsDirectory, 'fef0cfc');

//Consecutive revisions:
// 4/3/2014
var d64d41e   = path.resolve(projectsDirectory, 'd64d41e'),
   _83e36db   = path.resolve(projectsDirectory, '83e36db'),
    c967792   = path.resolve(projectsDirectory, 'c967792'),
   _71c11e9   = path.resolve(projectsDirectory, '71c11e9'),
    c67bd69   = path.resolve(projectsDirectory, 'c67bd69'),
   _1cb8584   = path.resolve(projectsDirectory, '1cb8584'),
   _7227f1a   = path.resolve(projectsDirectory, '7227f1a'),
    cb6b976   = path.resolve(projectsDirectory, 'cb6b976'),
   _8e2c62a   = path.resolve(projectsDirectory, '8e2c62a'),
    c369563   = path.resolve(projectsDirectory, 'c369563'),
    b63fd11   = path.resolve(projectsDirectory, 'b63fd11'),
// 4/4/2014
    a526ae8   = path.resolve(projectsDirectory, 'a526ae8'),
   _7b0c5b9   = path.resolve(projectsDirectory, '7b0c5b9'),
   _6b7a1b8   = path.resolve(projectsDirectory, '6b7a1b8'),
   _2845301   = path.resolve(projectsDirectory, '2845301'),
    e55c8bc   = path.resolve(projectsDirectory, 'e55c8bc'),
    dbe381f   = path.resolve(projectsDirectory, 'dbe381f'),
   _708f2ba   = path.resolve(projectsDirectory, '708f2ba'),
   _20b22f1   = path.resolve(projectsDirectory, '20b22f1'),
   _8b0b7ca   = path.resolve(projectsDirectory, '8b0b7ca');

//Consecutive revisions, round 2
var _1fef5fe = path.resolve(projectsDirectory, '1fef5fe'),
     ad0c510 = path.resolve(projectsDirectory, 'ad0c510'),
     d414b78 = path.resolve(projectsDirectory, 'd414b78'),
    _6e15462 = path.resolve(projectsDirectory, '6e15462'),
    _19af039 = path.resolve(projectsDirectory, '19af039'),
     d71df9f = path.resolve(projectsDirectory, 'd71df9f'),
     b87e5fc = path.resolve(projectsDirectory, 'b87e5fc'),
     e3003d5 = path.resolve(projectsDirectory, 'e3003d5'),
    _2ee29c5 = path.resolve(projectsDirectory, '2ee29c5'),
    _0c8a2cd = path.resolve(projectsDirectory, '0c8a2cd');

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
    it('should select 23 regression tests', function(done) {
      var promiseP1 = getAngularProject(b6f4d4b),
          promiseP2 = getAngularProject(e6ece7d);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(23)
                                   .notify(done);
    });
  });

  describe('b6f4d4b to fef0cfc, far revisions', function() {
    it('should select 70 regression tests', function(done) {
      var promiseP1 = getAngularProject(b6f4d4b),
          promiseP2 = getAngularProject(fef0cfc);

      Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                   .should.eventually.have.length(70)
                                   .notify(done);
    });
  });

  describe('Updating to each revision and testing:', function() {
    describe('b6f4d4b to e6ece7d', function() {
      it('should select 23 regression tests', function(done) {
        var promiseP1 = getAngularProject(b6f4d4b),
            promiseP2 = getAngularProject(e6ece7d);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(23)
                                     .notify(done);
      });
    });
    
    describe('e6ece7d to f6f0791', function() {
      it('should select 56 regression tests', function(done) {
        var promiseP1 = getAngularProject(e6ece7d),
            promiseP2 = getAngularProject(f6f0791);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(56)
                                     .notify(done);
      });
    });
    
    describe('f6f0791 to d396f42', function() {
      it('should select 3 regression tests', function(done) {
        var promiseP1 = getAngularProject(f6f0791),
            promiseP2 = getAngularProject(d396f42);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(3)
                                     .notify(done);
      });
    });
    
    describe('d396f42 to _00456a8', function() {
      it('should select 17 regression tests', function(done) {
        var promiseP1 = getAngularProject(d396f42),
            promiseP2 = getAngularProject(_00456a8);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(17)
                                     .notify(done);
      });
    });
    
    describe('_00456a8 to _93b0c2d', function() {
      it('should select 16 regression tests', function(done) {
        var promiseP1 = getAngularProject(_00456a8),
            promiseP2 = getAngularProject(_93b0c2d);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(16)
                                     .notify(done);
      });
    });
    
    describe('_93b0c2d to cd9afd9', function() {
      it('should select 22 regression tests', function(done) {
        var promiseP1 = getAngularProject(_93b0c2d),
            promiseP2 = getAngularProject(cd9afd9);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(22)
                                     .notify(done);
      });
    });
    
    describe('cd9afd9 to eba192b', function() {
      it('should select 27 regression tests', function(done) {
        var promiseP1 = getAngularProject(cd9afd9),
            promiseP2 = getAngularProject(eba192b);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(27)
                                     .notify(done);
      });
    });
    
    describe('eba192b to b586bfd', function() {
      it('should select 61 regression tests', function(done) {
        var promiseP1 = getAngularProject(eba192b),
            promiseP2 = getAngularProject(b586bfd);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(61)
                                     .notify(done);
      });
    });
    
    describe('b586bfd to f0904cf', function() {
      it('should select 17 regression tests', function(done) {
        var promiseP1 = getAngularProject(b586bfd),
            promiseP2 = getAngularProject(f0904cf);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(17)
                                     .notify(done);
      });
    });
    
    describe('f0904cf to _6acc73f', function() {
      it('should select 9 regression tests', function(done) {
        var promiseP1 = getAngularProject(f0904cf),
            promiseP2 = getAngularProject(_6acc73f);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(9)
                                     .notify(done);
      });
    });
    
    describe('_6acc73f to fef0cfc', function() {
      it('should select 27 regression tests', function(done) {
        var promiseP1 = getAngularProject(_6acc73f),
            promiseP2 = getAngularProject(fef0cfc);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(27)
                                     .notify(done);
      });
    });
  });

  //Consecutive revisions
  describe('Consecutive revisions', function() {
    describe('d64d41e to 83e36db', function() {
      it('should select 6 regression tests', function(done) {
        var promiseP1 = getAngularProject(d64d41e),
            promiseP2 = getAngularProject(_83e36db);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(6)
                                     .notify(done);
      });
    });
    
    describe('83e36db to c967792', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(_83e36db),
            promiseP2 = getAngularProject(c967792);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });
    
    describe('c967792 to 71c11e9', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(c967792),
            promiseP2 = getAngularProject(_71c11e9);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });
    
    describe('71c11e9 to c67bd69', function() {
      it('should select 4 regression tests', function(done) {
        var promiseP1 = getAngularProject(_71c11e9),
            promiseP2 = getAngularProject(c67bd69);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(4)
                                     .notify(done);
      });
    });
    
    describe('c67bd69 to 1cb8584', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(c67bd69),
            promiseP2 = getAngularProject(_1cb8584);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });
    
    describe('1cb8584 to 7227f1a', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(_1cb8584),
            promiseP2 = getAngularProject(_7227f1a);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('7227f1a to cb6b976', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(_7227f1a),
            promiseP2 = getAngularProject(cb6b976);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('cb6b976 to 8e2c62a', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(cb6b976),
            promiseP2 = getAngularProject(_8e2c62a);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('8e2c62a to c369563', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(_8e2c62a),
            promiseP2 = getAngularProject(c369563);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('c369563 to b63fd11', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(c369563),
            promiseP2 = getAngularProject(b63fd11);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('b63fd11 to a526ae8', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(b63fd11),
            promiseP2 = getAngularProject(a526ae8);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('a526ae8 to 7b0c5b9', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(a526ae8),
            promiseP2 = getAngularProject(_7b0c5b9);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('7b0c5b9 to 6b7a1b8', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(_7b0c5b9),
            promiseP2 = getAngularProject(_6b7a1b8);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('6b7a1b8 to 2845301', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(_6b7a1b8),
            promiseP2 = getAngularProject(_2845301);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('2845301 to e55c8bc', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(_2845301),
            promiseP2 = getAngularProject(e55c8bc);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('e55c8bc to dbe381f', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(e55c8bc),
            promiseP2 = getAngularProject(dbe381f);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });
    
    describe('dbe381f to 708f2ba', function() {
      it('should select 4 regression tests', function(done) {
        var promiseP1 = getAngularProject(dbe381f),
            promiseP2 = getAngularProject(_708f2ba);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(4)
                                     .notify(done);
      });
    });
    
    describe('708f2ba to 20b22f1', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(_708f2ba),
            promiseP2 = getAngularProject(_20b22f1);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
    
    describe('20b22f1 to 8b0b7ca', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(_20b22f1),
            promiseP2 = getAngularProject(_8b0b7ca);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });
  });

  //Consecutive revisions, Round 2
  describe('Consecutive revisions, round 2', function() {
    describe('1fef5fe to ad0c510', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(_1fef5fe),
            promiseP2 = getAngularProject(ad0c510);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });

    describe('ad0c510 to d414b78', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(ad0c510),
            promiseP2 = getAngularProject(d414b78);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });

    describe('d414b78 to 6e15462', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(d414b78),
            promiseP2 = getAngularProject(_6e15462);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });

    describe('6e15462 to 19af039', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(_6e15462),
            promiseP2 = getAngularProject(_19af039);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });

    describe('19af039 to d71df9f', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(_19af039),
            promiseP2 = getAngularProject(d71df9f);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });

    describe('d71df9f to b87e5fc', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(d71df9f),
            promiseP2 = getAngularProject(b87e5fc);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });

    describe('b87e5fc to e3003d5', function() {
      it('should select 0 regression tests', function(done) {
        var promiseP1 = getAngularProject(b87e5fc),
            promiseP2 = getAngularProject(e3003d5);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(0)
                                     .notify(done);
      });
    });

    describe('e3003d5 to 2ee29c5', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(e3003d5),
            promiseP2 = getAngularProject(_2ee29c5);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
                                     .notify(done);
      });
    });

    describe('2ee29c5 to 0c8a2cd', function() {
      it('should select 1 regression tests', function(done) {
        var promiseP1 = getAngularProject(_2ee29c5),
            promiseP2 = getAngularProject(_0c8a2cd);

        Q.all([promiseP1, promiseP2]).then(selectTestSuites)
                                     .should.eventually.have.length(1)
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
    var tests = selectTests(projects[0], projects[1]);
    //testExecutor.executeTests(tests);
    return tests;
  }

});