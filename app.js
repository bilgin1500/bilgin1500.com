// Import all the GSAP related things
// They will be inserted into the global namespace
// so that one time injection would be enough
import 'gsap';
import 'gsap/Draggable';
import 'ScrollToPlugin';
import 'ThrowPropsPlugin';

// Other injections
import FontFaceObserver from 'fontfaceobserver';
import { docReady, createEl } from 'utilities/helpers';
import { SVGIcon } from 'utilities/svg';
import events from 'utilities/events';
import { log } from 'utilities/helpers';
import router from 'utilities/router';
import { getInfo, getSetting, getPages } from 'utilities/orm';
import $menu from 'components/menu';
import 'normalize.css';
import 'css/main';

// Preload time
if (getSetting('isPerformanceActive')) {
  var pageLoadBeginTime = performance.now();
}

// Observe the font loads
var fontAvenirRegular = new FontFaceObserver('AvenirNextLTPro-Regular'),
  fontAvenirHeavy = new FontFaceObserver('AvenirNextLTPro-Heavy');

Promise.all([
  docReady(),
  fontAvenirRegular.load(),
  fontAvenirHeavy.load()
]).then(function() {
  //var $logoIcon = new SVGIcon('logo', { id: 'logo-icon' });
  var $logo = createEl('a', { id: 'logo', href: '/' });
  var $wrapper = createEl('div', { id: 'content-wrapper' });
  var $app = document.getElementById('app');

  for (var i = 0; i < getPages().length; i++) {
    var pageSlug = getPages()[i].slug;
    $wrapper.appendChild(require('components/' + pageSlug).default);
  }

  //$logoWrapper.appendChild($logoIcon);
  $logo.innerHTML = getInfo('title');
  $app.appendChild($logo);
  $app.appendChild($menu);
  $app.appendChild($wrapper);

  router.init();
  events.publish('page.ready');

  // Log the perf
  if (getSetting('isPerformanceActive')) {
    var pageLoadEndTime = performance.now();
    log(
      '[PERF] Page is ready in ' +
        Math.round(pageLoadEndTime - pageLoadBeginTime) +
        ' milliseconds.',
      { color: 'green' }
    );
  }
});
