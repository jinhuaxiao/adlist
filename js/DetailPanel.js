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
      swipe: false,
      tap: false
    }).on('dragleft dragright', $.bind(this.onCarousel, this));
  };

  $.inherite(detail, $.Panel);

  $.extend(detail.prototype, {
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
    onHammer: function (event) {
      console.log(event.type);
      if (event.type === 'touch') {
        this.carouselLeft = this.carousel.scrollLeft;
        this.offset = this.offset || 0;
      }
      if (event.type === 'release') {
        this.offset = this.tempOffset;
        if (this.offset > 0 || this.offset < this.bottom) {
          var isDown = event.gesture.direction == Hammer.DIRECTION_DOWN;
          this.container.className = 'container autoback';
          this.offset = isDown ? 0 : this.bottom;
          this.setTransform(isDown ? 0 : this.bottom);
        }
        console.log(this.offset, this.bottom);
      }
    },
    onCarousel: function (event) {
      var offset = this.carouselLeft - event.gesture.deltaX,
          max = this.carousel.scrollWidth - this.carousel.clientWidth;
      offset = offset > max ? max : offset;
      offset = offset < 0 ? 0 : offset;
      this.carousel.scrollLeft = offset;
      event.stopPropagation();
      event.preventDefault();
      event.gesture.preventDefault();
    },
    onTransitionEnd: function () {
      this.firstElementChild.className = 'container';
    }
  });


}());