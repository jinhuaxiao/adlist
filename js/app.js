'use strict';

function slidePageIn(page) {
  page.className = 'animated slideIn';
}
function slidePageOut(page) {
  page.className = 'animated slideOut';
}
function showDownloadPanel() {
  var info = $('#download-panel');
  info.className = 'animated slideDown';
  info.timeout = setTimeout(hideDownloadPanel, 5000);
}
function hideDownloadPanel() {
  var info = $('#download-panel');
  clearTimeout(info.timeout);

  info.className = 'animated slideUp';
}
function loadDetail() {

}
document.addEventListener('DOMContentLoaded', function () {
  var list = $('#list'),
      currPages = [];
  Hammer(list).on('tap', function (event) {
    var button = event.target;
    if (button.className === 'download-button' || button.parentNode.className === 'download-button') {
      showDownloadPanel();
      return;
    }
    var detail = $('#detail');
    currPages.push(detail);
    slidePageIn(detail);
  });

  var helpButton = $('.help-button');
  Hammer(helpButton).on('tap', function (event) {
    var help = $('#help');
    currPages.push(help);
    slidePageIn(help);

    event.gesture.preventDefault();
  });

  var backButton = $('.back-button');
  Hammer(backButton).on('tap', function (event) {
    if (currPages.length > 0) {
      slidePageOut(currPages.pop());
      event.gesture.preventDefault();
      return false;
    }
  });

  var detail = $('#detail');
  Hammer(detail).on('tap', function (event) {
    if (event.target.className == 'download-button') {
      showDownloadPanel();
    }
  });

  var panel = $('#download-panel');
  Hammer(panel).on('tap', function (event) {
    if (event.target.className === 'close') {
      hideDownloadPanel();
    }

  });

  $('#comments').addEventListener('submit', function (event) {
    $.ajax({
      url: this.action,
      method: this.method,
      data: {
        comment: this.elements['comment'].value
      },
      context: this,
      success: function () {
        this.elements['submit'].text('提交成功');
      }
    });
    this.elements['comment'].disabled = true;
    this.elements['submit'].disabled = true;
    event.preventDefault();
  });
});

var data = null;