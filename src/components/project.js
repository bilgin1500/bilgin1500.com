import {
  $doc,
  isUndefined,
  createEl,
  toggleClass,
  slugify,
  clearInnerHTML
} from 'utilities/helpers';
import {
  getProjects,
  getProject,
  findProjectIndex,
  setSetting,
  getSetting
} from 'utilities/orm';
import Sections from 'components/sections';
import 'css/project';

var sectionsInstance;
var defaultOpenings;

/**
 * Project constructor. It is used in the router.
 * Public properties and methods are:
 *     slug: Project's slug
 *     open: Opens the window
 *     close: Closes the window
 * @param {object} project - Project data from database
 * @param {object} defaults - With which page to open the project. {section,slide}
 */
function Project(project, defaults) {
  // Private variables for this constructor
  var isNavLocked = false;
  var prjData = project;
  var projects = getProjects();
  var prjIndex = findProjectIndex(prjData.name);
  var prevPrjIndex = prjIndex == 0 ? projects.length - 1 : prjIndex - 1;
  var nextPrjIndex = prjIndex == projects.length - 1 ? 0 : prjIndex + 1;
  var prevPrj = getProject(prevPrjIndex);
  var nextPrj = getProject(nextPrjIndex);
  prjData.prevPrjName = prevPrj.name;
  prjData.prevPrjUrl = '/projects/' + slugify(prevPrj.name);
  prjData.nextPrjName = nextPrj.name;
  prjData.nextPrjUrl = '/projects/' + slugify(nextPrj.name);
  prjData.slug = slugify(prjData.name);
  var windowInstance = new ProjectWindow(prjData);
  // Public variables
  this.slug = prjData.slug;
  sectionsInstance = new Sections(prjData);
  setSetting('sectionsInstance', sectionsInstance);
  // Global variables for this file
  defaultOpenings = defaults;

  this.open = function() {
    windowInstance.open();
  };

  this.close = function() {
    windowInstance.close();
    sectionsInstance.removeEvents();
    setSetting('projectInstance', undefined);
    setSetting('sectionsInstance', undefined);
  };
}

/**
 * ProjectWindow constructor. It is used in the Project constructor.
 * Public properties and methods are:
 *     open: Opens the window
 *     close: Closes the window
 * @param {object} prjData - Project data from database
 */
function ProjectWindow(prjData) {
  // The main window
  var $currWindow = $doc.getElementById(getSetting('projectWindowId'));

  if ($currWindow == null) {
    $currWindow = createEl('div', { id: 'project-window' });
    $doc.getElementById('app').appendChild($currWindow);
  }

  // All the window elements (besides the sections)
  var $projectWrapper = createEl('div', { class: 'project-wrapper' });
  var $projectHead = createEl('div', { class: 'project-head' });
  var $projectHelperNav = createEl('div', { class: 'project-helper-nav' });
  var $title = createEl('h2', { innerText: prjData.name });
  var $desc = createEl('h3', { innerText: prjData.desc });
  var l1 = createEl('div', { id: 'layer1', class: 'layer' });
  var l2 = createEl('div', { id: 'layer2', class: 'layer' });
  var l3 = createEl('div', { id: 'layer3', class: 'layer' });

  var $prev = createEl('a', {
    href: prjData.prevPrjUrl,
    title: 'Previous Project: ' + prjData.prevPrjName + ' [P]',
    class: 'prev',
    innerText: 'Previous'
  });

  var $next = createEl('a', {
    href: prjData.nextPrjUrl,
    title: 'Previous Project: ' + prjData.nextPrjName + ' [N]',
    class: 'prev',
    innerText: 'Next'
  });

  var $close = createEl('a', {
    href: '/projects/',
    title: 'Close Project [ESC]',
    class: 'close',
    innerText: 'Close'
  });

  // Append the layers according to their z-index order
  // Top is the z-index:4 bottom is the 1
  $currWindow.appendChild(l3);
  $currWindow.appendChild(l2);
  $currWindow.appendChild($projectWrapper);
  $currWindow.appendChild(l1);

  // Straight: Append the project content during the transition animation
  // Reversed: Remove the elements inside the .project-wrapper
  function manipulateDom() {
    if (timeline.reversed()) {
      clearInnerHTML($projectWrapper);
    } else {
      $projectHelperNav.appendChild($prev);
      $projectHelperNav.appendChild($next);
      $projectHelperNav.appendChild($close);
      $projectHead.appendChild($title);
      $projectHead.appendChild($desc);
      $projectHead.appendChild($projectHelperNav);
      $projectWrapper.appendChild($projectHead);
      $projectWrapper.appendChild(sectionsInstance.createDom());
      sectionsInstance.goto(defaultOpenings.section, defaultOpenings.slide);
    }
  }

  // Event callbacks
  function toogleClasses() {
    toggleClass($doc.body, ['no-scroll', 'project-window-opened']);
  }

  function destroyAll() {
    clearInnerHTML($currWindow);
  }

  // The timeline itself
  var t1 = TweenMax.set([l1, l2, l3], {
    transformOrigin: '100% 0%',
    immediateRender: false
  });

  var t2 = TweenMax.to(l1, 0.4, {
    xPercent: 100,
    ease: Circ.easeInOut
  });

  var t3 = TweenMax.to(l2, 0.4, {
    xPercent: 100,
    ease: Circ.easeInOut
  });

  var t4 = TweenMax.set(l1, {
    backgroundColor: prjData.theme.colors.spot1,
    immediateRender: false
  });

  var t5 = TweenMax.to(l2, 0.6, {
    scaleX: 0,
    ease: Circ.easeInOut
  });

  var t6 = TweenMax.to(l3, 0.25, {
    borderColor: prjData.theme.colors.spot1,
    borderWidth: 10
  });

  var timeline = new TimelineMax({ paused: true })
    .eventCallback('onReverseComplete', destroyAll)
    .add(toogleClasses)
    .add(t1)
    .add(t2)
    .add(t3, '-=0.1')
    .add(t4)
    .add(manipulateDom)
    .add(t5)
    .add(t6);

  // Public methods
  this.open = function() {
    timeline.play();
  };

  this.close = function() {
    timeline.reverse();
  };
}

export default Project;
