/*
 * metadata.spec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Peter Ingulli
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
    should = chai.should(); // Note: should has to be executed

// Load utilities for handling and transforming file paths
var path = require('path'),
    FS   = require('fs');

// Module under test
var metadata = require('../../../src/helper/metadata');

// Output directory (for temporary test output)
var outputDirectoryPath = path.resolve(__dirname, 'output');

// Mocks
var project = {
  modules: {
    a: { name: 'a', dependencies: ['b'], path: 'src/a.js'},
    b: { name: 'b', dependencies: ['c'], path: 'src/b.js'},
    c: { name: 'c', dependencies: [   ], path: 'src/c.js'}
  },
  testSuites: {
    test1: { dependencies: ['a','b'], path: 'tests/test1.js'},
    test2: { dependencies: ['b','c'], path: 'tests/test2.js'},
    test3: { dependencies: ['a'],     path: 'tests/test3.js'}
  }
};

describe('metadata', function() {

  // Make sure the output directory exists before running tests
  before(function() {
    if (!FS.existsSync(outputDirectoryPath)) {
      FS.mkdirSync(outputDirectoryPath);
    }
  });

  it('should be able to write metadata to a file and read it back', function(done) {
    metadata.store(project, outputDirectoryPath)
            .then(readMetadata)
            .should.eventually.eql(project)
            .notify(done);

    function readMetadata() {
      return metadata.read(outputDirectoryPath);
    }
  });

});
