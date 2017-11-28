import { TweenMax, TimelineMax } from 'gsap';
import throttle from 'throttle-debounce/throttle';
import debounce from 'throttle-debounce/debounce';
import {
  createEl,
  createSVG,
  createLine,
  getWinHeight
} from 'utilities/helpers';
import 'css/menu';
import pageData from 'content/index';

// Create menu wrapper

var $wrapper = createEl('div', { id: 'menu' });

// Menu options

var menu = {
  status: 'closed',
  width: 50,
  hamburgerWidth: 25,
  hamburgerGap: 10,
  stroke: {
    color: '#000',
    width: 4,
    linecap: 'round'
  }
};

var wrapperOffset = 60;

var getMenuHeight = function() {
  return getWinHeight() - wrapperOffset;
};

// Create menu svg items

var $topLine = createLine('topLine', menu.stroke, 23, 48, 22, 22);

var $mainLine = createLine(
  'mainLine',
  menu.stroke,
  menu.width - menu.hamburgerWidth / 2 - 2,
  menu.width - menu.hamburgerWidth / 2 - 2,
  -getMenuHeight() - 2,
  -2
);

var $bottomLine = createLine(
  'bottomLine',
  menu.stroke,
  23,
  48,
  22 + menu.hamburgerGap,
  22 + menu.hamburgerGap
);

var $menuSVG = createSVG('menu-svg');
$menuSVG.appendChild($topLine);
$menuSVG.appendChild($mainLine);
$menuSVG.appendChild($bottomLine);

// Create trigger

var $trigger = createEl('a', { id: 'trigger' });

// Create & insert buttons

var $buttonWrapper = createEl('div', { id: 'button-wrapper' });

pageData.sections.forEach(function(section) {
  var $button = createEl('a', {
    href: '#',
    id: 'btn-' + section.slug,
    class: 'button'
  });
  $button.textContent = section.name;
  $buttonWrapper.appendChild($button);
});

// Menu animation

var topLineHover = TweenMax.to($topLine, 0.15, {
  y: -menu.hamburgerGap / 2
});

var bottomLineHover = TweenMax.to($bottomLine, 0.15, {
  y: menu.hamburgerGap / 2
});

var topLineToTop = TweenMax.to($topLine, 0.15, {
  y: -20,
  rotation: 180,
  transformOrigin: '50% 50%',
  ease: 'Power4.easeOut'
});

var bottomLineToTop = TweenMax.to($bottomLine, 0.15, {
  y: -30,
  rotation: 180,
  transformOrigin: '50% 50%',
  ease: 'Power4.easeOut'
});

var bottomLineToBottom = TweenMax.to($bottomLine, 0.25, {
  y: getMenuHeight() - 34,
  rotation: 0,
  ease: 'Power4.easeOut'
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

var triggerMove = TweenMax.to($trigger, 0.15, { top: -17 });

var menuEverRevealed = false;

var menuAnimation = new TimelineMax({
  paused: true,
  smoothChildTiming: true,
  onComplete: function() {
    if (!menuEverRevealed) menuEverRevealed = true;
    menu.status = 'open';
  },
  onReverseComplete: function() {
    menu.status = 'closed';
  }
})
  .add(topLineHover)
  .add(bottomLineHover, '-=0.15')
  .add(triggerMove)
  .add(topLineToTop)
  .add(bottomLineToTop, '-=0.15')
  .add(bottomLineToBottom)
  .add(mainLineReveal, '-=0.25')
  .add(buttonsReveal, '-=0.25');

// Responsive height

var makeMenuRespAgain = throttle(300, function() {
  menuAnimation.pause(0);
  setTimeout(function() {
    if (menuEverRevealed) {
      bottomLineToBottom.updateTo({ css: { y: getMenuHeight() - 34 } });
    } else {
      bottomLineToBottom.updateTo({ y: getMenuHeight() - 34 });
    }
    $mainLine.setAttribute('y1', -getMenuHeight() - 2);
    mainLineReveal.updateTo({ yPercent: 100 });
  }, menuAnimation.time() * 1000);
});

window.addEventListener('resize', makeMenuRespAgain);

// Symlink menu events

menu.open = function() {
  menuAnimation.timeScale(1).play();
};
menu.close = function() {
  menuAnimation.timeScale(2).reverse();
};
menu.hover = function() {
  menuAnimation.tweenFromTo(0, 0.15);
};
menu.unhover = function() {
  menuAnimation.tweenFromTo(0.15, 0);
};

// Add trigger events

$trigger.addEventListener('click', function() {
  if (menu.status == 'closed') {
    menu.open();
  } else {
    menu.close();
  }
});

$trigger.addEventListener('mouseenter', function() {
  if (menu.status == 'closed' && !menuAnimation.isActive()) {
    menu.hover();
  }
});

$trigger.addEventListener('mouseleave', function() {
  if (menu.status == 'closed' && !menuAnimation.isActive()) {
    menu.unhover();
  }
});

// Menu auto close

$wrapper.addEventListener('mouseenter', function() {
  clearTimeout(menu.autoCloseTimer);
});

$wrapper.addEventListener('mouseleave', function() {
  if (menu.status == 'open') {
    menu.autoCloseTimer = setTimeout(function() {
      menu.close();
      clearTimeout(menu.autoCloseTimer);
    }, 750);
  }
});

// Insert DOM elements

$wrapper.appendChild($trigger);
$wrapper.appendChild($menuSVG);
$wrapper.appendChild($buttonWrapper);

export default $wrapper;
