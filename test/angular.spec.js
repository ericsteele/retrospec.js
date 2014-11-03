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

// Test input files
var files = {
	empty: {
		path: path.resolve(__dirname, 'input/empty.js')
	},
	multipleModules: {
		path: path.resolve(__dirname, 'input/angular/multiple-modules.js'),
		modules: [
			{ name: 'test1', dependencies: ['a', 'b', 'c'] },
			{ name: 'test2', dependencies: ['d', 'e', 'f'] },
			{ name: 'test3', dependencies: ['g', 'h', 'i'] }
		]
	},
	singleModule: {
		path: path.resolve(__dirname, 'input/angular/single-module.js'),
		modules: [
			{ name: 'test', dependencies: ['a', 'b', 'c'] }
		]
	}
};

// Module under test
var retrospec = require('../src/retrospec');

describe('retrospec [angular]', function() {
	
	describe('.findAngularModules(filePath)', function() {

		describe('empty.js', function() {
			it('should find 0 modules', function(done) {
				var promise = retrospec.findAngularModules(files.empty.path, 'utf-8');
				promise.should.eventually.have.length(0).notify(done);
			});
		});

		describe('single-module.js', function() {
			it('should find 1 module with 3 dependencies', function(done) {
				var promise = retrospec.findAngularModules(files.singleModule.path, 'utf-8');
				promise.should.eventually.eql(files.singleModule.modules).notify(done);
			});
		});

		describe('multiple-modules.js', function() {
			it('should find 3 modules, each with 3 dependencies', function(done) {
				var promise = retrospec.findAngularModules(files.multipleModules.path, 'utf-8');
				promise.should.eventually.eql(files.multipleModules.modules).notify(done);
			});
		});

	});

})