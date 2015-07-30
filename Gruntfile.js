module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      // options: {
      //   separator: ';',
      // },

      basic:  {
        src: ['./public/lib/underscore.js', 
              './public/lib/handlebars.js', 
              './public/lib/jquery.js', 
              './public/lib/backbone.js'
             ],

        dest: './public/dist/built.js',
      },

      extras:  {
        src: ['./public/client/app.js', 
              './public/client/link.js', 
              './public/client/links.js', 
              './public/client/linkView.js',
              './public/client/linksView.js', 
              './public/client/createLinkView.js', 
              './public/client/router.js'
             ],

        dest: './public/dist/backboneApp.js',
      }

    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          './public/dist/built.js': ['./public/dist/built.js'],
          './public/dist/backboneApp.js': ['./public/dist/backboneApp.js']
        }
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        './**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js',
          'node_modules/**/*.js'
        ]
      }
    },

    cssmin: {
        // Add filespec list here
      target: {
        files: {
          './public/dist/style.css': ['./public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('build', [
    'jshint',
    'mochaTest',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('dev', [

  ]);

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['build']);
    } else {
      grunt.task.run(['build','server-dev']);
    }
  });

  grunt.registerTask('deploy', [
      'upload'
  ]);




};
