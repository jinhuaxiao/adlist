/**
 * Created with JetBrains WebStorm.
 * User: Meathill <lujia.zhai@dianjoy.com>
 * Date: 13-6-18
 * Time: 下午3:20
 * 替代jQuery
 */
;(function (window) {
  'use strict';

  function stringifyParams(obj) {
    var result = '';
    for (var prop in obj) {
      result += prop + '=' +obj[prop] + '&';
    }
    return result.slice(0, -1);
  }

  var ctor = function () {},
      slice = Array.prototype.slice;

  var $ = window.$ = function (selector, root) {
    root = root || document;
    var dom;
    switch (selector.charAt(0)) {
      case '#':
        selector = selector.substr(1);
        dom = document.getElementById(selector);
        break;

      case '.':
        selector = selector.substr(1);
        dom = root.getElementsByClassName(selector)[0];
        break;

      default :
        dom = root.getElementsByTagName(selector)[0];
        break;
    }
    return dom;
  };
  $.ajax = function (options) {
    var method = options.method || 'get',
        url = options.url || '',
        context = options.context || this,
        xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function (event) {
      if (options.dataType == 'json') {
        var response = JSON.parse(this.response);
      }
      options.success.call(context, response);
    }
    xhr.onerror = function () {
      if ('error' in options) {
        options.error.call(context);
      }
    }
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send(stringifyParams(options.data));
  };
  $.bind = function (func, context) {
    var args,
        native = Function.prototype.bind;
    if (native && func.bind === native) {
      return native.apply(func, slice.call(arguments, 1));
    }
    args = slice.call(arguments, 2);
    return function() {
      if (!(this instanceof bound)) {
        return func.apply(context, args.concat(slice.call(arguments)));
      }
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      return Object(result) === result ? result : self;
    };
  };
  $.detect3DSupport = function (target) {
    target.style.WebkitTransform = 'translate3D(0, 0, 0) scale(1, 1, 1)';
    $.has3D = window.getComputedStyle(target, null).getPropertyValue('-webkit-transform');
  };
  $.extend = function (to, from) {
    for (var prop in from) {
      to[prop] = from[prop];
    }
    return to;
  };
  $.hasClass = function (dom, className) {
    var all = dom.className;
    return all.split(' ').indexOf(className) !== -1;
  };
  $.inherite = function (subType, superType) {
    var Surrogate = function () {
      this.constructor = subType;
    };
    Surrogate.prototype = superType.prototype;
    subType.prototype = new Surrogate();
  };
  $.isString = function (obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  };
}(window));