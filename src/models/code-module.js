/*
 * code-module.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// libs
var hashStr = require('../helper/hash-str');

// module to be exported
module.exports = CodeModule;

/**
 * Constructs an object that represents a module of code. 
 * 
 * @param {String} id           - string that uniquely identifies the module
 * @param {Array}  deps         - array of module ids that the module depends on
 * @param {String} path         - relative path of the file that defines the module
 * @param {String} fileContents - the contents of the file
 */
function CodeModule(id, deps, path, fileContents) {
  // this is a special object and it deserves to be called with "new"!
  if(this instanceof CodeModule === false) {
    console.log('[warn] forgot to use "new" operator when invoking CodeModule():' + id);
    return new CodeModule(id, deps, path, fileContents);
  }

  this.id           = id   || '';
  this.path         = path || '';
  this.dependencies = deps || [];
  this.hash         = hashStr(fileContents);
}