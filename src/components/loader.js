import { $doc, createEl, addClass, removeClass } from 'utilities/helpers';

// Create the loader element
var $loader = createEl('div', { id: 'loader' });

// Let's lock the body scroll!
addClass($doc.body, 'is-loading');

// Border-width set to zero
function removeBorders() {
  TweenMax.set($loader, { borderWidth: 0 });
}

// Border-width animation
function addBorders() {
  TweenMax.to($loader, 0.25, { borderWidth: 10 });
}

// Fades out only the bg
function fadeOut() {
  TweenMax.to($loader, 0.5, { backgroundColor: 'transparent' });
}

// Fades out and removing the is-loading state
function destroy() {
  fadeOut();
  removeClass($doc.body, 'is-loading');
}

export default {
  elements: {
    wrapper: $loader
  },
  removeBorders: removeBorders,
  addBorders: addBorders,
  destroy: destroy
};
