import { createEl, slugify, log } from 'utilities/helpers';
import { getSetting } from 'utilities/orm';
import Gallery from 'components/gallery';
import Video from 'components/video';
import Info from 'components/info';

/**
 * Single section constructor. It is use in the sections constructor.
 * Public properties and methods are:
 *   wrapper: A cache property to store the section wrapper
 *   draggable: GSAP Draggable instance of the section
 *   contentInstance: A property to store the Gallery,Info or Video content
 *   createContentDom: A method to create the sections
 *   createNavDom: A method to create the navigation items
 * @param {object} sectionData - Section data from database
 * @param {string} projectSlug - Project's slug
 */
function Section(sectionData, projectSlug) {
  // Create wrappers
  var $sWrapper = createEl('div', { class: 'project-section' });
  var $sInnerWrapper = createEl('div', { class: 'section-inner-wrapper' });

  // Expose the wrapper
  this.wrapper = $sWrapper;

  // Create the draggable instance
  this.draggable = attachDraggable($sWrapper);

  // Create all the section instances according to their types and
  // cache them on contentInstance property so in the future we can use
  // the instances' APIs
  switch (sectionData.type) {
    case 'video':
      this.contentInstance = new Video(sectionData, projectSlug, this);
      break;
    case 'gallery':
      this.contentInstance = new Gallery(sectionData, projectSlug, this);
      break;
    case 'info':
      this.contentInstance = new Info(sectionData, projectSlug, this);
      break;
  }

  // Create content element for this section and make it public
  this.createContentDom = function() {
    $sInnerWrapper.appendChild(this.contentInstance.element);
    $sWrapper.appendChild($sInnerWrapper);
    return $sWrapper;
  };

  // Create navigation element for this section and make it public
  this.createNavDom = function() {
    var $navItem = createEl('a', {
      href: '/projects/' + projectSlug + '/' + slugify(sectionData.name)
    });
    var $navItemSpan = createEl('span');
    var $navItemText = createEl('span');
    $navItemText.innerText = sectionData.name;
    $navItemSpan.appendChild($navItemText);
    $navItem.appendChild($navItemSpan);
    return $navItem;
  };
}

/**
 * Make a single section draggable (and touch enabled) via GSAP
 * @param {element} section - The section element the Draggable to be attached
 * @return {object} Draggable instance
 */
function attachDraggable(section) {
  var dragSwipeDir,
    dragStartY,
    dragThreshold = 100,
    dragBoundaries = 150;

  return Draggable.create(section, {
    type: 'y',
    zIndexBoost: false,
    edgeResistance: 0.75,
    dragResistance: 0,
    cursor: 'ns-resize',
    bounds: {
      minY: -dragBoundaries,
      maxY: dragBoundaries
    },
    onPress: function() {
      dragStartY = this.y;

      // Stop bubbling so that this draggable won't interfere with
      // app's draggable system
      event.stopPropagation();
    },
    onDrag: function() {
      dragSwipeDir = this.getDirection();
    },
    onDragEnd: function() {
      var thisDraggable = this;

      // If not dragged properly we'll use this tween
      // to reset target's position with motion
      var resetDragToStartPos = TweenMax.to(thisDraggable.target, 0.5, {
        paused: true,
        y: dragStartY,
        ease: Elastic.easeOut.config(1, 0.75)
      });

      // Check if the user is dragging good enough
      // If he is, proceed with dragEnd effects.
      if (
        thisDraggable.endY > dragThreshold ||
        thisDraggable.endY < -dragThreshold
      ) {
        // Down/Up: Change the section
        // Left/Right: Nothing
        if (dragSwipeDir == 'down') {
          getSetting('sectionsInstance').previous();
        } else if (dragSwipeDir == 'up') {
          getSetting('sectionsInstance').next();
        } else {
          resetDragToStartPos.play();
        }

        // Log the interaction
        log('[IX] Section swiped to the ' + dragSwipeDir);
      } else {
        resetDragToStartPos.play();
      }
    }
  })[0];
}

export default Section;
