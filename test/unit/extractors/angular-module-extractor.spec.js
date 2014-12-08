/*
 * angular-module-extractor.spec.js
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

// Load utilities for handling and transforming file paths
var path = require('path');

// Directory containing code snippets used in our tests
var codeSnippetDirectory = path.resolve(__dirname, '../../input/code-snippets');

// Directory containing some real projects we can use for our tests
var projectsDirectory = path.resolve(__dirname, '../../input/projects');

// Module under test
var extractor = require('../../../src/extractors/angular-module-extractor');

describe('angular-module-extractor.js', function() {

  describe('.fromFile("empty.js")', function() {
    it('should extract 0 modules', function(done) {
      extractor.fromFile('empty.js', codeSnippetDirectory)
               .should.eventually.have.length(0)
               .notify(done);
    });
  });

  describe('.fromFile("single-module.js")', function() {
    it('should extract 1 module with 3 dependencies', function(done) {
      var expected = [{ 
        id:   'test', dependencies: ['a', 'b', 'c'], 
        path: 'angular/single-module.js',
        hash: '4ec504b02e09484bc41e0314a4746bf13712faf4'
      }];

      extractor.fromFile('angular/single-module.js', codeSnippetDirectory)
               .should.eventually.eql(expected)
               .notify(done);
    });
  });

  describe('.fromFile("multiple-modules.js")', function() {
    it('should extract 3 modules, each with 3 dependencies', function(done) {
      var expected = [
        { 
          id:   'test1', dependencies: ['a', 'b', 'c'], 
          path: 'angular/multiple-modules.js',
          hash: '11e66d7f4c3a75d1a25e591d2b5c58daaf5307bf' 
        },
        { 
          id:   'test2', dependencies: ['d', 'e', 'f'], 
          path: 'angular/multiple-modules.js',
          hash: '11e66d7f4c3a75d1a25e591d2b5c58daaf5307bf'
        },
        { 
          id:   'test3', dependencies: ['g', 'h', 'i'], 
          path: 'angular/multiple-modules.js',
          hash: '11e66d7f4c3a75d1a25e591d2b5c58daaf5307bf'
        }
      ];

      extractor.fromFile('angular/multiple-modules.js', codeSnippetDirectory)
               .should.eventually.eql(expected)
               .notify(done);
    });
  });

  describe('.fromFile("ui-bootstrap-example.js")', function() {
    it('should extract 1 module, with 1 dependency', function(done) {
      var expected = [{ 
        id:   'ui.bootstrap.accordion', 
        dependencies: ['ui.bootstrap.collapse'], 
        path: 'angular/ui-bootstrap-example.js',
        hash: 'b45a37d401ed0fef5f70a0c30781fe77e06b53ac'
      }];

      extractor.fromFile('angular/ui-bootstrap-example.js', codeSnippetDirectory)
               .should.eventually.eql(expected)
               .notify(done);
    });
  });

  describe('.fromDirectory(["*/*.js", "angular.js/src")', function() {
    it('should find 739 modules', function(done) {
      var p = path.resolve(projectsDirectory, 'angular.js/b6f4d4b/src');
      extractor.fromDirectory(['*/*.js'], p)
               .should.eventually.have.length(739)
               .notify(done);
    });
  });

  describe('.fromDirectory(["*/*.js", "ui-bootstrap/src")', function() {
    it('should find 20 modules', function(done) {
      var p = path.resolve(projectsDirectory, 'ui-bootstrap/03b7c69/src');
      var promise = extractor.fromDirectory(['*/*.js'], p);
      promise.should.eventually.have.length(20)
             .notify(done);
    });
  });

});