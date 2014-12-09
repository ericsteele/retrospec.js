/*
 * angular-karma-test-suite-extractor.spec.js
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
var projectsDirectory = path.resolve(__dirname, '../../input/projects/');

// Module under test
var extractor = require('../../../src/extractors/angular-karma-test-suite-extractor');

describe('angular.js', function() {

  describe('.fromFile("ngCookies/cookiesSpec.js")', function() {
    it('should extract 1 test suite', function(done) {
      var cwd = path.resolve(projectsDirectory, 'angular.js/b6f4d4b/test'),
        expected = [{ 
          path: 'ngCookies/cookiesSpec.js', 
          hash: '970eb05a85ffe26eb4bdb445ec715e3958a700b6',
          dependencies: ['ngCookies']
        }];

      extractor.fromFile('ngCookies/cookiesSpec.js', cwd)
               .should.eventually.eql(expected)
           .notify(done);
    });
  });

  describe('.fromDirectory(["**/*Spec.js"], "test")', function() {
    it('should extract 93 test suites', function(done) {
      var cwd = path.resolve(projectsDirectory, 'angular.js/b6f4d4b/test');

      var promise = extractor.fromDirectory(['**/*Spec.js'], cwd);
      promise.should.eventually.have.length(93)
               .notify(done);
    });
  });
});

describe('ui-bootstrap.js', function() {
  describe('.fromFile("src/accordion/test/accordion.spec.js")', function() {
    it('should extract 1 test suite', function(done) {
      var cwd = path.resolve(projectsDirectory, 'ui-bootstrap/03b7c69'),
        expected = [{ 
          path: 'src/accordion/test/accordion.spec.js', 
          hash: '58353fe79f609fe48e1aedf45dacc2f86f12ea2a',
          dependencies: [
            'ui.bootstrap.accordion',
            'template/accordion/accordion.html',
            'template/accordion/accordion-group.html'
          ]
        }];

      extractor.fromFile('src/accordion/test/accordion.spec.js', cwd)
               .should.eventually.eql(expected)
               .notify(done);
    });
  });

  describe('.fromDirectory(["**/*Spec.js"], "test")', function() {
    it('should extract 26 test suites', function(done) {
      var cwd = path.resolve(projectsDirectory, 'ui-bootstrap/03b7c69');

      var promise = extractor.fromDirectory(['src/*/test/*.spec.js'], cwd);
      promise.should.eventually.have.length(26)
             .notify(done);
    });
  });
});