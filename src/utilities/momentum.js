import { getDocScrollY, isUndefined } from 'utilities/helpers';

/**
 * Adds momentum to an element. Updates on every RAF tick.
 * @param {string/element} el - HTMLElement or a ID
 * @param {object} options - Speed (0.4) and friction (0.08)
 */
var Momentum = function(el, options) {
  // Cache defaults
  var self = this;
  var speed =
    !isUndefined(options) && !isUndefined(options.speed) ? options.speed : 0.4;
  var friction =
    !isUndefined(options) && !isUndefined(options.friction)
      ? options.friction
      : 0.08;

  // Store old deltaY for further calculations
  self.deltaY = 0;

  // Active flag
  self.active = false;

  // Calculate new deltaY based on speed and friction
  var _calcDeltaY = function() {
    var newDeltaY = 0 - getDocScrollY() * speed;
    return self.deltaY - (self.deltaY - newDeltaY) * friction;
  };

  // TweenLite object
  var _motion = function(yPos) {
    return TweenLite.to(el, 0.1, {
      paused: true,
      y: yPos
    });
  };

  // Play the animation and store new deltaY
  var _play = function() {
    var newDeltaY = _calcDeltaY();
    _motion(newDeltaY).play();
    self.deltaY = newDeltaY;
  };

  /* 
    Public functions
  */

  // Initialize this momentum by adding it to the RAF cycle
  var start = function() {
    TweenMax.ticker.addEventListener('tick', _play);
    self.active = true;
  };

  // Destroy this momentum by removing it from the RAF cycle
  var stop = function() {
    TweenMax.ticker.removeEventListener('tick', _play);
    self.active = false;
  };

  // Toggle the init/destroy methods
  var toggle = function() {
    if (self.active) {
      stop();
    } else {
      start();
    }
  };

  return {
    start,
    stop,
    toggle
  };
};

export default Momentum;
