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
var projectsDirectory = path.resolve(__dirname, '../../input/projects');

// Module under test
var extractor = require('../../../src/extractors/jquery-mobile-test-suite-extractor');

describe('jquery-mobile-test-suite-extractor.js', function() {

  describe('.fromFile("unit/button-markup/index.html")', function() {
    it('should extract 1 test suite', function(done) {
      var cwd      = path.resolve(projectsDirectory, 'jquery-mobile/rev-1.4.5-2ef45a1/tests'),
          expected = [{ 
            path: 'unit/button-markup/index.html',
            hash: 'cb640b6466ec3f56e7f21b9c2e8476844e819c75', 
            dependencies: [ 
              'widgets/page', 'buttonMarkup', 'widgets/controlgroup', 
              'widgets/toolbar', 'widgets/fixedToolbar', 'widgets/forms/button',
              'init', 'buttonMarkup_core.js' 
            ]
          }];

      extractor.fromFile('unit/button-markup/index.html', cwd)
               .should.eventually.eql(expected)
               .notify(done);
    });
  });

  describe('.fromDirectory(["**/*.html"], "jquery-mobile/tests")', function() {

    it('should extract 84 test suites', function(done) {
      var cwd = path.resolve(projectsDirectory, 'jquery-mobile/rev-1.4.5-2ef45a1/tests');

      extractor.fromDirectory(['**/*.html'], cwd)
               .should.eventually.have.length(84)
               .notify(done);
    });

  });

  describe('.fromDirectory(["**/*.html"], "jquery-mobile/rev-1.3.1-74b4bec/tests")', function() {

    it('should extract 38 test suites', function(done) {
      var cwd = path.resolve(projectsDirectory, 'jquery-mobile/rev-1.3.1-74b4bec/tests');

      extractor.fromDirectory(['**/*.html'], cwd)
               .should.eventually.have.length(38)
               .notify(done);
    });

  });

});