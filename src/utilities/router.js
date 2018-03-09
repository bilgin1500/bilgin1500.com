import page from 'page';
import Project from 'components/project';
import loader from 'components/loader';
import analytics from 'utilities/analytics';
import {
  getInfo,
  getPage,
  getProject,
  getSection,
  getSetting,
  setSetting
} from 'utilities/orm';
import {
  $win,
  $doc,
  uppercase,
  isUndefined,
  slugify,
  getDocScrollY
} from 'utilities/helpers';

// We'll keep track of the loader's border.
// For a successful animation timing
// sometimes you end up doing some crazy shit.
var isLoaderBorderOpen = false;

/**
 * Scroll like a SPA
 * @param {object} args - Argument passed in
 *                      to: A ID to scroll to
 *                      onEnd: Callback which fires after scroll is completed
 */
function scrollTo(args) {
  var to = !isUndefined(args) && !isUndefined(args.to) ? '#' + args.to : 0;
  var prjInstance = getSetting('projectInstance');

  // Turn back where we are
  if (!isUndefined(prjInstance)) {
    if (!isUndefined(args.to)) {
      to = getDocScrollY();
    }
    prjInstance.close();
  }

  TweenMax.to($win, 0.5, {
    scrollTo: { y: to, autoKill: false },
    onComplete: function() {
      if (!isUndefined(args) && !isUndefined(args.onEnd)) args.onEnd();
    }
  });
}

/**
 * Closes the active about me section
 * @param {function} onEnd - Callback will fire after closing animation
 */
function closeActiveAboutMeSection(onEnd) {
  var activeArr = getSetting('aboutMeCache').filter(function(section) {
    return section.isActive == true;
  });

  if (activeArr.length) {
    activeArr[0].close(onEnd);
  } else {
    onEnd();
  }
}

/**
 * This function builds new page title and returns it
 * @param {string} name - Current page's name
 * @return {string} The new title of the page 
 */
function changeTitle(name) {
  var title = getInfo('title'); // Bilgin Özkan
  var sep = getSetting('separatorMain'); // -

  var builtTitle = name + ' ' + sep + ' ' + getInfo('title');

  $doc.title = builtTitle;

  return builtTitle;
}

/**
 * Route home
 */
function routeHome(ctx, next) {
  var pageTitle = changeTitle(getInfo('subtitle'));
  analytics.send({
    path: '/',
    title: pageTitle
  });
  scrollTo({
    onEnd: function() {
      next();
      if (!isLoaderBorderOpen) {
        loader.addBorders();
        isLoaderBorderOpen = false;
      }
    }
  });
}

/**
 * Route pages
 */
function routePages(ctx, next) {
  var pageData = getPage(ctx.params.page);

  if (!pageData) {
    notFound();
    next();
  } else {
    var pageTitle = changeTitle(pageData.name);
    analytics.send({
      path: '/' + slugify(pageData.name),
      title: pageTitle
    });
    scrollTo({
      to: slugify(pageData.name),
      onEnd: function() {
        next();
        if (!isLoaderBorderOpen) {
          loader.addBorders();
          isLoaderBorderOpen = false;
        }
      }
    });
  }
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
  var prjSlideNo = ctx.params.sectionSlideNo;

  var prjSlideNoText =
    prjSectionData.name == 'Gallery'
      ? isUndefined(prjSlideNo) ? '  / 1 ' : ' / ' + prjSlideNo + ' '
      : ' ';

  // Title: Gallery ‹ Project Name
  var projectTitleName =
    uppercase(prjSectionData.name) +
    prjSlideNoText +
    getSetting('separatorProject') +
    ' ' +
    prjData.name;

  var pageTitle = changeTitle(projectTitleName);

  analytics.send({
    path: ctx.path,
    title: pageTitle
  });

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
    prjInstance.open(next);
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
    // Project window's state is 'closed';
    // If there is an active about me section close it
    // and open the project window
    closeActiveAboutMeSection(openProject);
  }

  isLoaderBorderOpen = true;
}

/**
 * 404
 */
function notFound() {
  analytics.send({
    path: '/404',
    title: '404'
  });
  page.redirect('/');
}

/**
 * Load projects' images on home page
 */
function loadProjectImages(ctx, next) {
  for (var i = 0; i < getSetting('imageCacheForHome').length; i++) {
    getSetting('imageCacheForHome')[i].load();
  }
  next();
}

/**
 * Setup and start routing
 */
function init() {
  page('/', routeHome, loadProjectImages, loader.destroy);
  page('/:page', routePages, loadProjectImages, loader.destroy);
  page(
    '/projects/:project/:section?/:sectionSlideNo?',
    routeProject,
    loader.destroy
  );
  page();
}

export default {
  init: init,
  engine: page
};
