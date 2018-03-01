import { createEl } from 'utilities/helpers';
import { getIntroContent } from 'utilities/orm';
import 'css/intro';

/**
 * Creates this page's elements
 * @param  {string} pageSlug - Slug for this page, created by the app.js
 * @return {element} The page wrapper
 */
function createPageDom(pageSlug) {
  var $page = createEl('div', { id: pageSlug });
  var $text = createEl('p');
  $text.innerHTML = getIntroContent();
  $page.appendChild($text);
  return $page;
}

export default createPageDom;
