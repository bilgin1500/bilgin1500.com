import throttle from 'throttle-debounce/throttle';
import { SVGElement, SVGIcon } from 'utilities/svg';
import {
  $win,
  $doc,
  log,
  createEl,
  getHeight,
  hasClass,
  addClass,
  removeClass
} from 'utilities/helpers';
import { getPages, getSetting, setSetting } from 'utilities/orm';
import events from 'utilities/events';
import 'css/menu';

var $menu = createEl('div', { id: 'menu' });

// Settings
setSetting('menuStatus', 'closed');

var menu = {
  width: 50,
  hamburgerWidth: 25,
  hamburgerGap: 10,
  autoClose: {
    active: true,
    timer: null,
    duration: 5000
  }
};

var wrapperOffset = 60;

var getMenuHeight = function() {
  return getHeight('window') - wrapperOffset;
};

// Create menu svg items

var $topLine = new SVGElement('line', {
  x1: 23,
  x2: 48,
  y1: 22,
  y2: 22,
  stroke: 'default'
});

var $mainLine = new SVGElement('line', {
  x1: menu.width - menu.hamburgerWidth / 2 - 2,
  x2: menu.width - menu.hamburgerWidth / 2 - 2,
  y1: -getMenuHeight() - 2,
  y2: -2,
  stroke: 'default'
});

var $bottomLine = new SVGElement('line', {
  x1: 23,
  x2: 48,
  y1: 22 + menu.hamburgerGap,
  y2: 22 + menu.hamburgerGap,
  stroke: 'default'
});

var $menuSVG = new SVGElement('svg', { id: 'line-wrapper' });
$menuSVG.appendChild($topLine);
$menuSVG.appendChild($mainLine);
$menuSVG.appendChild($bottomLine);
$menu.appendChild($menuSVG);

// Create & insert buttons

var $buttonWrapper = createEl('div', { id: 'button-wrapper' });
var $buttons = [];

getPages().forEach(function(page) {
  $buttons[page.slug] = createEl('a', {
    href: '/' + page.slug,
    id: 'btn-' + page.slug,
    class: 'button'
  });
  $buttons[page.slug].textContent = page.name;
  $buttonWrapper.appendChild($buttons[page.slug]);
});

$menu.appendChild($buttonWrapper);

// Create trigger and X icon

var $trigger = createEl('a', { id: 'trigger', href: '' });
var $closeMenuIcon = new SVGIcon('x');
var closeMenuIconAnimation = TweenMax.to($closeMenuIcon, 0.25, {
  paused: true,
  rotation: 360
});

$trigger.appendChild($closeMenuIcon);
$menu.appendChild($trigger);

// Create menu pin

/*var menuPinGroupStartingY = 35; // Static value for top y positioning
var $menuPinMask = new SVGElement('mask');
var $menuPinDefs = new SVGElement('defs');
var $menuPinGroup = new SVGIcon('pin', { mask: $menuPinMask.id }, 'g');
var $menuPinMaskCircle = new SVGElement('circle', {
  cx: 10,
  cy: 55,
  r: 20,
  fill: '#fff'
});
var menuPinYAnimScene;

TweenMax.set($menuPinGroup, {
  x: 23.5,
  y: menuPinGroupStartingY
});

var menuPinCircleRevealVars = {
  y: '-=40',
  ease: 'Power4.easeOut'
};

var menuPinYAnimGenerator = function() {
  return new TweenMax.fromTo(
    $menuPinGroup,
    1,
    { y: menuPinGroupStartingY },
    {
      y: $buttonWrapper.getBoundingClientRect().bottom - 40,
      ease: 'Linear.easeNone'
    }
  );
};

var menuPinYAnimSceneUpdate = function() {
  if (menuPinYAnimScene.enabled()) {
    menuPinYAnimScene.removeTween().setTween(menuPinYAnimGenerator());
    menuPinYAnimScene.update();
  }
};

$menuPinMask.appendChild($menuPinMaskCircle);
$menuPinDefs.appendChild($menuPinMask);
$menuPinGroup.appendChild($menuPinDefs);
$menuSVG.appendChild($menuPinGroup);*/

// Menu animation

var topLineToTop = TweenMax.to($topLine, 0.15, {
  y: -20,
  scaleX: 0.5,
  rotation: 180,
  transformOrigin: '50% 50%',
  ease: 'Power4.easeOut'
});

