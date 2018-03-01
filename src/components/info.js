import normalizeWheel from 'normalize-wheel';
import { createEl, getHeight, isUndefined } from 'utilities/helpers';
import Project from 'components/project';
import { $doc, getHeight } from 'utilities/helpers';
import 'css/info';

/**
 * Info constructor
 * @param  {object} prjData - Data from database
 * @param  {number} index - Current section index
 * @param  {object} section - Parent section's instance
 */
function Info(prjData, index, section) {
  this.isActive = false;
  this.elasticEase = Elastic.easeOut.config(1, 0.75);
  this.content = prjData.sections[index].content;
  this.meta = prjData.meta;
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
  var $info = createEl('div', { class: 'info' });
  var $infoWrapper = createEl('div', { class: 'info-wrapper' });
  var $metaWrapper = createEl('div', { class: 'meta-wrapper' });
  var $metaContent = createEl('p');
  var $metaTitle = createEl('h4', { innerText: 'Info' });

  // Parse the meta section {prjData.meta}
  var meta = this.meta;

  var cat = meta.category;
  var tags = meta.tags;

  var date =
    meta.date.indexOf('-') > -1
      ? ' between ' + meta.date.replace('-', 'and')
      : ' in ' + meta.date;

  var agency = !isUndefined(meta.agency)
    ? ` for <a href="${meta.agency.url}" target="_blank">${meta.agency
        .name}</a>`
    : '';

  var parts = !isUndefined(meta.parts)
    ? `<br/>My parts in this project were ${meta.parts
        .join(', ')
        .replace(/,([^,]*)$/, ' and ' + '$1')}.`
    : '';

  var links = meta.links;

  var sentence = cat + date + agency + '.' + parts;
  $metaContent.insertAdjacentHTML('afterbegin', sentence);

  // Parse the info section {prjData.sections[i].type == 'info'}
  for (var i = 0; i < this.content.length; i++) {
    var $title = createEl('h4', { innerText: this.content[i].title });
    var $text = createEl('p', { innerHTML: this.content[i].text });

    $infoWrapper.appendChild($title);
    $infoWrapper.appendChild($text);
  }

  $metaWrapper.appendChild($metaTitle);
  $metaWrapper.appendChild($metaContent);
  $info.appendChild($metaWrapper);
  $info.appendChild($infoWrapper);

  this.element = $info;
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
