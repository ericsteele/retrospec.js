#!/usr/bin/env node

'use strict';

process.title = 'retrospec';

// libs
var argv = require('argv'); // CLI argument parser

// src
var log = require('./helper/logger'); // logging

// get CLI arguments
var args = getArguments();

// retrospec needs a configuration file to run
var configPath = (args.targets.length === 1) ? args.targets[0] : null;

// start the program
if(configPath) {
  require('./retrospec').cli({
    configPath: configPath,
    options:    args.options,
  });
}
else {
  log.error('no config file path provided')
}

/**
 * Parses CLI arguments with 'argv' and returns the result.
 * 
 * @return {Object} an object with the following properties:
 *
 *   - targets {Array}  - array of non-option arguments
 *   - options {Object} - object map from option name to its value
 */
function getArguments() {
  // define a custom 'flag' CLI argument type
  argv.type('flag', function(value) {
    return true;
  });

  // define expected CLI arguments
  argv.option([{
    name: 'reset',
    short: 'r',
    type: 'flag',
    description: 'Deletes all existing retrospec metadata',
    example: "'retrospec --reset or 'retrospec -r'"
  }, {
    name: 'save',
    short: 's',
    type: 'flag',
    description: 'Indicates whether or not retrospec should save project metadata',
    example: "'retrospec --save or 'retrospec -s'"
  }]);

  // run the CLI argument parser
  return argv.run();
}