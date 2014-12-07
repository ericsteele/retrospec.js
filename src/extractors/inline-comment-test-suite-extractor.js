/*
 * inline-comment-test-suite-extractor.js
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
module.exports = new FileContentExtractor('inline-comment-test-suite-extractor', extractTestSuites);

/**
 * Parses a JavaScript file's text and extracts special inline comments that provide information 
 * about the test suites defined in the file. The test suite information is returned as an array
 * of `TestSuite` objects. Both single and multi-line comments may be used. 
 * 
 * A test suite is defined like so:
 *
 *  // retrospec.testSuite(['a','b'])
 *
 * Where each string in the provided array is the name of a source code module that is validated
 * by the test suite. These names must match the names used by the client's chosen module loader.
 *
 * Multiple test suite definitions can appear in the same comment if they're separated by a semicolon:
 *
 *  // retrospec.testSuite(['a','b']); retrospec.testSuite(['c','d'])
 *
 * Basically, these comments must contain valid JavaScript text in order to be valid.
 * 
 * @param {String} fileContents - the file's text content
 * @param {String} filePath     - relative path of the file
 * @param {String} cwd          - directory that `filePath` is relative to
 * 
 * @return {Array} An array of `TestSuite` objects.
 */
function extractTestSuites(fileContents, filePath, cwd) {
  // extract the content of comments that contain "retrospec.testSuite("
  var comments = getPossibleTestSuiteComments(fileContents);

  var testSuites = [];
  comments.forEach(function(comment) {
    try{ 
      // get the comment's Abstact Syntax Tree (AST)
      var ast = esprima.parse(comment);
      // traverse the AST and extract comment data
      estraverse.traverse(ast, {
        enter: function (node, parent) {
          // if this node is a module
          if(isTestSuiteDefinition(node)) {
            // extract module data
            var args = AstHelper.getCallExpressionArguments(node);
            // create a new code module
            testSuites.push(new TestSuite(args[0], filePath, fileContents));
            // skip this node's children
            this.skip();
          }
        }
      });
    }
    catch(error) {
      console.log('[warn] malformed test suite defintion found in ' + filePath);
    }
  });

  return testSuites;
}

/**
 * Parses a JavaScript file's contents and extracts the contents of any comments that contain "retrospec.testSuite(".
 * 
 * @param {String} fileContents - the file's text content
 * 
 * @return {Array} An array of comment strings which may contain valid 'retrospec.testSuite([])' call expressions.
 */
function getPossibleTestSuiteComments(fileContents) {
  var comments = [];

  // get the JavaScript's Abstact Syntax Tree (AST) with comments
  var ast = esprima.parse(fileContents, { comment: true });

  // extract comments that contain "retrospec.testSuite("
  if(ast.comments && ast.comments.length > 0) {
    ast.comments.forEach(function(comment) {
      if(comment.value.indexOf('retrospec.testSuite(') !== -1) {
        comments.push(comment.value);
      }
    });
  }

  return comments;
}

/**
 * Checks if the specified JavaScript AST node represents an 'retrospec.testSuite([])' call expression.
 * 
 * @param {Object} node - the JavaScript AST node to check 
 * 
 * @return {Boolean} True if the node represents an 'retrospec.testSuite([])' call expression. False otherwise.
 */
function isTestSuiteDefinition(node) {
  return node && node.callee  && node.callee.object && node.callee.property && node.arguments && node.arguments.length === 1 &&
         node.type                      === 'CallExpression' &&
         node.callee.type               === 'MemberExpression' &&
         node.callee.object.name        === 'retrospec' &&
         node.callee.property.name      === 'testSuite' &&
         node.arguments[0].type         === 'ArrayExpression';
}