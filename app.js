// Import all the GSAP related things
// They will be inserted into the global namespace
// so that one time injection would be enough
import 'gsap';
import 'gsap/Draggable';
import 'ScrollToPlugin';
import 'ThrowPropsPlugin';

// Other injections
import FontFaceObserver from 'fontfaceobserver';
import { docReady, createEl, slugify } from 'utilities/helpers';
import events from 'utilities/events';
import { log } from 'utilities/helpers';
import router from 'utilities/router';
import { getInfo, getSetting, getPages } from 'utilities/orm';
import $menu from 'components/menu';
import 'normalize.css';
import 'css/main';
import 'css/helpers';

// Preload time
if (getSetting('isPerformanceActive')) {
  var pageLoadBeginTime = performance.now();
}

docReady().then(function() {
  // Observe the font loads
  var fontAvenirRegular = new FontFaceObserver('AvenirNextLTPro-Regular'),
    fontAvenirHeavy = new FontFaceObserver('AvenirNextLTPro-Heavy');

  Promise.all([
    fontAvenirRegular.load(),
    fontAvenirHeavy.load()
  ]).then(function() {
    var $logoWrapper = createEl('h1', { id: 'logo' });
    var $logo = createEl('a', {
      href: '/',
      innerHTML:
        '<span>' +
        getInfo('title') +
        '</span><span>' +
        getInfo('subtitle') +
        '</span>'
    });
    var $wrapper = createEl('div', { id: 'content-wrapper' });
    var $app = document.getElementById('app');

    for (var i = 0; i < getPages().length; i++) {
      var pageSlug = slugify(getPages()[i].name);
      $wrapper.appendChild(require('components/' + pageSlug).default(pageSlug));
    }

    $logoWrapper.appendChild($logo);
    $app.appendChild($logoWrapper);
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
});
