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
var angExtractor = require('./extractors/angular-module-extractor'),
    rjsExtractor = require('./extractors/requirejs-module-extractor');

// export the module
module.exports = retrospec;

function retrospec(config) {
  // 1. validate config and set default values as needed (probably using extend)
	// 2. choose the appropriate module extractor based on config input
	// 3. use extractor to find all module definitions
}