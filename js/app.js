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
    info.timeout = setTimeout(hideDownloadPanel, 5000);
  }
  function hideDownloadPanel() {
    var info = $('#download-panel');
    clearTimeout(info.timeout);

    info.className = 'animated slideUp';
  }

  // 取页面高度
  $.viewportHeight = document.documentElement.clientHeight - 60;

  var detail = new $.DetailPanel('#detail'),
      list = new $.ListPanel({
        el: '#list',
        detail: detail
      }),
      help = new $.HelpPanel('#help');
  $.detect3DSupport(list.$el);

  Hammer(document.body).on('tap', function (event) {
    if ($.hasClass(event.target, 'help-button')) {
      help.slideIn();
    }
    if ($.hasClass(event.target, 'back-button') && $.Panel.visiblePages.length > 0) {
      history.back();
    }
    if ($.hasClass(event.target, 'close')) {
      hideDownloadPanel();
    }
    if ($.hasClass(event.target, 'download-button')
        || $.hasClass(event.target.parentNode, 'download-button')) {
      var target = $.hasClass(event.target, 'download-button') ? event.target : event.target.parentNode;
      if ('dataset' in target) {
        var index = target.dataset.index;
        showDownloadPanel(index);
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

    // disabled click event
    document.body.addEventListener('click', function (event) {
      event.preventDefault();
      return false;
    });
    // disabled img drag
    document.body.addEventListener('dragstart', function (event) {
      if (event.target.tagName.toLowerCase() === 'img') {
        event.preventDefault();
        return false;
      }
    });
  }
  // for route
  document.body.addEventListener('webkitAnimationEnd', function (event) {
    var length = $.Panel.visiblePages.length;
    if (event.animationName === 'slideIn') {
      location.hash = '#/' + event.target.id;
      $('.back-button').href = '#/' + (length > 1 ? $.Panel.visiblePages[length - 1].id : 'home');
    } else if (event.animationName === 'slideOut') {
      if (length === 0) {
        $('.back-button').href = 'dianjoy:return';
      } else {
        $('.back-button').href = '#/' + (length > 1 ? $.Panel.visiblePages[length - 1].id : 'home');
      }
    }
  });
  window.addEventListener('hashchange', function (event) {
    var lastPage = $.Panel.visiblePages[$.Panel.visiblePages.length - 1],
        url = event.oldURL.substr(event.oldURL.indexOf('#/') + 2);
    if (lastPage && url === lastPage.id) {
      $.Panel.visiblePages.pop().slideOut();
    }

    $('.help-button').className = (location.hash === '#/help' ? 'hide' : '') + ' help-button';
  });

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