import Momentum from 'utilities/momentum';
import { getProjects, getSetting, setSetting } from 'utilities/orm';
import {
  isUndefined,
  createEl,
  removeClass,
  addClass
} from 'utilities/helpers';
import projectThumbTemplate from 'templates/project-thumbnail';
import 'css/projects';

// Create elements and cache them
var $wrapper = createEl('div', { id: 'projects' });
var $items = createEl('div', { class: 'project-items' });

// Create a blank array for Momentum cache
if (isUndefined(getSetting('momentumCache'))) {
  setSetting('momentumCache', []);
}

// Iterate all the projects in the db,
// append them to the DOM and init the parallax effect
getProjects().forEach(function(projectData, i) {
  if (projectData.thumbnail) {
    projectData.thumbnail = require('content/' +
      projectData.slug +
      '/' +
      projectData.thumbnail);
  }

  $items.insertAdjacentHTML('beforeend', projectThumbTemplate(projectData));

  var $projectItem = $items.lastChild,
    $projectItems = $items.children,
    $projectVisual = $projectItem.querySelector('.project-visual'),
    //$SVGelementsToBlow = $projectItem.querySelectorAll('.blow'),
    $projectDesc = $projectItem.querySelector('.project-desc'),
    $projectP = $projectItem.querySelector('.project-desc p');

  new Momentum($projectVisual).start();
  new Momentum($projectDesc, { speed: 0.45 }).start();
  new Momentum($projectP, { speed: 0.1 }).start();
  //var momentum = new Momentum($projectItem, projectData.momentum);
  //momentum.start();
  //getSetting('momentumCache').push(momentum);

  // Tüm momentumları setSetting ile kaydedelim
  // sonra da gerektiğinde hepsini birlikte durduralım da boşuna hesap kitap
  // dönmesin ana sayfada.

  /*$projectItem.addEventListener('mouseenter', function() {
    toggleSVGAnimations($projectItem);
    momentum.toggle();
  });

  $projectItem.addEventListener('mouseleave', function() {
    toggleSVGAnimations($projectItem);
    momentum.toggle();
  });*/
});

$wrapper.appendChild($items);

/*var CssAnim_defaultClass = 'paused',
  CssAnim_playingClass = 'playing',
  CssAnim_animClass = 'animation';*/

/**
 * Toggle SVG parts inside the element to pause and play
 * @param  {element} $projectItem - The parent element which contains the SVG doc
 */
/*var toggleSVGAnimations = function($projectItem) {
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
};*/

export default $wrapper;
