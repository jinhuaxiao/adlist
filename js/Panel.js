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
    if (event.type === 'release' && (this.offset > 0 || this.offset < this.bottom)) {
      var isDown = event.gesture.direction == Hammer.DIRECTION_DOWN;
      this.className = 'autoback';
      this.offset = isDown ? 0 : this.bottom;
      setPanelOffset(this, isDown ? 0 : this.bottom, !isDown);
    }
  }
  function onDrag(event) {
    setPanelOffset(this, event.gesture.deltaY);
  }
  function onAnimationEnd(event) {
    this.className = event.animationName === 'slideOut' ? 'hide' : '';
  }
  function onTransitionEnd(event) {
    console.log(event);
    this.className = ''
  }
  function setPanelOffset(target, offset, isNew) {
    target.tempOffset = offset;
    offset += isNew ? 0 : target.offset;
    if (offset > 0) {
      offset *= 0.4;
      offset = offset > 60 ? 60 : offset;
    } else if (offset < target.bottom) {
      offset = target.bottom + (offset - target.bottom) * 0.4;
      offset = offset < target.bottom - 60 ? target.bottom - 60 : offset;
    }
    target.style.WebkitTransform = $.has3D ? "translate3d(0, " + offset + "px, 0) scale3d(1, 1, 1)"
      : "translate(0, " + offset + ")";
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
      $el.addEventListener('webkitAnimationEnd', onAnimationEnd, false);
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
      this.$el.bottom = $.viewportHeight - this.$el.scrollHeight;
    }
  };
}());