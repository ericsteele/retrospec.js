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
// Load utilities for handling and transforming file paths
var path = require('path');

// Extend Chai with assertions about promises
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

// Grab Chai's assert, expect, and should interfaces
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should(); // Note that should has to be executed

// Load utilities for handling and transforming file paths
var path = require('path');

// Module under test
var retrospec = require('../src/retrospec');

var expected = [
	{ name: 'ui.bootstrap.accordion', dependencies: [ 'ui.bootstrap.collapse' ] },
	{ name: 'ui.bootstrap.alert', dependencies: [] },
	{ name: 'ui.bootstrap.buttons', dependencies: [] },
	{ name: 'ui.bootstrap.carousel', dependencies: [ 'ui.bootstrap.transition' ] },
	{ name: 'ui.bootstrap.bindHtml', dependencies: [] },
	{ name: 'ui.bootstrap.collapse', dependencies: [ 'ui.bootstrap.transition' ] },
	{ name: 'ui.bootstrap.dateparser', dependencies: [] },
	{ name: 'ui.bootstrap.datepicker', dependencies: [ 'ui.bootstrap.dateparser', 'ui.bootstrap.position' ] },
	{ name: 'ui.bootstrap.dropdown', dependencies: [] },
	{ name: 'ui.bootstrap.modal', dependencies: [ 'ui.bootstrap.transition' ] },
	{ name: 'ui.bootstrap.pagination', dependencies: [] },
	{ name: 'ui.bootstrap.position', dependencies: [] },
	{ name: 'ui.bootstrap.popover', dependencies: [ 'ui.bootstrap.tooltip' ] },
	{ name: 'ui.bootstrap.progressbar', dependencies: [] },
	{ name: 'ui.bootstrap.rating', dependencies: [] },
	{ name: 'ui.bootstrap.tabs', dependencies: [] },
	{ name: 'ui.bootstrap.timepicker', dependencies: [] },
	{ name: 'ui.bootstrap.transition', dependencies: [] },
	{ name: 'ui.bootstrap.tooltip', dependencies: [ 'ui.bootstrap.position', 'ui.bootstrap.bindHtml' ] },
	{ name: 'ui.bootstrap.typeahead', dependencies: [ 'ui.bootstrap.position', 'ui.bootstrap.bindHtml' ] }
]

describe('ui-bootstrap', function() {
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
		}, function(err) {
			console.log(err);
		});

		//promise.should.eventually.have.length(20).notify(done);
	});
})