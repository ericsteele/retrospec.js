/*
 * angular-js-e2e.spec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele, Peter Ingulli
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

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
    angularDir   = path.resolve(baseDir,      'angular.js'),
    outputDir    = path.resolve(retrospecDir, 'output/angular-js-e2e-results-' + dtStamp),
    configFile   = path.resolve(retrospecDir, 'test/input/configs/angular-js-retrospec-config.json'),
    resultsFile  = path.resolve(outputDir,    'final-results.txt');

// count of the number of rts executions
var rtsCount = 0;

// will contain concatenated results of all rts executions
var rtsResults = 'rev1 to rev2: [selected tests] [test selection time] [test execution time]\n' +
                 '--------------------------------------------------------------------------\n';

// 30 consecutive SHAs
var SHAs = [
  'd64d41e', '83e36db', 'c967792', '71c11e9', 'c67bd69',
  '1cb8584', '7227f1a', 'cb6b976', '8e2c62a', 'c369563',
  'b63fd11', 'a526ae8', '7b0c5b9', '6b7a1b8', '2845301',
  'e55c8bc', 'dbe381f', '708f2ba', '20b22f1', '8b0b7ca',
  'ef64169', '461d699', 'd845d8a', '4ae5f7a', '3d31a15',
  'e101c12', 'f7cf680', '4f38ba9', 'abddefd', 'b517f49',
  '6c7fdd8', '64d4046', '28613f0', '091eb83', 'a8d4280',
  'f452416', '1d9ac65', 'b389cfc', '940fcb4', '2354924',
  '879b0bc', 'acfcbdf', '3878be5', '2ad7bb9', '6743ccf',
  '6609175', '61a8e19', '24a045c', '4b1695e', '613a5cc'
];

log.info('install retrospec globally');
shell.exec('npm install ' + retrospecDir + ' -g');

log.info('clone the "angular.js" git repository');
shell.exec('git clone https://github.com/angular/angular.js ' + angularDir);

log.info('create the output directory');
shell.mkdir('-p', outputDir);

log.info('cd into the "angular.js" directory');
shell.cd(angularDir);
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
      execTime   = "n/a",
      testsRun   = output.match(/ (.*) tests selected/)[1];

  // add results
  rtsResults += prevSHA + ' to ' + currSHA + ': [' + testsRun + '] [' + selectTime  + '] [' + execTime + ']\n';
}