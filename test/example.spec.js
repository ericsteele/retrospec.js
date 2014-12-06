'use strict';

// Load the Chai Assertion Library
var chai = require('chai');

// Grab Chai's assert, expect, and should interfaces
var assert = chai.assert,
    expect = chai.expect,
    should = chai.should(); // Note that should has to be executed

// Object under test
var example = {
  sayHello: function() {
    return 'Hello World!';
  }
};

describe('example', function() {

  describe('.sayHello()', function() {
    it('should work with assert', function() {
      assert.equal(example.sayHello(), 'Hello World!');
    });
    it('should work with expect', function() {
      expect(example.sayHello()).to.equal('Hello World!');
    });
    it('should work with should', function() {
      example.sayHello().should.equal('Hello World!');
    });
  });
  
});