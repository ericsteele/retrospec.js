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

// Use the input folder as the working directory for tests
var cwd = path.resolve(__dirname, '../input');

// Module under test
var extractor = require('../../src/extractors/requirejs-module-extractor');

describe('requirejs-module-extractor', function() {
	
	describe('.fromFile(filePath, encoding)', function() {

		describe('empty.js', function() {
			it('should extract 0 modules', function(done) {
				extractor.fromFile('empty.js', cwd)
				         .should.eventually.have.length(0)
				         .notify(done);
			});
		});

		describe('requirejs/single-define.js', function() {
			it('should extract 1 module with 4 dependencies', function(done) {
				var expected = [{
					name:         'requirejs/single-define.js',
					dependencies: ['a','b','c','x'],
					path:         'requirejs/single-define.js'
				}];

				extractor.fromFile('requirejs/single-define.js', cwd)
				         .should.eventually.eql(expected)
				         .notify(done);
			});
		});

		describe('requirejs/multiple-defines.js', function() {
			it('should extract 1 module with 12 dependencies', function(done) {
				var expected = [{
					name:         'requirejs/multiple-defines.js',
					dependencies: ['a','b','c','d','e','f','g','h','i','x','y','z'],
					path:         'requirejs/multiple-defines.js'
				}];

				extractor.fromFile('requirejs/multiple-defines.js', cwd)
				         .should.eventually.eql(expected)
				         .notify(done);
			});
		});

		describe('requirejs/nested-defines.js', function() {
			it('should extract 1 module with 12 dependencies', function(done) {
				var expected = [{
					name:         'requirejs/nested-defines.js',
					dependencies: ['a','b','c','d','e','f','g','h','i','x','y','z'],
					path:         'requirejs/nested-defines.js'
				}];

				extractor.fromFile('requirejs/nested-defines.js', cwd)
				         .should.eventually.eql(expected)
				         .notify(done);
			});
		});

	});

	describe('.fromDirectory(patterns, cwd)', function() {

		describe('/jquery-mobile/js', function() {
			it('should extract 72 modules', function(done) {
				var cwd = path.resolve(__dirname, '../input/jquery-mobile/js');

				extractor.fromDirectory(['**/*.js'], cwd)
				         .should.eventually.have.length(66)
				         .notify(done);
			});
		});

	});

});