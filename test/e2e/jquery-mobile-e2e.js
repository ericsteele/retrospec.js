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
var dtStamp = moment().format('YYYY-MM-DD_HH-mm-ss');

// cwd = retrospec/test/e2e
var baseDir      = path.resolve(__dirname,    '../../..'),
    retrospecDir = path.resolve(baseDir,      'retrospec.js'),
    jqmDir       = path.resolve(baseDir,      'jquery-mobile'),
    outputDir    = path.resolve(retrospecDir, 'output/jqm-e2e-results-' + dtStamp),
    configFile   = path.resolve(retrospecDir, 'test/input/configs/jqm-retrospec-config-131.json'),
    resultsFile  = path.resolve(outputDir,    'final-results.txt');

// count of the number of rts executions
var rtsCount = 0;

// will contain concatenated results of all rts executions
var rtsResults = 'rev1 to rev2: [selected tests] [test selection time] [test execution time]\n' +
                 '--------------------------------------------------------------------------\n';

// 30 consecutive SHAs
var SHAs = [
  '22fcdba', '516afad', '050ef35', '18a3cd6', 'cb6a2c1',
  'f6ce1bf', 'cc95c3f', '86c75da', '6f97d29', '09832f3',
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

// Write results to file
log.info('writing results to file');
FS.writeFileSync(resultsFile, rtsResults);

function executeTests(nextSHA, currSHA) {
  rtsCount += 1;
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
  var outputFileName = 'rts-' + rtsCount + '-' + prevSHA + '-to-' + currSHA + '.txt',
      outputFilePath = path.resolve(outputDir, outputFileName);

  // execute rts
  log.info('running retrospec');
  var output = shell.exec('retrospec ' + configFile + ' -s').output;
  log.info('finished rts for ' + prevSHA + ' to ' + currSHA);

  // write output to file
  log.info('writing output to file: ' + outputFileName);
  FS.writeFileSync(outputFilePath, output);

  // parse output for results
  var selectTime = output.match(/test selection time: (.*)/)[1],
      execTime   = output.match(/test execution time: (.*)/)[1],
      testsRun   = output.match(/ (.*) tests selected/)[1];

  // add results
  rtsResults += prevSHA + ' to ' + currSHA + ': [' + testsRun + '] [' + selectTime  + '] [' + execTime + ']\n';
}