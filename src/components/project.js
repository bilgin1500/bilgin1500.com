import {
  $doc,
  isUndefined,
  createEl,
  toggleClass,
  slugify,
  clearInnerHTML,
  setBodyScroll
} from 'utilities/helpers';
import {
  getProjects,
  getProject,
  findProjectIndex,
  setSetting,
  getSetting
} from 'utilities/orm';
import loader from 'components/loader';
import events from 'utilities/events';
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
 *     
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

  /**
   * Public method to open the project and its window
   * @param {function} onOpenEnd - Will fire after project is opened. It is used in router's next function. After opening the project we'll close the page loader
   */
  this.open = function(onOpenEnd) {
    windowInstance.open(onOpenEnd);
  };

  /**
   * Public method to close the project and its window
   * @param {function} onOpenEnd - Will fire after project is closed. It comes from the router and used for the prev/next prj. navigation
   */
  this.close = function(onCloseEnd) {
    windowInstance.close(onCloseEnd);
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
 *     onOpenEnd: Fires after project is opened and set by open method
 *     onCloseEnd: Fires after project is closed and set by close method
 *     
 * @param {object} prjData - Project data from database
 */
function ProjectWindow(prjData) {
  var self = this;

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
    innerText: 'Previous',
    rel: 'prev'
  });

  var $next = createEl('a', {
    href: prjData.nextPrjUrl,
    title: 'Previous Project: ' + prjData.nextPrjName + ' [N]',
    class: 'prev',
    innerText: 'Next',
    rel: 'next'
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

  /**
   * This project opening/closing animation is a beautiful example 
   * of how complex yet elegant a GSAP timeline can become 
   * Repeat: 0 ( start/closed) - 1 (ends/opened) - 0 (reversed/closed)
   */
  var prjOpenCloseAnim = new TimelineMax({ paused: true })
    // Disable body scrolling and note to myself: delete project-window-opened
    .add(function() {
      toggleClass($doc.body, 'project-window-opened');
      setBodyScroll('toggle');
    })
    // At first we'll set the defaults for the layers
    .set([l1, l2, l3], {
      transformOrigin: '100% 0%',
      display: 'block',
      immediateRender: false
    })
    // Slide the layer1
    .to(l1, 0.4, {
      xPercent: 100,
      ease: Circ.easeInOut
    })
    // Remove page loader's borders (z-index issue)
    .add(function() {
      if (!prjOpenCloseAnim.reversed()) {
        loader.removeBorders();
      }
    }, '-=0.1')
    // Slide the layer2
    .to(
      l2,
      0.4,
      {
        xPercent: 100,
        ease: Circ.easeInOut
      },
      '-=0.1'
    )
    // While layer2 is blocking the vision change the background color behind
    .set(l1, {
      backgroundColor: prjData.theme.colors.spot1,
      immediateRender: false
    })
    // When layer2 blocks the vision manipulate the DOM behind:
    // Straight: Append the project content during the transition animation
    // Reversed: Remove the elements inside the .project-wrapper
    .add(function() {
      if (prjOpenCloseAnim.reversed()) {
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
        sectionsInstance.goto(
          defaultOpenings.section,
          defaultOpenings.slide,
          true
        );
      }
    })
    // Slide the layer2 out: Everything reveals
    .to(l2, 0.6, {
      scaleX: 0,
      ease: Circ.easeInOut
    })
    // Final touch: Borders
    .to(l3, 0.25, {
      borderColor: prjData.theme.colors.spot1,
      borderWidth: 10
    })
    // This will fire on 0-[1]-0
    .eventCallback('onComplete', function() {
      // Fire the onOpenEnd callback set by this.close method
      if (!isUndefined(self.onOpenEnd)) {
        self.onOpenEnd();
      }
    })
    // This will fire on 0-1-[0]
    .eventCallback('onReverseComplete', function() {
      // Remove page loader's borders (z-index issue)
      loader.addBorders();
      // Clear window's innerHTML
      clearInnerHTML($currWindow);
      // Fire the onCloseEnd callback set by this.close method
      if (!isUndefined(self.onCloseEnd)) {
        self.onCloseEnd();
      }
    });

  // Public methods
  this.open = function(onOpenEnd) {
    prjOpenCloseAnim.play();

    // Make the onOpenEnd callback reachable for the animation
    this.onOpenEnd = onOpenEnd;
  };

  this.close = function(onCloseEnd) {
    // Begin the reversing
    prjOpenCloseAnim.reverse();

    // Make the onCloseEnd callback reachable for the animation
    this.onCloseEnd = onCloseEnd;
  };
}

export default Project;
