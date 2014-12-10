/*
 * logger.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

//var winston = require('winston'); // multi-transport logging

module.exports = {
  on:      on,
  off:     off,
  divider: printDivider,
  msg:     console.log,
  info:    printInfo,
  error:   printError,
  warn:    printWarning
};

var active = true;

function on() {
  active = true;
}

function off() {
  active = false;
}

function printInfo(info) {
  if(active) console.log('[info] ' + info);
}

function printError(error) {
  if(active) console.log('[error] ' + error);
}

function printWarning(error) {
  if(active) console.log('[warn] ' + error);
}

function printDivider() {
  if(active) console.log('+------------+');
}