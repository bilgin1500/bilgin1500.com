import 'normalize.css';
import 'css/fonts';
import 'css/main';
import 'utilities/router';
import FontFaceObserver from 'fontfaceobserver';
import $menu from 'components/menu';
import { docReady, createEl } from 'utilities/helpers';
import pageData from 'content/index';

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
  var $wrapper = createEl('div', { id: 'content-wrapper' });
  var $app = document.getElementById('app');

  pageData.sections.forEach(function(section) {
    $wrapper.appendChild(require('components/' + section.slug).default);
  });

  $app.appendChild($menu);
  $app.appendChild($wrapper);
});
