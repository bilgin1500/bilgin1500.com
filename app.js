// Import all the GSAP related things
// They will be inserted into the global namespace
// so that one time injection would be enough
import 'gsap';
import 'gsap/Draggable';
import 'ScrollToPlugin';
import 'ThrowPropsPlugin';
import 'SplitText';

// Other injections
import FontFaceObserver from 'fontfaceobserver';
import { getInfo, getSetting, getPages } from 'utilities/orm';
import events from 'utilities/events';
import router from 'utilities/router';
import analytics from 'utilities/analytics';
import loader from 'components/loader';
import logo from 'components/logo';
import $header from 'components/header';
import $footer from 'components/footer';
import 'images/favicon-16x16.png';
import 'images/favicon-32x32.png';
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
    $app.appendChild(loader.elements.wrapper);
    $app.appendChild(logo.elements.wrapper);
    $app.appendChild($header);
    $app.appendChild($content);
    $app.appendChild($footer);

    // Initializations
    analytics.init();
    logo.type(['<b1500/>'], router.init);

    // Tell the world that page is ready!
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
