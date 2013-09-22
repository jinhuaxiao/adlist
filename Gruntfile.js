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
      EN = '<script src="js/app-en.min.js"></script>',
      BASIC = '<script src="js/basic.min.js"></script>', // 模板中不包含img
      SDK_JS = '<script src="data.js"></script>',
      REPLACE_TOKEN = /<!-- replace start -->[\S\s]+<!-- replace over -->/,
      TPL_TOKEN = /{{#(\w+)}}[\S\s]+{{\/\1}}/gm,
      SERV = 'http://a.dianjoy.com/dev/api/adlist/',
      HEADER_TOKEN = '<!-- header -->';

  function convertToMustache(str) {
    var stack = [],
        reg = /{{([#\/]?)(\w+)?\s?(..\/)?(\w+)?}}/g;
    str = str.replace(reg, function (match, pre, helper, path, key) {
      if (pre === '#') {
        stack.push({
          type: helper,
          key: key
        });
      }
      if (pre === '/') {
        var obj = stack.pop();
        if (obj.type === helper) {
          key = obj.key;
        } else {
          throw new Error('match error');
        }
      }
      if (helper === 'else') {
        var obj = stack[stack.length - 1];
        return '{{/' + obj.key + '}}{{^' + obj.key + '}}';
      }
      key = key || helper;
      return '{{' + pre + key + '}}';
    });
    return str;
  }
  function wrapJS(str) {
    return '<script>' + str + '</script>';
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      start: [build],
      end: [temp, build + 'index.html', build + 'index-en.html']
    },
    concat: {
      options: {
        separator: ';'
      },
      libs: {
        src: ['js/libs/iscroll-probe.js', 'js/libs/handlebars.runtime.js'],
        dest: temp + 'js/libs.js'
      },
      apps: {
        src: [temp + 'js/templates.js', 'js/dollar.js', 'js/Panel.js', 'js/DetailPanel.js', 'js/HelpPanel.js', 'js/ListPanel.js', 'js/app.js'],
        dest: temp + 'js/app.js'
      },
      basic: {
        src: [temp + 'js/templates-basic.js', 'js/dollar.js', 'js/Panel.js', 'js/DetailPanel.js', 'js/HelpPanel.js', 'js/ListPanel.js', 'js/app.js'],
        dest: temp + 'js/basic.js'
      },
      sdk: {
        src: [temp + 'js/templates-sdk.js', 'js/dollar.js', 'js/Panel.js', 'js/DetailPanel.js', 'js/HelpPanel.js', 'js/ListPanel.js', 'js/app.js'],
        dest: temp + 'js/app-sdk.js'
      },
      en: {
        src: [temp + 'js/templates-en.js', 'js/dollar.js', 'js/Panel.js', 'js/ListPanel.js', 'js/app-en.js'],
        dest: temp + 'js/app-en.js'
      },
      ensdk: {
        src: [temp + 'js/templates-en-sdk.js', 'js/dollar.js', 'js/Panel.js', 'js/ListPanel.js', 'js/app-en.js'],
        dest: temp + 'js/app-en-sdk.js'
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
        },
        report: 'gzip'
      },
      web: {
        files: [
          {src: [temp + 'js/libs.js', temp + 'js/app.js'], dest: build + 'js/app.min.js'},
          {src: [temp + 'js/libs.js', temp + 'js/basic.js'], dest: build + 'js/basic.min.js'},
          {src: [temp + 'js/libs.js', temp + 'js/app-en.js'], dest: build + 'js/app-en.min.js'}
        ]
      },
      sdk: {
        files: [
          {src: [temp + 'js/libs.js', temp + 'js/app-sdk.js'], dest: build + 'js/app.min.js'},
          {src: [temp + 'js/libs.js', temp + 'js/app-en-sdk.js'], dest: build + 'js/app-en.min.js'}
        ]
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      minify: {
        files: [
          {src: ['css/style.css', 'css/full.css', 'css/animate.css'], dest: build + 'css/style.css'},
          {src: ['css/style.css', 'css/full.css', 'css/xs.css', 'css/animate.css'], dest: build + 'css/xs.css'},
          {src: ['css/style.css'], dest: build + 'css/style-en.css'}
        ]
      }
    },
    extract: {
      web: {
        src: 'index.html',
        dest: temp + 'index.html',
        names: ['list', 'detail']
      },
      basic: {
        src: 'index.html',
        dest: temp + 'basic.html',
        names: ['list', 'detail'],
        isBasic: true
      },
      sdk: {
        src: 'index.html',
        isSDK: true,
        dest: build + 'index.html',
        names: ['list', 'detail']
      },
      en: {
        src: 'index-en.html',
        dest: temp + 'index-en.html',
        names: ['list-en']
      },
      ensdk: {
        src: 'index-en.html',
        isSDK: true,
        dest: build + 'index-en.html',
        names: ['list-en']
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
          processName: function (filename) {
            return filename.match(/detail|list/)[0];
          },
          processContent: function (content) {
            content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
            content = content.replace(/[\r\n]/g, '');
            content = content.replace(/\s{2,}/g, '\s');
            return content;
          }
        },
        files: [
          {
            src: [
              temp + 'templates/list.html',
              temp + 'templates/detail.html'
            ],
            dest: temp + 'js/templates.js'
          },
          {
            src: [
              temp + 'templates/list-basic.html',
              temp + 'templates/detail-basic.html'
            ],
            dest: temp + 'js/templates-basic.js'
          },
          {
            src: [
              temp + 'templates/list-sdk.html',
              temp + 'templates/detail-sdk.html'
            ],
            dest: temp + 'js/templates-sdk.js'
          },
          {src: temp + 'templates/list-en.html', dest: temp + 'js/templates-en.js'},
          {src: temp + 'templates/list-en-sdk.html', dest: temp + 'js/templates-en-sdk.js'}
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
          from: HEADER_TOKEN,
          to: grunt.file.read('add-ons/header.html')
        }, {
          from: REPLACE_TOKEN,
          to: JS
        }, {
          from: '"list-wrapper" class="wrapper hide"',
          to: '"list-wrapper" class="wrapper"'
        }, {
          from: '{{datetime}}',
          to: grunt.template.today('yyyy-mm-dd HH:MM:ss')
        }]
      },
      basic: {
        src: [temp + 'basic.html'],
        dest: build + 'templates/template-basic.html',
        replacements: [{
          from: HEADER_TOKEN,
          to: grunt.file.read('add-ons/header.html')
        },{
          from: REPLACE_TOKEN,
          to: BASIC
        }, {
          from: '"list-wrapper" class="wrapper hide"',
          to: '"list-wrapper" class="wrapper"'
        }, {
          from: '{{datetime}}',
          to: grunt.template.today('yyyy-mm-dd HH:MM:ss')
        }]
      },
      xs: {
        src: [temp + 'index.html'],
        dest: build + 'templates/template-xs.html',
        replacements: [{
          from: 'style.css',
          to: 'xs.css'
        }, {
          from: REPLACE_TOKEN,
          to: JS
        }, {
          from: '{{datetime}}',
          to: grunt.template.today('yyyy-mm-dd HH:MM:ss')
        }]
      },
      sdk: {
        src: [build + 'index.html'],
        overwrite: true,
        replacements: [{
          from: REPLACE_TOKEN,
          to: JS
        }, {
          from: TPL_TOKEN,
          to: ''
        }, {
          from: '{{datetime}}',
          to: grunt.template.today('yyyy-mm-dd HH:MM:ss')
        }]
      },
      en: {
        src: [temp + 'index-en.html'],
        dest: build + 'templates/template-en.html',
        replacements: [{
          from: REPLACE_TOKEN,
          to: EN
        }, {
          from: '"list-wrapper" class="wrapper hide"',
          to: '"list-wrapper" class="wrapper"'
        }, {
          from: 'style.css',
          to: 'style-en.css'
        }]
      },
      ensdk: {
        src: [build + 'index-en.html'],
        overwrite: true,
        replacements: [{
          from: REPLACE_TOKEN,
          to: EN
        }, {
          from: TPL_TOKEN,
          to: ''
        }, {
          from: 'style.css',
          to: 'style-en.css'
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
        files: [{
          src: [build + 'index.html', build + 'css/style.css', build + 'js/app.min.js', build + 'img/*'],
          dest: ''}]
      },
      en: {
        options: {
          archive: build + 'sdk-en.zip',
          mode: 'zip',
          pretty: true
        },
        files: [{
          src: [build + 'index-en.html', build + 'css/style-en.css', build + 'js/app-en.min.js', build + 'img/*'],
          dest: ''
        }]
      }
    }
  });

  grunt.registerMultiTask('extract', 'Extract templates.', function () {
    var src = this.data.src,
        dest = this.data.dest,
        names = this.data.names,
        isSDK = this.data.isSDK,
        isBasic = this.data.isBasic,
        content = grunt.file.read(src),
        REG = /<script type="text\/handlebars-template">([\s\S]+?)<\/script>/mg,
        index = 0;
    content = content.replace(REG, function (match, template) {
      var filename = names[index];
      if (isSDK) {
        filename += '-sdk';
        template = template.replace(/\{\{download\}\}/g, SERV + '{{download}}');
      }
      if (isBasic) {
        filename += '-basic';
        template = template.replace(/<img .*\/>/, '');
        template = template.replace(/<div class="carousel">[\s\S]+?<\/div>/, '');

      }
      grunt.file.write(temp + 'templates/' + filename + '.html', template);
      index++;
      return (!isSDK && /list/.test(filename)) ? convertToMustache(template) : '';
    });
    if (isSDK) {
      content = content + SDK_JS;
    } else {
      var footer = grunt.file.read('js/data.js');
      content += wrapJS(footer);
    }
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
  grunt.registerTask('default', ['clean:start', 'extract', 'replace', 'handlebars', 'concat', 'uglify:sdk', 'cssmin', 'copy', 'compress', 'uglify:web', 'clean:end']);
  grunt.registerTask('debug', ['clean', 'extract']);
}