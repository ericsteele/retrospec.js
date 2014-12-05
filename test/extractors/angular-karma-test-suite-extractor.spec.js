/*
 * jquery-mobile-test-suite-extractor.spec.js
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

// Directory containing some real projects we can use for our tests
var projectDirectory = path.resolve(__dirname, '../../x');

// Module under test
var extractor = require('../../src/extractors/angular-karma-test-suite-extractor');

describe('angular-karma-test-suite-extractor.js', function() {

	describe('.fromFile("ngCookies/cookiesSpec.js")', function() {
		it('should extract 1 test suite', function(done) {
			var cwd = path.resolve(projectDirectory, 'test'),
				expected = [{ 
					path: 'ngCookies/cookiesSpec.js', 
					dependencies: [ 
						'ngCookies' 
					]
				}];

			extractor.fromFile('ngCookies/cookiesSpec.js', cwd)
			         .should.eventually.eql(expected)
					 .notify(done);
		});
	});

	describe('.fromDirectory(["**/*Spec.js"], "test")', function() {
		it('should extract 25 test suites', function(done) {
			var cwd = path.resolve(projectDirectory, 'test');

			var promise = extractor.fromDirectory(['**/*Spec.js'], cwd);
			promise.then(function(d) {
				console.log(d);
			})

			promise.should.eventually.have.length(25)
               .notify(done);
		});

	});
});