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
chai.use(require('chai-as-promised'));

// Grab Chai's assert, expect, and should interfaces
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should(); // Note: should has to be executed

// Load utilities for handling and transforming file paths
var path = require('path');

// Directory containing some real projects we can use for our tests
var projectsDirectory     = path.resolve(__dirname, '../../input/projects'),
    jqueryMobileDirectory = path.resolve(projectsDirectory, 'jquery-mobile/rev-1.4.5-2ef45a1/js');

// Module under test
var fsHelper = require('../../../src/helper/fs-helper');

describe('fsHelper', function() {

	describe('.locateFiles(["*.js"], "jquery-mobile/rev-1.4.5-2ef45a1/js")', function() {
		it('should locate 24 files', function(done) {
			fsHelper.locateFiles(['*.js'], jqueryMobileDirectory)
			        .should.eventually.have.length(24)
			        .notify(done);
		});
	});

	describe('.locateFiles(["**/*.js"], "jquery-mobile/rev-1.4.5-2ef45a1/js")', function() {
		it('should locate 86 files', function(done) {
			fsHelper.locateFiles(['**/*.js'], jqueryMobileDirectory)
			        .should.eventually.have.length(86)
			        .notify(done);
		});
	});

	describe('.locateFiles(["*.js", "**/*.js"], "jquery-mobile/rev-1.4.5-2ef45a1/js")', function() {
		it('should locate 86 files', function(done) {
			fsHelper.locateFiles(['*.js', '**/*.js'], jqueryMobileDirectory)
			        .should.eventually.have.length(86)
			        .notify(done);
		});
	});

});