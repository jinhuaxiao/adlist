document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode;
  }

  // 取页面高度
  $.viewportHeight = document.documentElement.clientHeight - 60;

  var list = new $.ListPanel({
        wrapper: '#list-wrapper'
      }),
      hasHashchange = 'onhashchange' in window;

  var touch = {};
  $('header').addEventListener('touchstart', function (event) {
    touch.el = parentIfText(event.touches[0].target);
    touch.x = event.touches[0].pageX;
    touch.y = event.touches[0].pageY;
    touch.last = Date.now();
    event.preventDefault();
  }, false);
  $('header').addEventListener('touchend', function (event) {
    if (Date.now() - touch.last > 200) {
      return;
    }
    if (event.touches.length > 0) {
      var t = event.touches[0];
      if (touch.el !== t.target || Math.abs(touch.x - t.pageX) > 6 || Math.abs(touch.y - t.pageY) > 6) {
        return;
      }
    }

    setTimeout(function () {
      var evt = document.createEvent('Event');
      evt.initEvent('tap', true, true);
      touch.el.dispatchEvent(evt);
      touch = {};
    }, 0);
  }, false);
  document.addEventListener('tap', function (event) {
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
  }, false);

  // 调试环境下，从页面中取模版
  if (DEBUG) {
    Handlebars.templates = Handlebars.templates || {};
    var template = $('script', list.$el).innerHTML;
    Handlebars.templates.list = Handlebars.compile(template);
  }

  // disabled click event for back-button
  $('.back-button').addEventListener('click', function (event) {
    event.preventDefault();
    return false;
  }, false);


  // 生成列表
  if (data && config.init) {
    $('#money').innerHTML = data.money;
    list.render(Handlebars.templates.list(data));
  } else {
    list.prepare();
  }
  if (config.refresh) {
    list.refresh();
  }

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-35957679-8', 'dianjoy.com');
  ga('send', 'pageview');
});

document.addEventListener('dragstart', function (event) { event.preventDefault(); }, false);
document.addEventListener('touchmove', function (event) { event.preventDefault(); }, false);
window.devicePixelRatio = window.devicePixelRatio || 1;