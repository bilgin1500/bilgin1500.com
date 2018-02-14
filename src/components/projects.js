import {
  isUndefined,
  createEl,
  removeClass,
  addClass
} from 'utilities/helpers';
import {
  getProjectsByCategory,
  getCategories,
  getSetting,
  setSetting
} from 'utilities/orm';
import Momentum from 'utilities/momentum';
import 'css/projects';

// Template for category title
function templateTitle(args) {
  return `<h3>${args.title}</h3>`;
}

// Template for single project showcase
function templateProject(args) {
  return `<a href="/projects/${args.slug}" id="project-thumb-${args.slug}" class="project-item ${args.theme &&
    args.theme.size} ${args.theme && args.theme.color}">
    <div class="project-visual">
      <img src="${args.thumbnail}" alt="${args.name}">
    </div>
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

// Create a blank array for Momentum cache
if (isUndefined(getSetting('momentumCache'))) {
  setSetting('momentumCache', []);
}

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
  // and init the momentum (parallax) effect
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

    //new Momentum($projectItem).start();
  });

  $wrapper.appendChild($items);
}

// List projects
for (var i = 0; i < getCategories().length; i++) {
  listProjects(getCategories()[i]);
}

export default $wrapper;
