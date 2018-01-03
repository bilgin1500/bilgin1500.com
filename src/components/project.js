import { TweenMax } from 'gsap';
import Draggable from 'gsap/Draggable';
import 'ThrowPropsPlugin';
import throttle from 'throttle-debounce/throttle';
import {
  $win,
  $doc,
  log,
  createEl,
  clearInnerHTML,
  toggleClass,
  removeClass,
  addClass
} from 'utilities/helpers';
import events from 'utilities/events';
import router from 'utilities/router';
import { createIcon } from 'utilities/svg';
import Gallery from 'components/gallery';
import Video from 'components/video';
import Info from 'components/info';
import projectTemplate from 'templates/project';
import data from 'content/index';

/*
  The master project object.
  There can always be one project window available.
  Public:
  data: Current project's data property
  sections: Properties and methods to build the sections
  open and close: Methods to control to build and destroy a project
 */
var Project = {
  // Current project data
  data: {},

  // To check if project window is open or close
  isOpen: false,

  // To disable the key and drag events during the tweens
  isNavLocked: false,

  // Setup and init subsections of the current project
  sections: {
    // Current section's index number. It is not set yet!
    currentIndex: null,

    // Section cache [{type:gallery,...gallery properties and methods etc.}]
    cache: [],

    /**
     * Setup sections and the slider mechanism of the project
     */
    _init: function() {
      var _this = this;

      var $showcaseWrapper = $doc.getElementsByClassName('project-showcase')[0];
      var $navWrapper = $doc.getElementsByClassName('project-nav')[0];

      // Parse all sections
      _this.data.sections.forEach(function(section, curr) {
        // Create wrappers
        var $sectionWrapper = createEl('div', {
          class: 'section section-' + section.slug
        });
        var $sectionInnerWrapper = createEl('div', {
          class: 'section-inner-wrapper'
        });

        // Create new content's instance, append and parse it
        var instanceArgs = {
          projectSlug: _this.data.slug,
          sectionSlug: section.slug,
          content: section.content
        };

        switch (section.type) {
          case 'video':
            _this.sections.cache[curr] = new Video(instanceArgs);
            _this.sections.cache[curr].type = 'video';
            break;
          case 'gallery':
            _this.sections.cache[curr] = new Gallery(instanceArgs);
            _this.sections.cache[curr].type = 'gallery';
            break;
          case 'info':
            _this.sections.cache[curr] = new Info(instanceArgs);
            _this.sections.cache[curr].type = 'info';
            break;
        }

        // Append section content and wrappers
        $sectionInnerWrapper.appendChild(_this.sections.cache[curr].element);
        $sectionWrapper.appendChild($sectionInnerWrapper);
        $showcaseWrapper.appendChild($sectionWrapper);

        // Make the sections draggable and touch enabled via GSAP
        var swipeDirection;

        Draggable.create($sectionWrapper, {
          type: 'y',
          lockAxis: true,
          throwProps: true,
          zIndexBoost: false,
          edgeResistance: 0.75,
          dragResistance: 0,
          minimumMovement: 100,
          bounds: $showcaseWrapper,
          onDrag: function() {
            swipeDirection = this.getDirection();
          },
          onDragEnd: function() {
            if (!_this.isNavLocked) {
              // Log the swipe
              log('[IX] Section swiped to the ' + swipeDirection);
              // Change the section & lock the navigation
              if (swipeDirection == 'down') {
                _this.isNavLocked = true;
                _this.sections.previous.call(_this);
              } else if (swipeDirection == 'up') {
                _this.isNavLocked = true;
                _this.sections.next.call(_this);
              }
            }
          }
        });

        // Cache wrappers
        _this.sections.cache[curr].$wrapper = $sectionWrapper;

        // Create nav item for this section
        var $navItem = createEl('a', {
          href: '/projects/' + _this.data.slug + '/' + section.slug
        });

        var $navItemText = createEl('span');
        $navItemText.innerHTML = section.name;

        // Append nav item
        $navItem.appendChild(createIcon(section.icon));
        $navItem.appendChild($navItemText);
        $navWrapper.appendChild($navItem);
      });

      // Add key down event with throttle
      _this.sections._onKeyDownWithThrottle = throttle(
        300,
        _this.sections._onKeyDown.bind(_this)
      );
      $doc.addEventListener('keydown', _this.sections._onKeyDownWithThrottle);
    },

    /**
     * Key down/press events
     * @param  {object} e - event
     */
    _onKeyDown: function(e) {
      if (!this.isNavLocked) {
        // Change the section or exit
        if (e.key == 'ArrowDown') {
          this.isNavLocked = true;
          this.sections.next.call(this);
        } else if (e.key == 'ArrowUp') {
          this.isNavLocked = true;
          this.sections.previous.call(this);
        } else if (e.key == 'Escape') {
          router.engine('/projects');
        }
      }
    },

    /**
     * Find the adjacent section index
     * @param  {string} direction - Previous or next
     * @return {number} Adjacent index
     */
    _findAdjacentIndex: function(direction) {
      if (direction == 'previous') {
        return this.sections.currentIndex == 0
          ? this.data.sections.length - 1
          : this.sections.currentIndex - 1;
      } else if (direction == 'next') {
        return this.sections.currentIndex == this.data.sections.length - 1
          ? 0
          : this.sections.currentIndex + 1;
      }
    },

    /**
     * Change the url to the previous section
     */
    previous: function() {
      router.engine(
        '/projects/' +
          this.data.slug +
          '/' +
          this.data.sections[
            this.sections._findAdjacentIndex.call(this, 'previous')
          ].slug
      );
    },

    /**
     * Change the url to the next section
     */
    next: function() {
      router.engine(
        '/projects/' +
          this.data.slug +
          '/' +
          this.data.sections[
            this.sections._findAdjacentIndex.call(this, 'next')
          ].slug
      );
    },

    /**
     * Change the section visually (slide, nav etc.)
     * @param  {object} slug -  The slug of the section to be changed
     * @param  {number} slideNo - The section page to be changed
     */
    change: function(slug, slideNo) {
      var _this = this;

      // Performance check for slide changes
      if (data.settings.isPerformanceActive) {
        var changeBeginTime = performance.now();
      }

      // Cache the old and new index numbers
      var currentIndex = _this.sections.currentIndex;
      var nextIndex = _this.data.sections.findIndex(function(section) {
        return section.slug == slug;
      });
      // And save the currentIndex
      _this.sections.currentIndex = nextIndex;

      // Cache the necessary elements
      var $allNavItems = $doc.querySelectorAll('.project-nav a');
      var $currentNavItem = $allNavItems[currentIndex];
      var $nextNavItem = $allNavItems[nextIndex];
      var currentSection = _this.sections.cache[currentIndex];
      var nextSection = _this.sections.cache[nextIndex];
      var $nextSection = nextSection.element;

      // Check if we are on the same section
      if (currentIndex == nextIndex) {
        // This behaves like gallery router
        if (nextSection.type == 'gallery') {
          nextSection.goTo(slideNo);
        }
        // The rest is unnecessary
        return;
      }

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
      var yPercentCurr, yPercentNext;
      if (currentIndex == 0 && nextIndex == _this.data.sections.length - 1) {
        // Loop from beginning
        yPercentCurr = 100;
        yPercentNext = -100;
      } else if (
        currentIndex == _this.data.sections.length - 1 &&
        nextIndex == 0
      ) {
        // Loop from end
        yPercentCurr = -100;
        yPercentNext = 100;
      } else if (currentIndex > nextIndex) {
        // Going backwards
        yPercentCurr = 100;
        yPercentNext = -100;
      } else if (currentIndex < nextIndex) {
        // Going forward
        yPercentCurr = -100;
        yPercentNext = 100;
      }

      // Section tweenings
      if (currentSection) {
        TweenMax.to(currentSection.$wrapper, 1.5, {
          yPercent: yPercentCurr,
          ease: Power4.easeOut,
          onStart: function() {
            // Make nav item inactive
            removeClass($currentNavItem, 'active');

            // When there's a previous section available
            if (currentSection) {
              // Pause current video
              if (currentSection.type == 'video') {
                currentSection.pause();
                // Make the gallery inactive
              } else if (currentSection.type == 'gallery') {
                currentSection.isActive = false;
              }
            }
          },
          onComplete: function() {
            // After anim. completedmMake the section inactive
            removeClass(currentSection.$wrapper, 'active');
          }
        });
      }

      TweenMax.fromTo(
        nextSection.$wrapper,
        0.75,
        { yPercent: yPercentNext },
        {
          yPercent: 0,
          ease: Power4.easeOut,
          onStart: function() {
            // Toggle classes
            addClass($nextNavItem, 'active');
            addClass(nextSection.$wrapper, 'active');

            // If next section is a gallery we should prepare the right
            // page before the animation begins
            if (nextSection.type == 'gallery') {
              nextSection.isActive = true;
              nextSection.goTo(slideNo);
            }
          },
          onComplete: function() {
            // If next section is a video we should play it
            // after the animation is completed
            if (nextSection.type == 'video') {
              nextSection.play();
            }

            // Open the keyboard lock and enable nav links
            // after callstack cleaning
            setTimeout(function() {
              _this.isNavLocked = false;
              enableNavLinks();
            }, 10);

            // Log the perf
            if (data.settings.isPerformanceActive) {
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
    },

    /**
     * Reset and clear everything
     */
    destroy: function() {
      var _this = this;

      // Cache showcase and nav wrappers
      var $showcaseWrapper = $doc.getElementsByClassName('project-showcase')[0];
      var $navWrapper = $doc.getElementsByClassName('project-nav')[0];

      // Remove all gallery revent listeners one by one
      _this.sections.cache.forEach(function(section) {
        if (section.type == 'gallery') {
          $win.removeEventListener('resize', section._fixHeightWithThrottle);
          $doc.removeEventListener('keydown', section._onKeyDownWithThrottle);
        }
      });

      // Remove key events for section navigation
      $doc.removeEventListener(
        'keydown',
        _this.sections._onKeyDownWithThrottle
      );

      // Clear HTML by removeElement()
      clearInnerHTML($navWrapper);
      clearInnerHTML($showcaseWrapper);

      // Reset data cache
      _this.data = {};
      _this.isNavLocked = false;
      _this.sections.currentIndex = null;
      _this.sections.cache = [];
    }
  },

  /**
   * Project window setup and methods
   * This is for internal use
   * used by Project.open and close
   */
  _window: {
    /**
     * Create project window and append it to the dom
     * @return {element} Project window element
     */
    _init: function() {
      var windowID = 'project-window';
      if (!$doc.getElementById(windowID)) {
        this.$el = createEl('div', { id: windowID });
        $doc.getElementById('app').appendChild(this.$el);
      }
      return this.$el;
    },

    /**
     * Opens project window and inserts project HTML 
     * @param  {object} callbacks onStart and onComplete callbacks
     */
    open: function(callbacks) {
      var _this = this;
      var currentProject = events.publish('project.window.open.onStart');
      toggleClass($doc.body, 'no-scroll');
      var $projectWindow = _this._window._init();

      TweenMax.to($projectWindow, 0.5, {
        yPercent: -100,
        ease: Expo.easeInOut,
        onComplete: function() {
          $projectWindow.insertAdjacentHTML(
            'beforeend',
            projectTemplate(_this.data)
          );
          if (callbacks && callbacks.onComplete) callbacks.onComplete();
          events.publish('project.window.open.onComplete');
        }
      });
    },

    /**
     * Closes project window and cleans the inner HTML 
     * @param  {object} callbacks onStart and onComplete callbacks
     */
    close: function(callbacks) {
      var _this = this;
      events.publish('project.window.close.onStart');
      toggleClass($doc.body, 'no-scroll');
      var $projectWindow = _this._window.$el;

      TweenMax.to($projectWindow, 0.35, {
        yPercent: 100,
        ease: Expo.easeInOut,
        onComplete: function() {
          if (callbacks && callbacks.onComplete) callbacks.onComplete();
          clearInnerHTML($projectWindow);
          events.publish('project.window.close.onComplete');
        }
      });
    }
  },

  /**
   * Initializes and opens current project
   * @param  {string} projectSlug - The slug of the project to be opened
   * @param  {string} sectionSlug -  The slug of the section to be opened
   * @param  {number} sectionslideNo -  Page number of the section to be opened
   */
  open: function(projectSlug, sectionSlug, sectionslideNo) {
    var _this = this;
    var projects = data.pages.filter(function(page) {
      return page.slug == 'projects';
    })[0].list;

    var projectIndex = projects.findIndex(function(project) {
      return project.slug === projectSlug;
    });

    _this.isOpen = true;
    _this.data = projects.filter(function(project) {
      return project.slug === projectSlug;
    })[0];

    var previousIndex =
      projectIndex == 0 ? projects.length - 1 : projectIndex - 1;
    var nextIndex = projectIndex == projects.length - 1 ? 0 : projectIndex + 1;

    _this.data.adjacent = {
      prev: {
        link: '/projects/' + projects[previousIndex].slug,
        name: projects[previousIndex].name,
        icon: (function() {
          return createIcon('chevronLeft').outerHTML;
        })()
      },
      next: {
        link: '/projects/' + projects[nextIndex].slug,
        name: projects[nextIndex].name,
        icon: (function() {
          return createIcon('chevronRight').outerHTML;
        })()
      }
    };

    _this.data.keyboardNavIcon = (function() {
      return createIcon('keyboardNav', null, null, {
        stroke: { width: 1, color: '#ccc' }
      }).outerHTML;
    })();

    _this.data.mouseWheelIcon = (function() {
      return createIcon('mouseWheel', null, null, {
        stroke: { width: 1, color: '#ccc' }
      }).outerHTML;
    })();

    _this.data.year = new Date().getFullYear();

    _this._window.open.apply(_this, [
      {
        onComplete: function() {
          _this.sections._init.call(_this);
          _this.sections.change.call(_this, sectionSlug, sectionslideNo);
        }
      }
    ]);
  },

  /**
   * Destroys current project and closes project window
   * @param  {object} callbacks onComplete callback
   */
  close: function(callbacks) {
    var _this = this;
    if (_this.isOpen) {
      _this._window.close.apply(_this, [
        {
          onComplete: function() {
            _this.isOpen = false;
            _this.sections.destroy.call(_this);
            if (callbacks && callbacks.onComplete) callbacks.onComplete();
          }
        }
      ]);
    }
  }
};

export default Project;
