import { slugify } from 'utilities/helpers';
import data from 'content/database';

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
 * Grabs a specific page from db by name
 * @param  {string} name -  Name of the page
 * @return {object} Single project object
 */
function getPage(name) {
  return getPages().filter(function(page) {
    return slugify(page.name) == slugify(name);
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
 * Returns filtered projects by given category name
 * @param  {string} catName - Name of the category
 * @return {array} Array of projects
 */
function getProjectsByCategory(catName) {
  return getPage('projects').list.filter(function(project) {
    return project.meta.category.toLowerCase() == catName.toLowerCase();
  });
}

/**
 * Grabs a specific project from db by name or index
 * @param  {string/number} by - 
 *                            name: Name of the desired project
 *                            index: Index number in the projects array 
 * @return {object} Single project object
 */
function getProject(by) {
  if (typeof by == 'string') {
    return getProjects().filter(function(project) {
      return slugify(project.name) == slugify(by);
    })[0];
  } else if (typeof by == 'number') {
    return getProjects()[by];
  }
}

/**
 * Finds a specific project's index number
 * @param  {string} by - The name to search for
 * @return {number} Index number 
 */
function findProjectIndex(name) {
  return getProjects().findIndex(function(project) {
    return slugify(project.name) === slugify(name);
  });
}

/**
 * Grabs a specific section from a specific project by name or index
 * @param  {string/number} sectionBy - Name or index number of the section
 * @param  {string/number} projectBy - Name or index number of the project
 * @return {object} Single section object
 */
function getSection(sectionBy, projectBy) {
  var thisProject = getProject(projectBy);
  if (typeof sectionBy == 'string') {
    return thisProject.sections.filter(function(section) {
      return slugify(section.name) == slugify(sectionBy);
    })[0];
  } else if (typeof sectionBy == 'number') {
    return thisProject.sections[sectionBy];
  }
}

/**
 * Returns all (unique) project category names as an array
 * and reverses it so that it begins with the 'Personal Projects'
 * @return {array} of string (category names) 
 */
function getCategories() {
  return Array.from(
    new Set(
      getProjects().map(function(project) {
        return project.meta.category;
      })
    )
  ).reverse();
}

/**
 * Grabs intro's content
 * @return {string}
 */
function getIntroContent() {
  return getPage('intro').content;
}

// globals

export {
  getInfo,
  getSetting,
  setSetting,
  getPages,
  getPage,
  getProjects,
  getProjectsByCategory,
  getProject,
  findProjectIndex,
  getSection,
  getCategories,
  getIntroContent
};
