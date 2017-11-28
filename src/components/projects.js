import { TweenMax, TimelineMax } from 'gsap';
import ScrollMagic from 'scrollmagic';
import 'ScrollMagicGSAP';
import { createEl, getWinHeight } from 'utilities/helpers';
import pageData from 'content/index';
import projectThumbTemplate from 'templates/project-thumbnail';
import projectTemplate from 'templates/project';
import 'css/projects';
import { sectionLoader } from 'utilities/loaders';

var projectWindowStatus = 'closed';

var $wrapper = createEl('div', { id: 'projects' }),
  $items = createEl('div', { id: 'project-items' });

var projectsController = new ScrollMagic.Controller({
  container: $wrapper // This doesnt work!
});

/* Filter projects from all the sections in the db */

var projectSection = pageData.sections.filter(function(section) {
  return section.slug == 'projects';
});

var CssAnim_defaultClass = 'paused',
  CssAnim_playingClass = 'playing',
  CssAnim_animClass = 'animation';

/**
 * Toggle SVG parts inside the element to pause and play
 * @param  {element} $projectItem - The parent element which contains the SVG doc
 */
var toggleSVGAnimations = function($projectItem) {
  var status = 'playing';
  var $animatedSVGelements = $projectItem.querySelectorAll(
    '.' + CssAnim_playingClass
  );

  if ($animatedSVGelements.length == 0) {
    $animatedSVGelements = $projectItem.querySelectorAll(
      '.' + CssAnim_defaultClass
    );
    status = 'paused';
  }

  for (var i = $animatedSVGelements.length - 1; i >= 0; i--) {
    if (status == 'playing') {
      $animatedSVGelements[i].classList.remove(CssAnim_playingClass);
      $animatedSVGelements[i].classList.add(CssAnim_defaultClass);
    } else {
      $animatedSVGelements[i].classList.remove(CssAnim_defaultClass);
      $animatedSVGelements[i].classList.add(CssAnim_playingClass);
    }
  }
};

/*var $SVGelementsToBlow = $projectItem.querySelectorAll('.blow'),
for (var i = $SVGelementsToBlow.length - 1; i >= 0; i--) {
    $SVGelementsToBlow[i].classList.remove(CssAnim_animClass);
  }*/

var openProjectWindow = function() {
  if (projectWindowStatus == 'closed') {
    //projectsController.enabled(!projectsController.enabled()).update(true);
    sectionLoader.enter();
    projectWindowStatus = 'open';
  }
};

var closeProjectWindow = function() {
  if (projectWindowStatus == 'open') {
    //projectsController.enabled(!projectsController.enabled()).update(true);
    sectionLoader.leave();
    projectWindowStatus = 'closed';
  }
};

/* Iterate all the projects in the db */

var yValues = [50, 150, 100, 50, 50, 100, 0, 150];
var boxShadowValues = [100, 70, 50, 100, 70, 50, 100, 70, 50];

projectSection[0].list.forEach(function(projectData, i) {
  if (projectData.svg) {
    projectData.svg = require('content/' + projectData.svg);
  }

  $items.insertAdjacentHTML('beforeend', projectThumbTemplate(projectData));

  var $projectItem = $items.lastChild,
    $projectItems = $items.children,
    $projectVisual = $projectItem.querySelector('.project-visual svg'),
    $SVGelementsToBlow = $projectItem.querySelectorAll('.blow'),
    $projectH2 = $projectItem.querySelector('.project-desc h2'),
    $projectP = $projectItem.querySelector('.project-desc p');

  $projectItem.style.boxShadow =
    '10px ' + boxShadowValues[i] + 'px 0 rgba(0,0,0,0.05)';

  projectData.appearAnim = new TweenMax.to($projectItem, 1, {
    y: yValues[i],
    boxShadow: '10px ' + (boxShadowValues[i] + -20) + 'px 0 rgba(0,0,0,0.05)'
  });

  projectData.scrollScene = new ScrollMagic.Scene({
    triggerHook: 'onEnter',
    triggerElement: $projectItem,
    duration: getWinHeight()
  })
    .setTween(projectData.appearAnim)
    .addTo(projectsController);

  $projectItem.addEventListener('mouseenter', function() {
    toggleSVGAnimations($projectItem);
  });

  $projectItem.addEventListener('mouseleave', function() {
    toggleSVGAnimations($projectItem);
  });

  $projectItem.addEventListener('click', function(e) {
    openProjectWindow();
    e.preventDefault();
  });
});

$wrapper.appendChild($items);

export default $wrapper;
