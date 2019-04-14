# retrospec.js

A regression test selection tool for JavaScript. Currently under development.

## Project Setup

#### This project uses NodeJS
If you do not have NodeJS installed, get it [here](https://nodejs.org/).

#### Install dependencies
Project dependencies are managed via [npm](https://www.npmjs.org/):

```bash
$ npm install
```

## Tests
This project uses the [Mocha](https://github.com/mochajs/mocha) testing framework and the [Chai](https://github.com/chaijs/chai) assertion library. It contains unit, integration, and end-to-end (e2e) tests. 

#### Unit & Integration
To run unit and integration tests, first install dependencies, then run:

```bash
$ npm test
```

or

```bash
$ grunt test
```

#### End-to-End (e2e)
This project stores its e2e test scripts in the `retrospec.js/test/e2e` directory. Each script executes `retrospec` on 50 consecutive revisions of one of our 3 validation projects. The output of each `retrospec` execution is written to file in the `retrospec.js/output` directory. We aggregate this output data and write it to a file named `final-results.txt` (also in the output directory). The results file has the following format:

> rev1 to rev2: [selected tests] [test selection time] [test execution time]
<br>---------------------------------------------------------------------------------------
<br>b7eb69e to a294c87: [2/25] [0s 93.613631ms] [3s 987.647555ms]
<br>a294c87 to 68e5644: [0/25] [0s 98.243777ms] [0s 0ms]
<br>cde6a45 to 09678b1: [4/25] [0s 97.150709ms] [2s 860.635545ms]

##### Running E2E Tests 
After installing project dependencies, you can execute the e2e scripts using NodeJS:

```bash
$ node ./test/e2e/jquery-mobile-e2e.js
```

```bash
$ node ./test/e2e/ui-bootstrap-e2e.js
```

```bash
$ node ./test/e2e/angular-e2e.js
```

## Validation Projects
The following projects are being used for validation purposes:

#### [jQuery-Mobile](https://github.com/jquery/jquery-mobile/)
Uses the [RequireJS](https://github.com/jrburke/requirejs) module loader and the [QUnit](https://github.com/jquery/qunit) testing framework.

#### [AngularJS](https://github.com/angular/angular)
Uses the [AngularJS](https://github.com/angular/angular) module loader, [Karma](https://github.com/karma-runner/karma) test runner, and [Jasmine](https://github.com/jasmine/jasmine) testing framework.

#### [Angular UI-Bootstrap](https://github.com/angular-ui/bootstrap)
Uses the [AngularJS](https://github.com/angular/angular) module loader, [Karma](https://github.com/karma-runner/karma) test runner, and [Jasmine](https://github.com/jasmine/jasmine) testing framework.

## Progress

#### Validation Project Selection
In order to test `retrospec` and validate that it works we needed to find some open source JavaScript projects that could use it. After downloading and executing unit tests for 10 popular open source projects (12 revisions of each), we found that 3 of the projects had tests that ran long enough to warrant regression test selection. We found that `jquery-mobile`'s tests typically run for about 18 minutes on average while `angular's` tests run for about 18 seconds and `angular-bootstrap`'s tests take about 7.5 seconds.

#### Code Module Extraction
This tool  uses the dependency tracking information provided by JavaScript module loaders such as [AngularJS](https://github.com/angular/angular) and [RequireJS](https://github.com/jrburke/requirejs).

#####Completed Tasks
* Automate extraction of `RequireJS` modules from `jquery-mobile` 
* Automate extraction of `AngularJS` modules from `angular` & `angular-bootstrap`

#### Test Suite Extraction
In order to select and execute test suites, this tool must be able to extract test suite metadata from testing frameworks such as [QUnit](https://github.com/jquery/qunit) and  [Karma](https://github.com/karma-runner/karma).

#####Completed Tasks
* Automate extraction of `QUnit` test suites from `jquery-mobile`
* Automate extraction of `Jasmine` test suites from `angular` & `angular-bootstrap`
* Automate extraction of `inline comment` test suite definitions (for ad-hoc use)

#### Regression Test Selection

#####Completed Tasks
* Detect changes to files between revisions by comparing file hashes
* Build a project model using the extracted code module and test suite data
* Store and retrieve project models in JSON files
* Diff project models to identify file adds, edits, deletes, and moves.
* Select regression tests for `angular`, `angular-bootstrap`, and `jquery-mobile`.
* Execute selected regression tests for `jquery-mobile` and `angular-bootstrap`.

#####Dropped Tasks
* Execute selected regression tests for `angular`.
	* Unfortunately, the `angular` project's testing setup does not allow us to execute individual tests.

#### Project Validation
We validated `retrospec`'s ability to select and execute regression tests by running it over 50 consecutive revisions of 3 OSS projects and inspecting the results. For both `jquery-mobile` and `angular-bootstrap` we were able to correctly select and execute tests. We were able to correctly select tests for the `angular` project as well, but were not able to execute those tests because `angular`'s testing setup does not allow us to run individual tests. After collecting the results, we compared them with the commit logs of each project and traced modified files to their regression tests. We did not find any false positives or false negatives in our results. To execute our validation tests, see the section above entitled `Running E2E Tests`.

##### Completed Tasks
* Run `retrospec` on 50 consecutive revisions of `jquery-mobile`
* Run `retrospec` on 50 consecutive revisions of `angular`
* Run `retrospec` on 50 consecutive revisions of `angular-bootstrap`
* Compare results with validation project commit logs.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
