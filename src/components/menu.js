import { createEl } from 'utilities/helpers';
import { getPages, getInfo } from 'utilities/orm';
import 'css/menu';

// Create menu and inner elements
var $menu = createEl('div', { id: 'menu' });
var $navWrapper = createEl('div', { id: 'nav-wrapper' });
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
  var $socialItemIcon = createEl('img', {
    src: require('images/' + account[0].toLowerCase() + '.svg'),
    alt: account[0]
  });
  var $socialItemText = createEl('span');
  $socialItemText.textContent = account[0];
  $socialItem.appendChild($socialItemIcon);
  $socialItem.appendChild($socialItemText);
  $navSocial.appendChild($socialItem);
}

// Create a hamburger icon
/*var $mainLine = new SVGElement('line', {
  x1: 0,
  x2: 32,
  y1: 0,
  y2: 0,
  stroke: 'default'
});

var $bottomLine = new SVGElement('line', {
  x1: 23,
  x2: 48,
  y1: 22 + menu.hamburgerGap,
  y2: 22 + menu.hamburgerGap,
  stroke: 'default'
});

var $menuSVG = new SVGElement('svg', { id: 'line-wrapper' });*/

$menu.appendChild($navWrapper);
$navWrapper.appendChild($navPages);
$navWrapper.appendChild($navSocial);

export default $menu;
