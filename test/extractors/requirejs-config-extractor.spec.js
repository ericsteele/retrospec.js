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
var configFilePath = path.resolve(__dirname, '../input/requirejs/requirejs-config.js');

// Module under test
var extractor = require('../../src/extractors/requirejs-config-extractor');

describe('requirejs-config-extractor', function() {
	
	describe('.fromFile(filePath, encoding)', function() {

		it('should find 1 require.config() call in input/requirejs/requirejs-config.js', function(done) {
			var promise = extractor.fromFile(configFilePath, 'utf-8');
			promise.should.eventually.be.an('object').notify(done);
		});

	});

});