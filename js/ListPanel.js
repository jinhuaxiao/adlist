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

  var pn = 1,
      isLoading = false;
  var list = $.ListPanel = function (options) {
    $.Panel.call(this, options);

    this.detail = options.detail;
    this.$el.className = '';

    Hammer(this.$el).on('tap', $.bind(function (event) {
      var target = event.target;
      if (target.id === 'list') {
        return;
      }
      while (target.className !== 'item') {
        target = target.parentNode;
      }
      var index = Array.prototype.indexOf.call(this.$el.children, target);
      if ($.hasClass(event.target, 'download-button')
          || $.hasClass(event.target.parentNode, 'download-button')) {
        var target = $.hasClass(event.target, 'download-button') ?
            event.target : event.target.parentNode;
        target.dataset.index = index;
        return;
      }

      var item = data.offers[index];
      item.serv = data.serv;
      this.detail.index = index;
      this.detail.render(Handlebars.templates.detail(item));
      this.detail.slideIn();

      event.stopPropagation();
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
          div = document.createElement('div'),
          nodes;
      div.innerHTML = code;
      nodes = div.childNodes;
      fragment.textContent = '';
      while (nodes.length > 0) {
        fragment.appendChild(nodes[0]);
      }
      this.$el.appendChild(fragment);
      this.bottom = $.viewportHeight - this.$el.scrollHeight + 60;
    },
    loadNextPage: function () {
      if (isLoading) {
        return;
      }
      var param = getParams(location.search);
      param.pn = pn + 1;
      isLoading = true;
      $.ajax({
        url: '',
        method: 'post',
        context: this,
        data: param,
        dataType: 'json',
        success: function (data) {
          isLoading = false;
          if (!data || !data.hasOwnProperty('offers') || data.offers.length === 0) {
            this.$el.className = 'no-more delay autoback';
            this.offset = this.bottom;
            this.setTransform(this.bottom);
            return;
          }
          this.append(Handlebars.templates.list(data));
          this.$el.className = '';
          pn += 1;
        },
        error: function () {
          isLoading = false;
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