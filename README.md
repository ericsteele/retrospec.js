# retrospec.js

A regression test selection tool for JavaScript. Currently under development.

## Completed Tasks
* automate extraction of RequireJS modules from 'jquery-mobile' 
* automate extraction of AngularJS modules from 'angular' & 'angular-bootstrap'
* automate extraction of QUnit tests from 'jquery-mobile'
* automate extraction of Jasmine tests from 'angular' & 'angular-bootstrap'
* automate extraction of RequireJS config from 'jquery-mobile'
* automate extraction of inline comment test suite definitions 
* detect changes to files by comparing hashes
* build a project model using the extracted module and test data
* store and retrieve project models in JSON files
* diff project models
* select regression tests for 'angular'
* select regression tests for 'jquery-mobile'

## Remaining Tasks
* select regression tests for 'angular-bootstrap' <------ WE ARE HERE
* execute selected tests
* wrap it in a nice interface
* grunt plugin?

##This project uses Node
If you do not have NodeJS installed, get it [here](https://nodejs.org/).

##Install dependencies:
Project dependencies are managed via [npm](https://www.npmjs.org/):

```bash
$ npm install
```

## Tests
To run the test suite, first install dependencies, then run:

```bash
$ npm test
```

or

```bash
$ grunt test
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_