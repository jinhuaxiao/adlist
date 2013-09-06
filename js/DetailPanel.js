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

    this.id = this.wrapper.id;
  };

  $.inherit(detail, $.Panel);

  $.extend(detail.prototype, {
    getScrollType: function () {
      return {
        mouseWheel: false,
        tap: true
      };
    },
    render: function (code) {
      this.wrapper.innerHTML = code;
      this.$el = this.wrapper.firstElementChild;
      this.carousel = $('.carousel', this.$el);
      $('.download-button', this.wrapper).index = this.index;
      this.prepare();
    },
    slideIn: function () {
      this.wrapper.className = 'wrapper animated slideIn';
      $.Panel.visiblePages.push(this);
    }
  });
}());