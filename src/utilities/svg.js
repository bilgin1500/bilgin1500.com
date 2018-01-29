import objectAssign from 'object-assign';
import icons from 'content/icons';
import { isUndefined, isNull } from 'utilities/helpers';
import { $doc, createId } from 'utilities/helpers';

/**
 * Creates SVG elements
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element
 * 
 * @param {string} type - SVG element type
 * @param {object} attributes - All the available attributes 
 * at https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 *
 * @return {SVGElement}
 */
function SVGElement(type, attributes) {
  // First create the element
  this.element = $doc.createElementNS('http://www.w3.org/2000/svg', type);

  // Default attributes value
  attributes = !isUndefined(attributes) ? attributes : {};

  // First set the ID. This is a must. If non is given we'll create a unique ID for this element
  attributes.id = !isUndefined(attributes.id) ? attributes.id : createId();

  // If this is a SVG element there are some attributes we need to set
  if (type == 'svg') {
    // Version
    attributes.version = !isUndefined(attributes.version)
      ? attributes.version
      : '1.1';

    // Viewbox
    if (
      !isUndefined(attributes.width) &&
      !isUndefined(attributes.height) &&
      isUndefined(attributes.viewbox)
    )
      attributes.viewbox = '0 0 ' + attributes.width + ' ' + attributes.height;
  }

  // Mask attribute is a reference to other element
  if (!isUndefined(attributes.mask)) {
    attributes.mask = 'url(#' + attributes.mask + ')';
  }

  // Now set all the attributes
  this.setAttributes(attributes);

  return this.element;
}

/**
 * Set multiple attributes at once
 * @param {object} attributes - attribute names and values
 */
SVGElement.prototype.setAttributes = function(attributes) {
  for (var attr in attributes) {
    if (attributes.hasOwnProperty(attr)) {
      var val = attributes[attr];

      // Proceed only if the value is defined
      if (typeof val !== 'undefined' && val != null) {
        // There are some exceptions: Some attributes like fill and stroke have default values
        switch (attr) {
          case 'fill':
            if (typeof val !== 'string') return;
            if (val == 'default') {
              this.element.setAttribute('fill', icons.settings.fill);
            } else {
              this.element.setAttribute('fill', val);
            }
            break;

          // Another exception is that stroke attributes can be given as
          // stroke objects like stroke: {stroke-width:'',stroke-linecap:''}
          case 'stroke':
            if (typeof val == 'object') {
              val = objectAssign({}, icons.settings.stroke, val);
            } else if (typeof val == 'string' && val == 'default') {
              val = icons.settings.stroke;
            }

            for (var strokeAttr in val) {
              if (val.hasOwnProperty(strokeAttr)) {
                this.element.setAttribute(strokeAttr, val[strokeAttr]);
              }
            }

            break;

          default:
            this.element.setAttribute(attr, val);
        }
      }
    }
  }
};

/**
 * Creates a svg icon from given path and circle data
 * 
 * @param  {string} iconName - Icon name from the iconList
 * @param  {object} containerAttributes - SVG attributes for container element: id,width,height
 * @param  {string} container - Container for the icon: svg, g, defs or mask
 * @param  {object} childAttributes - Attributes for all child elements: stroke,fill
 * @param  {array} iconList - The list containing the icons (defaults to icons.list from icons.js)
 * @return {element} - Icon's shapes wrapped by the container element (<g>,<svg>,etc)
 */
function SVGIcon(
  iconName,
  containerAttributes,
  container,
  childAttributes,
  iconList
) {
  iconList = isUndefined(iconList) || isNull(iconList) ? icons.list : iconList;

  var iconData = iconList[iconName];

  container = isUndefined(container) || isNull(container) ? 'svg' : container;
  var $iconContainer = new SVGElement(
    container,
    objectAssign(
      { width: iconData.width, height: iconData.height },
      containerAttributes
    )
  );

  if (!isUndefined(iconData.paths)) {
    for (var i = 0; i < iconData.paths.length; i++) {
      var $path = new SVGElement(
        'path',
        objectAssign(iconData.paths[i], childAttributes)
      );
      $iconContainer.appendChild($path);
    }
  }

  if (!isUndefined(iconData.circles)) {
    for (var i = 0; i < iconData.circles.length; i++) {
      var $circle = new SVGElement(
        'circle',
        objectAssign(iconData.circles[i], childAttributes)
      );
      $iconContainer.appendChild($circle);
    }
  }

  return $iconContainer;
}

export { SVGElement, SVGIcon };
