import router from 'utilities/router';
import throttle from 'throttle-debounce/throttle';
import {
  $doc,
  createEl,
  slugify,
  addClass,
  removeClass,
  log
} from 'utilities/helpers';
import { getSetting, getAdjSectionIndexes } from 'utilities/orm';
import Section from 'components/section';

/**
 * Sections constructor. It is used in the Project constructor.
 * Public properties and methods are:
 *     currentIndex: Property for current index number of the current active section
 *     isNavLocked: A flag property for the navigation because it is locked during the transitions.
 *     instances: A cache property for all the single section instances
 *     createDom: A method to create all related dom elements
 *     removeEvents: Method to remove all event listeners
 *     previous: Method to navigate to previous section
 *     next: Method to navigate to next section
 *     goto: Method to go to a desired destination
 * @param {object} prjData - Project data from database
 */
function Sections(prjData) {
  // Public variables
  this.currentIndex = null;
  this.isNavLocked = false;
  this.instances = [];
  // Private variables for this constructor
  var projectNavLinks = [];
  var adjIndexes;

  // Create the dom elements
  this.createDom = function() {
    var $wrapper = createEl('div', { class: 'project-sections-wrapper' });
    var $sections = createEl('div', { class: 'project-sections' });
    var $nav = createEl('div', { class: ['project-nav', 'bullets'] });
    var $guide = createEl('div', {
      class: 'project-guide',
      innerHTML: '<p>Reveal</p>'
    });

    $wrapper.appendChild($guide);
    $wrapper.appendChild($sections);
    $wrapper.appendChild($nav);

    for (var i = 0; i < prjData.sections.length; i++) {
      var sectionInstance = new Section(prjData, i, $guide);
      var $content = sectionInstance.createContentDom();
      var $navItem = sectionInstance.createNavDom();
      $sections.appendChild($content);
      $nav.appendChild($navItem);
      this.instances.push(sectionInstance);
      projectNavLinks.push($navItem);
    }

    return $wrapper;
  };

  /**
   * Key down/press events
   * @param  {object} e - event
   */
  function keyEvents(e) {
    if (!this.isNavLocked) {
      // Change the section or exit
      if (e.key == 'ArrowDown') {
        this.next();
      } else if (e.key == 'ArrowUp') {
        this.previous();
      } else if (e.key == 'Escape') {
        router.engine('/projects');
      } else if (e.key == 'p') {
        router.engine(prjData.prevPrjUrl);
      } else if (e.key == 'n') {
        router.engine(prjData.nextPrjUrl);
      }
    }
  }

  // Add key events
  var keyEventsT = throttle(300, keyEvents.bind(this));
  $doc.addEventListener('keydown', keyEventsT);

  /**
   * Remove all events from the section and its content instances
   */
  this.removeEvents = function() {
    this.instances.forEach(function(sectionInstance) {
      if ('removeEvents' in sectionInstance.contentInstance) {
        sectionInstance.contentInstance.removeEvents();
      }
    });
    $doc.removeEventListener('keydown', keyEventsT);
  };

  /**
   * Change the url to the previous section
   */
  this.previous = function() {
    var sectionSlug = slugify(prjData.sections[adjIndexes.previous].name);
    router.engine('/projects/' + prjData.slug + '/' + sectionSlug);
  };

  /**
   * Change the url to the next section
   */
  this.next = function() {
    var sectionSlug = slugify(prjData.sections[adjIndexes.next].name);
    router.engine('/projects/' + prjData.slug + '/' + sectionSlug);
  };

  /**
   * Change the section visually (slide, nav etc.)
   * @param  {object} name -  The name of the section to be changed
   * @param  {number} slideNo - The instance page (gallery slide etc.) to be changed
   */
  this.goto = function(name, slideNo) {
    var self = this;

    // Performance check for slide changes
    if (getSetting('isPerformanceActive')) {
      var changeBeginTime = performance.now();
    }

    // Cache the old and new index numbers
    var currentIndex = self.currentIndex;
    var nextIndex = prjData.sections.findIndex(function(section) {
      return slugify(section.name) == slugify(name);
    });
    // And change the currentIndex
    self.currentIndex = nextIndex;
    // Store adjacent indexes
    adjIndexes = getAdjSectionIndexes(prjData.name, nextIndex);

    // Cache the necessary elements
    var $allNavItems = projectNavLinks;
    var $currentNavItem = $allNavItems[currentIndex];
    var $nextNavItem = $allNavItems[nextIndex];
    var currSectionData = prjData.sections[currentIndex];
    var currSectionInstance = self.instances[currentIndex];
    var nextSectionData = prjData.sections[nextIndex];
    var nextSectionInstance = self.instances[nextIndex];

    // Check if we are on the same section
    if (currentIndex == nextIndex) {
      // This behaves like gallery router
      if (nextSectionData.type == 'gallery') {
        nextSectionInstance.contentInstance.goTo(slideNo);
      }
      // The rest is unnecessary
      return;
    }

    // Lock the navigation to prevent further interaction
    // while changing the sections
    self.isNavLocked = true;

    // Disable the nav links so that they can not be triggered
    // while we're playing the transition
    var disableNavLinks = function() {
      for (var i = 0; i < $allNavItems.length; i++) {
        var href = $allNavItems[i].href;
        $allNavItems[i].setAttribute('rel', href);
        $allNavItems[i].href = 'javascript:;';
      }
    };

    var enableNavLinks = function() {
      for (var i = 0; i < $allNavItems.length; i++) {
        var href = $allNavItems[i].getAttribute('rel');
        $allNavItems[i].removeAttribute('rel');
        $allNavItems[i].href = href;
      }
    };

    // Disable nav links
    disableNavLinks();

    // Set yPercents
    var yPercentCurr,
      yPercentNext,
      percent = 100;

    if (currentIndex == 0 && nextIndex == prjData.sections.length - 1) {
      // Loop from beginning
      yPercentCurr = percent;
      yPercentNext = -percent;
    } else if (currentIndex == prjData.sections.length - 1 && nextIndex == 0) {
      // Loop from end
      yPercentCurr = -percent;
      yPercentNext = percent;
    } else if (currentIndex > nextIndex) {
      // Going backwards
      yPercentCurr = percent;
      yPercentNext = -percent;
    } else if (currentIndex < nextIndex) {
      // Going forward
      yPercentCurr = -percent;
      yPercentNext = percent;
    }

    var sectionTransitionSec = 0.5;

    // When there's a previous ('current' in this context)
    // section available first tween it out
    if (currentIndex !== null) {
      var t1 = TweenMax.to(currSectionInstance.wrapper, sectionTransitionSec, {
        transform: 'translateY(' + yPercentCurr + 'vh)',
        ease: Power4.easeOut,
        onStart: function() {
          // Make nav item inactive
          removeClass($currentNavItem, 'active');

          // Prevent further drag operations on this section while tweening
          currSectionInstance.draggable.disable();

          // Pause current video
          if (currSectionData.type == 'video') {
            currSectionInstance.contentInstance.pause();
          }

          // Make the section inactive..
          currSectionInstance.contentInstance.isActive = false;
          // and reset its position
          if ('resetPosition' in currSectionInstance.contentInstance) {
            currSectionInstance.contentInstance.resetPosition();
          }
        },
        onComplete: function() {
          // After anim. completedmMake the section inactive
          removeClass(currSectionInstance.wrapper, 'active');
        }
      });
    }

    TweenMax.fromTo(
      nextSectionInstance.wrapper,
      sectionTransitionSec,
      {
        transform: 'translateY(' + yPercentNext + 'vh)'
      },
      {
        transform: 'translateY(0)',
        ease: Power4.easeOut,
        onStart: function() {
          // Toggle classes
          addClass($nextNavItem, 'active');
          addClass(nextSectionInstance.wrapper, 'active');

          // Prevent drag operations on this section while tweening
          nextSectionInstance.draggable.disable();

          // If next section is a gallery we should prepare the right
          // page before the animation begins
          if (nextSectionData.type == 'gallery') {
            nextSectionInstance.contentInstance.goTo(slideNo, true);
          }
        },
        onComplete: function() {
          // If next section is a video we should play it
          // after the animation is completed
          if (nextSectionData.type == 'video') {
            nextSectionInstance.contentInstance.api.play();
          }

          // After the section appears it means we're active
          nextSectionInstance.contentInstance.isActive = true;

          // Open the keyboard lock,
          // enable nav links and
          // allow drag operations
          // after callstack cleaning
          self.isNavLocked = false;
          nextSectionInstance.draggable.enable();
          enableNavLinks();

          // Log the perf
          if (getSetting('isPerformanceActive')) {
            var changeEndTime = performance.now();
            log(
              '[PERF] Slide change has ended in ' +
                Math.round(changeEndTime - changeBeginTime) +
                ' milliseconds.',
              { color: 'green' }
            );
          }
        }
      }
    );
  };
}

export default Sections;
