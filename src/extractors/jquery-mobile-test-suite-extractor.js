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

// retrospec's interface for pluggable module extraction logic
var FileContentExtractor = require('../models/file-content-extractor.js');

// exports
module.exports = new FileContentExtractor('jquery-mobile-test-suite-extractor', extractTestSuites);

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

  if(fileContents.indexOf('qunit.js') !== -1) {
    if(fileContents.indexOf('$.testHelper.asyncLoad') !== -1) {
      var deps = getTestHelperDependencies(fileContents);
      if(deps.length > 0) {
        testSuites.push(new TestSuite(deps, filePath));
      }
    }
  }

  return testSuites;
}

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

function getTestHelperStatement(fileContents) {
  var iStart = fileContents.indexOf('$.testHelper.asyncLoad'),
      iEnd   = fileContents.indexOf('</script>', iStart);

  return fileContents.substring(iStart, iEnd);
}

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

/**
 */
function extractTestSuitesOld(fileContents, filePath, cwd) {
  // extract the content of comments that contain "retrospec.testSuite("
  var comments = getPossibleTestSuiteComments(fileContents);

  var testSuites = [];
  comments.forEach(function(comment) {
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
          testSuites.push(new TestSuite(args[0], filePath));
          // skip this node's children
          this.skip();
        }
      }
    });
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