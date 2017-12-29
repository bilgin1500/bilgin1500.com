import { TweenMax, TimelineMax } from 'gsap';
import normalizeWheel from 'normalize-wheel';
import throttle from 'throttle-debounce/throttle';
import debounce from 'throttle-debounce/debounce';
import {
  log,
  uppercase,
  createEl,
  clearInnerHTML,
  toggleClass,
  removeClass,
  addClass,
  getHeight,
  getWidth
} from 'utilities/helpers';
import events from 'utilities/events';
import router from 'utilities/router';
import { createIcon } from 'utilities/svg';
import projectTemplate from 'templates/project';
import data from 'content/index';

// Caching
var $win = window;
var $doc = document;

var project = {
  // Backup current project data
  data: {},
  isOpen: false,

  // Setup and init subsections of the current project
  sections: {
    // Reserved
    current: {
      index: null, // Current section's index number. It is not set yet!
      video: null // Current video element
    },
    $navWrapper: null, // .project-nav
    $showcaseWrapper: null, // .project-showcase
    $showcaseList: [], // .project-showcase .desktop-wrapper, .project-showcase .mobile-wrapper

    /**
     * Change sections on wheel events
     * @param  {object} e - onWheel event
     */
    _onWheel: debounce(1000, true, function(e) {
      // Normalization of the wheel event (delta)
      var normalized = normalizeWheel(e);

      // Find the adjacent section index
      function findAdjacentIndex(direction) {
        if (direction == 'down') {
          return project.sections.current.index == 0
            ? project.data.sections.length - 1
            : project.sections.current.index - 1;
        } else if (direction == 'up') {
          return project.sections.current.index ==
          project.data.sections.length - 1
            ? 0
            : project.sections.current.index + 1;
        }
      }

      // Update the url and change the section visually
      var changeSectionToTheDirection = function(direction) {
        var currentSection =
          project.data.sections[findAdjacentIndex(direction)];
        router.engine(
          '/projects/' + project.data.slug + '/' + currentSection.slug
        );
        project.sections.change(currentSection.slug);
      };

      // Up is next / down is previous
      if (normalized.pixelY > 0) {
        changeSectionToTheDirection('down');
      } else if (normalized.pixelY < 0) {
        changeSectionToTheDirection('up');
      }
    }),

    /**
     * Parses current section's content
     * @param {object} content -  Section's content object
     * @return {element} The content wrapped with section-inner-wrapper
     */
    _parsecontent: function(content) {
      var $thisSectionContent;

      switch (content.type) {
        /*
         * Create video section's content
         * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
         * @param  {object} content   Video data (poster,width,height,sources)
         */
        case 'video':
          var videoPoster = require('content/' +
            project.data.slug +
            '/' +
            content.poster);

          var $video = createEl('video', {
            poster: videoPoster,
            preload: 'none',
            width: content.width,
            height: content.height,
            muted: true,
            loop: true
          });

          for (var i = 0; i < content.sources.length; i++) {
            var videoSource = require('content/' +
              project.data.slug +
              '/' +
              content.sources[i].source);

            $video.appendChild(
              createEl('source', {
                src: videoSource,
                type: 'video/' + content.sources[i].type
              })
            );
          }

          $thisSectionContent = $video;
          break;

        /*
         * Create gallery section's content
         * @param  {object} content
         */
        case 'gallery':
          var $wrapper = createEl('div');
          $wrapper.innerHTML =
            '<h2>Test</h2><p>Sed vel vestibulum felis, sodales venenatis enim. Quisque vehicula ex sem, et imperdiet massa tempor a. </p>';
          $thisSectionContent = $wrapper;
          break;

        /*
         * Create info section's content
         * @param  {object} content
         */
        case 'info':
          var $wrapper = createEl('div');
          $wrapper.innerHTML =
            '<h2>Info</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at mauris ante. Phasellus sit amet venenatis orci. Vestibulum sit amet nunc scelerisque, aliquet orci eu, ultrices leo.</p>';
          $thisSectionContent = $wrapper;
          break;
      }

      var $sectionInnerWrapper = createEl('div', {
        class: 'section-inner-wrapper'
      });

      $sectionInnerWrapper.appendChild($thisSectionContent);

      return $sectionInnerWrapper;
    },

    /**
     * Setup sections and the slider mechanism of the project
     * @param  {string} slug - The default section slug to be opened
     */
    init: function(slug) {
      project.sections.$showcaseWrapper = $doc.getElementsByClassName(
        'project-showcase'
      )[0];
      project.sections.$navWrapper = $doc.getElementsByClassName(
        'project-nav'
      )[0];

      // Parse all sections
      project.data.sections.forEach(function(section, curr) {
        // Create section wrapper
        project.sections.$showcaseList[curr] = createEl('div', {
          class: 'section section-' + section.slug
        });

        // Create and append section inner wrapper and content
        project.sections.$showcaseList[curr].appendChild(
          project.sections._parsecontent(section.content)
        );

        // Append section wrapper to the showcase wrapper
        project.sections.$showcaseWrapper.appendChild(
          project.sections.$showcaseList[curr]
        );

        // Create nav item for this section
        var $navItem = createEl('a', {
          href: '/projects/' + project.data.slug + '/' + section.slug
        });

        var $navItemText = createEl('span');
        $navItemText.innerHTML = section.name;

        // Append nav item
        $navItem.appendChild(createIcon(section.icon));
        $navItem.appendChild($navItemText);
        project.sections.$navWrapper.appendChild($navItem);
      });

      // Start
      project.sections.change(slug);
      $doc.addEventListener('mousewheel', project.sections._onWheel);
    },

    /**
     * Change the section visually (slide, nav etc.)
     * @param  {object} slug -  The slug of the section to be changed
     */
    change: function(slug) {
      // Performance check for slide changes
      if (data.settings.isPerformanceActive) {
        var changeBeginTime = performance.now();
      }

      // Cache the necessary elements
      var $allSections = project.sections.$showcaseList;
      var $currentSection = $allSections[project.sections.current.index];
      var $allNavItems = project.sections.$navWrapper.getElementsByTagName('a');
      var $currentNavItem = $allNavItems[project.sections.current.index];
      var $currentVideo = project.sections.current.video;

      // Now save the current section index globally
      // ! This is the only place we set the current section data
      project.sections.current.index = project.data.sections.findIndex(function(
        section
      ) {
        return section.slug == slug;
      });

      // Cache the other necessary elements
      var $thisNavItem = $allNavItems[project.sections.current.index];
      var $thisSection = $allSections[project.sections.current.index];

      // Is there a video in this section?
      var $video = $thisSection.querySelector('video');

      if ($video) {
        project.sections.current.video = $video;
      } else {
        project.sections.current.video = null;
      }

      // Cache the video
      var $thisVideo = project.sections.current.video;

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

      // Section tweenings
      if ($currentSection) {
        TweenMax.to($currentSection, 0.25, { yPercent: -100 });
      }

      TweenMax.fromTo(
        $thisSection,
        0.25,
        { yPercent: 100 },
        {
          yPercent: 0,
          onStart: function() {
            // Disable nav links
            disableNavLinks();

            // Pause current video
            if ($currentVideo) {
              $currentVideo.pause();
            }

            // Toggle classes
            if ($currentNavItem) removeClass($currentNavItem, 'active');
            addClass($thisNavItem, 'active');
            addClass($thisSection, 'active');
          },
          onComplete: function() {
            // Toggle classes
            if ($currentSection) removeClass($currentSection, 'active');

            // Enable nav links
            enableNavLinks();

            // Play this video
            if ($thisVideo) {
              $thisVideo.play();
            }

            // Log the perf
            if (data.settings.isPerformanceActive) {
              var changeEndTime = performance.now();
              log(
                '[PERF] Slide change has ended in ' +
                  Math.round(changeEndTime - changeBeginTime) +
                  ' milliseconds. (Transition time excluded.)',
                { color: 'green' }
              );
            }
          }
        }
      );
    },

    /**
     * Reset everything
     */
    destroy: function() {
      clearInnerHTML(project.sections.$navWrapper);
      clearInnerHTML(project.sections.$showcaseWrapper);
      project.data = {};
      project.sections.$navWrapper = null;
      project.sections.$showcaseWrapper = null;
      project.sections.$showcaseList = [];
      $doc.removeEventListener('mousewheel', project.sections._onWheel);
    }
  },

  /**
   * Project window setup and methods
   */
  window: {
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
      events.publish('project.window.open.onStart');
      toggleClass($doc.body, 'no-scroll');
      var $projectWindow = this._init();

      TweenMax.to($projectWindow, 0.5, {
        yPercent: -100,
        ease: Expo.easeInOut,
        onComplete: function() {
          $projectWindow.insertAdjacentHTML(
            'beforeend',
            projectTemplate(project.data)
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
      events.publish('project.window.close.onStart');
      toggleClass($doc.body, 'no-scroll');
      var $projectWindow = this.$el;

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
   */
  open: function(projectSlug, sectionSlug) {
    var projects = data.pages.filter(function(page) {
      return page.slug == 'projects';
    })[0].list;

    var projectIndex = projects.findIndex(function(project) {
      return project.slug === projectSlug;
    });

    project.isOpen = true;
    project.data = projects.filter(function(project) {
      return project.slug === projectSlug;
    })[0];

    var previousIndex =
      projectIndex == 0 ? projects.length - 1 : projectIndex - 1;
    var nextIndex = projectIndex == projects.length - 1 ? 0 : projectIndex + 1;

    project.data.adjacent = {
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

    project.data.keyboardNavIcon = (function() {
      return createIcon('keyboardNav', null, null, {
        stroke: { width: 1, color: '#ccc' }
      }).outerHTML;
    })();

    project.data.mouseWheelIcon = (function() {
      return createIcon('mouseWheel', null, null, {
        stroke: { width: 1, color: '#ccc' }
      }).outerHTML;
    })();

    project.data.year = new Date().getFullYear();

    project.window.open({
      onComplete: function() {
        project.sections.init(sectionSlug);
      }
    });
  },

  /**
   * Destroys current project and closes project window
   * @param  {object} callbacks onComplete callback
   */
  close: function(callbacks) {
    if (project.isOpen) {
      project.isOpen = false;
      project.data = {};
      project.window.close({
        onComplete: function() {
          project.sections.destroy();
          if (callbacks && callbacks.onComplete) callbacks.onComplete();
        }
      });
    }
  }
};

export default project;
