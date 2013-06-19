/**
 * Date: 13-6-19
 * Time: 下午5:25
 * @overview 列表类
 * @author Meathill <lujia.zhai@dianjoy.com>
 * since 0.1.0
 */
;(function () {
  'use strict';

  var list = $.ListPanel = function (options) {
    $.Panel.call(this, options);

    this.detail = options.detail;

    Hammer(this.$el).on('tap', $.bind(function (event) {
      if ($('.download-button', this.$el).contains(event.target)) {
        this.showDownloadPanel();
        return;
      }

      var target = event.target;
      while (target.className !== 'item') {
        target = target.parentNode;
      }
      var index = Array.prototype.indexOf.call(this.$el.children, target);
      this.detail.render(Handlebars.templates['detail'](data.offers[index]));
      this.detail.slideIn();
    }, this));
  };

  $.extend(list, $.Panel);
}());