var bottomLineToTop = TweenMax.to($bottomLine, 0.15, {
  y: -30,
  scaleX: 0.5,
  rotation: 180,
  transformOrigin: '50% 50%',
  ease: 'Power4.easeOut'
});

var bottomLineToBottom = TweenMax.to($bottomLine, 0.25, {
  y: getMenuHeight() - 34,
  scaleX: 1,
  rotation: 0,
  ease: 'Power4.easeOut'
});

var triggerToClose = TweenMax.to($trigger, 0.15, {
  className: 'close-button',
  transformOrigin: '50% 50%',
  rotation: 360,
  top: -17
});

var mainLineReveal = TweenMax.to($mainLine, 0.25, {
  yPercent: 100,
  ease: 'Power4.easeOut'
});

var buttonsReveal = TweenMax.staggerTo(
  $buttonWrapper.childNodes,
  0.35,
  { scale: 1, right: 0, ease: 'Power4.easeOut' },
  0.1
);

/*var menuPinReveal = TweenMax.to(
  $menuPinMaskCircle,
  0.25,
  menuPinCircleRevealVars
);*/

var menuEverRevealed = false;

var menuAnimation = new TimelineMax({
  paused: true,
  onStart: function() {
    addClass($menu, 'opened');
  },
  onComplete: function() {
    if (!menuEverRevealed) menuEverRevealed = true;
    setSetting('menuStatus', 'open');
    log('[IX] Menu has opened');
  },
  onReverseComplete: function() {
    setSetting('menuStatus', 'closed');
    log('[IX] Menu has closed');
    removeClass($menu, 'opened');
  }
})
  .add(topLineToTop)
  .add(bottomLineToTop, '-=0.15')
  .add(triggerToClose, '-=0.15')
  .add(bottomLineToBottom)
  .add(mainLineReveal, '-=0.25')
  .add(buttonsReveal, '-=0.25');
/*.add(menuPinReveal, '-=0.5');*/

// Menu project animation

/*var setMenuPinPos = TweenMax.to($menuPinGroup, 0.1, {
  rotation: -90,
  x: 13,
  y: 34
});*/

var setButtonWrapperTop = TweenMax.to($buttonWrapper, 0.1, {
  top: 5
});

var bottomLineToTopLine = TweenMax.to($bottomLine, 0.15, {
  y: -10,
  rotation: 180,
  transformOrigin: '50% 50%',
  ease: 'Power4.easeOut'
});

var topLineRotate = TweenMax.to($topLine, 0.15, {
  rotation: 90,
  transformOrigin: '50% 50%',
  ease: 'Power4.easeOut'
});

var bottomLineRotate = TweenMax.to($bottomLine, 0.15, {
  rotation: 90,
  transformOrigin: '50% 50%',
  ease: 'Power4.easeOut'
});

var topLineToRight = TweenMax.to($topLine, 0.15, {
  x: 12.5,
  y: 0,
  ease: 'Power4.easeOut'
});

var bottomLineToRight = TweenMax.to($bottomLine, 0.15, {
  x: 0,
  y: -10,
  rotation: 0,
  ease: 'Power4.easeOut'
});

var triggerButtonReveal = TweenMax.to($trigger, 0.25, {
  className: '+=close-button',
  transformOrigin: '50% 50%',
  rotation: 360,
  y: '-=2',
  x: '-=20',
  ease: 'Power4.easeOut'
});

/*var menuPinReveal2 = TweenMax.to(
  $menuPinMaskCircle,
  0.25,
  menuPinCircleRevealVars
);*/

var menuProjectAnimation = new TimelineMax({
  paused: true,
  onStart: function() {
    //menuPinYAnimScene.enabled(false);
  },
  onReverseComplete: function() {
    //menuPinYAnimScene.enabled(true);
    //menuPinYAnimScene.update();
  }
})
  //.add(setMenuPinPos)
  .add(setButtonWrapperTop)
  .add(bottomLineToTopLine)
  .add(topLineRotate)
  .add(bottomLineRotate, '-=0.15')
  .add(topLineToRight)
  .add(bottomLineToRight, '-=0.15')
  //.add(menuPinReveal2)
  .add(triggerButtonReveal, '-=0.25');

