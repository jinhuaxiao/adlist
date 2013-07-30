document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  function showDownloadPanel(index) {
    var info = $('#download-panel'),
        item = data.offers[index];
    $('img', info).src = data.serv + item.icon;
    $('.success', info).innerHTML = item.success;
    info.className = 'animated slideDown';
    if ('timeout' in info) {
      clearTimeout(info.timeout);
    }
    info.timeout = setTimeout(hideDownloadPanel, 4000);
  }
  function hideDownloadPanel() {
    var info = $('#download-panel');
    clearTimeout(info.timeout);

    info.className = 'animated slideUp';
  }
  // 这个函数写的真丑
  // 目的是，如果是hashchange，那么正常执行即可
  // 如果不是，则要交换url和lastURL的值，以便后面函数运行
  function checkURL(url) {
    if (!url) {
      url = location.hash.substr(2);
      if (url === lastURL){
        return;
      } else {
        var temp = url;
        url = lastURL;
        lastURL = temp;
      }
    }

    var lastPage = $.Panel.visiblePages[$.Panel.visiblePages.length - 1];
    if (lastPage && url === lastPage.id) {
      $.Panel.visiblePages.pop().slideOut();
    }
    $('.help-button').className = (url === 'help' ? 'hide' : '') + ' help-button';
  }

  // 取页面高度
  $.viewportHeight = document.documentElement.clientHeight - 60;

  var detail = new $.DetailPanel('#detail'),
      list = new $.ListPanel({
        el: '#list',
        detail: detail
      }),
      help = new $.HelpPanel('#help'),
      lastURL = '';
  $.detect3DSupport(list.$el);

  Hammer(document.body).on('tap', function (event) {
    if ($.hasClass(event.target, 'help-button')) {
      help.slideIn();
    }
    if ($.hasClass(event.target, 'back-button')) {
      if ($.Panel.visiblePages.length > 0) {
        history.back();
      } else {
        location.href = 'dianjoy:return';
      }
    }
    if ($.hasClass(event.target, 'download-button')
        || $.hasClass(event.target.parentNode, 'download-button')) {
      var target = $.hasClass(event.target, 'download-button') ? event.target : event.target.parentNode;
      if ('index' in target) {
        showDownloadPanel(target.title);
      }
    }
  });

  document.body.addEventListener('downloadStart', showDownloadPanel);

  // 调试环境下，从页面中取模版
  if (DEBUG) {
    Handlebars.templates = Handlebars.templates || {};
    var template = $('script', list.$el).innerHTML;
    Handlebars.templates.list = Handlebars.compile(template);

    template = $('script', detail.$el).innerHTML;
    Handlebars.templates.detail = Handlebars.compile(template);

    // disabled img drag
    document.body.addEventListener('dragstart', function (event) {
      if (event.target.tagName.toLowerCase() === 'img') {
        event.preventDefault();
        return false;
      }
    });
  }
  // disabled click event
  document.body.addEventListener('click', function (event) {
    event.preventDefault();
    return false;
  });
  // for route
  document.body.addEventListener('webkitAnimationEnd', function (event) {
    if (event.animationName === 'slideIn') {
      location.hash = '#/' + event.target.id;
    } else if (event.animationName === 'slideUp') {
      event.target.className = 'hide';
    }
  });

  if ('onhashchange' in window) {
    window.addEventListener('hashchange', function (event) {
      var index = event.oldURL.indexOf('#/');
      checkURL(index === -1 ? '' : event.oldURL.substr(index + 2));
    });
  } else {
    setInterval(checkURL, 100);
  }


  // 生成列表
  if (data) {
    list.render(Handlebars.templates.list(data));
  }

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-35957679-7', 'dianjoy.com');
  ga('send', 'pageview');
});