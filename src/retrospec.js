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
    OS = require('os'),                    // operating system info
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
	var deferred = Q.defer(),
	    encoding = encoding || 'utf-8',
	    fileName = filePath.replace(/^.*[\\\/]/, '');

	readFile(filePath, encoding).then(
		function success(text) {
			var deps = parse.findDependencies(fileName, text);
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
						var module = new AngularModule(node.arguments);
						if (!alreadyInModuleArray(modules, module)) {
							modules.push(module);
						}
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
						allModules = addAllUniqueModulesToList(allModules, modules);
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
}

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

/**
 * Match file names using the patterns the shell uses, like stars and stuff.
 *
 * @param {String} pattern
 * @param {Object} options
 * @param {Function} callback
 *
 * @returns {Promise} A promise to produce an array of matched file names.
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

function RequireJsModule(path, dependencies) {
	// make sure that this function is invoked with the 'new' operator
	if(this instanceof RequireJsModule) {
		this.path = path || '';
		this.name = path.replace(/^.*[\\\/]/, '').slice(0, -3) || '';
		this.dependencies = dependencies || [];
	} 
	else {
		console.log('[warn] forgot to use "new" operator with RequireJsModule: ' + this.name);
		return new AngularModule(argsNode);
	}
}

retrospec.findRequireModulesInDir = function(patterns, cwd) {
	var deferred = Q.defer(),
			promises = [],
	    patterns = patterns || ['*'],
	    cwd      = cwd      || process.cwd();
	
	// get the paths of all files that match the provided patterns
	retrospec.locateFiles(patterns, cwd).then(
		function success(filePaths) {
			filePaths.forEach(function(path) {
				var promise = retrospec.findDependencies(path).then(
					function success(deps) {
						return new RequireJsModule(path, deps);
					});

				promises.push(promise);
			});

			Q.all(promises).then(
				function success(modules) {
					deferred.resolve(modules);
				},
				function failure(error) {
					deferred.reject(error);
				});

		},
		function failure(error) {
			deferred.reject(error);
		});

	return deferred.promise;

};

/**
 * Gets the absolute paths of all files in a directory that match one or more glob patterns.
 * 
 * @param  {Array}  patterns - Array of glob patterns that will be used to match/locate files
 * @param  {String} cwd - Absolute path of the directory to search in (defaults to process.cwd())
 * 
 * @returns {Promise} A promise to produce an array of absolute file paths (one path per matched file).
 */
retrospec.locateFiles = function(patterns, cwd) {
	var promises = [], filePaths = [];

	// set `cwd` to default value if not provided
	cwd = cwd || process.cwd();

	// initiate the search for files
	for(var i = 0, iEnd = patterns.length; i < iEnd; i++) {
		var promise = retrospec.glob(patterns[i], { cwd: cwd });
		promises.push(promise);
	}

	return Q.all(promises)		// combine promises
	        .then(flatten)		// flatten promise results into a single array
	        .then(getUnique)	// remove duplicate file paths (i.e. those matched by more than one glob pattern)
	        .then(makeFilePathsAbsolute)
	        .then(fixFilePathsForOS);

	// Prepends `cwd` to the relative paths
	function makeFilePathsAbsolute(relativePaths) {
		var absolutePaths = [];
		for(var i = 0, iEnd = relativePaths.length; i < iEnd; i++) {
			absolutePaths.push(cwd + '/' + relativePaths[i]);
		}
		return absolutePaths;
	} 		

	// Converts the POSIX paths output by node-glob into UNC paths if using a Windows OS 
	function fixFilePathsForOS(absolutePaths) {
		if(OS.type().indexOf('Windows') > -1) {
			for(var i = 0, iEnd = absolutePaths.length; i < iEnd; i++) {
				absolutePaths[i] = absolutePaths[i].replace(/\//g,'\\');
			}
		}
		return absolutePaths;
	}		
};

/**
 * Takes an array, whose elements may or may not be arrays, and flattens it into a single array.
 * 
 * @param  {Array} array - The array to flatten
 * 
 * @return {Array} The flattened array.
 */
function flatten(array) {
  var flattened = [];
  for(var i = 0, iEnd = array.length; i < iEnd; i++) {
    if(Array.isArray(array[i]) === false) {
      flattened.push(array[i]);
    }
    else {
      var temp = flatten(array[i]);
  		for(var j = 0, jEnd = temp.length; j < jEnd; j++) {
        flattened.push(temp[j]);
      }
    }
  }
  return flattened;
}

/**
 * Gets an array containing all unique values in the provided array.
 * 
 * @param  {Array} array - An array that may contain duplicate values
 * 
 * @return {Array} An array containing all unique values found in `array`
 */
function getUnique(array) {
	var unique = [];

	for(var i = 0, iEnd = array.length; i < iEnd; i++) {
		for(var j = i + 1; j < iEnd; j++) {
			// skip array[i] if it is found later in the array
			if(array[i] === array[j]) {
				j = ++i;
			}
		}
		unique.push(array[i]);
	}

	return unique;
}

/**
 * Checks if the module is already in the list
 *
 * @param {Array} list - The list to check for module
 * @param {Object} module - The module to check for
 *
 * @return {Boolean} Whether or not the module is already in the list
 */
function alreadyInModuleArray(list, module) {
	for (var i = 0; i < list.length; i++) {
		if (list[i].name === module.name) {
			return true;
		}
	}

	return false;
}

/**
 * Combines the two lists and returns a combined, unique list
 *
 * @param {Array} master - The list to be combined into (won't be changed)
 * @param {Array} list - The list from which modules are taken
 *
 * @return master plus all unique entries in list not already in master
 */
function addAllUniqueModulesToList(master, list) {
	for (var i = 0; i < list.length; i++) {
		var candidateModule = list[i];
		var found = false;
		for (var j = 0; j < master.length; j++)  {
			if (master[j].name === candidateModule.name) {
				found = true;
				break;
			}
		}
		if (!found) {
			master.push(candidateModule);
		}
	}
	return master;
}
