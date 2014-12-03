/*
 * angular.spec.js
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

// Module under test
var extractor = require('../../src/extractors/angular-module-extractor');

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
			var expected = [
				{ name: 'test', dependencies: ['a', 'b', 'c'], path: 'angular/single-module.js' }
			];

			extractor.fromFile('angular/single-module.js', codeSnippetDirectory)
			         .should.eventually.eql(expected)
			         .notify(done);
		});
	});

	describe('.fromFile("multiple-modules.js")', function() {
		it('should extract 3 modules, each with 3 dependencies', function(done) {
			var expected = [
				{ name: 'test1', dependencies: ['a', 'b', 'c'], path: 'angular/multiple-modules.js' },
				{ name: 'test2', dependencies: ['d', 'e', 'f'], path: 'angular/multiple-modules.js' },
				{ name: 'test3', dependencies: ['g', 'h', 'i'], path: 'angular/multiple-modules.js' }
			];

			extractor.fromFile('angular/multiple-modules.js', codeSnippetDirectory)
			         .should.eventually.eql(expected)
			         .notify(done);
		});
	});

	describe('.fromFile("ui-bootstrap-example.js")', function() {
		it('should extract 1 module, with 1 dependency', function(done) {
			var expected = [{ 
				name: 'ui.bootstrap.accordion', 
				dependencies: ['ui.bootstrap.collapse'], 
				path: 'angular/ui-bootstrap-example.js' 
			}];

			extractor.fromFile('angular/ui-bootstrap-example.js', codeSnippetDirectory)
			         .should.eventually.eql(expected)
			         .notify(done);
		});
	});

});