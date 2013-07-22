document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  function showDownloadPanel(index) {
    var info = $('#download-panel'),
        item = data.offers[index];
    $('img', info).src = item.icon;
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
    if (event.target.className === 'help-button') {
      event.target.className = event.target.className + ' hide';
      help.slideIn();
      return false;
    }
    if (event.target.className === 'back-button' && $.Panel.visiblePages.length > 0) {
      $('.help-button', this).className = 'help-button';
      $.Panel.visiblePages.pop().slideOut();
      return false;
    }
    if (event.target.className === 'close') {
      hideDownloadPanel();
    }
    if (event.target.className === 'download-button'
        || event.target.parentNode.className === 'download-button') {
      var target = event.target.className === 'download-button' ? event.target : event.target.parentNode;
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
  }
  // disabled img drag
  document.body.addEventListener('dragstart', function (event) {
    if (event.target.tagName.toLowerCase() === 'img') {
      event.preventDefault();
      return false;
    }
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

var data = null;