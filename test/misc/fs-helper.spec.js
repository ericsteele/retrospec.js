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

// Module under test
var fsHelper = require('../../src/misc/fs-helper');

// Test project directory paths
var testInputDirPath    = process.cwd()    + '\\test\\input',
    jqueryMobileDirPath = testInputDirPath + '\\jquery-mobile\\js';

describe('fsHelper', function() {
  
  describe('.locateFiles(patterns, cwd)', function() {
  
    describe('/jquery-mobile/js', function() {

      describe('["*.js"]', function() {
        it('should locate 29 files', function(done) {
          var promise = fsHelper.locateFiles(['*.js'], jqueryMobileDirPath);
          promise.should.eventually.have.length(29).notify(done);
        });
      });
    
      describe('["**/*.js"]', function() {
        it('should locate 72 files', function(done) {
          var promise = fsHelper.locateFiles(['**/*.js'], jqueryMobileDirPath);
          promise.should.eventually.have.length(72).notify(done);
        });
      });
    
      describe('["*.js", "**/*.js"]', function() {
        it('should locate 72 files', function(done) {
          var promise = fsHelper.locateFiles(['*.js', '**/*.js'], jqueryMobileDirPath);
          promise.should.eventually.have.length(72).notify(done);
        });
      });
    
      describe('["**/*.js", "**/*.js"]', function() {
        it('should locate 72 files', function(done) {
          var promise = fsHelper.locateFiles(['*.js', '**/*.js'], jqueryMobileDirPath);
          promise.should.eventually.have.length(72).notify(done);
        });
      });

    });

  });

});