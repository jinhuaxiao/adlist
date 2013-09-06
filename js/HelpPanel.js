/**
 * Date: 13-6-19
 * Time: 下午6:27
 * @overview 帮助页
 * @author Meathill <lujia.zhai@dianjoy.com>
 * since 0.1.0
 */
;(function () {
  'use strict';

  var help = $.HelpPanel = function (options) {
    $.Panel.call(this, options);

    $('#comments', this.$el).addEventListener('submit', function (event) {
      $.ajax({
        url: this.action,
        method: this.method,
        data: {
          appid: config.appid,
          deviceid: config.deviceid,
          channel: config.channel,
          net: config.net,
          comment: this.elements['comment'].value
        },
        context: this,
        success: function () {
          this.elements['submit'].innerHTML = '提交成功';
        }
      });
      this.elements['comment'].disabled = true;
      this.elements['submit'].disabled = true;
      event.preventDefault();
    }, false);
  };

  $.inherit(help, $.Panel);
  help.prototype.slideIn = function () {
    $.Panel.prototype.slideIn.call(this);

    if (this.scroll.maxScrollY === 0) {
      this.scroll.refresh();
    }
  }
}());