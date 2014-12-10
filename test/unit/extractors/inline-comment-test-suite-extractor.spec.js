/*
 * inline-comment-test-suite-extractor.spec.js
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

// Directory containing code snippets used in our tests
var codeSnippetDirectory = path.resolve(__dirname, '../../input/code-snippets');

// Module under test
var extractor = require('../../../src/extractors/inline-comment-test-suite-extractor');

describe('inline-comment-test-suite-extractor.js', function() {

  describe('.fromFile("empty.js")', function() {
    it('should extract 0 test suites', function(done) {
      extractor.fromFile('empty.js', codeSnippetDirectory)
               .should.eventually.have.length(0)
               .notify(done);
    });
  });

  describe('.fromFile("test-suite-comments.js")', function() {
    it('should extract 6 test suites', function(done) {
      var expected = [
        { dependencies: [ 'a', 'b' ], path: 'misc/test-suite-comments.js' },
        { dependencies: [ 'c', 'd' ], path: 'misc/test-suite-comments.js' },
        { dependencies: [ 'e', 'f' ], path: 'misc/test-suite-comments.js' },
        { dependencies: [ 'g', 'h' ], path: 'misc/test-suite-comments.js' },
        { dependencies: [ 'i', 'j' ], path: 'misc/test-suite-comments.js' },
        { dependencies: [ 'k', 'l' ], path: 'misc/test-suite-comments.js' } 
      ];

      extractor.fromFile('misc/test-suite-comments.js', codeSnippetDirectory)
               .then(function (result) {
                 result.length.should.equal(6);
                 result.forEach(function(item, index) {
                   item.should.have.property('hash');
                   item.path.should.eql(expected[index].path);
                   item.dependencies.should.eql(expected[index].dependencies);
                 });
               })
               .done(done);
    });
  });

});