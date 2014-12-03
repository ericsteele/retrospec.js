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
var retrospec = require('../src/retrospec');

var expected = [
	{ name: 'ngAria', dependencies: [ 'ng' ] },
	{ name: 'ngCookies', dependencies: [ 'ng' ] },
	{ name: 'ngLocale', dependencies: [] },
	{ name: 'ngAnimate', dependencies: [ 'ng' ] },
	{ name: 'ngMessages', dependencies: [] },
	{ name: 'ngResource', dependencies: [ 'ng' ] },
	{ name: 'ngAnimateMock', dependencies: [ 'ng' ] },
	{ name: 'ngMock', dependencies: [ 'ng' ] },
	{ name: 'ngMockE2E', dependencies: [ 'ng' ] },
	{ name: 'ngRoute', dependencies: [ 'ng' ] },
	{ name: 'ngSanitize', dependencies: [] },
	{ name: 'ngTouch', dependencies: [] }
];

/*****************************************************/
/* To successfully run this test, you must checkout  */
/* angular.js into the directory:                    */
/*   retrospec.js/x/                                 */
/*****************************************************/
describe('angular.js', function() {
	// TODO: If this fails, it will just hang until timeout.  Not sure how to fix.
	xit('should find 20 modules', function(done) {
		var p = path.resolve(__dirname, '../x/src/');
		var promise = retrospec.findAngularModulesInDir(p, 'utf-8', null, '/*/*.js');
		promise.then(function(d) {
			expect(d.length).to.equal(expected.length);
			for (var i = 0; i < expected.length; i++) {
				expect(d).to.include(expected[i]);
			}
			done();
			console.log(d);
		}, function(err) {
			console.log(err);
		});

		//promise.should.eventually.have.length(20).notify(done);
	});
});