import { createEl, createId, isUndefined } from 'utilities/helpers';
import loaderIcon from 'images/loader-tail-spin.svg';

/*
 * Image constructor
 * @param  {object} attr - <img> attributes
 *                         src
 *                         alt
 *                         caption
 *                         shadow
 */
function Image(attr) {
  this.isLoaded = false;
  this.isShadowed =
    isUndefined(attr.shadow) || attr.shadow == false ? false : true;
  this.attributes = attr;
  this._createDOM();
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
Image.prototype._createDOM = function() {
  var $wrapper = createEl('div', {
    id: this.attributes.id ? this.attributes.id : createId(),
    class: 'img-wrapper'
  });

  var $image = createEl('img', {
    src: this.settings.transparentGif,
    alt: this.attributes.alt || '',
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
  var self = this;

  // Find the image and loader inside the wrapper
  var $img = self.elements.image,
    $loader = self.elements.loader;

  // If the image is not loaded yet
  if (!self.isLoaded) {
    // Set opacity to zero
    TweenMax.set($img, { autoAlpha: 0 });

    // Does this image cast a shadow?
    var boxShadowProperty = this.isShadowed ? self.settings.boxShadow : 'none';

    // After loading fade in the image, remove the svg loader
    // and load other images nearby
    $img.onload = function() {
      // Loaded now
      self.isLoaded = true;

      // Fade in the image and append the shadow
      TweenMax.to($img, 1, {
        autoAlpha: 1,
        boxShadow: boxShadowProperty,
        onStart: function() {
          // Hide the loader
          TweenMax.set($loader, { autoAlpha: 0 });
        },
        onComplete: function() {
          if (!isUndefined(onComplete)) onComplete.call(self);
        }
      });
    };

    // Load the image
    $img.setAttribute('src', this.attributes.src);
  }
};

export default Image;
