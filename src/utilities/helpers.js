var svgNs = 'http://www.w3.org/2000/svg';

var docReady = function() {
  return new Promise(function(resolve) {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      function onReady() {
        resolve();
        document.removeEventListener('DOMContentLoaded', onReady, true);
        window.removeEventListener('load', onReady, true);
      }
      document.addEventListener('DOMContentLoaded', onReady, true);
      window.addEventListener('load', onReady, true);
    }
  });
};

var createEl = function(el, attributes) {
  var elType = el ? el : 'div';
  var $el = document.createElement(elType);
  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      $el.setAttribute(key, attributes[key]);
    }
  }
  return $el;
};

var createSVG = function(id, width, height) {
  var $svg = document.createElementNS(svgNs, 'svg');
  $svg.setAttribute('id', id);
  if (width) $svg.setAttribute('width', width);
  if (height) $svg.setAttribute('height', height);
  if (width && height)
    $svg.setAttribute('viewbox', '0 0 ' + width + ' ' + height);
  $svg.setAttribute('version', '1.1');
  return $svg;
};

var createLine = function(id, stroke, x1, x2, y1, y2) {
  var $line = document.createElementNS(svgNs, 'line');
  $line.setAttribute('id', id);
  $line.setAttribute('stroke', stroke.color);
  $line.setAttribute('stroke-width', stroke.width);
  $line.setAttribute('stroke-linecap', stroke.linecap);
  $line.setAttribute('x1', x1);
  $line.setAttribute('y1', y1);
  $line.setAttribute('x2', x2);
  $line.setAttribute('y2', y2);
  return $line;
};

var getElHeight = function(id) {
  var $el = document.getElementById(id);
  return $el.offsetHeight || $el.clientHeight;
};

var getWinHeight = function() {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  );
};

var getWinWidth = function() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
};

var getScrollTop = function() {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
};

var getDocHeight = function() {
  var body = document.body,
    html = document.documentElement;

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
};

function isScrolledIntoView(el) {
  var elemTop = el.getBoundingClientRect().top;
  var elemBottom = el.getBoundingClientRect().bottom;
  var isVisible = elemTop >= 0 && elemBottom <= getWinHeight();
  return isVisible;
}

export {
  docReady,
  createEl,
  createSVG,
  createLine,
  getElHeight,
  getWinHeight,
  getWinWidth,
  getScrollTop,
  getDocHeight,
  isScrolledIntoView
};
