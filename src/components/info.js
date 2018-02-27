import normalizeWheel from 'normalize-wheel';
import { createEl, getHeight, isUndefined } from 'utilities/helpers';
import Project from 'components/project';
import { $doc, getHeight } from 'utilities/helpers';
import 'css/info';

/**
 * Info constructor
 * @param  {object} sectionData from database
 * @param  {string} projectSlug
 * @param  {object} section - Parent section
 */
function Info(sectionData, projectSlug, section) {
  this.isActive = false;
  this.elasticEase = Elastic.easeOut.config(1, 0.75);
  this.content = sectionData.content;
  this._parentDraggable = section.draggable;
  this._parentSectionWrapper = section.wrapper;
  this._createDOM();
  this._addEvents();
  this._attachDraggable();
}

/**
 * Creates the .info div and its content and
 * appends it to the Info instance's element property
 */
Info.prototype._createDOM = function() {
  var $wrapper = createEl('div', { class: 'info' });

  for (var i = 0; i < this.content.length; i++) {
    var $title = createEl('h4');
    var $text = createEl('p');
    $title.innerText = this.content[i].title;
    $text.innerHTML = this.content[i].text;
    $wrapper.appendChild($title);
    $wrapper.appendChild($text);
  }

  this.element = $wrapper;
};

/**
 * Make the info texts draggable and touch enabled via GSAP
 */
Info.prototype._attachDraggable = function() {
  var self = this;

  self._draggable = Draggable.create(self.element, {
    type: 'y',
    throwProps: true,
    zIndexBoost: false,
    edgeResistance: 0.75,
    dragResistance: 0,
    cursor: 'ns-resize',
    onPress: function(e) {
      // Update the boundaries so that they cover the image
      var slideHeight = getHeight(
        self._parentSectionWrapper.querySelector('.section-content-wrapper')
      );
      var infoHeight = getHeight(self.element);
      var dynamicDragBoundaryMinY = -infoHeight + slideHeight;

      this.applyBounds({
        minY: dynamicDragBoundaryMinY,
        maxY: 0
      });

      // Stop bubbling so that this draggable won't interfere with
      // section's draggable system
      e.stopPropagation();
      // In some cases (when the type is single direction like 'y') stopPropagation
      // won't work. In this case we'll do it manually
      self._parentDraggable.disable();
    },
    onRelease: function() {
      // If the parent draggable is disabled manually we should enable it
      self._parentDraggable.enable();
    }
  });
};

/**
 * Scroll Info content on mouse wheel
 * @param  {object} e - event
 */
Info.prototype._mouseWheelNav = function(e) {
  var self = this;

  if (self.isActive) {
    var normalized = normalizeWheel(e);

    // If the draggable isn't initiated yet
    // ThrowPropsPlugin and onUpdate methods don't work
    if (isUndefined(self._initiatedDragging) || !self._initiatedDragging) {
      self._draggable[0].startDrag(e);
      self._draggable[0].endDrag(e);
      self._initiatedDragging = true;
    }

    // Up and down scroll
    // It's synchronized with the draggable
    ThrowPropsPlugin.to(self.element, {
      throwProps: { y: Math.round(normalized.pixelY) * -25 },
      force3D: true,
      onUpdate: function() {
        self._draggable[0].update({
          applyBounds: true
        });
      }
    });
  }
};

/**
 * Reset position
 */
Info.prototype.resetPosition = function() {
  TweenMax.set(this.element, { y: 0 });
};

/**
 * Adds all event listeners of this Info instance
 */
Info.prototype._addEvents = function() {
  // !! A new function reference is created after .bind() is called!
  this._mouseWheelNavBound = this._mouseWheelNav.bind(this);
  $doc.addEventListener('mousewheel', this._mouseWheelNavBound);
};

/**
 * Removes all event listeners of this Info instance
 */
Info.prototype.removeEvents = function() {
  $doc.removeEventListener('mousewheel', this._mouseWheelNavBound);
};

export default Info;
