import {
  $win,
  $doc,
  createEl,
  createPageContainer,
  slugify,
  getWidth,
  getHeight,
  removeClass,
  addClass,
  buildMediaUrl,
  setBodyScroll,
  isUndefined,
  isFunction
} from 'utilities/helpers';
import throttle from 'throttle-debounce/throttle';
import objectAssign from 'object-assign';
import Momentum from 'utilities/momentum';
import Image from 'utilities/image';
import events from 'utilities/events';
import { getAbouts, getSetting, setSetting } from 'utilities/orm';
import 'css/about';

/**
 * Creates this page's elements
 * @param  {object} page - Object containing page data
 *                        name: Name of the page
 *                        slug: Slug for this page, created by the app.js
 * @return {element} The page wrapper
 */
function createDom(page) {
  var page = createPageContainer(page);
  var $page = page.$page;
  var $pageContent = page.$content;

  // Create a personal photo
  var photoInstance = new Image({
    src: buildMediaUrl({ name: 'family' }),
    alt: 'Photo'
  });
  var $photo = photoInstance.elements.wrapper;

  // Cache the photo
  var imageCache = getSetting('imageCacheForHome');
  imageCache.push(photoInstance);
  setSetting('imageCacheForHome', imageCache);
  //new Momentum($photo, { speed: 0.05 }).start();

  // Cache all the skill lists
  var abouts = getAbouts();

  // Elements
  var $sectionContainer = createEl('div', { class: 'abouts' });
  var $overlay = createEl('div', { class: 'overlay' });

  // Loop the skill list sections
  for (var i = 0; i < abouts.length; i++) {
    var $section = createEl('div', {
      id: slugify(abouts[i].title),
      class: 'about-container'
    });

    // Section titles like 'Design Approach' or 'Coding Skills'
    var $sectionTitle = createEl('h3', {
      innerText: abouts[i].title,
      class: 'about-title'
    });

    var $sectionContent = createEl('div', { class: 'about-content' });
    $section.appendChild($sectionTitle);

    // Loop for the lists in the sections
    abouts[i].list.forEach(function(listItem) {
      var $listContainer = createEl('div', { class: 'list' });

      // Sub title like 'JavaScript' or 'Balanced'
      var $listTitle = createEl('h4', {
        innerText: listItem.name,
        class: 'list-title'
      });
      var $listTitle2 = $listTitle.cloneNode(true);

      // Invisible contents
      var $listContent = createEl('div', { class: 'list-content' });
      var $listText = createEl('div', {
        class: 'list-text',
        innerHTML: listItem.content
      });
      var $bottomGradient = createEl('div', { class: 'bottom-gradient' });

      $listText.insertBefore($listTitle2, $listText.firstChild);
      $listContent.appendChild($listText);
      $listContent.appendChild($bottomGradient);
      $listContainer.appendChild($listTitle);
      $listContainer.appendChild($listContent);
      $sectionContent.appendChild($listContainer);
      $section.appendChild($sectionContent);

      // Initialize a section instance and cache it
      getSetting('aboutMeCache').push(
        new AboutMeSection(abouts[i].title + ' / ' + listItem.name, {
          container: $listContainer,
          title: $listTitle,
          content: $listContent,
          text: $listText,
          gradient: $bottomGradient,
          overlay: $overlay
        })
      );
    });

    $sectionContainer.appendChild($section);
  }

  $pageContent.appendChild($photo);
  $pageContent.appendChild($sectionContainer);
  $pageContent.appendChild($overlay);

  return $page;
}

/**
 * About me section constructor
 * @param {string} name - The identifier name of the section
 * @param {object} elements - Related elements created by createDom function
 */
function AboutMeSection(name, elements) {
  this.name = name;
  this.isNavLocked = false;
  this.isActive = false;
  this.container = elements.container;
  this.title = elements.title;
  this.content = elements.content;
  this.text = elements.text;
  this.gradient = elements.gradient;
  this.overlay = elements.overlay;
  this.title.addEventListener('click', this.open.bind(this));
}

/**
 * Creates the opening animation, plays it and adds events
 */
