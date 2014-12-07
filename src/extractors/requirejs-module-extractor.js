/*
 * requirejs-module-extractor.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var parse       = require('../../lib/r.js/parse'),   // r.js parse lib
    path        = require('path'),                   // utils for resolving file paths
    arrayHelper = require('../helper/array-helper'), // array helper methods
    CodeModule  = require('../models/code-module');  // represents a "module" of code

// retrospec's interface for pluggable extraction logic
var FileContentExtractor = require('./file-content-extractor.js');

// exports
module.exports = new FileContentExtractor('requirejs-module-extractor', extractModules);

/**
 * Parses JavaScript source code text and extracts RequireJS module definitions of 
 * the form 'angular.module("",[])'. The names and dependencies of all RequireJS 
 * modules found within are returned as an array of `CodeModule` objects.
 * 
 * @param {String} fileContents - the file's text content
 * @param {String} filePath     - relative path of the file
 * @param {String} cwd          - directory that `filePath` is relative to
 * 
 * @return {Array} An array of `CodeModule` objects.
 */
function extractModules(fileContents, filePath, cwd) {
  // extract module dependencies
  var fileName   = filePath.replace(/^.*[\\\/]/, ''),
      moduleName = filePath.slice(0, -3),
      deps       = parse.findDependencies(fileName, fileContents),
      cjsDeps    = parse.findCjsDependencies(fileName, fileContents);

  // TODO: Implement our own module extraction using estraverse
  // if(hasName)
  //    addToListWithName
  // else
  //    addToListWithFileName

  // combine dependencies & remove duplicates
  deps = arrayHelper.getUnique(deps.concat(cjsDeps));

  // remove contextual paths from dependency names 
  deps.forEach(function(value, index, array) {
    array[index] = value.replace(/^.*[\\\/]/, '');
  });

  // currently, we consider a file to be a module if it has dependencies
  var codeModules = [];
  if(deps.length > 0) {
    codeModules.push(new CodeModule(moduleName, deps, filePath, fileContents));
  }

  return codeModules;
}