import { TweenMax, TimelineMax } from 'gsap';
import { winController, addScrollerScene } from 'utilities/scroller';
import { createEl, getHeight, removeClass, addClass } from 'utilities/helpers';
import projectThumbTemplate from 'templates/project-thumbnail';
import data from 'content/index';
import 'css/projects';

var $wrapper = createEl('div', { id: 'projects' }),
  $items = createEl('div', { class: 'project-items' });

/* Filter projects from all the sections in the db */

var projectSection = data.pages.filter(function(page) {
  return page.slug == 'projects';
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
      removeClass($animatedSVGelements[i], CssAnim_playingClass);
      addClass($animatedSVGelements[i], CssAnim_defaultClass);
    } else {
      removeClass($animatedSVGelements[i], CssAnim_defaultClass);
      addClass($animatedSVGelements[i], CssAnim_playingClass);
    }
  }
};

/* Iterate all the projects in the db */

var yValues = [50, 150, 100, 50, 50, 100, 0, 150];
var boxShadowValues = [100, 70, 50, 100, 70, 50, 100, 70, 50];

projectSection[0].list.forEach(function(projectData, i) {
  if (projectData.thumbnail) {
    projectData.thumbnail = require('content/' +
      projectData.slug +
      '/' +
      projectData.thumbnail);
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

  addScrollerScene({
    triggerHook: 'onEnter',
    triggerElement: $projectItem,
    duration: getHeight('window')
  })
    .setTween(projectData.appearAnim)
    .addTo(winController);

  $projectItem.addEventListener('mouseenter', function() {
    toggleSVGAnimations($projectItem);
  });

  $projectItem.addEventListener('mouseleave', function() {
    toggleSVGAnimations($projectItem);
  });
});

$wrapper.appendChild($items);

export default $wrapper;
