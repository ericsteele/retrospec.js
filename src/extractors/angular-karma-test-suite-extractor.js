/*
 * angular-karma-test-suite-extractor.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var esprima    = require('esprima'),              // parses JS and produces an Abstract Syntax Tree (AST)
    estraverse = require('estraverse'),           // simple interface for traversing the AST 
    AstHelper  = require('../helper/ast-helper'), // abstract syntax tree (AST) helper methods
    TestSuite  = require('../models/test-suite'); // generic representation of a test suite

// retrospec's interface for pluggable extraction logic
var FileContentExtractor = require('./file-content-extractor.js');

// exports
module.exports = new FileContentExtractor('angular-karma-test-suite-extractor', extractTestSuites);

/**
 * Parses a JavaScript file's text and extracts [TODO]. The test suite information is returned as an array
 * of `TestSuite` objects.
 * 
 * @param {String} fileContents - the file's text content
 * @param {String} filePath     - relative path of the file
 * @param {String} cwd          - directory that `filePath` is relative to
 * 
 * @return {Array} An array of `TestSuite` objects.
 */
function extractTestSuites(fileContents, filePath, cwd) {
  var testSuites = [];

  var deps = getTestHelperDependencies(fileContents);
  //if(deps.length > 0) {
    testSuites.push(new TestSuite(deps, filePath, fileContents));
  //}

  return testSuites;
}

/**
 * Parses a JavaScript file containing Jasmine test suites and extracts test dependencies.
 * 
 * @param {String} fileContents - the file's text content
 * 
 * @return {Array} An array of test dependency names (i.e. strings).
 */
function getTestHelperDependencies(fileContents) {
  var dependencies   = [],
      ast            = esprima.parse(fileContents);

  estraverse.traverse(ast, {
    enter: function (node, parent) {
      if(isKarmaModuleStatement(node)) {
        var dep = AstHelper.getCallExpressionArguments(node)[0];
        if (dependencies.indexOf(dep) == -1)
          dependencies.push(dep);
      }
    }
  });

  return dependencies;
}

/**
 * Checks if the specified JavaScript AST node represents a 'module("")' call expression.
 * 
 * @param {Object} node - the JavaScript AST node to check 
 * 
 * @return {Boolean} True if the node represents an 'module("")' call expression. False otherwise.
 */
function isKarmaModuleStatement(node) {
  return node && 
         node.callee && 
         node.callee.type && 
         node.callee.name &&  
         node.arguments && 
         node.arguments.length > 0 &&
         node.type === 'CallExpression' &&
         node.callee.type === 'Identifier' &&
         node.callee.name === 'module' &&
         node.arguments[0].type &&
         node.arguments[0].value &&
         node.arguments[0].type === 'Literal';
}
