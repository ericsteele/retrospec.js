/*
 * glob.spec.js
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

// Module under test
var retrospec = require('../src/retrospec');

// Test project directory paths
var testInputDirPath = process.cwd() + '\\test\\input',
    jqueryMobileDirPath = testInputDirPath + '\\jquery-mobile\\js';

describe('retrospec [glob]', function() {
	
	describe('.glob(pattern)', function() {
		it('should glob 5 files from the /test/input/requirejs directory', function(done) {
			var promise = retrospec.glob("test/input/requirejs/*.js", 'utf-8');
			promise.should.eventually.have.length(4).notify(done);
		});
	});
  
  describe('.locateFiles(patterns, cwd)', function() {
  
    describe('patterns = ["*.js"])', function() {
      it('should locate 29 files in the "/jquery-mobile/js" directory', function(done) {
        var promise = retrospec.locateFiles(['*.js'], jqueryMobileDirPath);
        promise.should.eventually.have.length(29).notify(done);
      });
    });
  
    describe('patterns = ["**/*.js"])', function() {
      it('should locate 72 files in the "/jquery-mobile/js" directory', function(done) {
        var promise = retrospec.locateFiles(['**/*.js'], jqueryMobileDirPath);
        promise.should.eventually.have.length(72).notify(done);
      });
    });
  
    describe('patterns = ["*.js", "**/*.js"])', function() {
      it('should locate 72 files in the "/jquery-mobile/js" directory', function(done) {
        var promise = retrospec.locateFiles(['*.js', '**/*.js'], jqueryMobileDirPath);
        promise.should.eventually.have.length(72).notify(done);
      });
    });
  
    describe('patterns = ["**/*.js", "**/*.js"])', function() {
      it('should locate 72 files in the "/jquery-mobile/js" directory', function(done) {
        var promise = retrospec.locateFiles(['*.js', '**/*.js'], jqueryMobileDirPath);
        promise.should.eventually.have.length(72).notify(done);
      });
    });

  });

});