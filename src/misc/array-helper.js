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
module.exports = {
  flatten:     flatten,
  getUnique:   getUnique,
  removeNulls: removeNulls
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
 * Removes all null values from the specified array.
 * 
 * @param  {Array} array - An array that may contain null values
 * 
 * @return {Array} An array containing all non-null values
 */
function removeNulls(array) {
  return array.filter(function(val) { return val !== null; });
}