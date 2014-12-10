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
chai.use(require('chai-as-promised'));

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

describe('angular-karma-test-suite-extractor', function() {

  describe('angular.js', function() {

    describe('.fromFile("ngCookies/cookiesSpec.js")', function() {
      it('should extract 1 test suite', function(done) {
        var cwd = path.resolve(projectsDirectory, 'angular.js/b6f4d4b/test');

        extractor.fromFile('ngCookies/cookiesSpec.js', cwd)
                 .then(function (result) {
                   result.length.should.equal(1);
                   result[0].should.have.property('hash');
                   result[0].path.should.eql('ngCookies/cookiesSpec.js');
                   result[0].dependencies.should.eql(['ngCookies']);
                 })
                 .done(done);
      });
    });

    describe('.fromDirectory(["**/*Spec.js"], "test")', function() {
      it('should extract 93 test suites', function(done) {
        var cwd = path.resolve(projectsDirectory, 'angular.js/b6f4d4b/test');

        extractor.fromDirectory(['**/*Spec.js'], cwd)
                 .should.eventually.have.length(93)
                 .notify(done);
      });
    });

  });

  describe('ui-bootstrap.js', function() {

    describe('.fromFile("src/accordion/test/accordion.spec.js")', function() {
      it('should extract 1 test suite', function(done) {
        var cwd = path.resolve(projectsDirectory, 'ui-bootstrap/03b7c69');

        extractor.fromFile('src/accordion/test/accordion.spec.js', cwd)
                 .then(function (result) {
                   result.length.should.equal(1);
                   result[0].should.have.property('hash');
                   result[0].path.should.eql('src/accordion/test/accordion.spec.js');
                   result[0].dependencies.should.eql([
                     'ui.bootstrap.accordion',
                     'template/accordion/accordion.html',
                     'template/accordion/accordion-group.html'
                   ]);
                 })
                 .done(done);
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

});