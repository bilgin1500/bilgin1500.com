import Momentum from 'utilities/momentum';
import Image from 'utilities/image';
import {
  isUndefined,
  createEl,
  createPageContainer,
  removeClass,
  addClass,
  slugify,
  buildMediaUrl
} from 'utilities/helpers';
import { getProjects, getSetting, setSetting } from 'utilities/orm';
import 'css/projects';

var imgInstanceCache, momentumCache;

/**
 * Create single project item's dom
 * @param  {object} prjData - Project data from database
 * @return {element} The project item
 */
function createProjectItem(prjData) {
  var projectSlug = slugify(prjData.name);

  // Create project item's inner elements
  var $projectItem = createEl('a', {
    href: '/projects/' + projectSlug,
    id: 'project-thumb-' + projectSlug,
    class: 'project-item'
  });
  var $projectVisual = createEl('div', { class: 'project-visual' });
  var $projectHead = createEl('div', { class: 'project-head' });
  var $projectTitle = createEl('h3', {
    innerText: prjData.name,
    style: 'color:' + prjData.theme.colors.spot1
  });
  var $projectDesc = createEl('p', {
    innerText: prjData.desc,
    style: 'color:' + prjData.theme.colors.spot2
  });

  // Create Image instance
  var imgInstance = new Image({
    src: buildMediaUrl({
      project: slugify(prjData.name),
      name: getSetting('thumbnailImageFileName')
    }),
    alt: prjData.name
  });
  $projectVisual.appendChild(imgInstance.elements.wrapper);

  // Cache Image instance
  imgInstanceCache.push(imgInstance);

  /*new Momentum($projectTitle, { speed: 0.025 }).start();
  new Momentum($projectDesc, { speed: 0.035 }).start();*/

  // Append everything and return
  $projectHead.appendChild($projectTitle);
  $projectHead.appendChild($projectDesc);
  $projectItem.appendChild($projectVisual);
  $projectItem.appendChild($projectHead);
  return $projectItem;
}

/**
 * Creates this page's elements
 * @param  {object} page - Object containing page data
 *                        name: Name of the page
 *                        slug: Slug for this page, created by the app.js
 * @return {element} The page wrapper
 */
function createDom(page) {
  var page = createPageContainer(page);
  var $page = page.$page;
  var $pageContent = page.$content;

  // Create empty cache element
  imgInstanceCache = [];
  momentumCache = [];

  // Cache all projects
  var projects = getProjects();

  // List and append single project items
  for (var i = 0; i < projects.length; i++) {
    var $projectItem = createProjectItem(projects[i]);
    $pageContent.appendChild($projectItem);
  }

  // Save instances
  setSetting('momentumCache', momentumCache);
  setSetting('imageCacheForHome', imgInstanceCache);

  return $page;
}

export default createDom;
