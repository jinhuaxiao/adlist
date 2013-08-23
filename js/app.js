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
  function checkURL(url) {
    var lastPage = $.Panel.visiblePages[$.Panel.visiblePages.length - 1];
    if (lastPage && url === lastPage.id) {
      $.Panel.visiblePages.pop().slideOut();
    }
  }

  // 取页面高度
  $.viewportHeight = document.documentElement.clientHeight - 60;

  var detail = new $.DetailPanel('#detail'),
      list = new $.ListPanel({
        el: '#list',
        detail: detail
      }),
      help = new $.HelpPanel('#help'),
      hasHashchange = 'onhashchange' in window,
      lastURL = '';
  $.detect3DSupport(list.$el);

  Hammer(document.body).on('tap', function (event) {
    if ($.hasClass(event.target, 'help-button')) {
      help.slideIn();
    }
    if ($.hasClass(event.target, 'back-button')) {
      if ($.Panel.visiblePages.length > 0) {
        if (hasHashchange) {
          history.back();
        } else {
          $.Panel.visiblePages.pop().slideOut();
        }
      } else {
        location.href = 'dianjoy:return';
      }
    }
    if ($.hasClass(event.target, 'download-button')
        || $.hasClass(event.target.parentNode, 'download-button')) {
      var target = $.hasClass(event.target, 'download-button') ? event.target : event.target.parentNode;
      showDownloadPanel(target.index);
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
  // disabled click event for back-button
  $('.back-button').addEventListener('click', function (event) {
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

  if (hasHashchange) {
    window.addEventListener('hashchange', function () {
      checkURL(lastURL);
      lastURL = location.hash.substr(2);

      $('.help-button').className = (lastURL === 'help' ? 'hide' : '') + ' help-button';
    });
  }


  // 生成列表
  if (data && config.init) {
    list.render(Handlebars.templates.list(data));
  }
  if (config.refresh) {
    list.refresh();
  }

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-35957679-7', 'dianjoy.com');
  ga('send', 'pageview');
});