/**
 * Date: 13-6-19
 * Time: 下午5:25
 * @overview 广告列表
 * @author Meathill <lujia.zhai@dianjoy.com>
 * since 0.1.0
 */
;(function () {
  'use strict';
  var REMOTE = /dianjoy\.com/i.test(location.hostname) ? '' : 'http://a.dianjoy.com/dev/api/adlist/adlist.php';

  function getParams(string) {
    var arr = string.substr(string.indexOf('?') + 1).split('&'),
        result = 'params' in window ? $.extend({}, params) : {},
        i = 0,
        len = arr.length;
    for (; i < len; i++) {
      if (!arr[i]) {
        continue;
      }
      var kv = arr[i].split('=');
      result[kv[0]] = kv[1];
    }
    result.ts = (new Date()).getTime();
    result.output = 'JSON';
    return result;
  }
  function loadIcons() {
    // 加载图片
    var i = 0,
      len = images.length,
      top = $.viewportHeight - (this instanceof IScroll ? this.y : 0),
      img;
    while (i < len) {
      img = images[i];
      if (top > img.offsetTop) {
        replaceImage(img);
        Array.prototype.splice.call(images, i, 1);
        len--;
      } else {
        i++;
      }
    }
  }
  function replaceImage(image) {
    if (image.getAttribute('s') && image.src != image.getAttribute('s')) {
      image.src = image.getAttribute('s');
      image.removeAttribute('s');
      image.className = 'item-icon';
    }
  }

  var pn = 1,
      images = null,
      isLoading = false;
  var list = $.ListPanel = function (options) {
    $.Panel.call(this, options);

    this.detail = options.detail;

    this.$el.addEventListener('tap', $.bind(function (event) {
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
        target = $.hasClass(event.target, 'download-button') ?
            event.target : event.target.parentNode;
        target.index = index;
        return;
      }

      var item = data.offers[index];
      item.serv = data.serv;
      this.detail.index = index;
      this.detail.render(Handlebars.templates.detail(item));
      this.detail.slideIn();
    }, this), false);
  };

  $.inherit(list, $.Panel);

  $.extend(list.prototype, {
    getScrollType: function () {
      return {
        mouseWheel: false,
        tap: true,
        probeType: 3
      };
    },
    prepare: function () {
      this.wrapper.className = 'wrapper';
      if (this.scroll) {
        this.scroll.refresh();
      } else {
        this.scroll = new IScroll(this.wrapper, this.getScrollType());
        this.scroll.on('scroll', $.bind(this.checkPosition, this));
        this.scroll.on('scrollEnd', $.bind(this.scrollEndHandler, this));
      }
      images = this.$el.getElementsByClassName('pre');
      loadIcons();
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
      this.prepare();
    },
    checkPosition: function () {
      loadIcons();

      if (this.scroll.y < (this.scroll.maxScrollY - 5) && !this.$el.className.match('flip')) {
        this.$el.className = 'flip';
      } else if (this.scroll.y > (this.scroll.maxScrollY + 5) && this.$el.className.match('flip')) {
        this.$el.className = '';
      }
    },
    loadNextPage: function () {
      this.loadPage(pn + 1);
    },
    loadPage: function (p, isRefresh) {
      if (isLoading) {
        return;
      }
      var param = getParams(location.search);
      param.pn = p;
      isLoading = true;
      this.isRefresh = isRefresh;
      $.ajax({
        url: REMOTE,
        method: 'post',
        context: this,
        data: param,
        dataType: 'json',
        success: this.remote_successHandler,
        error: this.remote_errorHandler
      });
    },
    refresh: function () {
      this.loadPage(1, true);
    },
    remote_errorHandler: function () {
      isLoading = false;
    },
    remote_successHandler: function (more) {
      isLoading = false;
      pn = more.pn || 1;
      if (!more || !more.hasOwnProperty('offers') || !more.offers || more.offers.length === 0) {
        this.$el.className = 'no-more delay autoback';
        this.offset = this.bottom;
        this.setTransform(this.bottom);
        return;
      }
      if (this.isRefresh) {
        this.render(Handlebars.templates.list(more));
        this.isRefresh = false;
        data.offers = more.offers;
      } else {
        this.append(Handlebars.templates.list(more));
        data.offers = data.offers.concat(more.offers);
        this.$el.className = '';
      }
    },
    scrollEndHandler: function () {
      if (pullUpEl.className.match('flip')) {
        pullUpEl.className = 'loading';
        pullUpEl.querySelector('.label').innerHTML = '加载中...';
        pullUpAction();
        timeout = setTimeout(clearLoading, 60000);
      }
    }
  });
}());