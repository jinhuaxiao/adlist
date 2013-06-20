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

  var ctor = function () {};

  var $ = window.$ = function (selector, root) {
    root = root || document;
    return root.querySelector(selector);
  };
  $.ajax = function (options) {
    var method = options.method || 'get',
        url = options.url || '',
        context = options.context || this,
        xhr = new XMLHttpRequest();
    xhr.open(method, url + '?' + stringifyParams(options.data));
    xhr.onreadystatechange = function () {
      if (this.readyState == XMLHttpRequest.DONE) {
        if (this.status == 200) {
          if (options.dataType == 'json') {
            var response = JSON.parse(this.response);
          }
          options.success.call(context, response);
        } else if ('error' in options) {
          options.error.call(context);
        }
      }
    }
    xhr.send();
  }
  $.detect3DSupport = function (target) {
    target.style.WebkitTransform = 'translate3D(0, 0, 0) scale(1, 1, 1)';
    $.has3D = window.getComputedStyle(target, null).getPropertyValue('-webkit-transform');
  }
  $.extend = function (subType, superType) {
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
  }
  $.isString = function (obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  }
  $.bind = function (func, context) {
    var args,
        bound,
        native = Function.prototype.bind;
    if (native && func.bind === native) {
      return native.apply(func, Array.prototype.slice.call(arguments, 1));
    }
    args = Array.prototype.slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) {
        return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
      }
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(Array.prototype.slice.call(arguments)));
      return Object(result) === result ? result : self;
    };
  }
}(window));