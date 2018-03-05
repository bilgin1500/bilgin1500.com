import { createEl, slugify } from 'utilities/helpers';
import { getPages, getInfo } from 'utilities/orm';
import events from 'utilities/events';
import ScrollEvent from 'utilities/scroll';
import 'css/header';

// The logo itself
var logoHTML =
  '<span>' +
  getInfo('title') +
  '</span><span>' +
  getInfo('subtitle') +
  '</span>';

// Create elements
var $header = createEl('div', { id: 'header' });
var $logoWrapper = createEl('h1', { id: 'logo' });
var $logo = createEl('a', { href: '/', innerHTML: logoHTML });
var $menu = createEl('div', { id: 'menu' });

// Loop pages and append them as a link
for (var i = 0; i < getPages().length; i++) {
  var page = getPages()[i];

  var $bullet = createEl('a', {
    href: '/' + slugify(page.name),
    id: 'nav-' + slugify(page.name)
  });

  var $bulletSpan = createEl('span');
  var $bulletText = createEl('span');
  $bulletText.innerText = page.name;
  $bulletSpan.appendChild($bulletText);
  $bullet.appendChild($bulletSpan);

  $menu.appendChild($bullet);
}

// Append everything
$logoWrapper.appendChild($logo);
$header.appendChild($logoWrapper);
$header.appendChild($menu);

export default $header;
