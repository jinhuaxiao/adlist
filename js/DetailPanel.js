/**
 * Date: 13-6-19
 * Time: 下午6:20
 * @overview 详情页
 * @author Meathill <lujia.zhai@dianjoy.com>
 * since 0.1.0
 */
;(function () {
  'use strict';

  var max = 0;

  var detail = $.DetailPanel = function (options) {
    $.Panel.call(this, options);

    Hammer(this.$el, {
      hold: false,
      prevent_default: true,
      prevent_mouseevents: true,
      swipe: false,
      tap: false,
      transform: false
    }).on('dragleft dragright', $.bind(this.onCarousel, this));

    this.parent = this.$el;
  };

  $.inherit(detail, $.Panel);

  $.extend(detail.prototype, {
    render: function (code) {
      var self = this;
      this.offset = 0;
      this.parent.innerHTML = code;
      this.$el = this.parent.firstElementChild;
      this.carousel = $('.carousel', this.$el);
      $('.download-button', this.parent).index = this.index;
      setTimeout(function () {
        max = self.carousel.scrollWidth - self.carousel.clientWidth;
        self.bottom = $.viewportHeight - self.$el.scrollHeight;
      }, 10);
    },
    slideIn: function () {
      this.parent.className = 'animated slideIn';
      $.Panel.visiblePages.push(this);
    },
    slideOut: function () {
      this.parent.className = 'animated slideOut';
    },
    onCarousel: function (event) {
      var offset = this.carouselLeft - event.gesture.deltaX;
      offset = offset > max ? max : offset;
      offset = offset < 0 ? 0 : offset;
      this.carousel.scrollLeft = offset;
      event.stopPropagation();
      event.preventDefault();
      event.gesture.stopPropagation();
      event.gesture.preventDefault();
    },
    onTouch: function () {
      $.Panel.prototype.onTouch.call(this);
      this.carouselLeft = this.carousel.scrollLeft;
    }
  });
}());