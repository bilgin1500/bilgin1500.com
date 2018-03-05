import { isUndefined, getDocScrollY } from 'utilities/helpers';

/**
 * Creates a new onScroll event based on GSAP's RAF ticker.
 * inspired by: https://greensock.com/forums/topic/8307-page-scroll-event-vs-ticker/?do=findComment&comment=32173
 * 
 * @param {object} callback - onDown and onUp callbacks
 */
function ScrollEvent(callback) {
  var self = this;

  // Public properties
  self.callback = callback;
  self.distance = 0;
  self.y = getDocScrollY();

  /**
   * onScroll events
   * @param  {object} callback - onDown and onUp functions
   */
  function onScroll() {
    var currScrollY = getDocScrollY();

    // Don't fire if nothing changed
    if (self.y == currScrollY) return;

    //var direction = self.y < currScrollY ? 'down' : 'up';

    if (self.y < currScrollY) {
      if (!isUndefined(self.callback.onDown)) {
        self.callback.onDown.call(self);
      }
    } else if (self.y > currScrollY) {
      if (!isUndefined(self.callback.onUp)) {
        self.callback.onUp.call(self);
      }
    }

    self.distance = currScrollY - self.y;
    self.y = currScrollY;
  }

  /*
   Public methods
   */
  self.start = function() {
    TweenLite.ticker.addEventListener('tick', onScroll);
  };

  self.stop = function() {
    TweenLite.ticker.removeEventListener('tick', onScroll);
  };
}

export default ScrollEvent;
