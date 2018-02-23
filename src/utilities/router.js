import page from 'page';
import Project from 'components/project';
import {
  getInfo,
  getSetting,
  getPage,
  getProject,
  getSection,
  setSetting
} from 'utilities/orm';
import {
  $win,
  $doc,
  log,
  uppercase,
  isUndefined,
  slugify
} from 'utilities/helpers';

var router = {
  // Which client-side router to use
  engine: page,

  /**
   * Scroll like a spa
   */
  _scrollTo: function(args) {
    var to = args && args.to ? '#' + args.to : 0;
    var prjInstance = getSetting('projectInstance');

    if (!isUndefined(prjInstance)) {
      if (args != undefined) {
        to = '#project-thumb-' + prjInstance.slug;
      }
      prjInstance.close();
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
      preTitle = title + ' ' + getSetting('separatorMain') + ' ';
    }
    $doc.title = preTitle + getInfo('title');
  },

  /**
   * Setup and start routing
   */
  init: function() {
    /**
     * Route home
     */
    function routeHome(ctx, next) {
      router._changeTitle(getInfo('subtitle'));
      router._scrollTo();
      next();
    }

    /**
     * Route all projects and their sections
     * @param  {object} ctx Url parameters: project/section/sectionSlideNo
     */
    function routeProject(ctx, next) {
      // Current project's data
      var prjData = getProject(ctx.params.project);
      // Current project and sections instances
      var prjInstance = getSetting('projectInstance');
      var sectionsInstance = getSetting('sectionsInstance');

      // If no project is found route to 404
      if (isUndefined(prjData)) {
        notFound();
        return;
      }

      // Get the current section object
      var prjSection = isUndefined(ctx.params.section)
        ? getSection(0, ctx.params.project)
        : getSection(ctx.params.section, ctx.params.project);

      // The same with the section number. If no page number is specified
      // then the page is the first page: 0
      var prjSlideNo = ctx.params.sectionSlideNo || 1;

      // Change the title to current project and section
      router._changeTitle(
        uppercase(prjSection.name) +
          ' ' +
          getSetting('separatorProject') +
          ' ' +
          prjData.name
      );

      // Setup the routing logic
      if (!isUndefined(prjInstance)) {
        // Same project
        if (prjInstance.slug == slugify(prjData.name)) {
          log(
            "[ROUTE] Same project called, just change the section or section's slide"
          );
          sectionsInstance.goto(prjSection.name, prjSlideNo);

          // Different project
        } else {
          log('[ROUTE] Different project called, change the project');
          /*prjInstance.close({
            onComplete: function() {
              router._scrollTo({
                to: 'project-thumb-' + slugify(prjData.name),
                onComplete: function() {
                  prjInstance = new Project(prjData, {
                    section: prjSection.name,
                    slide: prjSlideNo
                  });
                  prjInstance.open();
                }
              });
            }
          });*/
        }
      } else {
        log('[ROUTE] Project window is closed, open it');
        prjInstance = new Project(prjData, {
          section: prjSection.name,
          slide: prjSlideNo
        });
        prjInstance.open();
        setSetting('projectInstance', prjInstance);
      }
    }

    /**
     * Route pages
     */
    function routePages(ctx, next) {
      var pageData = getPage(ctx.params.page);

      if (!pageData) {
        notFound();
      } else {
        router._changeTitle(pageData.name);
        router._scrollTo({ to: slugify(pageData.name) });
      }

      next();
    }

    /**
     * 404
     */
    function notFound() {
      log('[ROUTE] Ooops! Not found.');
      router.engine.redirect('/');
    }

    /**
     * Load projects' images on home page
     */
    function loadProjectImages() {
      for (var i = 0; i < getSetting('imageInstanceCache').length; i++) {
        getSetting('imageInstanceCache')[i].load();
      }
    }

    // Map'em all
    router.engine('/', routeHome, loadProjectImages);
    router.engine('/:page', routePages, loadProjectImages);
    router.engine(
      '/projects/:project/:section?/:sectionSlideNo?',
      routeProject
    );
    router.engine();
  }
};

export default router;
