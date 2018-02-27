import normalizeWheel from 'normalize-wheel';
import throttle from 'throttle-debounce/throttle';
import Image from 'utilities/image';
import router from 'utilities/router';
import {
  $win,
  $doc,
  log,
  createEl,
  removeClass,
  addClass,
  hasClass,
  getHeight,
  getWidth,
  isUndefined,
  slugify,
  buildMediaUrl
} from 'utilities/helpers';
import 'css/gallery';

/**
 * Gallery constructor
 * @param  {object} sectionData from database
 * @param  {string} projectSlug
 * @param  {object} section - Parent section
 */
function Gallery(sectionData, projectSlug, section) {
  this.projectSlug = projectSlug;
  this.baseUrl = '/projects/' + projectSlug + '/' + slugify(sectionData.name);
  this.isActive = false;
  this.isNavLocked = false;
  this.currentIndex = null;
  this.elasticEase = Elastic.easeOut.config(1, 0.75);
  this.slides = sectionData.content;
  this._createDom();
  this._addEvents();
}

/**
 * Creates the .gallery div and its content and
 * appends it to the Gallery instance's element property
 */
Gallery.prototype._createDom = function() {
  var self = this;

  var $gallery = createEl('div', { class: 'gallery' });
  var $allSlides = createEl('div', { class: 'slides' });
  var $allBullets = createEl('div', { class: 'bullets' });
  var $allBulletsInnerWrapper = createEl('div', { class: 'inner-wrapper' });

  // Create slides and bullets with their containers
  for (var i = 0; i < this.slides.length; i++) {
    var $slide = self._createSlide(i, this.slides[i]);
    var $bullet = self._createBullet(i, this.slides[i].alt);
    $allSlides.appendChild($slide);
    $allBulletsInnerWrapper.appendChild($bullet);
    $allBullets.appendChild($allBulletsInnerWrapper);
  }

  // Append slides and bullets
  $gallery.appendChild($allSlides);
  $gallery.appendChild($allBullets);

  this.element = $gallery;
};

/**
 * Create a slide element from the source and make it draggable
 * @param  {number} index - Index number of the slide 
 * @param  {object} source - Source object with source,caption,alt,shadow
 * @return {element} Slide element
 */
Gallery.prototype._createSlide = function(index, source) {
  var self = this;
  var $slide,
    $img,
    $loader,
    $caption,
    $captionTitle,
    $captionText,
    swipeDirection;

  // Create the image instance and cache returning wrapper and image elements
  var imgInstance = new Image({
    src: buildMediaUrl({ project: this.projectSlug, name: source.source }),
    alt: source.alt || source.caption || '',
    shadow: source.shadow
  });
  var $wrapper = imgInstance.elements.wrapper;
  var $image = imgInstance.elements.image;

  // Save image instances to be able to load in the future
  self.slides[index].image = imgInstance;

  // Create the <figure> wrapper
  $slide = createEl('figure');
  $slide.appendChild($wrapper);
  // Append the caption if available
  if (source.caption) {
    $caption = createEl('figcaption');
    $captionTitle = createEl('h4');
    $captionText = createEl('p');
    $captionTitle.innerHTML = source.alt;
    $captionText.innerHTML = source.caption;
    $caption.appendChild($captionTitle);
    $caption.appendChild($captionText);
    $slide.appendChild($caption);
  }

  // Make the images draggable and touch enabled via GSAP
  var dragSwipeDir,
    dragStartY,
    dragStartX,
    dragThreshold = 75,
    dragBoundaries = 100;

  imgInstance._draggable = Draggable.create($image, {
    type: 'x,y',
    lockAxis: true,
    throwProps: true,
    zIndexBoost: false,
    edgeResistance: 0.75,
    dragResistance: 0,
    cursor: 'move',
    bounds: {
      minX: -dragBoundaries,
      maxX: dragBoundaries
    },
    onPress: function(e) {
      // Update the boundaries so that they cover the image
      var slideHeight = getHeight($slide);
      var imageHeight = getHeight($image);

      this.applyBounds({
        minX: -dragBoundaries,
        maxX: dragBoundaries,
        minY: -imageHeight + slideHeight,
        maxY: 0
      });

      // Let the user sense that the image is pressed
      if (imgInstance.isShadowed) {
        TweenMax.to($image, 0.5, {
          boxShadow: imgInstance.settings.boxShadowMore
        });
      }

      // Stop bubbling so that this draggable won't interfere with
      // section's draggable system
      e.stopPropagation();
    },
    onRelease: function() {
      // Release the image's hover
      if (imgInstance.isShadowed) {
        TweenMax.to($image, 0.5, {
          boxShadow: imgInstance.settings.boxShadow
        });
      }
    },
    onDrag: function() {
      dragSwipeDir = this.getDirection();
    },
    onDragEnd: function() {
      // If not dragged properly we'll use this tween
      // to reset target's position with motion
      var resetDragToStartPos = TweenMax.to(this.target, 0.5, {
        paused: true,
        x: 0,
        ease: self.elasticEase
      });

      // The axis along which movement is locked during that
      // particular drag (either "x" or "y"). For example,
      // if lockAxis is true on a Draggable of type:"x,y",
      // and the user starts dragging horizontally,
      // lockedAxis would be "y" because vertical movement
      // won't be allowed during that drag.
      if (this.lockedAxis == 'y') {
        // Check if the user is dragging good enough
        // If he is, proceed with dragEnd effects.
        if (this.endX > dragThreshold || this.endX < -dragThreshold) {
          // Left/Right: Change the gallery slide
          // Down/Up: Scroll the gallery image
          if (dragSwipeDir == 'left') {
            self.next();
          } else if (dragSwipeDir == 'right') {
            self.previous();
          }
        }
        resetDragToStartPos.play();
      }

      // Log the interaction and finish with the interaction
      log('[IX] Gallery swiped to the ' + dragSwipeDir);
    }
  });

  return $slide;
};

