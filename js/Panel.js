/**
 * Created with JetBrains WebStorm.
 * User: Meathill
 * Date: 13-6-19
 * Time: 下午4:52
 * @overview 可以拖拽的面板基类
 * @author Meathill <lujia.zhai@dianjoy.com>
 * @since 0.1.0
 */
;(function () {
  'use strict';

  function onHammer(event) {
    this.offset = event.type === 'touch' ? this.offset || 0 : this.tempOffset;
    if (event.type === 'release' && this.offset > 0) {
      this.className = 'autoback';
      this.offset = 0;
      $.drag(this, 0);
    }
  }
  function onDrag(event) {
    $.drag(this, event.gesture.deltaY);
  }
  function onAnimationEnd() {
    this.className = '';
  }
  function onTransitionEnd() {
    this.className = ''
  }

  var Panel = $.Panel = function (options) {
    this.initialize(options);
  };
  Panel.visiblePages = [];

  Panel.prototype = {
    initialize: function (options) {
      if ($.isString(options)) {
        options = {
          el: options
        };
      }
      var $el = this.$el = $(options.el);
      Hammer($el)
        .on('dragup dragdown', onDrag)
        .on('touch release', onHammer);
      $el.addEventListener('transitionend', onTransitionEnd);
      $el.addEventListener('animationend', onAnimationEnd);
    },
    showDownloadPanel: function () {
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent('downloadStart', true, false);
      this.$el.dispatchEvent(event);
    },
    slideIn: function () {
      this.$el.className = 'animated slideIn';
      Panel.visiblePages.push(this);
    },
    slideOut: function () {
      this.$el.className = 'animated slideOut';
    },
    render: function (code) {
      this.$el.innerHTML = code;
    }
  };
}());