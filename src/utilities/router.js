import page from 'page';
import { TweenMax } from 'gsap';
import 'GSAPScrollToPlugin';
import Project from 'components/project';
import { $win, $doc, log, uppercase, getEl } from 'utilities/helpers';
import data from 'content/index';

var router = {
  // Which client-side router to use
  engine: page,

  /**
   * Scroll like a spa
   */
  _scrollTo: function(args) {
    var to = args && args.to ? '#' + args.to : 0;

    if (Project.isOpen) {
      if (args != undefined) {
        to = '#project-thumb-' + Project.data.slug;
      }
      Project.close();
    }

    TweenMax.to($win, 0.5, {
      scrollTo: to,
      onStart: args && args.onstart,
      onComplete: args && args.onComplete
    });
  },

  /**
   * Changes the document title
   */
  _changeTitle: function(title) {
    var preTitle = '';
    if (title) {
      preTitle = title + ' ' + data.settings.titleSep + ' ';
    }
    $doc.title = preTitle + data.title;
  },

  /**
   * Setup and start routing
   */
  init: function() {
    /*
    Route home
     */
    var routeHome = function() {
      router._changeTitle(data.subtitle);
      router._scrollTo();
    };

    /**
     * Route all projects and their sections
     * @param  {object} ctx Url parameters: project/section/sectionSlideNo
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
      // The same with the section number. If no page number is specified
      // then the page is the first page: 0
      var sectionSlideNo = ctx.params.sectionSlideNo || 1;

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
      if (Project.isOpen) {
        // Same project
        if (Project.data.slug == thisProject.slug) {
          log(
            "[ROUTE] Same project called, just change the section or section's slide"
          );
          Project.sections.change.call(
            Project,
            thisSection.slug,
            sectionSlideNo
          );

          // Different project
        } else {
          log('[ROUTE] Different project called, change the project');
          Project.close({
            onComplete: function() {
              router._scrollTo({
                to: 'project-thumb-' + thisProject.slug,
                onComplete: function() {
                  Project.open(
                    thisProject.slug,
                    thisSection.slug,
                    sectionSlideNo
                  );
                }
              });
            }
          });
        }
      } else {
        log('[ROUTE] Project window is closed, open it');
        Project.open(thisProject.slug, thisSection.slug, sectionSlideNo);
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
    router.engine(
      '/projects/:project/:section?/:sectionSlideNo?',
      routeProject
    );
    router.engine();
  }
};

export default router;
