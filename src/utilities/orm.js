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
function getProjectsByCat(catName) {
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
  var project = getProject(projectBy);
  if (typeof sectionBy == 'string') {
    return project.sections.filter(function(section) {
      return slugify(section.name) == slugify(sectionBy);
    })[0];
  } else if (typeof sectionBy == 'number') {
    return project.sections[sectionBy];
  }
}

/**
 * Finds a specific section's index number
 * @param  {string} sectionName - The section name to search for
 * @param  {string/number} projectBy - The project which contains the section
 * @return {number} Index number 
 */
function findSectionIndex(sectionName, projectBy) {
  var project = getProject(projectBy);
  return project.sections.findIndex(function(section) {
    return slugify(section.name) === slugify(sectionName);
  });
}

/**
 * Find the adjacent section indexes
 * @param  {string/number} projectBy - Which project
 * @param  {string/number} sectionBy - Which section
 * @return {object} Adjacent indexes in an object: {previous,next}
 */
function getAdjSectionIndexes(projectBy, sectionBy) {
  var project = getProject(projectBy);
  var sections = project.sections;
  var sectionIndex;

  if (typeof sectionBy == 'string') {
    sectionIndex = findSectionIndex(sectionBy, projectBy);
  } else if (typeof sectionBy == 'number') {
    sectionIndex = sectionBy;
  }

  return {
    previous:
      sectionIndex == 0 ? project.sections.length - 1 : sectionIndex - 1,
    next: sectionIndex == project.sections.length - 1 ? 0 : sectionIndex + 1
  };
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
  getProjectsByCat,
  getProject,
  findProjectIndex,
  getSection,
  findSectionIndex,
  getAdjSectionIndexes,
  getCategories,
  getIntroContent
};
