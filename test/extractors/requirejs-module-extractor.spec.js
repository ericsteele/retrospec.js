/*
 * requirejs.spec.js
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
var codeSnippetDirectory = path.resolve(__dirname, '../input/code-snippets');

// Directory containing some real projects we can use for our tests
var projectsDirectory = path.resolve(__dirname, '../input/projects');

// Module under test
var extractor = require('../../src/extractors/requirejs-module-extractor');

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
			var expected = [{
				name:         'requirejs/single-define.js',
				dependencies: ['a','b','c','x'],
				path:         'requirejs/single-define.js'
			}];

			extractor.fromFile('requirejs/single-define.js', codeSnippetDirectory)
			         .should.eventually.eql(expected)
			         .notify(done);
		});
	});

	describe('.fromFile("multiple-defines.js")', function() {
		it('should extract 1 module with 12 dependencies', function(done) {
			var expected = [{
				name:         'requirejs/multiple-defines.js',
				dependencies: ['a','b','c','d','e','f','g','h','i','x','y','z'],
				path:         'requirejs/multiple-defines.js'
			}];

			extractor.fromFile('requirejs/multiple-defines.js', codeSnippetDirectory)
			         .should.eventually.eql(expected)
			         .notify(done);
		});
	});

	describe('.fromFile("nested-defines.js")', function() {
		it('should extract 1 module with 12 dependencies', function(done) {
			var expected = [{
				name:         'requirejs/nested-defines.js',
				dependencies: ['a','b','c','d','e','f','g','h','i','x','y','z'],
				path:         'requirejs/nested-defines.js'
			}];

			extractor.fromFile('requirejs/nested-defines.js', codeSnippetDirectory)
			         .should.eventually.eql(expected)
			         .notify(done);
		});
	});

	describe('.fromDirectory(["**/*.js"], "jquery-mobile/js")', function() {

		it('should extract 66 modules', function(done) {
			var cwd = path.resolve(projectsDirectory, 'jquery-mobile/js');

			extractor.fromDirectory(['**/*.js'], cwd)
			         .should.eventually.have.length(66)
			         .notify(done);
		});

	});

});