/**
 * Create the navigation bullet
 * @param  {number} index - Index number of the slide
 * @param  {string} alt - Alternative text (title of the slide)
 * @return {element} Bullet element
 */
Gallery.prototype._createBullet = function(index, alt) {
  var $bullet = createEl('a', {
    href: this.baseUrl + '/' + (index + 1)
  });

  var $bulletSpan = createEl('span');
  var $bulletText = createEl('span');
  $bulletText.innerText = alt;
  $bulletSpan.appendChild($bulletText);
  $bullet.appendChild($bulletSpan);

  return $bullet;
};

/**
 * Find the adjacent slide index
 * @param  {string} direction - Previous or next
 * @param  {number} index - Optional index parameter if the adjacents we want to calculate are other than the current index
 * @return {number} Adjacent index
 */
Gallery.prototype._findAdjacentIndex = function(direction, index) {
  var currentIndex = isUndefined(index) ? this.currentIndex : index;

  if (direction == 'previous') {
    return currentIndex == 0 ? this.slides.length - 1 : currentIndex - 1;
  } else if (direction == 'next') {
    return currentIndex == this.slides.length - 1 ? 0 : currentIndex + 1;
  }
};

/**
 * Change the url to the previous slide
 */
Gallery.prototype.previous = function() {
  router.engine(this.baseUrl + '/' + (this._findAdjacentIndex('previous') + 1));
};

/**
 * Change the url to the next slide
 */
Gallery.prototype.next = function() {
  router.engine(this.baseUrl + '/' + (this._findAdjacentIndex('next') + 1));
};

/**
 * Change the current slide
 * @param  {number} slideNo - Slide number to be changed
 */
