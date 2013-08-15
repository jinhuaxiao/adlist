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
  function loadImage(image) {
    if (image.getAttribute('s') && image.src != image.getAttribute('s')) {
      image.src = image.getAttribute('s');
      image.removeAttribute('s');
      image.className = 'item-icon';
    }
  }

  var pn = 1,
      imgs = null,
      isLoading = false;
  var list = $.ListPanel = function (options) {
    $.Panel.call(this, options);

    this.detail = options.detail;

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

      event.stopPropagation();
    }, this));
  };

  $.inherit(list, $.Panel);

  $.extend(list.prototype, {
    checkPosition: function (isDown, velocity) {
      if ( this.offset > 0 || this.offset > this.bottom - 141 && this.offset < this.bottom - 81) {
        this.$el.className = 'autoback';
        this.offset = isDown ? 0 : this.bottom;
        this.setTransform(isDown ? 0 : this.bottom);
      } else if (this.offset < this.bottom - 140) {
        this.$el.className = 'loading';
        this.loadNextPage();
      } else {
        var offset = this.offset + (isDown ? 1 : -1) * velocity;
        offset = offset > 0 ? 0 : offset;
        offset = offset < this.bottom ? this.bottom : offset;
        this.$el.className = 'momentum';
        this.setTransform(offset);
        this.offset = offset;
      }
    },
    render: function (code) {
      var self = this;
      this.$el.innerHTML = code;
      this.$el.className = '';
      setTimeout(function () {
        self.bottom = $.viewportHeight - self.$el.scrollHeight + 60;
      }, 10);
      imgs = this.$el.getElementsByClassName('pre');
      this.loadIcons();
    },
    setTransform: function (offset) {
      $.Panel.prototype.setTransform.call(this, offset);

      this.loadIcons();
    },
    append: function (code) {
      var fragment = document.createDocumentFragment(),
          div = document.createElement('div'),
          nodes,
          self = this;
      div.innerHTML = code;
      nodes = div.childNodes;
      fragment.textContent = '';
      while (nodes.length > 0) {
        fragment.appendChild(nodes[0]);
      }
      this.$el.appendChild(fragment);
      imgs = this.$el.getElementsByClassName('pre');
      setTimeout(function () {
        self.bottom = $.viewportHeight - self.$el.scrollHeight + 60;
      }, 10);
    },
    loadIcons: function () {
      // 加载图片
      var i = 0,
          len = imgs.length,
          img;
      while (i < len) {
        img = imgs[i];
        if ($.viewportHeight - this.offset > img.offsetTop) {
          loadImage(img);
          Array.prototype.splice.call(imgs, i, 1);
          len--;
        } else {
          i++;
        }
      }
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
        success: function (more) {
          isLoading = false;
          if (!more || !more.hasOwnProperty('offers') || !more.offers || more.offers.length === 0) {
            this.$el.className = 'no-more delay autoback';
            this.offset = this.bottom;
            this.setTransform(this.bottom);
            return;
          }
          this.append(Handlebars.templates.list(more));
          this.$el.className = '';
          pn += 1;
          data.offers = data.offers.concat(more.offers);
        },
        error: function () {
          isLoading = false;
          this.$el.className = 'error delay autoback';
          this.offset = this.bottom;
          this.setTransform(this.bottom);
        }
      });
    }
  });
}());