/**
 * Created with JetBrains WebStorm.
 * User: tekirokei
 * Date: 13-6-18
 * Time: 下午4:46
 * compile the files and make them better
 */
module.exports = function (grunt) {
  var build = 'build/',
      temp = 'temp/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      start: [build],
      end: [temp]
    },
    concat: {
      options: {
        separator: ';'
      },
      libs: {
        src: ['js/libs/hammer.min.js', 'js/libs/handlebars.runtim.js'],
        dest: temp + 'js/libs.js'
      },
      apps: {
        src: ['js/dollar.js', 'js/Panel.js', 'js/DetailPanel.js', 'js/HelpPanel.js', 'js/ListPanel.js', 'js/app.js', temp + 'templates.js'],
        dest: temp + 'js/app.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        compress: {
          global_defs: {
            'DEBUG': false
          },
          dead_code: true
        }
      },
      build: {
        files: [
          {src: [temp + 'js/*.js'], dest: build + '/js/app.min.js'}
        ]
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      minify: {
        files: [
          {src: ['css/*.css'], dest: build + 'css/style.css'}
        ]
      }
    },
    extract: {
      templates: {
        file: 'build/index.html',
        names: ['list', 'detail', 'panel']
      }
    },
    handlebars: {
      compile: {
        options: {
          partialsUseNamespace: true,
          namespace: 'Handlebars.templats',
          compilerOptions:{
            knownHelpers: {
              'if': true,
              'each': true
            },
            knownHelpersOnly: true
          },
          processName: function(filename) {
            return filename.substring(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
          }
        },
        files: [
          {src: temp + 'templates/*.html', dest: temp + 'js/templates.js'}
        ]
      }
    },
    copy: {
      img: {
        files: [{
          expand: true,
          cwd: 'img/',
          src: ['**'],
          dest: build + 'img/',
          filter: function (src) {
            return src.substr(src.lastIndexOf('.') + 1) !== 'db';
          }
        }]
      }
    },
    replace: {
      html: {
        src: ['index.html'],
        dest: build,
        replacements: [
          {
            from: /<!-- replace start -->[\S\s]+<!-- replace over -->/,
            to: '<link rel="stylesheet" href="css/style.css" />\n<script src="js/app.min.js"></script>'
          }
        ]
      }
    }
  });

  grunt.registerMultiTask('extract', 'Extract templates.', function () {
    var file = this.data.file,
        names = this.data.names,
        content = grunt.file.read(file),
        reg = /<script type="text\/handlebars-template">([\s\S]+?)<\/script>/mg,
        index = 0;
    content = content.replace(reg, function (match, template) {
      grunt.file.write(temp + 'templates/' + names[index] + '.html', template);
      index++;
      return '';
    });
    grunt.file.write(file, content);
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.registerTask('default', ['clean:start', 'replace', 'extract', 'handlebars', 'concat', 'uglify', 'cssmin', 'copy', 'clean:end']);
}