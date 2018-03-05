// Import all the GSAP related things
// They will be inserted into the global namespace
// so that one time injection would be enough
import 'gsap';
import 'gsap/Draggable';
import 'ScrollToPlugin';
import 'ThrowPropsPlugin';
import 'DrawSVGPlugin';

// Other injections
import FontFaceObserver from 'fontfaceobserver';
import events from 'utilities/events';
import router from 'utilities/router';
import { getInfo, getSetting, getPages } from 'utilities/orm';
import $header from 'components/header';
import $footer from 'components/footer';
import 'normalize.css';
import 'css/main';
import 'css/helpers';
import {
  docReady,
  createEl,
  slugify,
  removeClass,
  log,
  $doc
} from 'utilities/helpers';

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
    var $app = document.getElementById('app');

    // Create elements
    var $layer = createEl('div', { id: 'layer-top', class: 'layer' });
    var $content = createEl('div', { id: 'content' });

    // Get all the pages
    var pages = getPages();
    // And append them to the content
    for (var i = 0; i < pages.length; i++) {
      var pageName = pages[i].name;
      var pageContent = pages[i].content;
      var pageSlug = slugify(pageName);
      var createDom = require('components/page-' + pageSlug).default;
      $content.appendChild(
        createDom({ name: pageName, content: pageContent, slug: pageSlug })
      );
    }

    // Append content
    $app.appendChild($layer);
    $app.appendChild($header);
    $app.appendChild($content);
    $app.appendChild($footer);

    // Initializations
    router.init();

    // Open the curtains
    TweenMax.to($layer, 0.25, {
      borderWidth: 10,
      backgroundColor: 'transparent'
    });

    // Curtains on project opening and closing
    events.subscribe('project.onLayer2Start', function() {
      TweenMax.set($layer, { borderWidth: 0 });
    });
    events.subscribe('project.onEnd', function() {
      TweenMax.to($layer, 0.25, { borderWidth: 10 });
    });

    // Tell the world that lage is ready!
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
