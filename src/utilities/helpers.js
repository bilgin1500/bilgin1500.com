import objectAssign from 'object-assign';
import { getSetting, setSetting } from 'utilities/orm';

// Caching
var $win = window;
var $doc = document;

/*
  Is a given variable undefined?
 */
var isUndefined = function(obj) {
  return obj === void 0;
};

/*
  Is a given variable null?
 */
var isNull = function(obj) {
  return obj === null;
};

/**
 * Make a string's firs letter uppercase
 * @param {string} string - The string to be uppercased
 * @return {string} The string after transformation
 */
var uppercase = function(string) {
  return string.replace(string.charAt(0), string.charAt(0).toUpperCase());
};

/**
 * Javascript Slugify
 * @see  https://gist.github.com/mathewbyrne/1280286
 * @return {string} The text in slug format
 */
var slugify = function(text) {
  // Use hash map for special characters
  var specialChars = {
    à: 'a',
    ä: 'a',
    á: 'a',
    â: 'a',
    æ: 'a',
    å: 'a',
    ë: 'e',
    è: 'e',
    é: 'e',
    ê: 'e',
    î: 'i',
    ï: 'i',
    ì: 'i',
    í: 'i',
    ò: 'o',
    ó: 'o',
    ö: 'o',
    ô: 'o',
    ø: 'o',
    ù: 'o',
    ú: 'u',
    ü: 'u',
    û: 'u',
    ñ: 'n',
    ç: 'c',
    ß: 's',
    ş: 's',
    ÿ: 'y',
    œ: 'o',
    ŕ: 'r',
    ś: 's',
    ń: 'n',
    ṕ: 'p',
    ẃ: 'w',
    ǵ: 'g',
    ğ: 'g',
    ǹ: 'n',
    ḿ: 'm',
    ǘ: 'u',
    ẍ: 'x',
    ź: 'z',
    ḧ: 'h',
    '·': '-',
    '/': '-',
    _: '-',
    ',': '-',
    ':': '-',
    ';': '-'
  };

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/./g, (target, index, str) => specialChars[target] || target) // Replace special characters using the hash map
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * Functions like Array.prototype.join. 
 * Convert an object to an array and joins it's content
 * @param {object} obj - The object to be joined
 * @param {string} glue - The string between object key and value pair
 * @param {string} separator - The string between array nodes
 * @return {string} Joined object as string
 */
var objectJoin = function(obj, glue, separator) {
  if (glue == undefined) glue = '=';
  if (separator == undefined) separator = ',';

  return Object.getOwnPropertyNames(obj)
    .map(function(k) {
      return [k, obj[k]].join(glue);
    })
    .join(separator);
};

/**
 * Logs the content to the browser's dev console
 * @param {string} log -  Content to be logged
 * @param {object} options - console.log options like color, font size etc.
 */
var log = function(log, options) {
  if (getSetting('isLoggerActive')) {
    var defaultOptions = {
      color: 'blue'
    };
    if (options) {
      defaultOptions = objectAssign({}, defaultOptions, options);
    }
    options = objectJoin(defaultOptions, ':', ';');
    if ($win.console) console.log('%c' + log, options);
  }
};

/**
 * The DOMContentLoaded event is fired when the initial HTML document 
 * has been completely loaded and parsed, without waiting for stylesheets, 
 * images, and subframes to finish loading.
 * @return {Promise} 
 */
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

/**
 * document.createElement wrapper with element attributes
 * @param {string} type - Element's tag name in lowercase
 * @param {object} attributes - Element's attributes
 *                              key: Attribute name
 *                              value: A single or multi attribute value
 * @return {element} HTML element
 */
var createEl = function(type, attributes) {
  type = type ? type : 'div';
  var $el = $doc.createElement(type);
  for (var key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      var val = attributes[key];

      if (key == 'innerText' || key == 'innerHTML') {
        $el[key] = val;
        break;
      }

      if (typeof val == 'string') {
        $el.setAttribute(key, val);
      } else if (Array.isArray(val)) {
        $el.setAttribute(key, val.join(' '));
      }
    }
  }
  return $el;
};

