/*
 * requirejs-config-extractor.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var parse = require('../../lib/r.js/parse');  // r.js parse lib

// retrospec's interface for pluggable extraction logic
var FileContentExtractor = require('./file-content-extractor.js');

// exports
module.exports = new FileContentExtractor('requirejs-config-extractor', extractConfig);

/**
 * Parses a JavaScript file's text and extracts a RequireJS configuration object. This includes calls to:
 * 
 *   1. require.config()
 *   2. requirejs.config()
 *   3. require({}, ...)
 *   4. requirejs({}, ...)
 * 
 * @param {String} fileContents - the file's text content
 * @param {String} filePath     - relative path of the file
 * @param {String} cwd          - directory that `filePath` is relative to
 * 
 * @return {Object} If no configuration object is found in the text, then this function will return 
 *                  null, otherwise it will return an object with the following properties:
 *                  
 *   - config: {Object} the extracted RequireJS config object.
 *   - path:   {String} the relative path of the file in which the config object was found
 *   - range:  {Array}  the start index and end index in the contents where the config was found.
 */
function extractConfig(fileContents, filePath, cwd) {
  var result = parse.findConfig(fileContents);

  if(result.config) {
    result.path = filePath;
  } else {
    result = null;
  }

  return result;
}