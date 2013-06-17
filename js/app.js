function $(selector, root) {
  root = root || document;
  return root.querySelector(selector);
}
function slidePageIn(page) {
  page.className = 'animated slideIn';
}
function slidePageOut(page) {
  page.className = 'animated slideOut';
}
function loadDetail() {

}
document.addEventListener('DOMContentLoaded', function () {
  var list = $('#list'),
      currPages = [];
  Hammer(list).on('tap', function (event) {
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
      event.preventDefault();
      return false;
    }
  });
});