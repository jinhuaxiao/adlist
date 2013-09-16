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


    $('button', this.wrapper).addEventListener('tap', function () {
      var form = this.parentNode;
      if (form.elements.comment.value === '') {
        return false;
      }
      $.ajax({
        url: form.action,
        method: form.method,
        data: {
          appid: config.appid,
          deviceid: config.deviceid,
          channel: config.channel,
          net: config.net,
          comment: form.elements.comment.value
        },
        context: form,
        success: function () {
          this.elements.submit.innerHTML = '提交成功';
        }
      });
      form.elements.comment.disabled = true;
      this.disabled = true;
    }, false);
  };

  $.inherit(help, $.Panel);
  help.prototype.slideIn = function () {
    $.Panel.prototype.slideIn.call(this);

    if (!this.scroll) {
      this.scroll = new IScroll(this.wrapper, this.getScrollType());
    }
  }
}());