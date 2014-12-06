

/*
 * metadata-helper.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Peter Ingulli
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var FS         = require('fs'),                    // file system
    Q          = require('q'),                     // `kriskowal/q` promises
    path       = require('path'),                  // utils for resolving file paths
    fsHelper   = require('../misc/fs-helper'),     // file system helper methods
    CodeModule = require('../models/code-module'), // generic representation of a code module
    TestSuite  = require('../models/test-suite');  // generic representation of a test suite

// add Q promise support to FS operations
var mkdir     = Q.nfbind(FS.mkdir),
    openFile  = Q.nfbind(FS.open),
    readFile  = Q.nfbind(FS.readFile),
    writeFile = Q.fbind(FS.write);

// exports
module.exports = {
  readMetadata:  readMetadata,
  writeMetadata: writeMetadata
};

// constants
var METADATA_DIRECTORY = '.retrospec',
    METADATA_FILE      = 'project-snapshot.json'
    
/**
 * Writes the provided project meta-data to '{projectPath}/.retrospec/project-snapshot.json'.
 * 
 * @param  {Object} modules     - an object map whose properties are the project's CodeModules
 * @param  {Object} testSuites  - an object map whose properties are the project's TestSuites
 * @param  {String} projectPath - absolute path of the project's root directory
 * 
 * @return {Promise} A promise to write the project's meta-data to file.
 */
function writeMetadata(modules, testSuites, projectPath) {
  var metadataDirPath  = path.resolve(projectPath,     METADATA_DIRECTORY),
      metadataFilePath = path.resolve(metadataDirPath, METADATA_FILE),
      jsonStr          = JSON.stringify({ modules: modules, testSuites: testSuites });

  return fsHelper.exists(metadataDirPath)
                 .then(mkdirIfNeeded)
                 .then(openMetadataFile)
                 .then(writeJsonToFile);

  function mkdirIfNeeded(exists) {
    if(!exists) return mkdir(metadataDirPath);
  }

  function openMetadataFile() {
    return openFile(metadataFilePath, 'w+');
  }

  function writeJsonToFile(file) {
    return writeFile(file, jsonStr);
  }
}

/**
 * Reads project meta-data from '{projectPath}/.retrospec/project-snapshot.json'
 * 
 * @param  {String} projectPath - absolute path of the project's root directory
 * 
 * @return {Promise} A promise to produce the project's meta-data.
 */
function readMetadata(projectPath) {
  var filepath = path.resolve(projectPath, '.retrospec/project-snapshot.json');

  return fsHelper.exists(filepath)
                 .then(readMetadataFile)
                 .then(JSON.parse);

  function readMetadataFile(exists) {
    return exists ? readFile(filepath, 'utf-8') : null;
  }
}