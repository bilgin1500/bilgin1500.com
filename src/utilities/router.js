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
import { $win, $doc, uppercase, isUndefined, slugify } from 'utilities/helpers';

var router = {
  // Which client-side router to use
  engine: page,

  /**
   * Scroll like a SPA
   * @param {object} args - Argument passed in
   *                      to: A ID to scroll to
   *                      onEnd: Callback which fires after scroll is completed
   */
  _scrollTo: function(args) {
    var to = !isUndefined(args) && !isUndefined(args.to) ? '#' + args.to : 0;
    var prjInstance = getSetting('projectInstance');

    if (!isUndefined(prjInstance)) {
      prjInstance.close();
    }

    TweenMax.to($win, 0.5, {
      scrollTo: { y: to, autoKill: false },
      onComplete: function() {
        if (!isUndefined(args) && !isUndefined(args.onEnd)) args.onEnd();
      }
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
      // Current project and sections instances (if available!)
      var prjInstance = getSetting('projectInstance');
      var sectionsInstance = getSetting('sectionsInstance');

      // Current project's data using the url param
      var prjData = getProject(ctx.params.project);

      // If no project is found route to 404 exit
      if (isUndefined(prjData)) {
        notFound();
        return;
      }

      // Get the current section object using the url param.
      var prjSectionData = isUndefined(ctx.params.section)
        ? getSection(0, ctx.params.project)
        : getSection(ctx.params.section, ctx.params.project);

      // The same with the section number. Get it using the url param.
      // If no page number is specified then the page is the first page: 0
      var prjSlideNo = ctx.params.sectionSlideNo || 1;

      // Change the title to current project and section
      router._changeTitle(
        uppercase(prjSectionData.name) +
          ' ' +
          getSetting('separatorProject') +
          ' ' +
          prjData.name
      );

      /**
       * Wrapper for project opening functions
       * Returns nothing, just set up the project for us
       */
      function openProject() {
        // Create a new project instance with derived data from url params
        prjInstance = new Project(prjData, {
          section: prjSectionData.name,
          slide: prjSlideNo
        });
        // Use the project instance's public method and open it
        prjInstance.open();
        // Save the instance for further interactions
        setSetting('projectInstance', prjInstance);
      }

      // Setup the logic
      if (!isUndefined(prjInstance)) {
        // Same project called, just change the section or section's slide
        if (prjInstance.slug == slugify(prjData.name)) {
          sectionsInstance.goto(prjSectionData.name, prjSlideNo);
        } else {
          // Different project called, close the current on and open the next one
          prjInstance.close(openProject);
        }
      } else {
        // Project window is closed, open it
        openProject();
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
