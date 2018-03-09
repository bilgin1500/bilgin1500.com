import {
  $doc,
  createEl,
  getWidth,
  addClass,
  removeClass,
  clearInnerHTML,
  isUndefined
} from 'utilities/helpers';
import router from 'utilities/router';
import 'css/logo';

// Create elements
var $logo = createEl('div', { id: 'logo' });
var $cursor = createEl('span', { class: ['text', 'cursor'], innerText: '|' });
var $text = createEl('span', { class: 'text' });

// Append logo's children
$logo.appendChild($text);
$logo.appendChild($cursor);

/**
 * Blinking cursor repetitive animation
 */
function blink() {
  TweenMax.fromTo(
    $cursor,
    0.3,
    { opacity: 0 },
    { opacity: 1, repeat: -1, ease: SteppedEase.config(1) }
  );
}

// Some starting values
var currentString = 0;
var revealInterval = 0.075;

/**
 * Get position of the element (getBoundingClientRect) relative to its parent
 * @param  {element} el - Target element
 * @param  {element} parent - Parent element
 * @return {object} {top,left}
 */
function getPosRelToParent(el, parent) {
  var parentBox = parent.getBoundingClientRect();
  var elBox = el.getBoundingClientRect();
  return {
    top: elBox.top - parentBox.top,
    left: elBox.left - parentBox.left
  };
}

/**
 * Types the logo texts and at the last string it stops
 * @param  {array} strings - An array of strings
 * @param  {function} onEnd - It'll fire after all animation is completed
 */
function type(strings, onEnd) {
  // This animation's settings
  var currString = strings[currentString];
  var isLastOne = currentString == strings.length - 1;

  // Change the text
  $text.innerText = currString;

  // Don't interfere with the timeline, there might be delays etc.
  TweenMax.set($logo, { autoAlpha: 1 });

  // The starting pos of the cursor
  var relPosCursor = getPosRelToParent($text, $logo);
  TweenMax.set($cursor, {
    left: relPosCursor.left,
    top: relPosCursor.top,
    onComplete: blink
  });

  // Logo characters
  var $chars = new SplitText($text, {
    type: 'chars',
    charsClass: 'char',
    position: 'absolute'
  }).chars;

  function onComplete() {
    // If it's not the last string clear the old string's characters
    if (!isLastOne) {
      clearInnerHTML($text);
      $text.removeAttribute('style');
    } else {
      // If it's the last string fire the callback
      if (!isUndefined(onEnd)) onEnd();
      // And add the logo link
      TweenMax.set($logo, { cursor: 'pointer' });
      $logo.addEventListener('click', function() {
        router.engine('/');
      });
    }

    // Iterate the strings and type new one
    if (currentString < strings.length - 1) {
      currentString++;
      type(strings, onEnd);
    }
  }

  // Create the timeline. It'll repeat the strings except the last one
  var logoAnimationTl = new TimelineMax({
    paused: true,
    delay: 0.5,
    repeat: isLastOne ? false : true,
    yoyo: true,
    onComplete: onComplete
  });

  // Add character animations to the timeline
  $chars.forEach(function($char, i) {
    var charWidth = getWidth($char);
    var textRelPos = getPosRelToParent($text, $logo);
    var charRelPos = getPosRelToParent($char, $text);

    // leftGap: Tha left gap between text wrapper and its parent logo wrapper (on mobile the logo is centered and this makes a huge gap on left and right sides)
    // charRelPos.left: The left position of any character relative to its parent, in this case text wrapper span.
    // charWidth: Any character's width
    // -10: The 10px of the page border
    var cursorLeft = textRelPos.left + charRelPos.left + charWidth - 10;

    // Make the cursor follow the characters
    logoAnimationTl.set(
      $cursor,
      { left: cursorLeft, top: charRelPos.top },
      (i + 1) * revealInterval
    );

    // Make the characters reveal one by one
    logoAnimationTl.set($char, { autoAlpha: 1 }, (i + 1) * revealInterval);
  });

  // Finish the timeline by clearing the line or fading out the cursor
  if (!isLastOne) {
  } else {
    logoAnimationTl.to($cursor, 0.01, { opacity: 0, delay: 1 });
  }

  logoAnimationTl.play();
}

export default {
  elements: {
    wrapper: $logo
  },
  type: type
};
