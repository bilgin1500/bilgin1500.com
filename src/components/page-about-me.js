import {
  $win,
  $doc,
  createEl,
  createPageContainer,
  slugify,
  getWidth,
  getHeight,
  removeClass,
  addClass,
  buildMediaUrl,
  setBodyScroll
} from 'utilities/helpers';
import throttle from 'throttle-debounce/throttle';
import objectAssign from 'object-assign';
import Momentum from 'utilities/momentum';
import Image from 'utilities/image';
import events from 'utilities/events';
import { getAbouts, getSetting, setSetting } from 'utilities/orm';
import 'css/about';

/**
 * Creates this page's elements
 * @param  {object} page - Object containing page data
 *                        name: Name of the page
 *                        slug: Slug for this page, created by the app.js
 * @return {element} The page wrapper
 */
function createDom(page) {
  var page = createPageContainer(page);
  var $page = page.$page;
  var $pageContent = page.$content;

  // Photo
  var photoInstance = new Image({
    src: buildMediaUrl({ name: 'family' }),
    alt: 'Photo'
  });
  var $photo = photoInstance.elements.wrapper;
  var imageCache = getSetting('imageCacheForHome');
  imageCache.push(photoInstance);
  setSetting('imageCacheForHome', imageCache);
  //new Momentum($photo, { speed: 0.05 }).start();
  $pageContent.appendChild($photo);

  // Cache all the skill lists
  var abouts = getAbouts();

  // The section of skill lists with the background gradient
  var $sectionContainer = createEl('div', { class: 'abouts' });

  // Page overlay
  var $overlay = createEl('div', { class: 'overlay' });

  // Loop for the sections (jsons)
  for (var i = 0; i < abouts.length; i++) {
    var $section = createEl('div', {
      id: slugify(abouts[i].title),
      class: 'about-container'
    });

    // Section titles like 'Design Approach' or 'Coding Skills'
    var $sectionTitle = createEl('h3', {
      innerText: abouts[i].title,
      class: 'about-title'
    });

    var $sectionContent = createEl('div', { class: 'about-content' });
    $section.appendChild($sectionTitle);

    // Loop for the lists in the sections
    abouts[i].list.forEach(function(listItem) {
      var $listContainer = createEl('div', { class: 'list' });

      // Sub title like 'JavaScript' or 'Balanced'
      var $listTitle = createEl('h4', {
        innerText: listItem.name,
        class: 'list-title'
      });
      var $listTitle2 = $listTitle.cloneNode(true);

      // Invisible contents
      var $listContent = createEl('div', { class: 'list-content' });
      var $listText = createEl('div', {
        class: 'list-text',
        innerHTML: listItem.content
      });
      $listText.insertBefore($listTitle2, $listText.firstChild);
      $listContent.appendChild($listText);

      // Bottom gradient
      var $bottomGradient = createEl('div', { class: 'bottom-gradient' });
      $listContent.appendChild($bottomGradient);

      // To save the createOpeningMotion()
      var tl = null;

      /**
       * Dynamic measurements 
       * @return {object} All the needed measurements
       */
      function calc() {
        var windowW = getWidth('window');
        var windowH = getHeight('window');
        var contentW =
          windowW < getSetting('breakpoints').tablet
            ? windowW / 1.2
            : windowW / 2;
        var contentH = windowH / 2;
        var startingW = getWidth($listTitle);
        var startingH = getHeight($listTitle);
        var containerBox = $listContainer.getBoundingClientRect();
        var centerX = windowW / 2 - contentW / 2 - containerBox.left;
        var centerY = windowH / 2 - contentH / 2 - containerBox.top;

        return {
          windowW: windowW,
          windowH: windowH,
          contentW: contentW,
          contentH: contentH,
          startingW: startingW,
          startingH: startingH,
          centerX: centerX,
          centerY: centerY
        };
      }

      /**
       * The box revealing animation is responsive to window resize
       * so we have to calculate new properties for both starting animation
       * and onResize event's animation 
       * @return {[type]} [description]
       */
      function createBoxRevealCSSProperties() {
        return {
          scaleX: 1,
          x: calc().centerX,
          y: calc().centerY,
          width: calc().contentW,
          height: calc().contentH,
          backgroundColor: '#fff',
          zIndex: 120
        };
      }

      /**
       * These functioms create the tweens with dynamic variables
       * like window width and height
       */
      function createBoxReveal() {
        return TweenMax.to(
          $listContent,
          0.25,
          objectAssign({}, createBoxRevealCSSProperties(), {
            ease: Circ.easeOut
          })
        );
      }

      /**
       * Creates the timeline for the revealing animation
       * @return {object} TimelineMax object
       */
      function createOpeningMotion() {
        var tl = new TimelineMax({ paused: true });

        var t1 = TweenMax.to($listContent, 0.25, {
          width: '100%',
          backgroundColor: getSetting('spotColor')
        });
        var t2 = TweenMax.to($listContent, 0.25, {
          borderWidth: 10,
          borderColor: getSetting('spotColor'),
          backgroundColor: '#fff',
          boxShadow: '1px 1px 25px 1px rgba(0,0,0,0.25)'
        });
        var t3 = TweenMax.set($listText, {
          display: 'block',
          autoAlpha: 0,
          immediateRender: false
        });
        var t4 = TweenMax.to($listText, 0.25, { autoAlpha: 1 });
        var t5 = TweenMax.to($bottomGradient, 0.25, { height: 50 });
        var t6 = TweenMax.set($overlay, {
          width: '100%',
          height: '100%',
          autoAlpha: 0,
          immediateRender: false
        });
        var t7 = TweenMax.to($overlay, 0.25, { autoAlpha: 0.5 });

        tl
          .add(t1)
          .add('boxReveal')
          .add(t2, 'boxReveal+=0.25')
          .add(t3)
          .add(t4)
          .add(t5, '-=0.25')
          .add(t6, '-=0.5')
          .add(t7, '-=0.45');

        return tl;
      }

      // Save the anim so that we can alter it later
      var boxRevealAnim;

      // On window resize update the box reveal
      function onResize() {
        if (tl.isActive()) {
          boxRevealAnim.updateTo({
            css: createBoxRevealCSSProperties()
          });
        } else if (tl.progress() == 1) {
          createBoxReveal();
        }
      }
      var thOnResize = throttle(300, onResize);

      // Play the content revealing animation
      function tlPlay() {
        tl = tl == null ? createOpeningMotion() : tl;
        // This specific tween should be dynamic
        boxRevealAnim = createBoxReveal();
        if (!tl.isActive()) {
          tl.add(boxRevealAnim, 'boxReveal').play();
          setBodyScroll(true);
          $overlay.addEventListener('click', tlReverse);
          $win.addEventListener('resize', thOnResize);
        }
      }

      // Reverse the content revealing animation
      function tlReverse() {
        tl.reverse();
        setBodyScroll(false);
        $overlay.removeEventListener('click', tlReverse);
        $win.removeEventListener('resize', thOnResize);
      }

      // On container click let's open the boxes
      $listTitle.addEventListener('click', tlPlay);

      $listContainer.appendChild($listTitle);
      $listContainer.appendChild($listContent);
      $sectionContent.appendChild($listContainer);
      $section.appendChild($sectionContent);
    });

    $sectionContainer.appendChild($section);
  }

  $pageContent.appendChild($sectionContainer);
  $pageContent.appendChild($overlay);

  return $page;
}

export default createDom;
