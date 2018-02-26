import { createEl, slugify, log } from 'utilities/helpers';
import { getSetting, getAdjSectionIndexes, getSection } from 'utilities/orm';
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
 * @param {object} prjData - Project data from database
 * @param {number} index - Section index from the generator loop
 * @param {element} $guide - Guide text wrapper to show while dragging
 */
function Section(prjData, index, $guide) {
  // Global variables for this document
  var sectionData = prjData.sections[index];
  var adjIndexes = getAdjSectionIndexes(prjData.name, index);
  var prevSection = getSection(adjIndexes.previous, prjData.name);
  var nextSection = getSection(adjIndexes.next, prjData.name);

  // Create wrappers
  var $sWrapper = createEl('div', {
    class: 'project-section',
    style: 'background-color:' + prjData.theme.colors.light
  });
  var $sContent = createEl('div', { class: 'section-content-wrapper' });

  // Expose the wrapper
  this.wrapper = $sWrapper;

  // Create the draggable instance
  this.draggable = attachDraggable(
    prjData,
    $sWrapper,
    $guide,
    prevSection,
    nextSection
  );

  // Create all the section instances according to their types and
  // cache them on contentInstance property so in the future we can use
  // the instances' APIs
  switch (sectionData.type) {
    case 'video':
      this.contentInstance = new Video(sectionData, prjData.slug, this);
      break;
    case 'gallery':
      this.contentInstance = new Gallery(sectionData, prjData.slug, this);
      break;
    case 'info':
      this.contentInstance = new Info(sectionData, prjData.slug, this);
      break;
  }

  // Create content element for this section and make it public
  this.createContentDom = function() {
    $sWrapper.appendChild($sContent);
    $sContent.appendChild(this.contentInstance.element);
    return $sWrapper;
  };

  // Create navigation element for this section and make it public
  this.createNavDom = function() {
    var $navItem = createEl('a', {
      href: '/projects/' + prjData.slug + '/' + slugify(sectionData.name)
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
 * @param {object} prjData - Project data from database
 * @param {element} $section - The section element the Draggable to be attached
 * @param {element} $guide - Guide text wrapper to show while dragging
 * @param {object} prevSection - Data object of the previous section
 * @param {object} nextSection - Data object of the next section
 * @return {object} Draggable instance
 */
function attachDraggable(prjData, $section, $guide, prevSection, nextSection) {
  var dragSwipeDir,
    dragStartY,
    dragThreshold = 100,
    dragBoundaries = 150,
    $guideText = $guide.querySelector('p');

  // Set theme options to the guide container
  TweenMax.set($guideText, {
    backgroundColor: prjData.theme.colors.light,
    color: prjData.theme.colors.spot1
  });

  return Draggable.create($section, {
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

      // Make the guide visible
      TweenMax.set($guide, { autoAlpha: 1 });

      // Stop bubbling so that this draggable won't interfere with
      // app's draggable system
      event.stopPropagation();
    },
    onDrag: function() {
      dragSwipeDir = this.getDirection();

      // Update the guide according to the direction
      if (dragSwipeDir == 'down') {
        $guide.querySelector('p').innerText = prevSection.name;
        TweenMax.set($guide, { top: 0, bottom: 'auto' });
      } else if (dragSwipeDir == 'up') {
        $guide.querySelector('p').innerText = nextSection.name;
        TweenMax.set($guide, { top: 'auto', bottom: 0 });
      }

      // Calculate the distance
      var lastY = this.y;
      var distance = lastY - dragStartY;
      var margin = dragSwipeDir == 'down' ? -25 : 25;
      // Follow the drag
      TweenMax.set($guide, { y: distance - distance / 2 + margin });

      // Lock the navigation so that we cannot use keyboard while dragging
      getSetting('sectionsInstance').isNavLocked = true;
    },
    onDragEnd: function() {
      var thisDraggable = this;

      // Reset the guide
      TweenMax.to($guide, 0.5, { y: 0 });
      // Unlock the navigation
      getSetting('sectionsInstance').isNavLocked = false;

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
