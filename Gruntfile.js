module.exports = function(grunt) {

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          //captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false,   // Optionally suppress output to standard out (defaults to false)
          timeout: 10000
        },
        src: ['test/**/*.spec.js', '!test/input/**/*.spec.js']
      }
    }
    // Example configuration for 'jquery-mobile'.
    //
    // retrospec: {
    //   src: {
    //     blobs:     ['js/**/*.js'], 
    //     extractor: retrospec.requirejs,
    //     config:    './js/requirejs.config.js' // path or object
    //   },
    //   tests: {
    //     blobs:     ['tests/**/*.html'],                 // blobs used to identify test files
    //     extractor: require('./jqm-test-extractor.js'),  // test suite extraction logic
    //     executor:  require('./jqm-test-executor.js')    // executes tests
    //   }
    // }
  });

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['mochaTest']);

};