/**
 * Creates a unique ID for id attributes
 * @return {id}
 */
var createId = function() {
  setSetting('idCounter', getSetting('idCounter') + 1);
  var uniqueId =
    getSetting('idCounter') +
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return uniqueId;
};

/**
 * Basic getElement wrapper for private usage
 * @param {element/string} el - Object is HTMLElement, string is element id
 * @return {element}
 */
var _getEl = function(el) {
  var $el;
  if (typeof el == 'object') {
    $el = el;
  } else {
    $el = $doc.getElementById(el);
  }
  return $el;
};

/**
 * Comprehensive getHeight wrapper
 * @param {string/object} el
 *                           window: Gets window height
 *                           document: Gets doc height
 *                           string or HTMLElement: Gets element's height 
 * @return {number}
 */
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
      var $el = _getEl(el);
      if ($el instanceof SVGElement) {
        return $el.getBoundingClientRect().height;
      } else {
        return $el.offsetHeight || $el.clientHeight;
      }
  }
};

/**
 * Comprehensive getWidth wrapper
 * @param {string/object} el
 *                           window: Gets window height
 *                           string or HTMLElement: Gets element's height 
 * @return {number}
 */
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
      var $el = _getEl(el);
      if ($el instanceof SVGElement) {
        return $el.getBoundingClientRect().width;
      } else {
        return $el.offsetWidth || $el.clientWidth;
      }
  }
};

/**
 * Class name look up
 * @param {string/element}  el - HTMLElement or a ID
 * @param {string} className - Name of the class to look up for
 * @return {Boolean}
 */
var hasClass = function(el, className) {
  el = _getEl(el);
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
};

/**
 * Adds class name to an element
 * @param {string/element}  el - HTMLElement or a ID
 * @param {string} className - Name of the class to be added
 */
var addClass = function(el, className) {
  el = _getEl(el);
  if (el.classList) el.classList.add(className);
  else el.className += ' ' + className;
};

/**
 * Removes a class name from an element
 * @param {string/element}  el - HTMLElement or a ID
 * @param {string} className - Name of the class to be removed
 */
var removeClass = function(el, className) {
  el = _getEl(el);
  if (el.classList) el.classList.remove(className);
  else
    el.className = el.className.replace(
      new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
      ' '
    );
};

/**
 * Adds or removes class
 * @param {string/element}  el - HTMLElement or a ID
 * @param {string/array} className - Name of the class or classes to be toggled
 */
var toggleClass = function(el, className) {
  el = _getEl(el);

  function toggle(c) {
    if (!hasClass(el, c)) {
      addClass(el, c);
    } else {
      removeClass(el, c);
    }
  }

  if (typeof className == 'string') {
    toggle(className);
  } else if (Array.isArray(className)) {
    for (var i = 0; i < className.length; i++) {
      toggle(className[i]);
    }
  }
};

/**
 * Clears inner HTML of an element
 * @param {string/element}  el - HTMLElement or a ID
 */
var clearInnerHTML = function(el) {
  el = _getEl(el);
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

/**
 * Cross browser scrolled y pos data of the document
 * @return {number} Returns the number of pixels that the document is currently scrolled vertically
 */
function getDocScrollY() {
  return $win.pageYOffset !== undefined
    ? $win.pageYOffset
    : ($doc.documentElement || $doc.body.parentNode || $doc.body).scrollTop;
}

export {
  $win,
  $doc,
  isUndefined,
  isNull,
  slugify,
  log,
  docReady,
  uppercase,
  createEl,
  createId,
  getHeight,
  getWidth,
  hasClass,
  addClass,
  removeClass,
  toggleClass,
  clearInnerHTML,
  getDocScrollY
};
