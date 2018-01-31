import data from 'content/index';

/**
 * Grabs a specific info from db
 * @param  {string} property - A info property 
 * @return {string/number/boolean} 
 */
function getInfo(property) {
  return data.info[property];
}

/**
 * Grabs a specific setting from db
 * @param  {string} property - A setting property 
 * @return {string/number/boolean}
 */
function getSetting(property) {
  return data.settings[property];
}

/**
 * Save a setting to the db for later use
 * @param  {string} property - A setting property 
 * @return {string/number/boolean} The value we've set
 */
function setSetting(property, value) {
  data.settings[property] = value;
  return value;
}

/**
 * Grabs all the pages from db
 * @return {array} Pages array
 */
function getPages() {
  return data.pages;
}

/**
 * Grabs a specific page from db by slug
 * @param  {string} slug - Slug name of the page
 * @return {object} Single project object
 */
function getPage(slug) {
  return getPages().filter(function(page) {
    return page.slug == slug;
  })[0];
}

/**
 * Grabs all projects from db
 * @return {array} Array of projects
 */
function getProjects() {
  return getPage('projects').list;
}

/**
 * Grabs a specific project from db by slug or index
 * @param  {string/number} by - 
 *                            slug: Slug name of the desired project
 *                            index: Index number in the projects array 
 * @return {object} Single project object
 */
function getProject(by) {
  if (typeof by == 'string') {
    return getProjects().filter(function(project) {
      return project.slug == by;
    })[0];
  } else if (typeof by == 'number') {
    return getProjects()[by];
  }
}

/**
 * Finds a specific project's index number
 * @param  {string/number} by - Get by slug
 * @return {number} Index number 
 */
function findProjectIndex(slug) {
  return getProjects().findIndex(function(project) {
    return project.slug === slug;
  });
}

/**
 * Grabs a specific section from a specific project by slug or index
 * @param  {string/number} sectionBy - Slug name or index number of the section
 * @param  {string/number} projectBy - Slug name or index number of the project
 * @return {object} Single section object
 */
function getSection(sectionBy, projectBy) {
  var thisProject = getProject(projectBy);
  if (typeof sectionBy == 'string') {
    return thisProject.sections.filter(function(section) {
      return section.slug == sectionBy;
    })[0];
  } else if (typeof sectionBy == 'number') {
    return thisProject.sections[sectionBy];
  }
}

// globals

export {
  getInfo,
  getSetting,
  setSetting,
  getPages,
  getPage,
  getProjects,
  getProject,
  findProjectIndex,
  getSection
};
