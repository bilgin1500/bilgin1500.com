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
  addClass
} from 'utilities/helpers';
import events from 'utilities/events';
import router from 'utilities/router';
import { sectionLoader } from 'utilities/loaders';
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

    // Change the section visually (slide, nav etc.)
    change: function(args) {
      project.sections._setCurrent(args);

      // Change slide
      project.sections.$slideWrapper = $doc.getElementsByClassName(
        'project-showcase'
      )[0];
      project.sections.$slideWrapper.innerHTML =
        '<h3>Section #' + project.sections.current.id + '</h3>';

      // Change navigation focus
      var navActiveClass = 'active';
      var $allNavItems = project.sections.$navWrapper.getElementsByTagName('a');
      for (var i = 0; i < $allNavItems.length; i++) {
        removeClass($allNavItems[i], navActiveClass);
      }
      toggleClass($allNavItems[project.sections.current.id], navActiveClass);
    },

    // Setup sub sections of the project
    init: function(currentSectionName) {
      project.sections.$navWrapper = $doc.getElementsByClassName(
        'project-nav'
      )[0];

      project.data.sections.forEach(function(section, curr) {
        var thisSectionName = project.sections._getNameFromId(curr);

        var $navItem = createEl('a', {
          class: 'nav-' + thisSectionName,
          href: '/projects/' + project.data.slug + '/' + thisSectionName
        });

        var $navItemText = createEl('span');
        $navItemText.innerHTML = uppercase(thisSectionName);

        $navItem.appendChild(createIcon(thisSectionName));
        $navItem.appendChild($navItemText);
        project.sections.$navWrapper.appendChild($navItem);
      });

      project.sections.change({ name: currentSectionName });

      $doc.addEventListener('mousewheel', project.sections._onWheel);
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
    open: function(callbacks) {
      events.publish('project.window.open.onStart');
      var $loader = sectionLoader.enter({
        onComplete: function() {
          $loader.insertAdjacentHTML(
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
      var $loader = sectionLoader.leave({
        onComplete: function() {
          if (callbacks && callbacks.onComplete) callbacks.onComplete();
          clearInnerHTML($loader);
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
