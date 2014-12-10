/*
 * requirejs-config-extractor.spec.js
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
var extractor = require('../../../src/extractors/requirejs-config-extractor');

describe('requirejs-config-extractor.js', function() {
  
  describe('.fromFile("requirejs-config.js")', function() {

    it('should extract 1 config object', function(done) {
      extractor.fromFile('requirejs/requirejs-config.js', codeSnippetDirectory)
               .then(function (result) {
                 result.should.have.property('range');
                 result.config.should.eql({ paths: { a: './a', b: './b', c: './c' } });
                 result.path.should.eql('requirejs/requirejs-config.js');
               })
               .done(done);
    });

  });

});