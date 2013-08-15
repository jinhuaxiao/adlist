/**
 * Created with JetBrains WebStorm.
 * User: tekirokei
 * Date: 13-6-18
 * Time: 下午4:46
 * compile the files and make them better
 */
module.exports = function (grunt) {
  var build = 'build/',
      temp = 'temp/',
      JS = '<script src="js/app.min.js"></script>',
      BASIC = '<script src="js/basic.min.js"></script>', // 模板中不包含img
      REPLACE_TOKEN = /<!-- replace start -->[\S\s]+<!-- replace over -->/;


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
        src: ['js/libs/hammer.min.js', 'js/libs/handlebars.runtime.js'],
        dest: temp + 'js/libs.js'
      },
      apps: {
        src: [temp + 'js/templates.js', 'js/dollar.js', 'js/Panel.js', 'js/DetailPanel.js', 'js/HelpPanel.js', 'js/ListPanel.js', 'js/app.js'],
        dest: temp + 'js/app.js'
      },
      basic: {
        src: [temp + 'js/templates-basic.js', 'js/dollar.js', 'js/Panel.js', 'js/DetailPanel.js', 'js/HelpPanel.js', 'js/ListPanel.js', 'js/app.js'],
        dest: temp + 'js/basic.js'
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
          {src: [temp + 'js/libs.js', temp + 'js/app.js'], dest: build + '/js/app.min.js'},
          {src: [temp + 'js/libs.js', temp + 'js/basic.js'], dest: build + '/js/basic.min.js'}
        ]
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      minify: {
        files: [
          {src: ['css/style.css', 'css/animate.css'], dest: build + 'css/style.css'},
          {src: ['css/style.css', 'css/xs.css', 'css/animate.css'], dest: build + 'css/xs.css'}
        ]
      }
    },
    extract: {
      templates: {
        src: 'index.html',
        dest: temp + 'index.html',
        names: ['list', 'detail']
      }
    },
    handlebars: {
      compile: {
        options: {
          partialsUseNamespace: true,
          namespace: 'Handlebars.templates',
          compilerOptions:{
            knownHelpers: {
              'if': true,
              'each': true
            },
            knownHelpersOnly: true
          },
          processName: function(filename) {
            var isBasic = filename.indexOf('-basic') !== -1;
            return filename.substring(filename.lastIndexOf('/') + 1, filename.lastIndexOf(isBasic ? '-basic' : '.'));
          }
        },
        files: [
          {src: temp + 'templates/*.html', dest: temp + 'js/templates.js'},
          {src: temp + 'templates/*-basic.html', dest: temp + 'js/templates-basic.js'}
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
        src: [temp + 'index.html'],
        dest: build + 'templates/template.html',
        replacements: [{
          from: REPLACE_TOKEN,
          to: JS
        }]
      },
      basic: {
        src: [temp + 'index.html'],
        dest: build + 'templates/template-basic.html',
        replacements: [{
          from: REPLACE_TOKEN,
          to: BASIC
        }]
      },
      xs: {
        src: [temp + 'index.html'],
        dest: build + 'templates/template-xs.html',
        replacements: [{
          from: 'style.css',
          to: 'xs.css'
        }]
      }
    },
    compress: {
      sdk: {
        options: {
          archive: build + 'sdk.zip',
          mode: 'zip',
          pretty: true
        },
        files: [
          {src: [build + '**'], dest: '/'}
        ]
      }
    }
  });

  grunt.registerMultiTask('extract', 'Extract templates.', function () {
    var src = this.data.src,
        dest = this.data.dest,
        names = this.data.names,
        content = grunt.file.read(src),
        REG = /<script type="text\/handlebars-template">([\s\S]+?)<\/script>/mg,
        index = 0;
    content = content.replace(REG, function (match, template) {
      var basic = template.replace(/<img .*\/>/, '');
      basic = basic.replace(/<div class="carousel">[\s\S]+?<\/div>/, '');
      grunt.file.write(temp + 'templates/' + names[index] + '.html', template);
      grunt.file.write(temp + 'templates/' + names[index] + '-basic.html', basic);
      index++;
      return '';
    });
    grunt.file.write(dest, content);
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.registerTask('default', ['clean:start', 'extract', 'replace', 'handlebars', 'concat', 'uglify', 'cssmin', 'copy', 'compress', 'clean:end']);
}