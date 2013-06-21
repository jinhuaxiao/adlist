/**
 * Date: 13-6-19
 * Time: 下午5:25
 * @overview 广告列表
 * @author Meathill <lujia.zhai@dianjoy.com>
 * since 0.1.0
 */
;(function () {
  'use strict';

  function getParams(string) {
    var arr = string.substr(string.indexOf('?') + 1).split('&'),
      result = {},
      i = 0,
      len = arr.length;
    for (; i < len; i++) {
      var kv = arr[i].split('=');
      result[kv[0]] = kv[1];
    }
    result.ts = (new Date()).getTime();
    result.output = 'JSON';
    return result;
  }

  var pn = 1;
  var list = $.ListPanel = function (options) {
    $.Panel.call(this, options);

    this.detail = options.detail;

    Hammer(this.$el).on('tap', $.bind(function (event) {
      if ($('.download-button', this.$el).contains(event.target)) {
        this.showDownloadPanel();
        return;
      }

      var target = event.target;
      if (target.id === 'list') {
        return;
      }
      while (target.className !== 'item') {
        target = target.parentNode;
      }
      var index = Array.prototype.indexOf.call(this.$el.children, target);
      this.detail.render(Handlebars.templates['detail'](data.offers[index]));
      this.detail.slideIn();
    }, this));
  };

  $.inherite(list, $.Panel);

  $.extend(list.prototype, {
    render: function (code) {
      this.$el.innerHTML = code;
      this.bottom = $.viewportHeight - this.$el.scrollHeight + 60;
    },
    append: function (code) {
      var fragment = document.createDocumentFragment(),
        div = fragment.createElement('div'),
        nodes;
      div.innerHTML = code;
      nodes = div.childNodes;
      fragment.textContent = '';
      for (var i = 0, len = nodes.length; i < len; i++) {
        fragment.appendChild(nodes[i]);
      }
      this.$el.appendChild(fragment);
    },
    loadNextPage: function () {
      var param = getParams(location.search);
      param.pn = pn + 1;
      pn += 1;
      $.ajax({
        url: '',
        method: 'post',
        context: this,
        data: param,
        success: function (data) {
          if (!data || !data.hasOwnProperty('offers') || data.offers.length === 0) {
            this.$el.className = 'no-more delay autoback';
            this.offset = this.bottom;
            this.setTransform(this.bottom);
            return;
          }
          this.append(Handlebars.templates['list'](data));
          this.$el.className = '';
        },
        error: function () {
          this.$el.className = 'error delay autoback';
          this.offset = this.bottom;
          this.setTransform(this.bottom);
        }
      });
    },
    onHammer: function (event) {
      this.offset = event.type === 'touch' ? this.offset || 0 : this.tempOffset;
      if (event.type === 'release') {
        if ( this.offset > 0) {
          this.$el.className = 'autoback';
          this.offset = 0;
          this.setTransform(0);
        } else if (this.offset < this.bottom) {
          this.$el.className = 'loading';
          this.loadNextPage();
        }
      }
    }
  });

}());