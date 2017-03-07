
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-shell');

  grunt.initConfig({

    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {\%= __ngModule %}',
        name: 'citytaps',
      },
      // Environment targets
      development: {
        options: {
          dest: 'app/assets/config.js',
          deps: false
        },
        constants: {
          apiURL: '//localhost:8080',
          googleAnalyticsId : 'UA-91267633-1'
        }
      },
      production: {
        options: {
          dest: 'app/assets/config.js',
          deps: false
        },
        constants: {
          apiURL: 'https://api.citytaps.org',
          googleAnalyticsId : 'UA-90205232-2'
        }
      }
    },
    shell: {
      options: {
          stderr: false
      },
      target: {
          command: 'brunch w'
      },
      deploy: {
        options: { stdout: true },
        command: 'brunch build --production'
      }
    }
  });


  grunt.registerTask('default', [
    'ngconstant:development', // ADD THIS
    'shell'
  ]);

  grunt.registerTask('build', function() {
    
    var tasks = [
      'ngconstant:production', // ADD THIS
      'shell:deploy'
    ];
    grunt.option('force', true);
    grunt.task.run(tasks);
  });
};