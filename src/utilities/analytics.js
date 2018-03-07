import { getSetting } from 'utilities/orm';

/**
 * Initialize the analytics tracker
 * @return Nothing. It sets the window.ga global object
 */
function init() {
  // Initialize the command queue in case analytics.js hasn't loaded yet.
  window.ga =
    window.ga ||
    function() {
      (ga.q = ga.q || []).push(arguments);
    };
  ga.l = +new Date();

  // Create the tracker
  ga('create', getSetting('analyticsPropertyId'), 'auto');

  // Updates the tracker to use `navigator.sendBeacon` if available.
  ga('set', 'transport', 'beacon');

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging
  // Nothing will be sent on dev. server
  if (location.hostname == 'localhost') {
    ga('set', 'sendHitTask', null);
  }
}

/**
 * Sends a page hit
 * @param  {object} page - 
 *                       path: The path portion of the page URL. Should begin with '/'. 
 *                       title: The title of the page / document.
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications
 */
function send(page) {
  ga('set', {
    path: page.path,
    title: page.title
  });
  ga('send', 'pageview');
}

export default { init, send };
