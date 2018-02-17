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
  isUndefined
} from 'utilities/helpers';
import 'css/gallery';

/*
 * Gallery constructor
 * @param  {object} args - Argument object with projectSlug, sectionSlug and content properties
 */
function Gallery(args) {
  this.isActive = false;
  this.isNavLocked = false;
  this.currentIndex = null;
  this.projectSlug = args.projectSlug;
  this.sectionSlug = args.sectionSlug;
  this.slidesLength = args.content.sources.length;
  this.images = [];
  this.element = this._init(args);
}

Gallery.prototype = {
  /**
   * Creates the .gallery div and its content
   * @param  {object} args - argument:
   *                       projectSlug: current project's slug
   *                       sectionSlug: current section's slug
   *                       content: section's content property, usually an array
   * @return {element} - Wrapper element
   */
  _init: function(args) {
    var _this = this;

    var $gallery = createEl('div', { class: 'gallery' });
    var $allSlides = createEl('div', { class: 'slides' });
    var $allBullets = createEl('div', { class: 'bullets' });
    var $allBulletsInnerWrapper = createEl('div', { class: 'inner-wrapper' });

    // Create slides and bullets with their containers
    for (var i = 0; i < args.content.sources.length; i++) {
      var $slide = _this._createSlide(args.content.sources[i]);
      var $bullet = _this._createBullet(i, args.content.sources[i].alt);
      $allSlides.appendChild($slide);
      $allBulletsInnerWrapper.appendChild($bullet);
      $allBullets.appendChild($allBulletsInnerWrapper);
    }

    // Append slides and bullets
    $gallery.appendChild($allSlides);
    $gallery.appendChild($allBullets);

    // Add key down event with throttle
    _this._keyNavWithThrottle = throttle(300, _this._keyNav.bind(_this));
    $doc.addEventListener('keydown', _this._keyNavWithThrottle);

    // Add mouse wheel nav
    //$doc.addEventListener('mousewheel', _this._mouseWheelNav.bind(_this));

    return $gallery;
  },

  /**
   * Create a slide element from the source and make it draggable
   * @param  {object} source - Source object with source,caption,alt,shadow
   * @return {element} Slide element
   */
  _createSlide: function(source) {
    var _this = this;
    var $slide, $img, $loader, $caption, slideSource, swipeDirection;

    slideSource = require('../projects/' +
      _this.projectSlug +
      '/' +
      source.source);

    // Does this image cast a shadow?
    var isShadowed =
      isUndefined(source.shadow) ||
      (!isUndefined(source.shadow) && source.shadow == true)
        ? true
        : false;

    // Create the image instance and cache returning wrapper and image elements
    var imgInstance = new Image({
      src: slideSource,
      alt: source.alt || source.caption || '',
      isShadowed: isShadowed
    });
    var $wrapper = imgInstance.elements.wrapper;
    var $image = imgInstance.elements.image;

    // Save image instances to be able to load in the future
    this.images.push(imgInstance);

    // Create the <figure> wrapper
    $slide = createEl('figure');
    $slide.appendChild($wrapper);
    // Append the caption if available
    if (source.caption) {
      $caption = createEl('figcaption');
      $caption.innerHTML = source.caption;
      $slide.appendChild($caption);
    }

    // Make the images draggable and touch enabled via GSAP
    var dragSwipeDir,
      dragStartY,
      dragStartX,
      dragThreshold = 75,
      dragBoundaries = 100;

    Draggable.create($wrapper, {
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
      onPress: function() {
        // Cache these values
        dragStartY = this.y;
        dragStartX = this.x;

        // Update the boundaries so that they cover the image
        var slideHeight = getHeight($slide);
        var imageHeight = getHeight($image);
        var dynamicDragBoundaryMinY = -imageHeight + slideHeight;

        this.applyBounds({
          minX: -dragBoundaries,
          maxX: dragBoundaries,
          minY: dynamicDragBoundaryMinY,
          maxY: 0
        });

        // Let the user sense that the image is pressed
        if (isShadowed) {
          TweenMax.to($image, 0.5, {
            boxShadow: imgInstance.settings.boxShadowMore
          });
        }

        // Stop bubbling so that this draggable won't interfere with
        // section's draggable system
        event.stopPropagation();
      },
      onRelease: function() {
        // Release the image's hover
        if (isShadowed) {
          TweenMax.to($image, 0.5, {
            boxShadow: imgInstance.settings.boxShadow
          });
        }
      },
      onDrag: function() {
        dragSwipeDir = this.getDirection();
      },
      onDragEnd: function() {
        var thisDraggable = this;

        // If not dragged properly we'll use this tween
        // to reset target's position with motion
        var resetDragToStartPos = TweenMax.to(thisDraggable.target, 0.5, {
          paused: true,
          y: dragStartY,
          x: dragStartX,
          ease: Elastic.easeOut.config(1, 0.75)
        });

        // The axis along which movement is locked during that
        // particular drag (either "x" or "y"). For example,
        // if lockAxis is true on a Draggable of type:"x,y",
        // and the user starts dragging horizontally,
        // lockedAxis would be "y" because vertical movement
        // won't be allowed during that drag.
        if (thisDraggable.lockedAxis == 'y') {
          // Check if the user is dragging good enough
          // If he is, proceed with dragEnd effects.
          if (
            thisDraggable.endX > dragThreshold ||
            thisDraggable.endX < -dragThreshold
          ) {
            // Left/Right: Change the gallery slide
            // Down/Up: Scroll the gallery image
            if (dragSwipeDir == 'left') {
              _this.next();
            } else if (dragSwipeDir == 'right') {
              _this.previous();
            }
          }
          resetDragToStartPos.play();
        }

        // Log the interaction and finish with the interaction
        log('[IX] Gallery swiped to the ' + dragSwipeDir);
      }
    });

    return $slide;
  },

  /**
   * Fit the current slide's image inside its container element
   */
  _bestFitCurrentImage: function() {
    if (this.isActive) {
      // Find the image and loader inside the slide
      var $img = this.currentSlide.querySelector('.image');

      // Ratios
      var imgAspectRatio = getWidth($img) / getHeight($img),
        slideAspectRatio =
          getWidth(this.currentSlide) / getHeight(this.currentSlide);

      // This means that our image is taller than its container
      // This will be also checked on every resize event
      if (imgAspectRatio < slideAspectRatio && !hasClass($img, 'taller')) {
        addClass($img, 'taller');
      } else if (
        imgAspectRatio > slideAspectRatio &&
        hasClass($img, 'taller')
      ) {
        removeClass($img, 'taller');
      }
    }
  },

  /**
   * Create the navigation bullet
   * @param  {number} no - Bullet number (from 0)
   * @param  {string} alt - Alternative text (title of the slide)
   * @return {element} Bullet element
   */
  _createBullet: function(no, alt) {
    var $bullet = createEl('a', {
      href:
        '/projects/' +
        this.projectSlug +
        '/' +
        this.sectionSlug +
        '/' +
        (no + 1)
    });

    var $bulletSpan = createEl('span');
    var $bulletText = createEl('span');
    $bulletText.innerText = alt;
    $bulletSpan.appendChild($bulletText);
    $bullet.appendChild($bulletSpan);

    return $bullet;
  },

  /**
   * Find the adjacent slide index
   * @param  {string} direction - Previous or next
   * @param  {number} index - Optional index parameter if the adjacents we want to calculate are other than the current index
   * @return {number} Adjacent index
   */
  _findAdjacentIndex: function(direction, index) {
    var currentIndex = isUndefined(index) ? this.currentIndex : index;

    if (direction == 'previous') {
      return currentIndex == 0 ? this.slidesLength - 1 : currentIndex - 1;
    } else if (direction == 'next') {
      return currentIndex == this.slidesLength - 1 ? 0 : currentIndex + 1;
    }
  },

  /**
   * Change slides on key press events
   * @param  {object} e - event
   */
  _keyNav: function(e) {
    if (this.isActive && !this.isNavLocked) {
      // Left is previous / right is next
      if (e.key == 'ArrowLeft') {
        this.previous();
      } else if (e.key == 'ArrowRight') {
        this.next();
      }
    }
  },

  /**
   * Scroll current image on mouse wheel
   * @param  {object} e - event
   */
  _mouseWheelNav: function(e) {
    if (this.isActive && !this.isNavLocked) {
      var normalized = normalizeWheel(e);
      var $img = this.currentSlide.querySelector('img');

      if ($img.hasAttribute('src')) {
        TweenMax.to($img, 0.15, {
          y: '-=' + normalized.pixelY,
          ease: Power4.easeOut
        });
      }
    }
  },

  /**
   * Change the url to the previous slide
   */
  previous: function() {
    router.engine(
      '/projects/' +
        this.projectSlug +
        '/' +
        this.sectionSlug +
        '/' +
        (this._findAdjacentIndex('previous') + 1)
    );
  },

  /**
   * Change the url to the next slide
   */
  next: function() {
    router.engine(
      '/projects/' +
        this.projectSlug +
        '/' +
        this.sectionSlug +
        '/' +
        (this._findAdjacentIndex('next') + 1)
    );
  },

  /**
   * Change the current slide
   * @param  {number} slideNo - Slide number to be changed
   */
  goTo: function(slideNo, immediately) {
    var _this = this;

    // Cache indexes
    var currentIndex = _this.currentIndex;
    var nextIndex = slideNo - 1;

    // Save current index globally
    _this.currentIndex = nextIndex;

    // Exit if same slide is called
    if (currentIndex == nextIndex) return;

    // Lock the navigation to prevent further interaction
    // while changing the galery images
    _this.isNavLocked = true;

    // First time opened?
    var firstTime = currentIndex == null;

    // Cache
    var $slidesWrapper = _this.element.querySelector('.slides');
    var $allSlides = _this.element.querySelectorAll('figure');
    var $allBullets = _this.element.querySelectorAll('.bullets a');
    var $currSlide = $allSlides[currentIndex];
    var $currBullet = $allBullets[currentIndex];
    var $nextSlide = $allSlides[nextIndex];
    var $nextBullet = $allBullets[nextIndex];

    // Save current slide globally
    _this.currentSlide = $nextSlide;

    // Set xPercents
    var xPercentCurr, xPercentNext;
    if (currentIndex == 0 && nextIndex == _this.slidesLength - 1) {
      // Loop from beginning
      xPercentCurr = 200;
      xPercentNext = -200;
    } else if (currentIndex == _this.slidesLength - 1 && nextIndex == 0) {
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
          _this.isNavLocked = false;
          // Load the gallery image with adjacent images
          var currIndex = _this.currentIndex;
          var preIndex = _this._findAdjacentIndex('previous', currIndex);
          var nextIndex = _this._findAdjacentIndex('next', currIndex);

          // Start loading by first one
          _this.images[currIndex].load(function() {
            _this.images[preIndex].load(function() {
              _this.images[nextIndex].load();
            });
          });
        }
      }
    );
  }
};

export default Gallery;
