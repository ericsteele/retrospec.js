/*
 * ui-bootstrap-e2e.spec.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele, Peter Ingulli
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
var baseDir        = path.resolve(__dirname,    '../../..'),
    retrospecDir   = path.resolve(baseDir,      'retrospec.js'),
    uiBootstrapDir = path.resolve(baseDir,      'ui-bootstrap'),
    outputDir      = path.resolve(retrospecDir, 'output/ui-bootstrap-e2e-results-' + dtStamp),
    configDir      = path.resolve(retrospecDir, 'test/input/misc'),
    configFile     = path.resolve(retrospecDir, 'test/input/configs/ui-bootstrap-retrospec-config.json'),
    resultsFile    = path.resolve(outputDir,    'final-results.txt');

// count of the number of tests that have run
var rtsCount = 0;

// will contain concatenated results of all rts executions
var rtsResults = 'rev1 to rev2: [selected tests] [test selection time] [test execution time]\n' +
                 '--------------------------------------------------------------------------\n';

// 20 consecutive SHAs
var SHAs = [
  'b7eb69e', 'a294c87', '68e5644', '101c43a', '0daa7a7',
  'e8d5fef', '7f4b40e', 'a88b115', 'cde6a45', '09678b1',
  '3111501', 'c5862b0', 'c01d255', 'bce2505', '9a2638b',
  'dea67b0', 'e199349', '378a933', 'd19b4c0', '5ca23e9',
  '3e938bd', '0d4c2e2', '467dd15', '93da30d', '890e2d3',
  '341b5b5', 'c6c0e2d', '6a83011', 'd89bbd1', 'f715d05',
  'f9b6c49', 'f9aa459', 'd002493', '4b811b7', '3b6ab25',
  'f48e433', '82df4fb', '4c76a85', '004dd1d', 'cb31b87',
  'de5a25e', '2423f6d', 'b0b1434', '97b0747', '73c2dea',
  'bd2ae0e', 'e0eb1bc', 'ded352c', '00829b6', '96def3d'
];

log.info('install retrospec globally');
shell.exec('npm install ' + retrospecDir + ' -g');

log.info('clone the "ui-boostrap" git repository');
shell.exec('git clone https://github.com/angular-ui/bootstrap ' + uiBootstrapDir);

log.info('create the output directory');
shell.mkdir('-p', outputDir);

log.info('cd into the "ui-boostrap" directory');
shell.cd(uiBootstrapDir);
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
  editConfigFiles();
  npmInstall();
  gruntBeforeTest();
  runRetrospec(nextSHA, currSHA);
}

function editConfigFiles() {
  log.info('writing Gruntfile with added test:retrospec task');
  var gruntfilePath = path.resolve(uiBootstrapDir, 'Gruntfile.js');
  var additionalContentPath = path.resolve(configDir, 'ui-bootstrap-gruntfile-addition');
  addContentToGruntfile(gruntfilePath, additionalContentPath, 345);

  log.info('writing retrospec-karma.template.js');
  var karmaConfigTemplatePath = path.resolve(configDir, 'ui-bootstrap-retrospec-karma.template.js');
  copyKarmaConfigTemplate(karmaConfigTemplatePath);
}

/**
 * Updates the supplied gruntfile with the test:retrospec grunt task
 *
 * @param {Array} filePaths - relative paths of the tests to execute
 * @param {String} projectDir - The absolute path to the project directory
 */
function addContentToGruntfile(gruntfilePath, additionalContentPath, lineNumberToAppendTo) {
  var fileContents = FS.readFileSync(gruntfilePath, 'utf-8');
  var additionalContent = FS.readFileSync(additionalContentPath, 'utf-8');

  var counter = 0;
  var line = "";
  var len = fileContents.length;
  for(var i = 0; i < len; i++) {
    if (fileContents[i] === "\n") {
      counter++;
    }
    if (counter === lineNumberToAppendTo) {
      fileContents = fileContents.slice(0,i) + additionalContent + fileContents.slice(i,len);
      break;
    }
  }

  var newFilePath = path.resolve(uiBootstrapDir, 'Gruntfile.js');
  FS.writeFileSync(newFilePath, fileContents);
}

function copyKarmaConfigTemplate(karmaConfigTemplatePath) {
  var fileContents = FS.readFileSync(karmaConfigTemplatePath, 'utf-8');
  var newPath = path.resolve(uiBootstrapDir, "retrospec-karma.template.js");
  
  FS.writeFileSync(newPath, fileContents);
}

function gitCheckout(sha) {
  log.info('git checkout ' + sha);
  shell.exec('git checkout ' + sha);
}

function npmInstall() {
  log.info('npm install');
  shell.exec('npm install');
}

function gruntBeforeTest() {
  log.info('grunt before-test');
  shell.exec('grunt before-test');
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