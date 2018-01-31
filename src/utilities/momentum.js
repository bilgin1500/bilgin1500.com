import { getDocScrollY } from 'utilities/helpers';

/**
 * Adds momentum to an element. Updates on every RAF tick.
 * @param {string/element} el - HTMLElement or a ID
 * @param {object} options - Speed (0.4) and friction (0.08)
 */
var Momentum = function(el, options) {
  // Cache defaults
  var _this = this;
  var speed = options && options.speed ? options.speed : 0.4;
  var friction = options && options.friction ? options.friction : 0.08;

  // Store old deltaY for further calculations
  _this.deltaY = 0;

  // Active flag
  _this.active = false;

  // Calculate new deltaY based on speed and friction
  var _calcDeltaY = function() {
    var newDeltaY = 0 - getDocScrollY() * speed;
    return _this.deltaY - (_this.deltaY - newDeltaY) * friction;
  };

  // TweenLite object
  var _motion = function(yPos) {
    return TweenLite.to(el, 0.1, { paused: true, y: yPos });
  };

  // Play the animation and store new deltaY
  var _play = function() {
    var newDeltaY = _calcDeltaY();
    _motion(newDeltaY).play();
    _this.deltaY = newDeltaY;
  };

  /* 
    Public functions
  */

  // Initialize this momentum by adding it to the RAF cycle
  var init = function() {
    TweenMax.ticker.addEventListener('tick', _play);
    _this.active = true;
  };

  // Destroy this momentum by removing it from the RAF cycle
  var destroy = function() {
    TweenMax.ticker.removeEventListener('tick', _play);
    _this.active = false;
  };

  // Toggle the init/destroy methods
  var toggle = function() {
    if (_this.active) {
      destroy();
    } else {
      init();
    }
  };

  return {
    init,
    destroy,
    toggle
  };
};

export default Momentum;
