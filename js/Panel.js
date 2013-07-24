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
  function onAnimationEnd(event) {
    this.className = event.animationName === 'slideOut' ? 'hide' : '';
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
      Hammer($el, {
        drag_block_vertical: true,
        swipe: false
      })
        .on('dragup dragdown', $.bind(this.onDrag, this))
        .on('touch release', $.bind(this.onHammer, this));
      $el.addEventListener('transitionend', this.onTransitionEnd, false);
      $el.addEventListener('webkitAnimationEnd', onAnimationEnd, false);
    },
    render: function (code) {
      this.$el.innerHTML = code;
      var self = this;
      setTimeout(function () {
        self.bottom = $.viewportHeight - self.$el.scrollHeight;
      }, 0);
    },
    setPanelOffset: function (offset) {
      offset += this.offset;
      this.tempOffset = offset;
      if (offset > 0) {
        offset *= 0.4;
        offset = offset > 60 ? 60 : offset;
      } else if (offset < this.bottom) {
        offset = this.bottom + (offset - this.bottom) * 0.4;
        offset = offset < this.bottom - 60 ? this.bottom - 60 : offset;
      }
     this.setTransform(offset);
    },
    setTransform: function (offset) {
      this.$el.style.WebkitTransform = $.has3D ? "translate3d(0, " + offset + "px, 0) scale3d(1, 1, 1)"
        : "translate(0, " + offset + ")";
    },
    showDownloadPanel: function (src) {
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent('downloadStart', true, false, {src: src});
      this.$el.dispatchEvent(event);
    },
    slideIn: function () {
      this.$el.className = 'animated slideIn';
      Panel.visiblePages.push(this);
    },
    slideOut: function () {
      this.$el.className = 'animated slideOut';
    },
    onDrag: function (event) {
      this.setPanelOffset(event.gesture.deltaY);
      event.gesture.preventDefault();
    },
    onHammer: function (event) {
      this.offset = event.type === 'touch' ? this.offset || 0 : this.tempOffset;
      if (event.type === 'release') {
        var isDown = event.gesture.direction === Hammer.DIRECTION_DOWN;
        if(this.offset > 0 || this.offset < this.bottom) {
          this.$el.className = 'autoback';
          this.offset = isDown ? 0 : this.bottom;
          this.setTransform(isDown ? 0 : this.bottom);
        } else {
          var offset = this.offset + (isDown ? -1 : 1) * event.gesture.velocityY * 80;
          offset = offset > 0 ? 0 : offset;
          offset = offset < this.bottom ? this.bottom : offset;
          this.$el.className = 'momentum';
          this.setTransform(offset);
          this.offset = offset;
        }
      }
    },
    onTransitionEnd: function () {
      this.className = ''
    }
  };
}());