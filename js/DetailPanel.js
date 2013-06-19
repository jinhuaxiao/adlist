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

  $.extend(detail, $.Panel);
}());