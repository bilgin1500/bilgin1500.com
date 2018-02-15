import { createEl } from 'utilities/helpers';
import { getPages, getInfo } from 'utilities/orm';
import 'css/menu';

// Create menu and inner elements
var $menu = createEl('div', { id: 'menu' });
var $navPages = createEl('div', { id: 'nav-pages' });
var $navSocial = createEl('div', { id: 'nav-social' });

// Loop pages and append them as a link
for (var i = 0; i < getPages().length; i++) {
  var page = getPages()[i];

  var $navItem = createEl('a', {
    href: '/' + page.slug,
    id: 'nav-' + page.slug
  });
  $navItem.textContent = page.name;
  $navPages.appendChild($navItem);
}

// Loop social media accounts and append them as a link
for (var i = 0; i < getInfo('socialAccounts').length; i++) {
  var account = getInfo('socialAccounts')[i];

  var $socialItem = createEl('a', {
    href: account[1],
    target: '_blank'
  });

  var socialItemIcon = require('!svg-inline-loader!images/' +
    account[0].toLowerCase() +
    '.svg');

  var $socialItemText = createEl('span');

  $socialItemText.textContent = account[0];
  $socialItem.insertAdjacentHTML('beforeend', socialItemIcon);
  $socialItem.appendChild($socialItemText);
  $navSocial.appendChild($socialItem);
}

// Copyright
var $copyright = createEl('div', { id: 'copyright' });
var $copyrighText = createEl('p');
$copyrighText.innerHTML = getInfo('copyright').replace(
  '{year}',
  new Date().getFullYear()
);
$copyright.appendChild($copyrighText);

$menu.appendChild($navPages);
$menu.appendChild($navSocial);
$menu.appendChild($copyright);

export default $menu;
