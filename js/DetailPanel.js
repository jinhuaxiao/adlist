/**
 * Date: 13-6-19
 * Time: 下午6:20
 * @overview 详情页
 * @author Meathill <lujia.zhai@dianjoy.com>
 * since 0.1.0
 */
;(function () {
  'use strict';

  function startCarousel(event) {
    touch.start = event.touches[0].pageX;
    touch.offset = this.scrollLeft;
    this.addEventListener('touchmove', moveCarousel, false);
  }
  function moveCarousel(event) {
    var offset = touch.offset - (event.touches[0].pageX - touch.start);
    offset *= window.devicePixelRatio;
    offset = offset > touch.max ? touch.max : offset;
    offset = offset < 0 ? 0 : offset;
    this.scrollLeft = offset;
  }
  function cancelCarousel() {
    this.removeEventListener('touchmove', moveCarousel);
  }

  var touch = {
    start: 0,
    offset: 0,
    max: 0
  };
  var detail = $.DetailPanel = function (options) {
    $.Panel.call(this, options);
  };

  $.inherit(detail, $.Panel);

  $.extend(detail.prototype, {
    prepare: function () {
      this.wrapper.className = 'wrapper';
      if (this.scroll) {
        this.scroll.destroy();
      }
      this.scroll = new IScroll(this.wrapper, this.getScrollType());
    },
    render: function (code) {
      if (this.carousel) {
        this.carousel.removeEventListener('touchstart', startCarousel);
        this.carousel.removeEventListener('touchend', cancelCarousel);
        this.carousel.removeEventListener('touchcancel', cancelCarousel);
      }
      this.wrapper.innerHTML = code;
      this.carousel = $('.carousel', this.wrapper);
      this.carousel.addEventListener('touchstart', startCarousel, false);
      this.carousel.addEventListener('touchend', cancelCarousel, false);
      this.carousel.addEventListener('touchcancel', cancelCarousel, false);
      var carousel = this.carousel;
      setTimeout(function () {
        touch.max = carousel.scrollWidth - carousel.clientWidth;
      }, 10);

      $('a', this.wrapper).index = this.index;
      this.prepare();
    }
  });
}());