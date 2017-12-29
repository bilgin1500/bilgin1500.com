import page from 'page';
import { TweenMax } from 'gsap';
import 'GSAPScrollToPlugin';
import project from 'components/project';
import { log, uppercase, getEl } from 'utilities/helpers';
import data from 'content/index';

var projectThumbPreId = 'project-thumb-';

var router = {
  // Which client-side router to use
  engine: page,

  /**
   * Scroll like a spa
   * @param  {[type]} args [description]
   * @return {[type]}      [description]
   */
  _scrollTo: function(args) {
    var to = args && args.to ? '#' + args.to : 0;

    if (project.isOpen) {
      if (args != undefined) {
        to = '#' + projectThumbPreId + project.data.slug;
      }
      project.close();
    }

    TweenMax.to(window, 0.5, {
      scrollTo: to,
      onStart: args && args.onstart,
      onComplete: args && args.onComplete
    });
  },

  /**
   * [_changeTitle description]
   * @param  {[type]} title [description]
   * @return {[type]}       [description]
   */
  _changeTitle: function(title) {
    var preTitle = '';
    if (title) {
      preTitle = title + ' ' + data.settings.titleSep + ' ';
    }
    document.title = preTitle + data.title;
  },

  /**
   * Setup and start routing
   * @return {[type]} [description]
   */
  init: function() {
    /*
    Route home
     */
    var routeHome = function() {
      router._changeTitle(data.subtitle);
      router._scrollTo();
    };

    /*
    Route all projects and their sections
     */
    var routeProject = function(ctx) {
      // Filter pages and projects to find current project
      var projectList = data.pages.filter(function(page) {
        return page.slug == 'projects';
      })[0].list;
      var thisProject = projectList.filter(function(project) {
        return project.slug == ctx.params.project;
      })[0];

      // If no project is found route to 404
      if (!thisProject) {
        notFound();
        return;
      }

      // If no section is called via url then the section is
      // the first section of the current project
      var sectionSlug = ctx.params.section || thisProject.sections[0].slug;

      // Get the current section object
      var thisSection = thisProject.sections.filter(function(section) {
        return section.slug == sectionSlug;
      })[0];

      // Change the title to current project and section
      router._changeTitle(
        uppercase(thisSection.name) +
          ' ' +
          data.settings.titleSep +
          ' ' +
          thisProject.name
      );

      // Setup the routing logic
      if (project.isOpen) {
        // Same project
        if (project.data.slug == thisProject.slug) {
          // Different section
          if (
            project.data.sections[project.sections.current.index].slug !=
            thisSection.slug
          ) {
            log('[ROUTE] Same project called, just change the section');
            project.sections.change(thisSection.slug);
          }

          // Different project
        } else {
          log('[ROUTE] Different project called, change the project');
          project.close({
            onComplete: function() {
              router._scrollTo({
                to: projectThumbPreId + thisProject.slug,
                onComplete: function() {
                  project.open(thisProject.slug, thisSection.slug);
                }
              });
            }
          });
        }
      } else {
        log('[ROUTE] Project window is closed, open it');
        project.open(thisProject.slug, thisSection.slug);
      }
    };

    /*
    Route pages
     */
    var routePages = function(ctx) {
      // Filter pages and find current one
      var currentPage = data.pages.filter(function(page) {
        return page.slug == ctx.params.page;
      })[0];

      if (!currentPage) {
        notFound();
      } else {
        router._changeTitle(currentPage.name);
        router._scrollTo({ to: currentPage.slug });
      }
    };

    /*
    404 Not found
     */
    var notFound = function() {
      log('[ROUTE] Ooops! Not found.');
      router.engine.redirect('/');
    };

    router._changeTitle(data.subtitle);

    /*
    Map'em all
     */
    router.engine('/', routeHome);
    router.engine('/:page', routePages);
    router.engine('/projects/:project/:section?', routeProject);
    router.engine();
  }
};

export default router;
