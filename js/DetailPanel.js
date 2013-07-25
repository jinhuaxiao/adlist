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

    Hammer(this.$el, {
      drag_block_horizontal: true,
      drag_lock_to_axis: true,
      drag_min_distance: 5,
      hold: false,
      prevent_default: true,
      prevent_mouseevents: true,
      swipe: false,
      tap: false,
      transform: false
    }).on('dragleft dragright', $.bind(this.onCarousel, this));
  };

  $.inherit(detail, $.Panel);

  $.extend(detail.prototype, {
    checkPosition: function (isDown) {
      if (this.offset > 0 || this.offset < this.bottom) {
        this.container.className = 'container autoback';
        this.offset = isDown ? 0 : this.bottom;
        this.setTransform(isDown ? 0 : this.bottom);
      } else {
        var offset = this.offset + (isDown ? 1 : -1) * event.gesture.velocityY * 80;
        offset = offset > 0 ? 0 : offset;
        offset = offset < this.bottom ? this.bottom : offset;
        this.container.className = 'container momentum';
        this.setTransform(offset);
        this.offset = offset;
      }
    },
    render: function (code) {
      $.Panel.prototype.render.call(this, code);
      this.container = this.$el.firstElementChild;
      this.carousel = $('.carousel', this.$el);
      $('.download-button', this.$el).dataset.index = this.index;
    },
    setTransform: function (offset) {
      this.container.style.WebkitTransform = $.has3D ? "translate3d(0, " + offset + "px, 0) scale3d(1, 1, 1)"
        : "translate(0, " + offset + ")";
    },
    onCarousel: function (event) {
      var offset = this.carouselLeft - event.gesture.deltaX,
          max = this.carousel.scrollWidth - this.carousel.clientWidth;
      offset = offset > max ? max : offset;
      offset = offset < 0 ? 0 : offset;
      this.carousel.scrollLeft = offset;
      event.stopPropagation();
      event.preventDefault();
      event.gesture.stopPropagation();
      event.gesture.preventDefault();
    },
    onTouch: function () {
      this.$el.className = 'container';
      this.offset = this.offset || 0;
      this.carouselLeft = this.carousel.scrollLeft;
    },
    onTransitionEnd: function () {
      this.firstElementChild.className = 'container';
    }
  });
}());