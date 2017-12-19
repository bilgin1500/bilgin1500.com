import objectAssign from 'object-assign';
import data from 'content/index';

var $win = window;
var $doc = document;

var uppercase = function(string) {
  return string.replace(string.charAt(0), string.charAt(0).toUpperCase());
};

var objectJoin = function(obj, glue, separator) {
  if (glue == undefined) glue = '=';
  if (separator == undefined) separator = ',';

  return Object.getOwnPropertyNames(obj)
    .map(function(k) {
      return [k, obj[k]].join(glue);
    })
    .join(separator);
};

var log = function(log, options) {
  if (data.settings.isLoggerActive) {
    var defaultOptions = {
      color: 'blue'
    };
    if (options) {
      defaultOptions = objectAssign({}, defaultOptions, options);
    }
    options = objectJoin(defaultOptions, ':', ';');
    console.log('%c' + log, options);
  }
};

var docReady = function() {
  return new Promise(function(resolve) {
    if ($doc.readyState === 'complete') {
      resolve();
    } else {
      function onReady() {
        resolve();
        $doc.removeEventListener('DOMContentLoaded', onReady, true);
        $win.removeEventListener('load', onReady, true);
      }
      $doc.addEventListener('DOMContentLoaded', onReady, true);
      $win.addEventListener('load', onReady, true);
    }
  });
};

var createEl = function(type, attributes) {
  type = type ? type : 'div';
  var $el = $doc.createElement(type);
  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      $el.setAttribute(key, attributes[key]);
    }
  }
  return $el;
};

var createId = function() {
  data.settings.idCounter++;
  var uniqueId =
    data.settings.idCounter +
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return uniqueId;
};

var getEl = function(el) {
  var $el;
  if (typeof el == 'object') {
    $el = el;
  } else {
    $el = $doc.getElementById(el);
  }
  return $el;
};

var getHeight = function(el) {
  switch (el) {
    case 'window':
      return (
        $win.innerHeight ||
        $doc.documentElement.clientHeight ||
        $doc.body.clientHeight
      );
      break;
    case 'document':
      var body = $doc.body,
        html = $doc.documentElement;
      return Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      break;
    default:
      var $el = getEl(el);
      if ($el instanceof SVGElement) {
        return $el.getBoundingClientRect().height;
      } else {
        return $el.offsetHeight || $el.clientHeight;
      }
  }
};

var getWidth = function(el) {
  switch (el) {
    case 'window':
      return (
        $win.innerWidth ||
        $doc.documentElement.clientWidth ||
        $doc.body.clientWidth
      );
      break;

    default:
      var $el = getEl(el);
      if ($el instanceof SVGElement) {
        return $el.getBoundingClientRect().width;
      } else {
        return $el.offsetWidth || $el.clientWidth;
      }
  }
};

var getScrollTop = function() {
  return $win.pageYOffset !== undefined
    ? $win.pageYOffset
    : ($doc.documentElement || $doc.body.parentNode || $doc.body).scrollTop;
};

var hasClass = function(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
};

var addClass = function(el, className) {
  if (el.classList) el.classList.add(className);
  else el.className += ' ' + className;
};

var removeClass = function(el, className) {
  if (el.classList) el.classList.remove(className);
  else
    el.className = el.className.replace(
      new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
      ' '
    );
};

var toggleClass = function(el, className) {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = -1;
    for (var i = classes.length; i--; ) {
      if (classes[i] === className) existingIndex = i;
    }

    if (existingIndex >= 0) classes.splice(existingIndex, 1);
    else classes.push(className);

    el.className = classes.join(' ');
  }
};

var clearInnerHTML = function(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

// Check for mime type support against a player instance
// Credits: http://diveintohtml5.info/everything.html
// Credits: https://github.com/sampotts/plyr/blob/master/src/js/plyr.js
/*var supportMime = function(media, mimeType) {
  switch (mimeType) {
    case 'video/webm':
      return !!(
        media.canPlayType &&
        media.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, '')
      );
    case 'video/mp4':
      return !!(
        media.canPlayType &&
        media
          .canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
          .replace(/no/, '')
      );
    case 'video/ogg':
      return !!(
        media.canPlayType &&
        media.canPlayType('video/ogg; codecs="theora"').replace(/no/, '')
      );
  }
  return false;
};*/

export {
  log,
  docReady,
  uppercase,
  createEl,
  createId,
  getEl,
  getHeight,
  getWidth,
  getScrollTop,
  hasClass,
  addClass,
  removeClass,
  toggleClass,
  clearInnerHTML
};