Gallery.prototype.goTo = function(slideNo, immediately) {
  var self = this;

  // Cache indexes
  var currentIndex = self.currentIndex;
  var nextIndex = slideNo - 1;

  // Save current index globally
  self.currentIndex = nextIndex;

  // Exit if same slide is called
  if (currentIndex == nextIndex) return;

  // Lock the navigation to prevent further interaction
  // while changing the galery images
  self.isNavLocked = true;

  // First time opened?
  var firstTime = currentIndex == null;

  // Cache
  var $slidesWrapper = self.element.querySelector('.slides');
  var $allSlides = self.element.querySelectorAll('figure');
  var $allBullets = self.element.querySelectorAll('.bullets a');

  if (!firstTime) {
    var $currSlide = $allSlides[currentIndex];
    var currImgInstance = self.slides[currentIndex].image;
    var $currBullet = $allBullets[currentIndex];
  }

  var $nextSlide = $allSlides[nextIndex];
  var $nextBullet = $allBullets[nextIndex];

  // Set xPercents
  var xPercentCurr, xPercentNext;
  if (currentIndex == 0 && nextIndex == self.slides.length - 1) {
    // Loop from beginning
    xPercentCurr = 200;
    xPercentNext = -200;
  } else if (currentIndex == self.slides.length - 1 && nextIndex == 0) {
    // Loop from end
    xPercentCurr = -200;
    xPercentNext = 200;
  } else if (currentIndex > nextIndex) {
    // Going backwards
    xPercentCurr = 200;
    xPercentNext = -200;
  } else if (currentIndex < nextIndex) {
    // Going forward
    xPercentCurr = -200;
    xPercentNext = 200;
  }

  // Next slide's slideIn duration
  var transitionSec = immediately ? 0.01 : 0.5;

  // If this isn't the first time we should slide out the current slide
  if (!firstTime) {
    TweenMax.to($currSlide, transitionSec, {
      transform: 'translateX(' + xPercentCurr + 'vh)',
      ease: Power4.easeOut,
      onStart: function() {
        removeClass($currBullet, 'active');
      },
      onComplete: function() {
        removeClass($currSlide, 'active');
        // Reset the current image's position
        self.resetPosition(currImgInstance.elements.image);
      }
    });
  }

  TweenMax.fromTo(
    $nextSlide,
    transitionSec,
    {
      transform: 'translateX(' + xPercentNext + 'vh)'
    },
    {
      transform: 'translateX(0)',
      ease: Power4.easeOut,
      onStart: function() {
        // Make this index active
        addClass($nextSlide, 'active');
        addClass($nextBullet, 'active');
      },
      onComplete: function() {
        // Open the nav lock
        self.isNavLocked = false;
        // Load the gallery image with adjacent images
        var currIndex = self.currentIndex;
        var preIndex = self._findAdjacentIndex('previous', currIndex);
        var nextIndex = self._findAdjacentIndex('next', currIndex);

        // Start loading by first one
        self.slides[currIndex].image.load(function() {
          self.slides[preIndex].image.load(function() {
            self.slides[nextIndex].image.load();
          });
        });
      }
    }
  );
};

/**
 * Change slides on key press events
 * @param  {object} e - event
 */
Gallery.prototype._keyNav = throttle(300, function(e) {
  if (this.isActive && !this.isNavLocked) {
    // Left is previous / right is next
    if (e.key == 'ArrowLeft') {
      this.previous();
    } else if (e.key == 'ArrowRight') {
      this.next();
    }
  }
});

/**
 * Scroll current image on mouse wheel
 * @param  {object} e - event
 */
Gallery.prototype._mouseWheelNav = function(e) {
  if (this.isActive && !this.isNavLocked) {
    var normalized = normalizeWheel(e);

    // Get the current image instance and img element
    var imgInstance = this.slides[this.currentIndex].image;
    var $image = imgInstance.elements.image;

    // Scroll only iif the image is loaded
    if (imgInstance.isLoaded) {
      // Left and right scroll
      if (normalized.pixelX > 50) {
        this.next();
        return;
      } else if (normalized.pixelX < -50) {
        this.previous();
        return;
      }

      // If the draggable isn't initiated yet
      // ThrowPropsPlugin and onUpdate method don't work
      if (
        isUndefined(imgInstance._initiatedDragging) ||
        !imgInstance._initiatedDragging
      ) {
        imgInstance._draggable[0].startDrag(e);
        imgInstance._draggable[0].endDrag(e);
        imgInstance._initiatedDragging = true;
      }

      // Up and down scroll
      // It's synchronized with the draggable
      ThrowPropsPlugin.to($image, {
        throwProps: { y: normalized.pixelY * -25 },
        force3D: true,
        onUpdate: function() {
          imgInstance._draggable[0].update({
            applyBounds: true
          });
        }
      });
    }
  }
};

/**
 * Reset position
 */
Gallery.prototype.resetPosition = function(el) {
  if (isUndefined(el)) {
    el = this.slides[this.currentIndex].image.elements.image;
  }
  TweenMax.set(el, { y: 0, x: 0 });
};

/**
 * Adds all event listeners of this Gallery instance
 */
Gallery.prototype._addEvents = function() {
  // !! A new function reference is created after .bind() is called!
  this._keyNavBound = this._keyNav.bind(this);
  this._mouseWheelNavBound = this._mouseWheelNav.bind(this);

  $doc.addEventListener('keydown', this._keyNavBound);
  $doc.addEventListener('mousewheel', this._mouseWheelNavBound);
};

/**
 * Removes all event listeners of this Gallery instance
 */
Gallery.prototype.removeEvents = function() {
  $doc.removeEventListener('keydown', this._keyNavBound);
  $doc.removeEventListener('mousewheel', this._mouseWheelNavBound);
};

export default Gallery;
