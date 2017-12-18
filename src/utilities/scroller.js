import ScrollMagic from 'scrollmagic';
import 'ScrollMagicIndicators';
import 'ScrollMagicGSAP';

var winController = new ScrollMagic.Controller();

var addScrollerScene = function(args) {
  return new ScrollMagic.Scene(args);
};

export { winController, addScrollerScene };
