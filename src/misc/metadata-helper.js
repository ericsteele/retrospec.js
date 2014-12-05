/*
 * metadata-writer.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Peter Ingulli
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
// libs
var FS          = require('fs'),                    // file system
    Q           = require('q'),                     // `kriskowal/q` promises
    path        = require('path'),                  // utils for resolving file paths
    CodeModule  = require('../models/code-module'), // generic representation of a code module
    TestSuite   = require('../models/test-suite');  // generic representation of a test suite

// aliases
var readFile = Q.nfbind(FS.readFile);  // add Q promise support to FS.readile

// exports
module.exports = {
  writeMetadata: writeMetadata
}

function writeMetadata(modules, testSuites, projectRootPath) {
  var retrospecDir = path.resolve(projectRootPath, '.retrospec');
  if (!FS.existsSync(retrospecDir)) {
    FS.mkdirSync(retrospecDir);
  }

  var filepath = path.resolve(retrospecDir, 'retrospec');
  var file = FS.openSync(filepath, 'w+');

  writeModules(modules, file);
  writeToFile(file, ", \n")
  writeTestSuites(testSuites, file);
}

function writeModules(modules, file) {
  var modulesJSON = "modules: " + JSON.stringify(modules);
  writeToFile(file, modulesJSON, true);
}

function writeTestSuites(testSuites, file) {
  var testSuitesJSON = "testSuites: " + JSON.stringify(testSuites);
  writeToFile(file, testSuitesJSON, true);
}

function writeToFile(file, str, append) {
  var writeStartPos = append ? null : 0;
  FS.writeSync(file, str);
}
