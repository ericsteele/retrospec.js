/*
 * array-helper.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// exports
module.exports = diffProjects;

/**
 * Performs a diff of the provided `Project` instances, treating `projectA` as an older
 * version of `projectB`. This diff considers both the project's modules and its test
 * suites. Each diff is represented as an object with the following properties:
 *
 *   - id     {String} - the unique identifier of the modified object 
 *   - change {String} - the type of change: Add, Edit, Move, Delete, None
 * 
 * @param  {Object} projectA [description]
 * @param  {Object} projectB [description]
 * 
 * @return {Object} an object with the following properties
 *                  
 *   - modules:    {Array} - diffs between `CodeModule` maps
 *   - testSuites: {Array} - diffs between `TestSuite` maps
 */
function diffProjects(projectA, projectB) {
  var moduleChanges    = fileMapDiff(projectA.moduleMap,    projectB.moduleMap),
      testSuiteChanges = fileMapDiff(projectA.testSuiteMap, projectB.testSuiteMap);

  return { modules: moduleChanges, testSuites: testSuiteChanges };
}

/**
 * Diffs two maps containing either `CodeModule` objects or `TestSuite` objects, 
 * treating `mapA` as an older version of `mapB`. Each diff is represented as an 
 * object with the following properties:
 * 
 * @param  {Object} mapA - the older map
 * @param  {Object} mapB - the newer map
 * 
 * @return {Array} an array of 'diff' objects, each with the following properties:
 *
 *   - id     {String} - the unique identifier of the modified object 
 *   - change {String} - the type of change: Add, Edit, Move, Delete, None
 */
function fileMapDiff(mapA, mapB) {
  var diffs = [];

  for (var key in mapA) {
    if (mapA.hasOwnProperty(key) && mapB.hasOwnProperty(key)) {
      var fileA = mapA[key],
          fileB = mapB[key];

      if (fileA.hash === fileB.hash) {
        if(fileA.path === fileB.path) {
          //console.log('none:   ' + key);
          diffs.push({ id: key, change: 'None'});
        }
        else {
          //console.log('move:   ' + key);
          diffs.push({ id: key, change: 'Move'});
        }
      }
      else {
        //console.log('edit:   ' + key);
        diffs.push({ id: key, change: 'Edit'});
      }
    }
    else {
      //console.log('delete: ' + key);
      diffs.push({ id: key, change: 'Delete'});
    }
  }

  for (key in mapB) {
    if (mapB.hasOwnProperty(key) && !mapA.hasOwnProperty(key)) {
      //console.log('add:    ' + key);
      diffs.push({ id: key, change: 'Add'});
    }
  }

  return diffs;
}