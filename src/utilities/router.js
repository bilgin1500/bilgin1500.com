import page from 'page';
import Project from 'components/project';
import { getInfo, getPage, getProject, getSection } from 'utilities/orm';
import { $win, $doc, log, uppercase, isUndefined } from 'utilities/helpers';

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
      preTitle = title + ' ' + getInfo('separatorMain') + ' ';
    }
    $doc.title = preTitle + getInfo('title');
  },

  /**
   * Setup and start routing
   */
  init: function() {
    /*
    Route home
     */
    var routeHome = function() {
      router._changeTitle(getInfo('subtitle'));
      router._scrollTo();
    };

    /**
     * Route all projects and their sections
     * @param  {object} ctx Url parameters: project/section/sectionSlideNo
     */
    var routeProject = function(ctx) {
      // Current project
      var thisProject = getProject(ctx.params.project);

      // If no project is found route to 404
      if (!thisProject) {
        notFound();
        return;
      }

      // Get the current section object
      var thisSection = isUndefined(ctx.params.section)
        ? getSection(0, ctx.params.project)
        : getSection(ctx.params.section, ctx.params.project);

      // The same with the section number. If no page number is specified
      // then the page is the first page: 0
      var sectionSlideNo = ctx.params.sectionSlideNo || 1;

      // Change the title to current project and section
      router._changeTitle(
        uppercase(thisSection.name) +
          ' ' +
          getInfo('separatorProject') +
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
          Project.sections.goTo.call(Project, thisSection.slug, sectionSlideNo);

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
      var currentPage = getPage(ctx.params.page);

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

    router._changeTitle(getInfo('subtitle'));

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
