/*
 * jquery-mobile-e2e.spec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// chai assertion library
// var chai = require('chai');

// extend chai with assertions about promises
// chai.use(require('chai-as-promised'));

// grab chai's assert, expect, and should interfaces
// var assert = chai.assert,
//     expect = chai.expect,
//     should = chai.should(); // Note that should has to be executed

// node libs
var FS   = require('fs'),
    exec = require('child_process').exec,
    path = require('path');

// libs
var moment = require('moment'),  // datetime
    shell  = require('shelljs'); // portable unix shell commands (Windows/Linux/OS X)

// src
var log = require('../../src/helper/logger');

if (!shell.which('git')) {
  shell.echo('[error] Cannot proceed without Git: http://www.git-scm.com/downloads');
  shell.exit(1);
}

// make sure logging is enabled
log.on();

// get the current datetime
var dtStamp = moment().format('YYYY-MM-DD_HH-MM-SS');

// cwd = retrospec/test/e2e
var baseDir      = path.resolve(__dirname,    '../../..'),
    retrospecDir = path.resolve(baseDir,      'retrospec.js'),
    jqmDir       = path.resolve(baseDir,      'jquery-mobile'),
    outputDir    = path.resolve(retrospecDir, 'output/jqm-e2e-results-' + dtStamp),
    configFile   = path.resolve(retrospecDir, 'test/input/configs/jqm-retrospec-config-131.json');

// count of the number of tests that have run
var testCount = 0;

// 20 consecutive SHAs
var SHAs = [
  '3a22e02', '2e1bb85', '277d379', '044a3f8', 'aea0f99',
  'eb8d2ba', 'b9b25ba', '1651544', '7378b55', '7b31cee',
  'bc4d8e2', '468d221', '5f34b77', '0e6bf28', '2d5b272',
  '1ff2d3a', 'bbb3bd5', '40d4cb8', '87453e0', '4b66652'
];

log.info('install retrospec globally');
shell.exec('npm install ' + retrospecDir + ' -g');

log.info('clone the "jquery-mobile" git repository');
shell.exec('git clone https://github.com/jquery/jquery-mobile ' + jqmDir);

log.info('create the output directory');
shell.mkdir('-p', outputDir);

log.info('cd into the "jquery-mobile" directory');
shell.cd(jqmDir);
gitCheckout(SHAs[0]);
npmInstall();

log.info('initial run of retrospec');
shell.exec('retrospec ' + configFile + ' -rs');

// Commence e2e test (20 consecutive revisions)
for(var i = 1, iEnd = SHAs.length; i < iEnd; i++) {
  executeTests(SHAs[i], SHAs[i-1]);
}

function executeTests(nextSHA, currSHA) {
  testCount += 1;
  gitCheckout(nextSHA);
  npmInstall();
  runRetrospec(nextSHA, currSHA);
}

function gitCheckout(sha) {
  log.info('git checkout ' + sha);
  shell.exec('git checkout ' + sha);
}

function npmInstall() {
  log.info('npm install');
  shell.exec('npm install');
}

function runRetrospec(currSHA, prevSHA) {
  log.info('running retrospec');

  var resultFileName = 'rts-' + testCount + '-' + prevSHA + '-to-' + currSHA + '.txt',
      resultFilePath = path.resolve(outputDir, resultFileName);

  var output = shell.exec('retrospec ' + configFile + ' -s').output;

  log.info('finished rts for ' + prevSHA + ' to ' + currSHA);
  FS.writeFileSync(resultFilePath, output);
}