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
 * Types the logo texts and at the last string it stops
 * @param  {array} strings - An array of strings
 * @param  {function} onEnd - It'll fire after all animation is completed
 */
function type(strings, onEnd) {
  blink();

  // This animation's settings
  var currString = strings[currentString];
  var isLastOne = currentString == strings.length - 1;

  // Change the text
  $text.innerText = currString;

  // Don't interfere with the timeline, there might be delays etc.
  TweenMax.set($logo, { autoAlpha: 1 });

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
      $logo.style.cursor = 'pointer';
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
    var parentBox = $logo.getBoundingClientRect();
    var charBox = $char.getBoundingClientRect();
    var charWidth = getWidth($char);
    var relativePos = {
      top: charBox.top - parentBox.top,
      left: charBox.left - parentBox.left
    };

    // Make the cursor follow the characters
    logoAnimationTl.set(
      $cursor,
      { left: relativePos.left + charWidth, top: relativePos.top },
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
