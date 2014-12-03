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
var FS          = require('fs'),                    // file system
    Q           = require('q'),                     // `kriskowal/q` promises
    parse       = require('../../lib/r.js/parse'),  // r.js parse lib
    arrayHelper = require('../misc/array-helper'),  // array helper methods
    fsHelper    = require('../misc/fs-helper'),     // file system helper methods
    CodeModule  = require('../models/code-module'); // represents a "module" of code

// retrospec's interface for pluggable module extraction logic
var CodeModuleExtractor = require('../models/code-module-extractor.js');

// add Q promise support to FS.readile
var readFile = Q.nfbind(FS.readFile);

// export a RequireJS implementation
module.exports = new CodeModuleExtractor(['RequireJS'], extractModulesFromText);

/**
 * Parses JavaScript source code text and extracts RequireJS module definitions of 
 * the form 'angular.module("",[])'. The names and dependencies of all RequireJS 
 * modules found within are returned as an array of `CodeModule` objects.
 * 
 * @param {String} filePath - relative path of the file from which the text originated
 * @param {String} text     - the JavaScript text to parse
 * 
 * @return {Array} An array of `CodeModule` objects.
 */
function extractModulesFromText(filePath, text) {
  // validate arguments
  if(!filePath) throw new Error('[error] invalid argument "filePath" = ' + filePath);
  if(!text)     throw new Error('[error] invalid argument "text" = ' + text);

  // extract module dependencies
  var fileName = filePath.replace(/^.*[\\\/]/, ''),
      deps     = parse.findDependencies(fileName, text),
      cjsDeps  = parse.findCjsDependencies(fileName, text);

  // TODO: Implement my own module extraction using estraverse
  // If(hasName)
  //    addToListWithName
  // Else
  //    addToListWithFileName

  // combine dependencies & remove duplicates
  deps = arrayHelper.getUnique(deps.concat(cjsDeps));

  // currently, we consider a file to be a module if it has dependencies
  var codeModules = [];
  if(deps.length > 0) {
    codeModules.push(new CodeModule(filePath, deps, filePath));
  }

  return codeModules;
}