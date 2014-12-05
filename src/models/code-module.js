/*
 * code-module.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// module to be exported
module.exports = CodeModule;

/**
 * Constructs an object that represents a piece of code defined using a module loader. 
 * 
 * @param {String} name - string that uniquely identifies the code module
 * @param {Array}  deps - array of code module names that the code module depends on
 * @param {String} path - relative path of the file that defines the code module
 */
function CodeModule(name, deps, path) {
  // this is a special object and it deserves to be called with "new" damn it!
  if(this instanceof CodeModule === false) {
    console.log('[warn] forgot to use "new" operator when invoking CodeModule():' + name);
    return new CodeModule(name, deps, path);
  }

  this.name         = name || '';
  this.dependencies = deps || [];
  this.path         = path || '';
}