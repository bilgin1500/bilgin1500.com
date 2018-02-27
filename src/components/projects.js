import Momentum from 'utilities/momentum';
import Image from 'utilities/image';
import {
  isUndefined,
  createEl,
  removeClass,
  addClass,
  slugify,
  buildMediaUrl
} from 'utilities/helpers';
import { getProjectsByCat, getCategories, setSetting } from 'utilities/orm';
import 'css/projects';

// Template for category title
function templateTitle(args) {
  return `<h3>${args.title}</h3>`;
}

// Template for single project showcase
function templateProject(args) {
  return `<a href="/projects/${slugify(args.name)}" id="project-thumb-${slugify(
    args.name
  )}" class="project-item ${args.theme && args.theme.thumbnail.fontColor}">
    <div class="project-visual"></div>
    <div class="project-desc">
      <h4>${args.name}</h4>
      <p>${args.desc}</p>
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
  getProjectsByCat(categoryName).forEach(function(projectData, i) {
    var projectSlug = slugify(projectData.name);

    $items.insertAdjacentHTML('beforeend', templateProject(projectData));

    var $projectItem = $items.lastChild;
    var $projectVisual = $projectItem.querySelector('.project-visual');

    // Create Image instance
    if (
      !isUndefined(projectData.theme.thumbnail) &&
      !isUndefined(projectData.theme.thumbnail.image)
    ) {
      var imgInstance = new Image({
        src: buildMediaUrl({
          project: projectSlug,
          name: projectData.theme.thumbnail.image
        }),
        alt: projectData.name
      });
      $projectVisual.appendChild(imgInstance.elements.wrapper);

      // Cache Image instance
      imgInstanceCache.push(imgInstance);
    }

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
