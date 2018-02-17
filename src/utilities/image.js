import { createEl, createId, isUndefined } from 'utilities/helpers';
import loaderIcon from 'images/loader-tail-spin.svg';

/*
 * Image constructor
 * @param  {object} attr - <img> attributes
 */
function Image(attr) {
  this.isLoaded = false;
  this.attributes = attr;
  this.createDOM();
}

/**
 * Some properties for further use
 */
Image.prototype.settings = {
  // Base64 Encode of 1x1px Transparent GIF
  transparentGif:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  // Box shadows for gallery hover and press
  boxShadow: '1px 1px 25px 1px rgba(0,0,0,0.25)',
  boxShadowMore: '1px 1px 35px 1px rgba(0,0,0,0.5)'
};

/**
 * Creates wrapper, image and loader DOM elements
 */
Image.prototype.createDOM = function() {
  var attr = this.attributes;

  var $wrapper = createEl('div', {
    id: attr.id ? attr.id : createId(),
    class: 'img-wrapper'
  });

  var $image = createEl('img', {
    src: this.settings.transparentGif,
    alt: attr.alt || '',
    'data-src': attr.src,
    'data-shadow': attr.isShadowed | false,
    class: 'img'
  });

  var $loader = createEl('img', {
    src: loaderIcon,
    alt: 'Image is loading...',
    class: 'loader'
  });

  $wrapper.appendChild($image);
  $wrapper.appendChild($loader);

  this.elements = {
    wrapper: $wrapper,
    image: $image,
    loader: $loader
  };
};

/**
 * Image loader
 * @param  {function} onComplete - Callback function
 */
Image.prototype.load = function(onComplete) {
  var _this = this;

  // Find the image and loader inside the wrapper
  var $img = _this.elements.image,
    $loader = _this.elements.loader;

  // If the image is not loaded yet
  if (!_this.isLoaded) {
    // Set opacity to zero
    TweenMax.set($img, { autoAlpha: 0 });

    // Does this image cast a shadow?
    var boxShadowProperty =
      $img.getAttribute('data-shadow') == 1 ? _this.settings.boxShadow : 'none';

    // After loading fade in the image, remove the svg loader
    // and load other images nearby
    $img.onload = function() {
      // Loaded now
      _this.isLoaded = true;

      // Fade in the image and append the shadow
      TweenMax.to($img, 1, {
        autoAlpha: 1,
        boxShadow: boxShadowProperty,
        onStart: function() {
          // Hide the loader
          TweenMax.set($loader, { autoAlpha: 0 });
        },
        onComplete: function() {
          if (!isUndefined(onComplete)) onComplete.call(_this);
        }
      });
    };

    // Load the image
    $img.setAttribute('src', $img.getAttribute('data-src'));
    // And remove the data-src
    $img.removeAttribute('data-src');
  }
};

export default Image;
