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
chai.use(require('chai-as-promised'));

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
      extractor.fromFile('angular/single-module.js', codeSnippetDirectory)
               .then(function (result) {
                 result.length.should.equal(1);
                 result[0].should.have.property('hash');
                 result[0].id.should.eql('test');
                 result[0].path.should.eql('angular/single-module.js');
                 result[0].dependencies.should.eql(['a', 'b', 'c']);
               })
               .done(done);
    });
  });

  describe('.fromFile("multiple-modules.js")', function() {
    it('should extract 3 modules, each with 3 dependencies', function(done) {
      extractor.fromFile('angular/multiple-modules.js', codeSnippetDirectory)
               .then(function (result) {
                 result.length.should.equal(3);
                 result[0].should.have.property('hash');
                 result[1].should.have.property('hash');
                 result[2].should.have.property('hash');
                 result[0].id.should.eql('test1');
                 result[1].id.should.eql('test2');
                 result[2].id.should.eql('test3');
                 result[0].path.should.eql('angular/multiple-modules.js');
                 result[1].path.should.eql('angular/multiple-modules.js');
                 result[2].path.should.eql('angular/multiple-modules.js');
                 result[0].dependencies.should.eql(['a', 'b', 'c']);
                 result[1].dependencies.should.eql(['d', 'e', 'f']);
                 result[2].dependencies.should.eql(['g', 'h', 'i']);
               })
               .done(done);
    });
  });

  describe('.fromFile("ui-bootstrap-example.js")', function() {
    it('should extract 1 module, with 1 dependency', function(done) {
      extractor.fromFile('angular/ui-bootstrap-example.js', codeSnippetDirectory)
               .then(function (result) {
                 result.length.should.equal(1);
                 result[0].should.have.property('hash');
                 result[0].id.should.eql('ui.bootstrap.accordion');
                 result[0].path.should.eql('angular/ui-bootstrap-example.js');
                 result[0].dependencies.should.eql(['ui.bootstrap.collapse']);
               })
               .done(done);
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