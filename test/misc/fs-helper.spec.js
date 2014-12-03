/*
 * fs-helper.spec.js
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

// Directory containing some real projects we can use for our tests
var projectsDirectory     = path.resolve(__dirname, '../input/projects'),
    jqueryMobileDirectory = path.resolve(projectsDirectory, 'jquery-mobile/js');

// Module under test
var fsHelper = require('../../src/misc/fs-helper');

describe('fsHelper', function() {

	describe('.locateFiles(["*.js"], "jquery-mobile/js")', function() {
		it('should locate 29 files', function(done) {
			fsHelper.locateFiles(['*.js'], jqueryMobileDirectory)
			        .should.eventually.have.length(29)
			        .notify(done);
		});
	});

	describe('.locateFiles(["**/*.js"], "jquery-mobile/js")', function() {
		it('should locate 72 files', function(done) {
			fsHelper.locateFiles(['**/*.js'], jqueryMobileDirectory)
			        .should.eventually.have.length(72)
			        .notify(done);
		});
	});

	describe('.locateFiles(["*.js", "**/*.js"], "jquery-mobile/js")', function() {
		it('should locate 72 files', function(done) {
			fsHelper.locateFiles(['*.js', '**/*.js'], jqueryMobileDirectory)
			        .should.eventually.have.length(72)
			        .notify(done);
		});
	});

});