// Responsive height

var makeMenuRespAgain = throttle(300, function() {
  menuAnimation.pause(0);
  setSetting('menuStatus', 'closed');
  setTimeout(function() {
    if (menuEverRevealed) {
      bottomLineToBottom.updateTo({ css: { y: getMenuHeight() - 34 } });
    } else {
      bottomLineToBottom.updateTo({ y: getMenuHeight() - 34 });
    }
    //menuPinYAnimSceneUpdate();
    $mainLine.setAttribute('y1', -getMenuHeight() - 2);
    mainLineReveal.updateTo({ yPercent: 100 });
  }, 0);
});

// Symlink menu events

menu.open = function() {
  menuAnimation.timeScale(1).play();
};

menu.close = function(args) {
  var scaleFactor = 2;
  if (args) {
    if (args.onStart) args.onStart;
    if (args.onComplete)
      TweenMax.delayedCall(menuAnimation.time() / scaleFactor, args.onComplete);
  }
  menuAnimation.timeScale(scaleFactor).reverse();
};

menu.toggle = function(e) {
  if (getSetting('menuStatus') == 'closed') {
    menu.open();
  } else {
    menu.close();
  }
  e.preventDefault();
};

menu.hover = function() {
  log('[IX] Menu hovered');
  if (hasClass($trigger, 'close-button')) {
    closeMenuIconAnimation.play(0);
  }
};

menu.unhover = function() {
  log('[IX] Menu unhovered');
  if (hasClass($trigger, 'close-button')) {
    closeMenuIconAnimation.reverse(0);
  }
};

menu.autoClose.start = function() {
  if (
    menu.autoClose.active &&
    getSetting('menuStatus') == 'open' &&
    menu.autoClose.timer == null
  ) {
    log('[IX] Menu autoClose has started');
    menu.autoClose.timer = setTimeout(function() {
      menu.autoClose.end();
      menu.close();
    }, menu.autoClose.duration);
  }
};

menu.autoClose.end = function() {
  if (menu.autoClose.active && menu.autoClose.timer !== null) {
    clearTimeout(menu.autoClose.timer);
    menu.autoClose.timer = null;
    log('[IX] Menu autoClose has been ended');
  }
};

menu.project = {
  open: function() {
    $trigger.removeEventListener('click', menu.toggle);
    $trigger.setAttribute('href', '/projects');
    if (getSetting('menuStatus') == 'open') {
      menu.close({
        onComplete: function() {
          menuProjectAnimation.play();
        }
      });
    } else {
      menuProjectAnimation.play();
    }
    setSetting('menuStatus', 'project');
    log('[IX] Menu is on project mode');
  },
  close: function() {
    $trigger.setAttribute('href', '');
    $trigger.addEventListener('click', menu.toggle);
    /*TweenMax.delayedCall(menuProjectAnimation.time(), function() {
      menuPinYAnimSceneUpdate();
    });*/
    menuProjectAnimation.reverse();
    setSetting('menuStatus', 'closed');
    log('[IX] Menu project mode has closed');
  }
};

// Bind events

$win.addEventListener('resize', makeMenuRespAgain);
$trigger.addEventListener('click', menu.toggle);
$trigger.addEventListener('mouseenter', menu.hover);
$trigger.addEventListener('mouseleave', menu.unhover);
$menu.addEventListener('mouseenter', menu.autoClose.end);
$menu.addEventListener('mouseleave', menu.autoClose.start);
events.subscribe('project.window.close.onStart', menu.project.close);
events.subscribe('project.window.open.onStart', menu.project.open);

// On page ready

events.subscribe('page.ready', function() {
  // Place the buttons according to the pages' heights

  for (var i = 0; i < getPages().length; i++) {
    var el = $doc.getElementById(getPages()[i].slug);
    var elTopo = el.getBoundingClientRect().top;
    var perc = 100 / (getHeight('content-wrapper') / elTopo);
    perc = perc < 0 ? 0 : perc;
    $buttons[getPages()[i].slug].setAttribute('style', 'top:' + perc + '%');
  }

  /*menuPinYAnimScene = addScrollerScene({
    duration: getHeight('content-wrapper'),
    triggerHook: 'onEnter'
  })
    .setTween(menuPinYAnimGenerator())
    .addTo(winController);*/
});

export default $menu;