AboutMeSection.prototype.open = function() {
  this.isActive = true;
  this.contentRevealAnim = this._createContentRevealTween();
  this.timeline = new TimelineMax();
  // Bound events
  this._closeB = this.close.bind(this);
  this._resizeEventsB = this.resizeEvents.bind(this);
  this._keyEventsB = this.keyEvents.bind(this);

  // Opening timeline animations
  var t1 = TweenMax.to(this.content, 0.25, {
    width: '100%',
    backgroundColor: getSetting('spotColor')
  });
  var t2 = TweenMax.to(this.content, 0.25, {
    borderWidth: 10,
    borderColor: getSetting('spotColor'),
    backgroundColor: '#fff',
    boxShadow: '1px 1px 25px 1px rgba(0,0,0,0.25)'
  });
  var t3 = TweenMax.set(this.text, {
    display: 'block',
    autoAlpha: 0,
    immediateRender: false
  });
  var t4 = TweenMax.to(this.text, 0.25, { autoAlpha: 1 });
  var t5 = TweenMax.to(this.gradient, 0.25, { height: 50 });
  var t6 = TweenMax.set(this.overlay, {
    width: '100%',
    height: '100%',
    autoAlpha: 0,
    immediateRender: false
  });
  var t7 = TweenMax.to(this.overlay, 0.25, { autoAlpha: 0.5 });

  this.timeline
    .add(t1)
    .add(this.contentRevealAnim)
    .add(t2)
    .add(t3)
    .add(t4)
    .add(t5, '-=0.25')
    .add(t6, '-=0.5')
    .add(t7, '-=0.45');

  setBodyScroll(true);

  // Add events
  this.overlay.addEventListener('click', this._closeB);
  $win.addEventListener('resize', this._resizeEventsB);
  $doc.addEventListener('keydown', this._keyEventsB);
};

/**
 * Reverse the content revealing animation
 * @return {[type]} [description]
 */
AboutMeSection.prototype.close = function(onEnd) {
  var self = this;

  self.timeline.reverse().eventCallback('onReverseComplete', function() {
    if (isFunction(onEnd)) onEnd();

    self.isActive = false;
    setBodyScroll(false);
    self.overlay.removeEventListener('click', self._closeB);
    $win.removeEventListener('resize', self._resizeEventsB);
    $doc.removeEventListener('keydown', self._keyEventsB);
  });
};

/**
 * The box revealing animation is responsive to window resize
 * so we have to calculate new properties for both starting animation
 * and onresize event's animation 
 * @return {object} An object with all the related properties
 */
AboutMeSection.prototype._createContentRevealCSSProperties = function() {
  var windowW = getWidth('window');
  var windowH = getHeight('window');
  var contentW =
    windowW < getSetting('breakpoints').tablet ? windowW / 1.2 : windowW / 2;
  var contentH = windowH / 2;
  var containerBox = this.container.getBoundingClientRect();
  var centerX = windowW / 2 - contentW / 2 - containerBox.left;
  var centerY = windowH / 2 - contentH / 2 - containerBox.top;

  return {
    scaleX: 1,
    x: centerX,
    y: centerY,
    width: contentW,
    height: contentH,
    backgroundColor: '#fff',
    zIndex: 120
  };
};

/**
 * These function creates the dynamic tween for
 * the content box revealing (Its properties changes according to 
 * window width and height)
 */
AboutMeSection.prototype._createContentRevealTween = function() {
  return TweenMax.to(
    this.content,
    0.25,
    objectAssign({}, this._createContentRevealCSSProperties(), {
      ease: Circ.easeOut
    })
  );
};

/**
 * Throttled onresize events
 */
AboutMeSection.prototype.resizeEvents = throttle(300, function() {
  if (this.timeline.isActive()) {
    this.contentRevealAnim.updateTo({
      css: this._createContentRevealCSSProperties()
    });
  } else if (this.timeline.progress() == 1) {
    this._createContentRevealTween();
  }
});

/**
 * Get neighbour instances
 * @param  {string} direction - Previous or next
 * @return {object} The adjacent instance
 */
AboutMeSection.prototype._getAdjacentInstance = function(direction) {
  var adjIndex;
  var instances = getSetting('aboutMeCache');
  var currIndex = instances.findIndex(function(instance) {
    return instance.isActive == true;
  });

  if (direction == 'previous') {
    adjIndex = currIndex == 0 ? instances.length - 1 : currIndex - 1;
  } else if (direction == 'next') {
    adjIndex = currIndex == instances.length - 1 ? 0 : currIndex + 1;
  }

  return instances[adjIndex];
};

/**
 * Throttled keydown events
 * @param  {object} e - event
 */
AboutMeSection.prototype.keyEvents = throttle(300, function(e) {
  var self = this;

  if (!self.timeline.isActive()) {
    if (e.key == 'ArrowDown' || e.key == 'ArrowRight') {
      self.close(function() {
        self._getAdjacentInstance('next').open();
      });
    } else if (e.key == 'ArrowUp' || e.key == 'ArrowLeft') {
      self.close(function() {
        self._getAdjacentInstance('previous').open();
      });
    } else if (e.key == 'Escape') {
      self.close();
    }
  }

  e.preventDefault();
});

export default createDom;
