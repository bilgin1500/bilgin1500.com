import FontFaceObserver from 'fontfaceobserver';
import { docReady, createEl } from 'utilities/helpers';
import { createIcon } from 'utilities/svg';
import events from 'utilities/events';
import router from 'utilities/router';
import $menu from 'components/menu';
import data from 'content/index';
import 'normalize.css';
import 'css/main';

var fontMuseoSans300 = new FontFaceObserver('MuseoSans-300'),
  fontMuseoSans300I = new FontFaceObserver('MuseoSans-300Italic'),
  fontMuseoSans900 = new FontFaceObserver('MuseoSans-900'),
  fontMuseo300 = new FontFaceObserver('Museo-300'),
  fontMuseo700 = new FontFaceObserver('Museo-700');

Promise.all([
  docReady(),
  fontMuseoSans300.load(),
  fontMuseoSans300I.load(),
  fontMuseoSans900.load(),
  fontMuseo300.load(),
  fontMuseo700.load()
]).then(function() {
  var $logo = createIcon('logo', { id: 'logo' });
  var $logoWrapper = createEl('a', { id: 'logo-wrapper', href: '/' });
  var $wrapper = createEl('div', { id: 'content-wrapper' });
  var $app = document.getElementById('app');

  for (var i = 0; i < data.pages.length; i++) {
    var pageSlug = data.pages[i].slug;
    $wrapper.appendChild(require('components/' + pageSlug).default);
  }

  $logoWrapper.appendChild($logo);
  $app.appendChild($logoWrapper);
  $app.appendChild($menu);
  $app.appendChild($wrapper);

  router.init();
  events.publish('page.ready');
});
