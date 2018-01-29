import { TweenMax } from 'gsap';
import Draggable from 'gsap/Draggable';
import throttle from 'throttle-debounce/throttle';
import {
  $win,
  $doc,
  log,
  isUndefined,
  createEl,
  clearInnerHTML,
  toggleClass,
  removeClass,
  addClass
} from 'utilities/helpers';
import events from 'utilities/events';
import router from 'utilities/router';
import frame from 'utilities/frame';
import { SVGElement, SVGIcon } from 'utilities/svg';
import Gallery from 'components/gallery';
import Video from 'components/video';
import Info from 'components/info';
import projectTemplate from 'templates/project';
import data from 'content/index';
import 'css/project';

/*
  The master project object.
  There can always be one project window available.
  Public:
  data: Current project's data property
  sections: Properties and methods to build the sections
  open and close: Methods to control to build and destroy a project
 */
var Project = {
  // Current project & its section's data
  data: {},

  // To check if project window is open or close
  isOpen: false,

  // To disable the key and drag events during the tweens
  isNavLocked: false,

  // Setup and init subsections of the current project
  sections: {
    // Current section's index number. It is not set yet!
    currentIndex: null,

    /**
     * Setup sections and the slider mechanism of the project
     */
    _init: function() {
      var _this = this;

      // Some element caching
      var $projectShowcase = _this._window.$el.querySelector(
        '.project-showcase'
      );
      var $projectNav = _this._window.$el.querySelector('.project-nav');

      // Parse all sections
      _this.data.sections.forEach(function(sectionData, curr) {
        // Create wrappers
        var $sectionWrapper = createEl('div', { class: 'project-section' });
        var $sectionInnerWrapper = createEl('div', {
          class: 'section-inner-wrapper'
        });

        // Create new content's instance, initialize and append it
        var instanceArgs = {
          projectSlug: _this.data.slug,
          sectionSlug: sectionData.slug,
          content: sectionData.content
        };

        switch (sectionData.type) {
          case 'video':
            sectionData._instance = new Video(instanceArgs);
            break;
          case 'gallery':
            sectionData._instance = new Gallery(instanceArgs);
            break;
          case 'info':
            sectionData._instance = new Info(instanceArgs);
            break;
        }

        // Append the content to the grid frame if it's visually needed
        // or append it to the inner-wrapper directly
        if (sectionData.frame) {
          // Add frame name as a class
          addClass($sectionWrapper, 'frame-' + sectionData.frame);

          // 9-box framing
          var $frame = frame.create({
            type: sectionData.frame,
            content: sectionData._instance.element,
            url: _this.data.url,
            title: _this.data.name
          });

          // Append the frames
          $sectionInnerWrapper.appendChild($frame);
        } else {
          // Add section's type as a frame name class
          addClass($sectionWrapper, 'frame-' + sectionData.type);
          // Append the content without frames
          $sectionInnerWrapper.appendChild(sectionData._instance.element);
        }

        // Append section content and wrappers
        $sectionWrapper.appendChild($sectionInnerWrapper);
        $projectShowcase.appendChild($sectionWrapper);

        // Make the sections draggable and touch enabled via GSAP
        var dragSwipeDir,
          dragStartY,
          dragThreshold = 100,
          dragBoundaries = 150;

        sectionData._draggable = Draggable.create($sectionWrapper, {
          type: 'y',
          lockAxis: true,
          zIndexBoost: false,
          edgeResistance: 0.75,
          dragResistance: 0,
          cursor: 'ns-resize',
          bounds: {
            minY: -dragBoundaries,
            maxY: dragBoundaries
          },
          onPress: function() {
            dragStartY = this.y;
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
              ease: Elastic.easeOut.config(1, 0.75)
            });

            // Check if the user is dragging good enough
            // If he is, proceed with dragEnd effects.
            if (
              thisDraggable.endY > dragThreshold ||
              thisDraggable.endY < -dragThreshold
            ) {
              // Down/Up: Change the section
              // Left/Right: Nothing
              if (dragSwipeDir == 'down') {
                _this.sections.previous.call(_this);
              } else if (dragSwipeDir == 'up') {
                _this.sections.next.call(_this);
              } else {
                resetDragToStartPos.play();
              }

              // Log the interaction
              log('[IX] Section swiped to the ' + dragSwipeDir);
            } else {
              resetDragToStartPos.play();
            }
          }
        })[0];

        // Cache wrappers
        sectionData._wrapper = $sectionWrapper;

        // Create nav item for this section
        var $navItem = createEl('a', {
          href: '/projects/' + _this.data.slug + '/' + sectionData.slug
        });

        var $navItemText = createEl('span');
        $navItemText.innerHTML = sectionData.name;

        // Append nav item
        $navItem.appendChild(new SVGIcon(sectionData.icon));
        $navItem.appendChild($navItemText);
        $projectNav.appendChild($navItem);
      });

      // Add key down event with throttle
      _this.sections._keyNavWithThrottle = throttle(
        300,
        _this.sections._keyNav.bind(_this)
      );
      $doc.addEventListener('keydown', _this.sections._keyNavWithThrottle);
    },

    /**
     * Key down/press events
     * @param  {object} e - event
     */
    _keyNav: function(e) {
      if (!this.isNavLocked) {
        // Change the section or exit
        if (e.key == 'ArrowDown') {
          this.sections.next.call(this);
        } else if (e.key == 'ArrowUp') {
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
     * @param  {number} slideNo - The instance page (gallery slide etc.) to be changed
     */
    goTo: function(slug, slideNo) {
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
      var currentSection = _this.data.sections[currentIndex];
      var nextSection = _this.data.sections[nextIndex];
      var $nextSection = nextSection.element;

      // Check if we are on the same section
      if (currentIndex == nextIndex) {
        // This behaves like gallery router
        if (nextSection.type == 'gallery') {
          nextSection._instance.goTo(slideNo);
        }
        // The rest is unnecessary
        return;
      }

      // Lock the navigation to prevent further interaction
      // while changing the sections
      _this.isNavLocked = true;

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

      if (currentIndex == 0 && nextIndex == _this.data.sections.length - 1) {
        // Loop from beginning
        yPercentCurr = percent;
        yPercentNext = -percent;
      } else if (
        currentIndex == _this.data.sections.length - 1 &&
        nextIndex == 0
      ) {
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
      if (currentSection) {
        var t1 = TweenMax.to(currentSection._wrapper, sectionTransitionSec, {
          transform: 'translateY(' + yPercentCurr + 'vh)',
          ease: Power4.easeOut,
          onStart: function() {
            // Make nav item inactive
            removeClass($currentNavItem, 'active');

            // Prevent further drag operations on this section while tweening
            currentSection._draggable.disable();

            // Pause current video
            if (currentSection.type == 'video') {
              currentSection._instance.pause();
              // Make the gallery inactive
            } else if (currentSection.type == 'gallery') {
              currentSection._instance.isActive = false;
            }
          },
          onComplete: function() {
            // After anim. completedmMake the section inactive
            removeClass(currentSection._wrapper, 'active');
          }
        });
      }

      TweenMax.fromTo(
        nextSection._wrapper,
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
            addClass(nextSection._wrapper, 'active');

            // Prevent drag operations on this section while tweening
            nextSection._draggable.disable();

            // If next section is a gallery we should prepare the right
            // page before the animation begins
            if (nextSection.type == 'gallery') {
              nextSection._instance.goTo(slideNo, true);
            }
          },
          onComplete: function() {
            // If next section is a video we should play it
            // after the animation is completed
            if (nextSection.type == 'video') {
              nextSection._instance.api.play();
            }

            // After the section appears it means we're active
            if (nextSection.type == 'gallery') {
              nextSection._instance.isActive = true;
            }

            // Open the keyboard lock,
            // enable nav links and
            // allow drag operations
            // after callstack cleaning
            _this.isNavLocked = false;
            nextSection._draggable.enable();
            enableNavLinks();

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
     * Reset section specific listeners, clear data etc.
     */
    destroy: function() {
      // Remove all gallery revent listeners one by one
      this.data.sections.forEach(function(section) {
        if (section.type == 'gallery') {
          $doc.removeEventListener(
            'keydown',
            section._instance._keyNavWithThrottle
          );
        }
      });

      // Remove key events for section navigation
      $doc.removeEventListener('keydown', this.sections._keyNavWithThrottle);

      // Reset data cache
      this.sections.currentIndex = null;
    }
  },

  /**
   * Project window setup and methods
   * Private method for project only
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
     * Opens or closes project window
     * @param  {string} act - Action type: open or close
     * @param  {object} callbacks - onStart and onComplete callbacks
     */
    toggle: function(act, callbacks) {
      var _this = this;
      var currentProject = events.publish('project.window.' + act + '.onStart');
      toggleClass($doc.body, 'no-scroll');
      toggleClass($doc.body, 'project-window');
      var $projectWindow = _this._init();

      TweenMax.to($projectWindow, 0.5, {
        yPercent: act == 'open' ? -100 : 100,
        ease: Expo.easeInOut,
        onStart: function() {
          if (!isUndefined(callbacks) && !isUndefined(callbacks.onStart)) {
            callbacks.onStart.call(_this);
          }
        },
        onComplete: function() {
          if (!isUndefined(callbacks) && !isUndefined(callbacks.onComplete)) {
            callbacks.onComplete.call(_this);
          }
          events.publish('project.window.' + act + '.onComplete');
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
          return new SVGIcon('chevronLeft').outerHTML;
        })()
      },
      next: {
        link: '/projects/' + projects[nextIndex].slug,
        name: projects[nextIndex].name,
        icon: (function() {
          return new SVGIcon('chevronRight').outerHTML;
        })()
      }
    };

    _this.data.year = new Date().getFullYear();

    _this._window.toggle('open', {
      onStart: function() {
        /* Merge project template with data and insert it */
        this.$el.insertAdjacentHTML('beforeend', projectTemplate(_this.data));

        /* Background SVG shapes floating all around like it's summer */
        /*var $shapesWrapper = new SVGElement('svg', {
            class: 'project-bg-shapes'
          });

          for (var i = 0; i < _this.data.shapes.length; i++) {
            var $shape = new SVGElement(
              _this.data.shapes[i].type,
              _this.data.shapes[i].attributes
            );

            TweenMax.to($shape, 2, {
              //transform: 'translate3d(100vw, 100vh, 0)',
              x: '100vw',
              y: '100vh',
              repeat: -1,
              yoyo: true
            });

            $shapesWrapper.appendChild($shape);
          }

          $projectWindow.appendChild($shapesWrapper);*/

        // Create sections and insert them
        _this.sections._init.call(_this);
        _this.sections.goTo.call(_this, sectionSlug, sectionslideNo);
      }
    });
  },

  /**
   * Destroys current project and closes project window
   * @param  {object} callbacks - onComplete callback
   */
  close: function(callbacks) {
    var _this = this;

    if (_this.isOpen) {
      // Close the #projectWindow
      _this._window.toggle('close', {
        onComplete: function() {
          // First destroy the sections
          _this.sections.destroy.call(_this);

          // Then clear the #projectWindow
          // this refers to #projectWindow inside the _window.toggle
          clearInnerHTML(this.$el);

          // Clear data cache
          _this.data = {};
          _this.isOpen = false;
          _this.isNavLocked = false;

          // onComplete
          if (!isUndefined(callbacks) && !isUndefined(callbacks.onComplete)) {
            callbacks.onComplete.call(_this);
          }
        }
      });
    }
  }
};

export default Project;
