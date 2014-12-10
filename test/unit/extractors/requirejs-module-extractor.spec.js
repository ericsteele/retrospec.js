/*
 * requirejs-module-extractor.spec.js
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
var extractor = require('../../../src/extractors/requirejs-module-extractor');

describe('requirejs-module-extractor.js', function() {

  describe('.fromFile("empty.js")', function() {
    it('should extract 0 modules', function(done) {
      extractor.fromFile('empty.js', codeSnippetDirectory)
               .should.eventually.have.length(0)
               .notify(done);
    });
  });

  describe('.fromFile("single-define.js")', function() {
    it('should extract 1 module with 4 dependencies', function(done) {
      extractor.fromFile('requirejs/single-define.js', codeSnippetDirectory)
               .then(function (result) {
                 result.length.should.equal(1);
                 result[0].should.have.property('hash');
                 result[0].id.should.eql('requirejs/single-define');
                 result[0].path.should.eql('requirejs/single-define.js');
                 result[0].dependencies.should.eql(['a', 'b', 'c','x']);
               })
               .done(done);
    });
  });

  describe('.fromFile("multiple-defines.js")', function() {
    it('should extract 1 module with 12 dependencies', function(done) {
      extractor.fromFile('requirejs/multiple-defines.js', codeSnippetDirectory)
               .then(function (result) {
                 result.length.should.equal(1);
                 result[0].should.have.property('hash');
                 result[0].id.should.eql('requirejs/multiple-defines');
                 result[0].path.should.eql('requirejs/multiple-defines.js');
                 result[0].dependencies.should.eql(['a','b','c','d','e','f','g','h','i','x','y','z']);
               })
               .done(done);
    });
  });

  describe('.fromFile("nested-defines.js")', function() {
    it('should extract 1 module with 12 dependencies', function(done) {
      extractor.fromFile('requirejs/nested-defines.js', codeSnippetDirectory)
               .then(function (result) {
                 result.length.should.equal(1);
                 result[0].should.have.property('hash');
                 result[0].id.should.eql('requirejs/nested-defines');
                 result[0].path.should.eql('requirejs/nested-defines.js');
                 result[0].dependencies.should.eql(['a','b','c','d','e','f','g','h','i','x','y','z']);
               })
               .done(done);
    });
  });

  // rev-1.4.5-2ef45a1
  describe('.fromDirectory(["**/*.js"], "jquery-mobile/rev-1.4.5-2ef45a1/js")', function() {
    it('should extract 83 modules', function(done) {
      var cwd = path.resolve(projectsDirectory, 'jquery-mobile/rev-1.4.5-2ef45a1/js');
      extractor.fromDirectory(['**/*.js'], cwd)
               .should.eventually.have.length(83)
               .notify(done);
    });
  });

  // rev-1.3.1-74b4bec
  describe('.fromDirectory(["**/*.js"], "jquery-mobile/rev-1.3.1-74b4bec/js")', function() {
    it('should extract 66 modules', function(done) {
      var cwd = path.resolve(projectsDirectory, 'jquery-mobile/rev-1.3.1-74b4bec/js');
      extractor.fromDirectory(['**/*.js'], cwd)
               .should.eventually.have.length(66)
               .notify(done);
    });
  });

});