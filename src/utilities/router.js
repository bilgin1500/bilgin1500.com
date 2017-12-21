import page from 'page';
import { TweenMax } from 'gsap';
import 'GSAPScrollToPlugin';
import project from 'components/project';
import { log, uppercase, getEl } from 'utilities/helpers';
import data from 'content/index';

var router = {
  // Which client-side router to use
  engine: page,

  // Setup and start routing
  init: function() {
    // Change title
    var _changeTitle = function(title) {
      var preTitle = '';
      if (title) {
        preTitle = title + ' ' + data.settings.titleSep + ' ';
      }
      document.title = preTitle + data.title;
    };

    var projectThumbPreId = 'project-thumb-';

    // Scroll like a spa
    var _scrollTo = function(args) {
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
    };

    // Route home
    var routeHome = function() {
      _changeTitle(data.subtitle);
      _scrollTo();
    };

    // Route all projects and their sections
    var routeProject = function(ctx) {
      var projectList = data.pages.filter(function(page) {
        return page.slug == 'projects';
      })[0].list;
      var currentProject = projectList.filter(function(project) {
        return project.slug == ctx.params.project;
      });

      if (currentProject.length == 0) {
        notFound();
        return;
      }

      var sectionName =
        ctx.params.section || Object.keys(currentProject[0].sections[0])[0];

      _changeTitle(
        uppercase(sectionName) +
          ' ' +
          data.settings.titleSep +
          ' ' +
          currentProject[0].name
      );

      if (project.isOpen) {
        // Same project
        if (project.data.slug == ctx.params.project) {
          // Different section
          if (project.sections.current.name != sectionName) {
            log('Same project called, just change the section');
            project.sections.change({ name: sectionName });
          }

          // Different project
        } else {
          log('Different project called, change the project');
          project.close({
            onComplete: function() {
              _scrollTo({
                to: projectThumbPreId + ctx.params.project,
                onComplete: function() {
                  project.open(ctx.params.project, sectionName);
                }
              });
            }
          });
        }
      } else {
        log('Project window is closed, open it');
        project.open(ctx.params.project, sectionName);
      }
    };

    // Route pages
    var routePages = function(ctx) {
      if (!document.getElementById(ctx.params.page)) {
        notFound();
      } else {
        _changeTitle(uppercase(ctx.params.page));
        _scrollTo({ to: ctx.params.page });
      }
    };

    // 404 Not found
    var notFound = function() {
      log('Ooops! Not found.');
      router.engine.redirect('/');
    };

    _changeTitle(data.subtitle);

    // Map'em all
    router.engine('/', routeHome);
    router.engine('/:page', routePages);
    router.engine('/projects/:project/:section?', routeProject);
    router.engine();
  }
};

export default router;
