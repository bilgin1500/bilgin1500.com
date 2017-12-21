import { TweenMax, TimelineMax } from 'gsap';
import normalizeWheel from 'normalize-wheel';
import debounce from 'throttle-debounce/throttle';
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
import {
  createSVG,
  createDefs,
  createClipPath,
  createCircle
} from 'utilities/svg';
import events from 'utilities/events';
import router from 'utilities/router';
import { createIcon } from 'utilities/svg';
import projectTemplate from 'templates/project';
import data from 'content/index';

var $doc = document;

var project = {
  // Backup current project data
  data: {},
  isOpen: false,

  // Setup and init subsections of the current project
  sections: {
    // Reserved elements' cache
    $navWrapper: null, // .project-nav
    $showcaseWrapper: null, // .project-showcase
    $showcaseList: [], // .project-showcase .desktop-wrapper, .project-showcase .mobile-wrapper

    // Reserved methods
    _revealSectionAnimation: null, // The clip path animation to reveal the sections

    // Change sections on wheel events
    _onWheel: debounce(500, true, function(e) {
      var normalized = normalizeWheel(e);
      var wheelDistanceThreshold = 1;

      var changeSectionToTheDirection = function(direction) {
        var gotoId = project.sections._findAdjacentId(direction);
        router.engine(
          '/projects/' +
            project.data.slug +
            '/' +
            project.sections._getNameFromId(gotoId)
        );
        project.sections.change({ id: gotoId });
      };

      if (normalized.pixelY < -wheelDistanceThreshold) {
        changeSectionToTheDirection('previous');
      } else if (normalized.pixelY > wheelDistanceThreshold) {
        changeSectionToTheDirection('next');
      }
    }),

    // Find prev and next section id
    _findAdjacentId: function(which) {
      if (which == 'previous') {
        return project.sections.current.id == 0
          ? project.data.sections.length - 1
          : project.sections.current.id - 1;
      } else if (which == 'next') {
        return project.sections.current.id == project.data.sections.length - 1
          ? 0
          : project.sections.current.id + 1;
      }
    },

    // Find section name from id
    _getNameFromId: function(sectionId) {
      return Object.keys(project.data.sections[sectionId])[0];
    },

    // Find section id from name
    _getIdFromName: function(sectionName) {
      return project.data.sections.findIndex(function(section) {
        return Object.keys(section)[0] == sectionName;
      });
    },

    // Set current section's name and id
    _setCurrent: function(args) {
      var setDefault = function() {
        project.sections.current = {
          id: 0,
          name: (function() {
            return project.sections._getNameFromId(0);
          })()
        };
      };

      if (args.name == undefined && args.id == undefined) {
        setDefault();
      } else {
        if (args.name != undefined) {
          var id = project.sections._getIdFromName(args.name);
          if (id == -1) {
            setDefault();
            return;
          }
          project.sections.current = { id: id, name: args.name };
        } else if (args.id != undefined) {
          var name = project.sections._getNameFromId(args.id);
          if (name == undefined || name == null || name == '') {
            setDefault();
            return;
          }
          project.sections.current = { id: args.id, name: name };
        }
      }
      log(
        'Current sections changed. Id: ' +
          project.sections.current.id +
          ', name: ' +
          project.sections.current.name
      );
    },

    // Setup sub sections of the project
    init: function(currentSectionName) {
      project.sections.$showcaseWrapper = $doc.getElementsByClassName(
        'project-showcase'
      )[0];
      project.sections.$navWrapper = $doc.getElementsByClassName(
        'project-nav'
      )[0];

      // Create and append clip path element for section transitions
      var $showcaseClipSVG = createSVG();
      project.sections.$showcaseWrapper.appendChild($showcaseClipSVG);

      var findSvgDiagonal = function() {
        var svgWidth = getWidth($showcaseClipSVG) / 2;
        var svgHeight = getHeight($showcaseClipSVG) / 2;
        return Math.sqrt(svgWidth * svgWidth + svgHeight * svgHeight);
      };

      var findSvgCenter = function() {
        return {
          x: getWidth($showcaseClipSVG) / 2,
          y: getHeight($showcaseClipSVG) / 2
        };
      };

      var $showcaseDefs = createDefs();
      var $showcaseClipPath = createClipPath();
      var $showcaseClipItem = createCircle({
        cx: findSvgCenter().x,
        cy: findSvgCenter().y,
        r: 0
      });

      $showcaseClipPath.appendChild($showcaseClipItem);
      $showcaseDefs.appendChild($showcaseClipPath);
      $showcaseClipSVG.appendChild($showcaseDefs);

      // Transition effect
      project.sections._revealSectionAnimation = TweenMax.to(
        $showcaseClipItem,
        0.5,
        {
          paused: true,
          transformOrigin: '50% 50%',
          ease: 'Power4.easeOut',
          attr: { r: findSvgDiagonal() },
          onStart: function() {},
          onComplete: function() {}
        }
      );

      // Parse all sections
      project.data.sections.forEach(function(section, curr) {
        var thisSectionName = project.sections._getNameFromId(curr);

        // Create and append sections
        project.sections.$showcaseList[curr] = createEl('div', {
          class: 'section-' + thisSectionName,
          style:
            'clip-path:url(#' +
            $showcaseClipPath.id +
            ');-webkit-clip-path:url(#' +
            $showcaseClipPath.id +
            ')'
        });

        project.sections.$showcaseWrapper.appendChild(
          project.sections.$showcaseList[curr]
        );

        // Create and append nav items
        var $navItem = createEl('a', {
          href: '/projects/' + project.data.slug + '/' + thisSectionName
        });

        var $navItemText = createEl('span');
        $navItemText.innerHTML = uppercase(thisSectionName);

        $navItem.appendChild(createIcon(thisSectionName));
        $navItem.appendChild($navItemText);
        project.sections.$navWrapper.appendChild($navItem);
      });

      // Start
      project.sections.change({ name: currentSectionName });
      $doc.addEventListener('mousewheel', project.sections._onWheel);
    },

    // Change the section visually (slide, nav etc.)
    change: function(args) {
      project.sections._setCurrent(args);

      // Make all slides invisible and current slide visible
      var toggleSectionClasses = function() {
        for (var i = 0; i < project.sections.$showcaseList.length; i++) {
          removeClass(project.sections.$showcaseList[i], 'active');
        }
        toggleClass(
          project.sections.$showcaseList[project.sections.current.id],
          'active'
        );
      };

      // Play section transition
      if (project.sections._revealSectionAnimation.progress() == 1) {
        project.sections._revealSectionAnimation.reverse();
        setTimeout(function() {
          toggleSectionClasses();
          project.sections._revealSectionAnimation.play();
        }, 500);
      } else {
        toggleSectionClasses();
        project.sections._revealSectionAnimation.play();
      }

      // Change navigation focus
      var $allNavItems = project.sections.$navWrapper.getElementsByTagName('a');
      for (var i = 0; i < $allNavItems.length; i++) {
        removeClass($allNavItems[i], 'active');
      }
      toggleClass($allNavItems[project.sections.current.id], 'active');
    },

    destroy: function() {
      project.sections.current = {};
      clearInnerHTML(project.sections.$navWrapper);
      clearInnerHTML(project.sections.$slideWrapper);
      $doc.removeEventListener('mousewheel', project.sections._onWheel);
    }
  },

  // Project window setup and methods
  window: {
    _init() {
      var windowID = 'project-window';
      if (!$doc.getElementById(windowID)) {
        this.$el = createEl('div', { id: windowID });
        $doc.getElementById('app').appendChild(this.$el);
      }
      return this.$el;
    },
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

  // Initialize and open current project
  open: function(projectSlug, currentSectionName) {
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

    project.window.open({
      onComplete: function() {
        project.sections.init(currentSectionName);
      }
    });
  },

  // Destroys current project
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
