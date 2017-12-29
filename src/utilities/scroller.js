import ScrollMagic from 'scrollmagic';
import 'ScrollMagicIndicators';
import 'ScrollMagicGSAP';

var winController = new ScrollMagic.Controller();

var addScrollerScene = function(args) {
  return new ScrollMagic.Scene(args);
};

/*addScrollerScene({
    triggerHook: 'onEnter',
    triggerElement: $projectItem
  })
    .setTween(projectData.appearAnim)
    .addTo(winController);*/

export { winController, addScrollerScene };
