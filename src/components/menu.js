import { createEl } from 'utilities/helpers';
import { getPages, getInfo } from 'utilities/orm';
import 'css/menu';

// Create menu and inner elements
var $menu = createEl('div', { id: 'menu' });
var $nav = createEl('div', { id: 'nav' });
var $socialNav = createEl('div', { id: 'social-nav' });

// Loop pages and append them as a link
for (var i = 0; i < getPages().length; i++) {
  var page = getPages()[i];

  var $navItem = createEl('a', {
    href: '/' + page.slug,
    id: 'nav-' + page.slug,
    class: 'nav-item'
  });
  $navItem.textContent = page.name;
  $nav.appendChild($navItem);
}

// Loop social media accounts and append them as a link
for (var i = 0; i < getInfo('socialAccounts').length; i++) {
  var account = getInfo('socialAccounts')[i];

  var $socialItem = createEl('a', {
    href: account[1],
    target: '_blank'
  });
  var $socialItemIcon = createEl('img', {
    src: require('images/' + account[0].toLowerCase() + '.svg'),
    alt: account[0]
  });
  var $socialItemText = createEl('span');
  $socialItemText.textContent = account[0];
  $socialItem.appendChild($socialItemIcon);
  $socialItem.appendChild($socialItemText);
  $socialNav.appendChild($socialItem);
}

$menu.appendChild($nav);
$menu.appendChild($socialNav);

export default $menu;
