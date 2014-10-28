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

// Test input files
var files = {
	empty: {
		path: path.resolve(__dirname, 'input/empty.js'),
		deps: [],
		cjsDeps: []
	},
	nestedDefines: {
		path: path.resolve(__dirname, 'input/requirejs/nested-defines.js'),
		deps: ['a','b','c','d','e','f','g','h','i'],
		cjsDeps: ['x','y','z']
	},
	multipleDefines: {
		path: path.resolve(__dirname, 'input/requirejs/multiple-defines.js'),
		deps: ['a','b','c','d','e','f','g','h','i'],
		cjsDeps: ['x','y','z']
	},
	singleDefine: {
		path: path.resolve(__dirname, 'input/requirejs/single-define.js'),
		deps: ['a','b','c'],
		cjsDeps: ['x']
	},
	requirejsConfig: {
		path: path.resolve(__dirname, 'input/requirejs/requirejs-config.js')
	}
};

// Module under test
var retrospec = require('../src/retrospec');

describe('retrospec [requirejs]', function() {
 
	describe('.parseJS', function() {
		it('should be a function', function() {
			retrospec.parseJS.should.be.a('function');
		})
		it('should return a promise', function() {
			var promise = retrospec.parseJS(files.singleDefine.path, 'utf-8');
			promise.then.should.be.a('function');
		})
	})
	
	describe('.parseJS(filePath, encoding)', function() {
		it('should parse empty.js', function(done) {
			var promise = retrospec.parseJS(files.empty.path, 'utf-8');
			promise.should.eventually.be.fulfilled.notify(done);
		})
		it('should parse single-define.js', function(done) {
			var promise = retrospec.parseJS(files.singleDefine.path, 'utf-8');
			promise.should.eventually.be.fulfilled.notify(done);
		})
		it('should parse multiple-defines.js', function(done) {
			var promise = retrospec.parseJS(files.multipleDefines.path, 'utf-8');
			promise.should.eventually.be.fulfilled.notify(done);
		})
		it('should parse nested-defines.js', function(done) {
			var promise = retrospec.parseJS(files.nestedDefines.path, 'utf-8');
			promise.should.eventually.be.fulfilled.notify(done);
		})
	})
	
	describe('.findDependencies(filePath, encoding)', function() {
		it('should find 0 deps in empty.js', function(done) {
			var promise = retrospec.findDependencies(files.empty.path, 'utf-8');
			promise.should.eventually.eql(files.empty.deps).notify(done);
		})
		it('should find 3 deps in single-define.js', function(done) {
			var promise = retrospec.findDependencies(files.singleDefine.path, 'utf-8');
			promise.should.eventually.eql(files.singleDefine.deps).notify(done);
		})
		it('should find 9 deps in multiple-defines.js', function(done) {
			var promise = retrospec.findDependencies(files.multipleDefines.path, 'utf-8');
			promise.should.eventually.eql(files.multipleDefines.deps).notify(done);
		})
		it('should find 9 deps in nested-defines.js', function(done) {
			var promise = retrospec.findDependencies(files.nestedDefines.path, 'utf-8');
			promise.should.eventually.eql(files.nestedDefines.deps).notify(done);
		})
	})
	
	describe('.findCjsDependencies(filePath, encoding)', function() {
		it('should find 0 Cjs deps in empty.js', function(done) {
			var promise = retrospec.findCjsDependencies(files.empty.path, 'utf-8');
			promise.should.eventually.eql(files.empty.cjsDeps).notify(done);
		})
		it('should find 1 Cjs dep in single-define.js', function(done) {
			var promise = retrospec.findCjsDependencies(files.singleDefine.path, 'utf-8');
			promise.should.eventually.eql(files.singleDefine.cjsDeps).notify(done);
		})
		it('should find 3 Cjs deps in multiple-defines.js', function(done) {
			var promise = retrospec.findCjsDependencies(files.multipleDefines.path, 'utf-8');
			promise.should.eventually.eql(files.multipleDefines.cjsDeps).notify(done);
		})
		it('should find 3 Cjs deps in nested-defines.js', function(done) {
			var promise = retrospec.findCjsDependencies(files.nestedDefines.path, 'utf-8');
			promise.should.eventually.eql(files.nestedDefines.cjsDeps).notify(done);
		})
	})
	
	describe('.findConfig(filePath, encoding)', function() {
		it('should find 1 require.config() call in requirejs-config.js', function(done) {
			var promise = retrospec.findConfig(files.requirejsConfig.path, 'utf-8');
			promise.should.eventually.be.an('object').notify(done);
		})
	})

})