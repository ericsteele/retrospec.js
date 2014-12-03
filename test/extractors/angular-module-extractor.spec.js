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

// Use the input folder as the working directory for tests
var cwd = path.resolve(__dirname, '../input');

// Module under test
var extractor = require('../../src/extractors/angular-module-extractor');

describe('angular-module-extractor', function() {
	
	describe('.fromFile(filePath)', function() {

		describe('empty.js', function() {
			it('should extract 0 modules', function(done) {
				extractor.fromFile('empty.js', cwd)
				         .should.eventually.have.length(0)
				         .notify(done);
			});
		});

		describe('angular/single-module.js', function() {
			it('should extract 1 module with 3 dependencies', function(done) {
				var expected = [
					{ name: 'test', dependencies: ['a', 'b', 'c'], path: 'angular/single-module.js' }
				];

				extractor.fromFile('angular/single-module.js', cwd)
				         .should.eventually.eql(expected)
				         .notify(done);
			});
		});

		describe('angular/multiple-modules.js', function() {
			it('should extract 3 modules, each with 3 dependencies', function(done) {
				var expected = [
					{ name: 'test1', dependencies: ['a', 'b', 'c'], path: 'angular/multiple-modules.js' },
					{ name: 'test2', dependencies: ['d', 'e', 'f'], path: 'angular/multiple-modules.js' },
					{ name: 'test3', dependencies: ['g', 'h', 'i'], path: 'angular/multiple-modules.js' }
				];

				extractor.fromFile('angular/multiple-modules.js', cwd)
				         .should.eventually.eql(expected)
				         .notify(done);
			});
		});

		describe('angular/ui-bootstrap-example.js', function() {
			it('should extract 1 module, with 1 dependency', function(done) {
				var expected = [{ 
					name: 'ui.bootstrap.accordion', 
					dependencies: ['ui.bootstrap.collapse'], 
					path: 'angular/ui-bootstrap-example.js' 
				}];

				extractor.fromFile('angular/ui-bootstrap-example.js', cwd)
				         .should.eventually.eql(expected)
				         .notify(done);
			});
		});

	});

});