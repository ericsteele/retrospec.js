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
    estraverse = require('estraverse');    // ast traversal

// add Q promise support to FS.readile
var readFile = Q.nfbind(FS.readFile);

// module to be exported
var retrospec = module.exports = {};

/**
 * Parses the specified JavaSript file produces an Abstract Syntax Tree (AST).
 *
 * @param {String} filePath
 * @param {String} encoding
 * @param {Function} callback
 *
 * @returns {Object} an Abstract Syntax Tree (AST).
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
 * @param {String} filePath
 * @param {String} encoding
 * @param {Function} callback
 *
 * @returns {Array} an array of dependency strings.
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
 * @param {String} filePath
 * @param {String} encoding
 * @param {Function} callback
 *
 * @returns {Array} an array of dependency strings.
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
 *   1. require/requirejs.config()
 *   2. require/requirejs({}, ...)
 * 
 * @param {String} filePath
 * @param {String} encoding
 * @param {Function} callback
 *
 * @returns {Object} a config details object with the following properties:
 * - config: {Object} the config object found. Can be undefined if no
 * config found.
 * - range: {Array} the start index and end index in the contents where
 * the config was found. Can be undefined if no config found.
 * Can throw an error if the config in the file cannot be evaluated in
 * a build context to valid JavaScript.
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
 * @returns {Array} an array of matched files.
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
 * Finds 'angular.module()' statements.
 * 
 * @param {String} filePath
 * @param {String} encoding
 * @param {Function} callback
 *
 * @returns {Array} an array of matched modules.
 */
retrospec.findAngularModules = function(filePath, encoding, callback) {
	var deferred = Q.defer();

	// array of found modules
	var modules = [];

	readFile(filePath, encoding).then(
		function success(text) {
			var ast = esprima.parse(text);

			estraverse.traverse(ast, {
					enter: function (node, parent) {
						if(node.type === 'ExpressionStatement' &&
						   node.expression.type === 'CallExpression' &&
						   node.expression.callee.type === 'MemberExpression' &&
						   node.expression.callee.object.name === 'angular' &&
						   node.expression.callee.property.name === 'module' &&
						   node.expression.arguments[1].elements.length > 0) {
							
							modules.push({
								name: node.expression.arguments[0].value,
								deps: node.expression.arguments[1].elements
							});
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