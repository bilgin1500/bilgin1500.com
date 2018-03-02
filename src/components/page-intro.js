import { createEl, createPageContainer } from 'utilities/helpers';
import { getPageContent } from 'utilities/orm';
import 'css/intro';

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

  // Get and append page content
  $pageContent.innerHTML = getPageContent('Intro');

  return $page;
}

export default createDom;
