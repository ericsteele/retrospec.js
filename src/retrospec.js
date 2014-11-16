/*
 * retrospec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var esprima = require('esprima'),          // js parser
    FS = require('fs'),                    // file system
    parse = require('../lib/r.js/parse'),  // r.js parse lib
    Q = require('q'),                      // promises
    glob = require('glob'),                // file globbing
    path = require('path'),                // handling file paths
    estraverse = require('estraverse');    // ast traversal

// add Q promise support to FS.readile
var readFile = Q.nfbind(FS.readFile);

// module to be exported
var retrospec = module.exports = {};

/**
 * Parses the specified JavaSript file and produces an Abstract Syntax Tree (AST).
 *
 * @param {String} filePath - absolute path of the JavaSript file
 * @param {String} encoding - the file encoding (e.g. "utf-8")
 * @param {Function} callback - optional callback to invoke  
 *
 * @returns {Object} A promise to produce an Abstract Syntax Tree (AST).
 */
retrospec.parseJS = function(filePath, encoding, callback) {
	var deferred = Q.defer();
	
	readFile(filePath, encoding).then(
		function success(text) {
			var ast = esprima.parse(text);
			deferred.resolve(ast);
		},
		function failure(error) {
			deferred.reject(error);
		});

	deferred.promise.nodeify(callback);
	return deferred.promise;
};

/**
 * Finds all dependencies specified in dependency arrays and inside simplified commonjs wrappers.
 *
 * @param {String} filePath - absolute path of the JavaSript file
 * @param {String} encoding - the file encoding (e.g. "utf-8")
 * @param {Function} callback - optional callback to invoke  
 *
 * @returns {Object} A promise to produce an array of dependency strings.
 */
retrospec.findDependencies = function(filePath, encoding, callback) {
	var deferred = Q.defer();

	readFile(filePath, encoding).then(
		function success(text) {
			var deps = parse.findDependencies('', text);
			deferred.resolve(deps);
		},
		function failure(error) {
			deferred.reject(error);
		});

	deferred.promise.nodeify(callback);
	return deferred.promise;
};

/**
 * Finds only CJS dependencies, ones that are the form: require('stringLiteral')
 *
 * @param {String} filePath - absolute path of the JavaSript file
 * @param {String} encoding - the file encoding (e.g. "utf-8")
 * @param {Function} callback - optional callback to invoke  
 *
 * @returns {Promise} A promise to produce an array of dependency strings.
 */
retrospec.findCjsDependencies = function(filePath, encoding, callback) {
	var deferred = Q.defer();

	readFile(filePath, encoding).then(
		function success(text) {
			var deps = parse.findCjsDependencies('', text);
			deferred.resolve(deps);
		},
		function failure(error) {
			deferred.reject(error);
		});

	deferred.promise.nodeify(callback);
	return deferred.promise;
};

/**
 * Finds any config that is passed to requirejs. That includes calls to:
 *   1. require.config()
 *   2. requirejs.config()
 *   3. require({}, ...)
 *   4. requirejs({}, ...)
 *
 * @param {String} filePath - absolute path of the JavaSript file
 * @param {String} encoding - the file encoding (e.g. "utf-8")
 * @param {Function} callback - optional callback to invoke  
 *
 * @returns {Promise} A promise to produce a RequireJS config details {Object} with the following properties:
 * - config: {Object} the config object found. Can be undefined if no config found.
 * - range: {Array} the start index and end index in the contents where
 *                  the config was found. Can be undefined if no config found.
 *                  Can throw an error if the config in the file cannot be 
 *                  evaluated ina build context to valid JavaScript.
 */
retrospec.findConfig = function(filePath, encoding, callback) {
	var deferred = Q.defer();

	readFile(filePath, encoding).then(
		function success(text) {
			var config = parse.findConfig(text);
			deferred.resolve(config);
		},
		function failure(error) {
			deferred.reject(error);
		});

	deferred.promise.nodeify(callback);
	return deferred.promise;
};

/**
 * Match files using the patterns the shell uses, like stars and stuff.
 *
 * @param {String} pattern
 * @param {Object} options
 * @param {Function} callback
 *
 * @returns {Promise} A promise to produce an array of matched files.
 */
retrospec.glob = function(pattern, options, callback) {
	var deferred = Q.defer();

	glob(pattern, options, function (error, files) {
		if(error) deferred.reject(error);
		deferred.resolve(files);
	});

	deferred.promise.nodeify(callback);
	return deferred.promise;
};

/**
 * Finds 'angular.module("",[])' statements in the specified file,
 *
 * @param {String} filePath - absolute path of the JavaSript file
 * @param {String} encoding - the file encoding (e.g. "utf-8")
 * @param {Function} callback - optional callback to invoke  
 *
 * @returns {Promise} A promise to produce an array of matched modules.
 */
