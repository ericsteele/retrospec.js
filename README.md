# retrospec.js

A regression test selection tool for JavaScript. Currently under development.

## Project Setup
####This project uses NodeJS
If you do not have NodeJS installed, get it [here](https://nodejs.org/).

####Install dependencies
Project dependencies are managed via [npm](https://www.npmjs.org/):

```bash
$ npm install
```

## Tests
This project uses the [Mocha](https://github.com/mochajs/mocha) testing framework and the [Chai](https://github.com/chaijs/chai) assertion library. It contains unit, integration, and end-2-end (e2e) tests. 

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
This project stores its e2e test scripts in the `retrospec.js/test/e2e` directory. After installing project dependencies, you can execute the e2e scripts using NodeJS:

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

#### [AngularJS](https://github.com/jquery/jquery-mobile/)
Uses the [AngularJS](https://github.com/angular/angular) module loader, [Karma](https://github.com/karma-runner/karma) test runner, and [Jasmine](https://github.com/jasmine/jasmine) testing framework.

#### [Angular UI-Bootstrap](https://github.com/angular-ui/bootstrap)
Uses the [AngularJS](https://github.com/angular/angular) module loader, [Karma](https://github.com/karma-runner/karma) test runner, and [Jasmine](https://github.com/jasmine/jasmine) testing framework.

## Progress

### Completed Tasks

#### Code Module Extraction
This tool  uses the dependency tracking information provided by JavaScript module loaders such as [AngularJS](https://github.com/angular/angular) and [RequireJS](https://github.com/jrburke/requirejs).

#####Tasks
* Automate extraction of `RequireJS` modules from `jquery-mobile` 
* Automate extraction of `AngularJS` modules from `angular` & `angular-bootstrap`

#### Test Suite Extraction
In order to select and execute test suites, this tool must be able to extract test suite metadata from testing frameworks such as [QUnit](https://github.com/jquery/qunit) and  [Jasmine](https://github.com/jasmine/jasmine).

#####Tasks
* Automate extraction of `QUnit` test suites from `jquery-mobile`
* Automate extraction of `Jasmine` test suites from `angular` & `angular-bootstrap`
* Automate extraction of `inline comment` test suite definitions (for ad-hoc use)

#### Regression Test Selection

#####Tasks
* Detect changes to files between revisions by comparing file hashes
* Build a project model using the extracted code module and test suite data
* Store and retrieve project models in JSON files
* Diff project models to identify file adds, edits, deletes, and moves.
* Select regression tests using project model diff results.

#### Project Validation
We validated retrospec's ability to select and execute regression tests by running it over 50 consecutive revisions of 3 OSS projects and inspecting the results.

#####Tasks
* Run retrospec on 50 consecutive revisions of `angular-bootstrap`

### Remaining Tasks
* Run retrospec on 50 consecutive revisions of `jquery-mobile`
* Run retrospec on 50 consecutive revisions of `angular`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_