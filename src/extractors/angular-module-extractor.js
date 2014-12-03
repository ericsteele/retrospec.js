/*
 * angular-module-extractor.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var Q           = require('q'),                     // `kriskowal/q` promises
    esprima     = require('esprima'),               // parses JS and produces an Abstract Syntax Tree (AST)
    estraverse  = require('estraverse'),            // simple interface for traversing the AST 
    AstHelper   = require('../misc/ast-helper'),    // abstract syntax tree (AST) helper methods
    CodeModule  = require('../models/code-module'); // loader-agnostic representation of a "module" of code

// retrospec's interface for pluggable module extraction logic
var CodeModuleExtractor = require('../models/code-module-extractor.js');

// export an AngularJS implementation
module.exports = new CodeModuleExtractor(['AngularJS'], extractModulesFromText);

/**
 * Parses a JavaScript file's text and extracts AngularJS module definitions of 
 * the form 'angular.module("",[])'. The names and dependencies of all AngularJS 
 * modules found within are returned as an array of `CodeModule` objects.
 * 
 * @param {String} filePath     - relative path of the JavaScript file
 * @param {String} fileContents - the JavaScript text
 * 
 * @return {Array} An array of `CodeModule` objects.
 */
function extractModulesFromText(filePath, fileContents) {

	// get the JavaScript's Abstact Syntax Tree (AST)
	var ast = esprima.parse(fileContents);

	// traverse the AST and extract module data
	var modules = [];
	estraverse.traverse(ast, {
		enter: function (node, parent) {
      // if this node is a module
			if(isAngularModuleDefinition(node)) {
				// extract module data
				var args = AstHelper.getCallExpressionArguments(node);
        // create a new code module
				modules.push(new CodeModule(args[0], args[1], filePath));
				// skip this node's children
				this.skip();
			}
		}
	});

	// check for duplicate module definitions
	if(hasDuplicateCodeModules(modules)) {
		throw new Error('[error] encountered duplicate AngularJS module definitions: ' + filePath);
	}

	// remove duplicate module definitions
	return modules;
}

/**
 * Checks if an array of `CodeModule` objects contains multiple AngularJS modules with the same name.
 * 
 * @param {Array} modules - an array of `CodeModule` objects
 * 
 * @return {Boolean} True if the array contains any `CodeModule` with the same name. False otherwise.
 */
function hasDuplicateCodeModules(modules) {
  for(var i = 0, iEnd = modules.length; i < iEnd; i++) {
    for(var j = i + 1; j < iEnd; j++) {
      if(modules[i].name === modules[j].name) {
      	return true;
      }
    }
  }
	return false;
}

/**
 * Checks if the specified JavaScript AST node represents an 'angular.module("",[])' call expression.
 * 
 * @param {Object} node - the JavaScript AST node to check 
 * 
 * @return {Boolean} True if the node represents an 'angular.module("",[])' call expression. False otherwise.
 */
function isAngularModuleDefinition(node) {
	return node && node.callee  && node.callee.object && node.callee.property && node.arguments && node.arguments.length >= 2 &&
	       node.type                      === 'CallExpression' &&
	       node.callee.type               === 'MemberExpression' &&
	       node.callee.object.name        === 'angular' &&
	       node.callee.property.name      === 'module' &&
	       typeof node.arguments[0].value === 'string' &&
	       node.arguments[1].type         === 'ArrayExpression';
}