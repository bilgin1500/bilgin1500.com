import { TweenMax } from 'gsap';
import Draggable from 'gsap/Draggable';
import 'ThrowPropsPlugin';
import router from 'utilities/router';
import throttle from 'throttle-debounce/throttle';
import {
  $win,
  $doc,
  log,
  createEl,
  removeClass,
  addClass,
  getHeight
} from 'utilities/helpers';

/*
 * Gallery constructor
 * @param  {object} args - Argument object with projectSlug, sectionSlug and content properties
 * @return {element} - Wrapper element
 */
function Gallery(args) {
  this.projectSlug = args.projectSlug;
  this.sectionSlug = args.sectionSlug;
  this.slidesLength = args.content.sources.length;
  this.element = this._init(args);
}

Gallery.prototype = {
  // If active this gallery listenes to bound events
  isActive: false,

  // To disable the key and drag events during the tweens
  isNavLocked: false,

  /**
   * Creates the .gallery div and its content
   * @param  {object} args - Argument object with projectSlug and content properties
   * @return {element} - Wrapper element
   */
  _init: function(args) {
    var $gallery = createEl('div', { class: 'gallery' });
    var $allSlides = createEl('div', { class: 'slides' });
    var $allBullets = createEl('div', { class: 'bullets' });

    // Create slides and bullets with their containers
    for (var i = 0; i < args.content.sources.length; i++) {
      var $slide = this._createSlide(args.content.sources[i], $gallery);
      var $bullet = this._createBullet(i);
      $allSlides.appendChild($slide);
      $allBullets.appendChild($bullet);
    }

    // Append slides and bullets
    $gallery.appendChild($allSlides);
    $gallery.appendChild($allBullets);

    // Add resize event with throttle
    this._fixHeightWithThrottle = throttle(300, this._fixHeight.bind(this));
    $win.addEventListener('resize', this._fixHeightWithThrottle);

    // Add key down event with throttle
    this._onKeyDownWithThrottle = throttle(300, this._onKeyDown.bind(this));
    $doc.addEventListener('keydown', this._onKeyDownWithThrottle);

    return $gallery;
  },

  /**
   * Create a slide element from the source
   * @param  {object} source - Source object with source,caption,alt
   * @param  {element} $gallery - Gallery element for Draggable to bind
   * @return {element} Slide element
   */
  _createSlide: function(source, $gallery) {
    var _this = this;
    var $slide, $img, $caption, slideSource, swipeDirection;

    slideSource = require('content/' + _this.projectSlug + '/' + source.source);

    $img = createEl('img', {
      src: slideSource,
      alt: source.alt || source.caption || ''
    });

    $slide = createEl('figure');
    $slide.appendChild($img);

    if (source.caption) {
      $caption = createEl('figcaption');
      $caption.innerHTML = source.caption;
      $slide.appendChild($caption);
    }

    // Make the slides draggable and touch enabled via GSAP
    Draggable.create($slide, {
      type: 'x',
      lockAxis: true,
      throwProps: true,
      zIndexBoost: false,
      edgeResistance: 0.75,
      dragResistance: 0,
      bounds: $gallery,
      onDrag: function() {
        swipeDirection = this.getDirection();
      },
      onDragEnd: function() {
        if (!_this.isNavLocked) {
          // Lock the navigation
          _this.isNavLocked = true;
          // Log the swipe
          log('[IX] Slide swiped to the ' + swipeDirection);
          // Change the slide
          if (swipeDirection == 'left') {
            _this.next();
          } else if (swipeDirection == 'right') {
            _this.previous();
          }
        }
      }
    });

    return $slide;
  },

  /**
   * Create the navigation bullet
   * @param  {object} no - Bullet number (from 0)
   * @return {element} Bullet element
   */
  _createBullet: function(no) {
    var $bullet;
    $bullet = createEl('a', {
      href:
        '/projects/' +
        this.projectSlug +
        '/' +
        this.sectionSlug +
        '/' +
        (no + 1)
    });
    return $bullet;
  },

  /**
   * Find the adjacent slide index
   * @param  {string} direction - Previous or next
   * @return {number} Adjacent index
   */
  _findAdjacentIndex: function(direction) {
    if (direction == 'previous') {
      return this.currentIndex == 0
        ? this.slidesLength - 1
        : this.currentIndex - 1;
    } else if (direction == 'next') {
      return this.currentIndex == this.slidesLength - 1
        ? 0
        : this.currentIndex + 1;
    }
  },

  /**
   * Fix the slide wrapper's height according to the active slide's height
   */
  _fixHeight: function() {
    if (this.isActive) {
      // Find the current active slide
      var $allSlides = this.element.querySelectorAll('figure');
      var $currentSlide = $allSlides[this.currentIndex];

      // Change wrapper's height with animation
      if ($currentSlide) {
        // Cache the wrapper
        var $slidesWrapper = this.element.querySelector('.slides');

        // Tween the height
        TweenMax.to($slidesWrapper, 0.25, { height: getHeight($currentSlide) });
      }
    }
  },

  /**
   * Change slides on key press events
   * @param  {object} e - event
   */
  _onKeyDown: function(e) {
    if (this.isActive && !this.isNavLocked) {
      // Left is previous / right is next
      if (e.key == 'ArrowLeft') {
        this.isNavLocked = true;
        this.previous();
      } else if (e.key == 'ArrowRight') {
        this.isNavLocked = true;
        this.next();
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
  goTo: function(slideNo) {
    var _this = this;

    // Cache indexes
    var currentIndex = _this.currentIndex;
    var nextIndex = slideNo - 1;
    // Save global index
    _this.currentIndex = nextIndex;

    // Exit if same slide is called
    if (currentIndex == nextIndex) return;

    // First time open or not?
    var firstTime = typeof currentIndex == 'undefined';

    // Next slide's slideIn duration
    var nextSlideInDur = firstTime ? 0 : 0.5;

    // Cache
    var $slidesWrapper = _this.element.querySelector('.slides');
    var $allSlides = _this.element.querySelectorAll('figure');
    var $allBullets = _this.element.querySelectorAll('.bullets a');
    var $currSlide = $allSlides[currentIndex];
    var $currBullet = $allBullets[currentIndex];
    var $nextSlide = $allSlides[nextIndex];
    var $nextBullet = $allBullets[nextIndex];

    // If this isn't the first time we should slide out the current slide
    if (!firstTime) {
      TweenMax.to($currSlide, 1, {
        xPercent: currentIndex > nextIndex ? 200 : -200,
        ease: Power4.easeOut,
        onStart: function() {
          removeClass($currBullet, 'active');
        },
        onComplete: function() {
          removeClass($currSlide, 'active');
        }
      });
    }

    // Clear the callstack before applying the height
    // to the container so that we can get the right height
    TweenMax.delayedCall(0.1, function() {
      addClass($nextSlide, 'active');
      addClass($nextBullet, 'active');
      _this._fixHeight();
    });

    TweenMax.fromTo(
      $nextSlide,
      nextSlideInDur,
      { xPercent: currentIndex > nextIndex ? -200 : 200 },
      {
        xPercent: 0,
        ease: Power4.easeOut,
        onComplete: function() {
          // Open the key lock
          _this.isNavLocked = false;
        }
      }
    );
  }
};

export default Gallery;