retrospec.findAngularModules = function(filePath, encoding, callback) {
	var deferred = Q.defer(), modules = [];

	readFile(filePath, encoding).then(
		function success(text) {
			var ast = esprima.parse(text);

			estraverse.traverse(ast, {
				enter: function (node, parent) {
					if(isAngularModuleExpression(node)) {
						modules.push(new AngularModule(node.arguments));
					}
				}
			});
			deferred.resolve(modules);
		},
		function failure(error) {
			deferred.reject(error);
		});

	deferred.promise.nodeify(callback);
	return deferred.promise;
};

/**
 * finds all angular modules below a directory
 *
 * @param {String} filePath - absolute path of the JavaSript file
 * @param {String} encoding - the file encoding (e.g. "utf-8")
 * @param {Function} callback - optional callback to invoke  
 *
 * @returns {Promise} A promise to produce an array of matched modules.
 */
retrospec.findAngularModulesInDir = function(filePath, encoding, callback, globPattern) {
	var deferred = Q.defer();
	var allModules = [];

	globPattern = globPattern || "**/*.js";
	retrospec.glob(filePath + globPattern, encoding).then(
		function(files) {
			var count = 0;
			for (var i = 0; i < files.length; i++) {
				var f = files[i];
				retrospec.findAngularModules(f, encoding, callback).then(
					function(modules) {
						count++;
						allModules = allModules.concat(modules);
						if (count == files.length) {
							deferred.resolve(allModules);
						}
					},
					function(err) {
						deferred.reject(err);
					}
				)
			}
		},
		function(error) {
			deferred.reject(error);
		}
	);

	return deferred.promise;
}

/**
 * Checks if the specified JavaScript AST node represents an 'angular.module("",[])' statement.
 * 
 * @param {Object} node - the JavaScript AST node to check 
 * 
 * @returns {Boolean} True if the node represents an 'angular.module("",[])' statement. False otherwise.
 */
function isAngularModuleExpression(node) {
	// AST node must have the following structure
    return node && node.callee && node.callee.object &&
           node.callee.property && node.arguments && 
           isCallExpression(node) &&
           isMemberExpression(node.callee) &&
           node.callee.object.name === 'angular' &&
           node.callee.property.name === 'module' &&
           typeof node.arguments[0].value === 'string' &&
           node.arguments[0].value.length > 0 &&
           isArrayExpression(node.arguments[1]);
};

/**
 * Checks if the specified JavaScript AST node represents a MemberExpression.
 * 
 * @param  {Object}  node - the JavaScript AST node to check
 * 
 * @return {Boolean} True if the node is a MemberExpression. False otherwise.
 */
function isMemberExpression(node) {
	return node && node.type === 'MemberExpression';
};

/**
 * Checks if the specified JavaScript AST node represents a CallExpression.
 * 
 * @param  {Object}  node - the JavaScript AST node to check
 * 
 * @return {Boolean} True if the node is a CallExpression. False otherwise.
 */
function isCallExpression(node) {
	return node && node.type === 'CallExpression';
}

/**
 * Checks if the specified JavaScript AST node represents an ArrayExpression.
 * 
 * @param  {Object}  node - the JavaScript AST node to check
 * 
 * @return {Boolean} True if the node is an ArrayExpression. False otherwise.
 */
function isArrayExpression(node) {
	return node && node.type === 'ArrayExpression';
}

/**
 * Checks if the specified JavaScript AST node represents an ExpressionStatement.
 * 
 * @param  {Object}  node - the JavaScript AST node to check
 * 
 * @return {Boolean} True if the node is an ExpressionStatement. False otherwise.
 */
function isExpressionStatement(node) {
	return node && node.type === 'ExpressionStatement';
}

/**
 * Constructs an object that represents an AngularJS module, containing both
 * the module's name and the names of its dependencies.
 * 
 * @param {Object} argsNode - CallExpression 'arguments' node for 'angular.module("",[])'
 */
function AngularModule(argsNode) {
	// make sure that this function is invoked with the 'new' operator
	if(this instanceof AngularModule) {
		// module name
		this.name = argsNode[0].value;
		// module dependencies
		this.dependencies = [];
		for(var i = 0, iEnd = argsNode[1].elements.length; i < iEnd; i++) {
			var dependency = argsNode[1].elements[i].value;
			if(typeof dependency === 'string' && dependency.length > 0) {
				this.dependencies.push(dependency);
			} else {
				console.log('[warn] non-string dependency encountered for angular module: ' + this.name);
			}
		}
	}
	else {
		console.log('[warn] forgot to use "new" operator with AngularModule: ' + this.name);
		return new AngularModule(argsNode);
	}
}
