import { createEl } from 'utilities/helpers';
import 'css/sketchbook';

/**
 * Creates this page's elements
 * @param  {string} pageSlug - Slug for this page, created by the app.js
 * @return {element} The page wrapper
 */
function createPageDom(pageSlug) {
  var $page = createEl('div', { id: pageSlug });
  return $page;
}

export default createPageDom;
