/*
 * jquery-mobile-test-suite-extractor.js
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
    AstHelper  = require('../misc/ast-helper'),   // abstract syntax tree (AST) helper methods
    TestSuite  = require('../models/test-suite'); // generic representation of a test suite

// retrospec's interface for pluggable extraction logic
var FileContentExtractor = require('./file-content-extractor.js');

// exports
module.exports = new FileContentExtractor('jquery-mobile-test-suite-extractor', extractTestSuites);

/**
 * Parses an HTML file's text and extracts test suite information from within. This extractor was created
 * specifically for the 'jQuery Mobile' project because of the non-standard way in which it loads
 * test dependencies. The test suite information is returned as an array of `TestSuite` objects.
 * 
 * @param {String} fileContents - the file's text content
 * @param {String} filePath     - relative path of the file
 * @param {String} cwd          - directory that `filePath` is relative to
 * 
 * @return {Array} An array of `TestSuite` objects.
 */
function extractTestSuites(fileContents, filePath, cwd) {
  var testSuites = [];

  if(fileContents.indexOf('qunit.js') !== -1) {
    if(fileContents.indexOf('$.testHelper.asyncLoad') !== -1) {
      var deps = getTestHelperDependencies(fileContents);
      if(deps.length > 0) {
        testSuites.push(new TestSuite(deps, filePath, fileContents));
      }
    }
  }

  return testSuites;
}

/**
 * Parses an HTML file's text and extracts test dependencies from
 * any '$.testHelper.asyncLoad([])' statements found within.
 * 
 * @param {String} fileContents - the file's text content
 * 
 * @return {Array} An array of test dependency names (i.e. strings).
 */
function getTestHelperDependencies(fileContents) {
  var dependencies   = [],
      testHelperStmt = getTestHelperStatement(fileContents),
      ast            = esprima.parse(testHelperStmt);

  estraverse.traverse(ast, {
    enter: function (node, parent) {
      if(isTestHelperAsyncLoad(node)) {
        var args = AstHelper.getCallExpressionArguments(node);
        args[0].forEach(function(deps) {
          dependencies = dependencies.concat(deps);
        });
      }
    }
  });

  return dependencies;
}

/**
 * Parses an HTML file's text and extracts the first 
 * '$.testHelper.asyncLoad([])' statement that is encountered.
 * 
 * @param {String} fileContents - the file's text content
 * 
 * @return {String} A '$.testHelper.asyncLoad([])' statement.
 */
function getTestHelperStatement(fileContents) {
  var iStart = fileContents.indexOf('$.testHelper.asyncLoad'),
      iEnd   = fileContents.indexOf('</script>', iStart);

  return fileContents.substring(iStart, iEnd);
}

/**
 * Checks if the specified JavaScript AST node represents a '$.testHelper.asyncLoad([])' call expression.
 * 
 * @param {Object} node - the JavaScript AST node to check 
 * 
 * @return {Boolean} True if the node represents an '$.testHelper.asyncLoad([])' call expression. False otherwise.
 */
function isTestHelperAsyncLoad(node) {
  return node && 
         node.callee && 
         node.callee.object && 
         node.callee.object.property && 
         node.callee.object.object && 
         node.callee.property && 
         node.arguments && 
         node.type                        === 'CallExpression' &&
         node.callee.type                 === 'MemberExpression' &&
         node.callee.object.object.name   === '$' &&
         node.callee.object.property.name === 'testHelper' &&
         node.callee.property.name        === 'asyncLoad' &&
         node.arguments.length            === 1 &&
         node.arguments[0].type           === 'ArrayExpression';
}