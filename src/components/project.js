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
import events from 'utilities/events';
import Sections from 'components/sections';
import closeIcon from 'images/close.svg';
import 'css/project';

var sectionsInstance;
var defaultOpenings;

/**
 * Project constructor. It is used in the router.
 * Public properties and methods are:
 *     slug: Project's slug
 *     open: Opens the window
 *     close: Closes the window
 *     onEnd: onEnd callback
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

  // onEnd: After project window is closed onEnd will trigger
  // It comes from the router and used for the prev/next prj. navigation
  this.close = function(onEnd) {
    windowInstance.close(onEnd);
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
    class: 'close'
  });
  var $closeImg = createEl('img', {
    src: closeIcon,
    alt: 'Close Project [ESC]'
  });
  $close.appendChild($closeImg);

  // Close button hover animation
  var hoverAnim = TweenMax.to($close, 0.15, {
    paused: true,
    rotation: 135
  });
  $close.addEventListener('mouseover', function() {
    hoverAnim.play();
  });
  $close.addEventListener('mouseout', function() {
    hoverAnim.reverse();
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
    // This will fire on on [0]-1-0
    .eventCallback('onStart', function() {
      events.publish('project.onStart');
    })
    // Disable body scrolling and note to myself: delete project-window-opened
    .add(function() {
      toggleClass($doc.body, ['no-scroll', 'project-window-opened']);
    })
    // At first we'll set the defaults for the layers
    .set([l1, l2, l3], {
      transformOrigin: '100% 0%',
      display: 'block',
      immediateRender: false
    })
    // A gate for other functions to hook to
    .add(function() {
      events.publish('project.onLayer1Start');
    })
    // Slide the layer1
    .to(l1, 0.4, {
      xPercent: 100,
      ease: Circ.easeInOut
    })
    // A gate for other functions to hook to
    .add(function() {
      events.publish('project.onLayer2Start');
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
    // A gate for other functions to hook to
    .add(function() {
      events.publish('project.onContentRevealBegin', {
        isReversed: prjOpenCloseAnim.reversed()
      });
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
      events.publish('project.onReady');
    })
    // This will fire on 0-1-[0]
    .eventCallback('onReverseComplete', function() {
      events.publish('project.onEnd');
      clearInnerHTML($currWindow);
      // Fire the onEnd callback set by this.close method
      if (!isUndefined(self.onEnd)) {
        self.onEnd();
      }
    });

  // Public methods
  this.open = function() {
    prjOpenCloseAnim.play();
  };

  // Parameter onEnd comes from project.close()
  this.close = function(onEnd) {
    // https://greensock.com/forums/topic/9182-detect-reverse-start-event/?do=findComment&comment=36992
    events.publish('project.onReverseStart');

    // Begin the reversing
    prjOpenCloseAnim.reverse();

    // Make the onEnd callback reachable
    this.onEnd = onEnd;
  };
}

export default Project;
