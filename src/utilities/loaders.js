import { TweenMax } from 'gsap';
import { createEl } from 'utilities/helpers';
import 'css/loaders';

var noScrollClass = 'no-scroll';

var _toggleScroll = function() {
  document.body.classList.toggle(noScrollClass);
};

var pageLoader = function() {
  /*var $loader = document.getElementById('loader'),
    loadingClass = 'loading';

  var loaderToggle = new TimelineMax({
    paused: true,
    onComplete: function() {
      document.body.classList.remove(loadingClass);
      $loader.style.display = 'none';
    },
    onReverseComplete: function() {
      $loader.style.display = 'block';
      document.body.classList.add(loadingClass);
    }
  });

  loaderToggle.to($loader, 1, {
    opacity: 0
  });*/
};

var sectionLoader = (function() {
  var $loader,
    loaderId = 'section-loader';

  function _init() {
    if (!document.getElementById(loaderId)) {
      $loader = createEl('div', { id: loaderId });
      document.getElementById('app').appendChild($loader);
    }
  }

  function enter(args) {
    _init();
    _toggleScroll();
    TweenMax.to($loader, 0.5, {
      yPercent: -100,
      ease: Expo.easeInOut,
      onStart: args.onStart,
      onComplete: args.onComplete
    });
    return $loader;
  }

  function leave(args) {
    _toggleScroll();
    TweenMax.to($loader, 0.25, {
      yPercent: 100,
      ease: Expo.easeInOut,
      onStart: args.onStart,
      onComplete: args.onComplete
    });
    return $loader;
  }

  return {
    enter: enter,
    leave: leave
  };
})();

export { pageLoader, sectionLoader };
