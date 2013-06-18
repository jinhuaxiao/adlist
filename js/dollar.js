/**
 * Created with JetBrains WebStorm.
 * User: Meathill <lujia.zhai@dianjoy.com>
 * Date: 13-6-18
 * Time: 下午3:20
 * 替代jQuery
 */
;(function (window) {
  function stringifyParams(obj) {
    var result = '';
    for (var prop in obj) {
      result += prop + '=' +obj[prop] + '&';
    }
    return result.slice(0, -1);
  }

  var $ = window.$ = function (selector, root) {
    root = root || document;
    return root.querySelector(selector);
  }
  $.ajax = function (options) {
    var method = options.method || 'get',
        url = options.url || '',
        context = options.context || this,
        xhr = new XMLHttpRequest();
    xhr.open(method, url + '?' + stringifyParams(options.data));
    xhr.onreadystatechange = function (event) {
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
}(window));