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
    should = chai.should(); // Note: should has to be executed

// Load utilities for handling and transforming file paths
var path = require('path');

// Module under test
//var retrospec = require('../src/retrospec');
var extractor = require('../src/extractors/angular-module-extractor');

/*****************************************************/
/* To successfully run this test, you must checkout  */
/* angular.js into the directory:                    */
/*   retrospec.js/x/                                 */
/*****************************************************/
describe('angular.js', function() {
	it('should find 12 modules', function(done) {
		var p = path.resolve(__dirname, '../x/src/');
		extractor.fromDirectory(['*/*.js'], p)
		         .should.eventually.have.length(754)
		         .notify(done);
	});
});
