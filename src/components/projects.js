import {
  isUndefined,
  createEl,
  removeClass,
  addClass
} from 'utilities/helpers';
import {
  getProjectsByCategory,
  getCategories,
  setSetting
} from 'utilities/orm';
import Momentum from 'utilities/momentum';
import Image from 'utilities/image';
import 'css/projects';

// Template for category title
function templateTitle(args) {
  return `<h3>${args.title}</h3>`;
}

// Template for single project showcase
function templateProject(args) {
  return `<a href="/projects/${args.slug}" id="project-thumb-${args.slug}" class="project-item ${args.theme &&
    args.theme.size} ${args.theme && args.theme.color}">
    <div class="project-visual"></div>
    <div class="project-desc">
      <h4>${args.name}</h4>
      <p>${args.desc}</p>
      <div class="tags">
        <span>${args.tags.join('</span><span>')}</span>
      </div>
    </div>
  </a>`;
}

// Create elements and cache them
var $wrapper = createEl('div', { id: 'projects' });

// Cache all the images to control the loading process in the near future
var imgInstanceCache = [];

// Function wrapper to list and append projects by category
function listProjects(categoryName) {
  // Create a wrapper for this category
  var $items = createEl('div', {
    class: 'project-items ' + categoryName.toLowerCase().replace(/\s/g, '-')
  });

  // Category title
  $wrapper.insertAdjacentHTML(
    'beforeend',
    templateTitle({ title: categoryName })
  );

  // Iterate all projects in db, append them to the DOM
  getProjectsByCategory(categoryName).forEach(function(projectData, i) {
    projectData.thumbnail =
      projectData.theme && projectData.theme.thumbnail
        ? require('../projects/' +
            projectData.slug +
            '/' +
            projectData.theme.thumbnail)
        : '';

    $items.insertAdjacentHTML('beforeend', templateProject(projectData));

    var $projectItem = $items.lastChild;
    var $projectVisual = $projectItem.querySelector('.project-visual');

    // Create Image instance
    var imgInstance = new Image({
      src: projectData.thumbnail,
      alt: projectData.name
    });
    $projectVisual.appendChild(imgInstance.elements.wrapper);

    // Cache Image instance
    imgInstanceCache.push(imgInstance);

    //new Momentum($projectItem).start();
  });

  $wrapper.appendChild($items);
}

// Save momentum cache
setSetting('momentumCache', []);

// Save img instance cache
setSetting('imageInstanceCache', imgInstanceCache);

// List projects
for (var i = 0; i < getCategories().length; i++) {
  listProjects(getCategories()[i]);
}

export default $wrapper;
