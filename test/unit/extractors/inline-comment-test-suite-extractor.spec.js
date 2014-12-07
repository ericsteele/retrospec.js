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
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

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
        { dependencies: [ 'a', 'b' ], path: 'misc/test-suite-comments.js', hash: '4dfac0dc7b7d5438fa938abb3513ea9bd7699110' },
        { dependencies: [ 'c', 'd' ], path: 'misc/test-suite-comments.js', hash: '4dfac0dc7b7d5438fa938abb3513ea9bd7699110' },
        { dependencies: [ 'e', 'f' ], path: 'misc/test-suite-comments.js', hash: '4dfac0dc7b7d5438fa938abb3513ea9bd7699110' },
        { dependencies: [ 'g', 'h' ], path: 'misc/test-suite-comments.js', hash: '4dfac0dc7b7d5438fa938abb3513ea9bd7699110' },
        { dependencies: [ 'i', 'j' ], path: 'misc/test-suite-comments.js', hash: '4dfac0dc7b7d5438fa938abb3513ea9bd7699110' },
        { dependencies: [ 'k', 'l' ], path: 'misc/test-suite-comments.js', hash: '4dfac0dc7b7d5438fa938abb3513ea9bd7699110' } 
      ];

      extractor.fromFile('misc/test-suite-comments.js', codeSnippetDirectory)
               .should.eventually.eql(expected)
               .notify(done);
    });
  });

});