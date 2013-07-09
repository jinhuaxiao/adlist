/**
 * Date: 13-6-19
 * Time: 下午6:20
 * @overview 详情页
 * @author Meathill <lujia.zhai@dianjoy.com>
 * since 0.1.0
 */
;(function () {
  'use strict';

  var detail = $.DetailPanel = function (options) {
    $.Panel.call(this, options);

    Hammer(this.$el).on('tap', $.bind(function () {
      if (event.target.className == 'download-button') {
        this.showDownloadPanel();
      }
    }, this));
  };

  $.inherite(detail, $.Panel);

  $.extend(detail.prototype, {
    showDownloadPanel: function () {
      var event = document.createEvent('CustomEvent'),
        src = $('img', this.$el).src;
      event.initCustomEvent('downloadStart', true, false, {
        index: this.index,
        src: src
      });
      this.$el.dispatchEvent(event);
    },
    render: function (code) {
      $.Panel.prototype.render.call(this, code);
      this.container = this.$el.firstElementChild;
    },
    setTransform: function (offset) {
      this.container.style.WebkitTransform = $.has3D ? "translate3d(0, " + offset + "px, 0) scale3d(1, 1, 1)"
        : "translate(0, " + offset + ")";
    },
    onHammer: function (event) {
      this.offset = event.type === 'touch' ? this.offset || 0 : this.tempOffset;
      if (event.type === 'release' && (this.offset > 0 || this.offset < this.bottom)) {
        var isDown = event.gesture.direction == Hammer.DIRECTION_DOWN;
        this.container.className = 'container autoback';
        this.offset = isDown ? 0 : this.bottom;
        this.setTransform(isDown ? 0 : this.bottom);
      }
    },
    onTransitionEnd: function () {
      this.firstElementChild.className = 'container';
    }
  });


}());