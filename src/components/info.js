import normalizeWheel from 'normalize-wheel';
import { createEl } from 'utilities/helpers';
import Project from 'components/project';
import { $doc, getHeight } from 'utilities/helpers';
import 'css/info';

/**
 * Info constructor
 * @param  {object} sectionData - content: Section content from the database
 *                                name: Section name from the database 
 *                                type: Section type (this Constructor)
 *                                _draggable: This sections's Draggable instance
 *                                _projectName: Parent project's data
 *                                _wrapper: Section wrapper element
 */
function Info(sectionData) {
  this.elasticEase = Elastic.easeOut.config(1, 0.75);
  this.content = sectionData.content;
  this._parentDraggable = sectionData._draggable;
  this.createDOM();
  this.addAllListeners();
  this._attachDraggable();
}

/**
 * Creates the .info div and its content and
 * appends it to the Info instance's element property
 */
Info.prototype.createDOM = function() {
  var $wrapper = createEl('div', { class: 'info' });

  for (var i = 0; i < this.content.length; i++) {
    var $title = createEl('h4');
    var $text = createEl('p');
    $title.innerText = this.content[i].title;
    $text.innerText = this.content[i].text;
    $wrapper.appendChild($title);
    $wrapper.appendChild($text);
  }

  this.element = $wrapper;
};

/**
 * Make the info texts draggable and touch enabled via GSAP
 */
Info.prototype._attachDraggable = function() {
  var _this = this;

  var dragStartY,
    dragThreshold = 75,
    dragBoundaries = 100;

  this._draggable = Draggable.create(this.element, {
    type: 'y',
    throwProps: true,
    zIndexBoost: false,
    edgeResistance: 0.75,
    dragResistance: 0,
    cursor: 'move',
    bounds: {
      minX: -dragBoundaries,
      maxX: dragBoundaries
    },
    onPress: function(e) {
      // Cache these values
      dragStartY = this.y;

      // Update the boundaries so that they cover the image
      /*var slideHeight = getHeight($slide);
      var imageHeight = getHeight($image);
      var dynamicDragBoundaryMinY = -imageHeight + slideHeight;

      this.applyBounds({
        minX: -dragBoundaries,
        maxX: dragBoundaries,
        minY: dynamicDragBoundaryMinY,
        maxY: 0
      });*/

      // Stop bubbling so that this draggable won't interfere with
      // section's draggable system
      e.stopPropagation();
      // In some cases (when the type is single direction like 'y') stopPropagation
      // won't work. In this case we'll do it manually
      _this._parentDraggable.disable();
    },
    onRelease: function() {
      // If the parent draggable is disabled manually we should enable it
      _this._parentDraggable.enable();
    }
    /*onDragEnd: function() {
      // If not dragged properly we'll use this tween
      // to reset target's position with motion
      var resetDragToStartPos = TweenMax.to(this.target, 0.5, {
        paused: true,
        y: dragStartY,
        ease: _this.elasticEase
      });

      // The axis along which movement is locked during that
      // particular drag (either "x" or "y"). For example,
      // if lockAxis is true on a Draggable of type:"x,y",
      // and the user starts dragging horizontally,
      // lockedAxis would be "y" because vertical movement
      // won't be allowed during that drag.
      if (this.lockedAxis == 'y') {
        // Check if the user is dragging good enough
        // If he is, proceed with dragEnd effects.
        if (this.endX > dragThreshold || this.endX < -dragThreshold) {
          // Left/Right: Change the gallery slide
          // Down/Up: Scroll the gallery image
          if (dragSwipeDir == 'left') {
            _this.next();
          } else if (dragSwipeDir == 'right') {
            _this.previous();
          }
        }
        resetDragToStartPos.play();
      }
    }*/
  });
};

/**
 * Scroll Info content on mouse wheel
 * @param  {object} e - event
 */
Info.prototype._mouseWheelNav = function(e) {
  //if (this.isActive && !this.isNavLocked) {
  var normalized = normalizeWheel(e);

  // Up and down scroll
  // It's synchronized with the draggable
  ThrowPropsPlugin.to(this.element, {
    throwProps: { y: Math.round(normalized.pixelY) * -25 },
    force3D: true
    /*onUpdate: function() {
        imgInstance.draggable[0].update({
          applyBounds: true
        });
      }*/
  });
  //}
};

/**
 * Adds all event listeners of this Info instance
 */
Info.prototype.addAllListeners = function() {
  // !! A new function reference is created after .bind() is called!
  this._mouseWheelNavBound = this._mouseWheelNav.bind(this);
  $doc.addEventListener('mousewheel', this._mouseWheelNavBound);
};

/**
 * Removes all event listeners of this Info instance
 */
Info.prototype.removeAllListeners = function() {
  $doc.removeEventListener('mousewheel', this._mouseWheelNavBound);
};

export default Info;
