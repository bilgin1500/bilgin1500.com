import { createEl } from 'utilities/helpers';
import { getInfo } from 'utilities/orm';
import 'css/footer';

// Create elements
var $footer = createEl('div', { id: 'footer' });
var $navSocial = createEl('div', { id: 'nav-social' });
var $copyright = createEl('div', { id: 'copyright' });

// Loop social media accounts and append them as a link
for (var i = 0; i < getInfo('socialAccounts').length; i++) {
  var account = getInfo('socialAccounts')[i];

  var $socialItem = createEl('a', {
    href: account[1],
    rel: 'external'
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
var copyText = getInfo('copyright').replace('{year}', new Date().getFullYear());
var $copyrighText = createEl('p', { innerHTML: copyText });
$copyright.appendChild($copyrighText);

// Append everything
$footer.appendChild($copyright);
$footer.appendChild($navSocial);

export default $footer;
