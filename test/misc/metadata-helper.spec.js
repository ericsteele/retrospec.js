/*
 * metadata-helper.spec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Peter Ingulli
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
    should = chai.should(); // Note: should has to be executed

// Load utilities for handling and transforming file paths
var path = require('path');
var FS = require('fs');

// Module under test
var metadataHelper = require('../../src/misc/metadata-helper');

describe('metadataHelper', function() {

	it('should create a folder and write a file', function() {
		var expected = "modules: {}, \ntestSuites: []";
		var modules = {};
		var testSuites = [];
		var outputDir = getOutputDir();

		metadataHelper.writeMetadata(modules, testSuites, outputDir);

		var filepath = path.resolve(outputDir, '.retrospec/retrospec');
		var str = FS.readFileSync(filepath, {'encoding': 'utf-8'});

		expect(str).to.equal(expected);
	});

	it('should read the metadata and produce a map of modules: and testSuites:', function() {
		var expected = {
			modules: {},
			testSuites: []
		};
	});

});

function getOutputDir() {
	var outputDir = path.resolve(__dirname, 'output');
	if (!FS.existsSync(outputDir)) {
		FS.mkdirSync(outputDir);
	}
	return outputDir;
}
