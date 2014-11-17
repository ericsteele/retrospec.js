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
					quiet: false, // Optionally suppress output to standard out (defaults to false)
					timeout: 10000
				},
				src: ['test/**/*.spec.js']
			}
		}
		// retrospec: {
		// 	filePattern: '/*/*.js',
		// 	depth: 1, // How many levels deep in the dependency tree to test
		// 	          // e.g. X depends on Y depends on Z.  If Z changes:
		// 	          //      1: run tests related to Z
		// 	          //      2: run tests related to Z and/or Y
		// 	          //      3: run tests related to Z and/or Y and/or X
		// 	filePath: 'some/where', // Where metadata and other information will be saved
		// 	                        //  defaults to .retrospec/
		// 	mochaTest: {
		// 		test: {
		// 			options: {
		// 				reporter: 'spec',
		// 				//captureFile: 'results.txt', // Optionally capture the reporter output to a file
		// 				quiet: false, // Optionally suppress output to standard out (defaults to false)
		// 				timeout: 10000
		// 			},
		// 			src: ['test/**/*.spec.js']
		// 		}
		// 	}
		// }
	});

	grunt.registerTask('default', 'mochaTest');

};