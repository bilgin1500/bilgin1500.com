import objectAssign from 'object-assign';
import icons from 'content/icons';
import { createId } from 'utilities/helpers';

var svgNs = 'http://www.w3.org/2000/svg';
var $doc = document;

// SET ATTRIBUTES

var setId = function($el, id) {
  id = id ? id : createId();
  $el.setAttribute('id', id);
};

var setStroke = function($el, stroke) {
  switch (typeof stroke) {
    case 'undefined':
      return;
    case 'object':
      stroke = objectAssign({}, icons.settings.stroke, stroke);
      break;
    case 'string':
      if (stroke == 'default') stroke = icons.settings.stroke;
      break;
  }
  if (stroke.color) $el.setAttribute('stroke', stroke.color);
  if (stroke.width) $el.setAttribute('stroke-width', stroke.width);
  if (stroke.linecap) $el.setAttribute('stroke-linecap', stroke.linecap);
  if (stroke.linejoin) $el.setAttribute('stroke-linejoin', stroke.linejoin);
  if (stroke.miterlimit)
    $el.setAttribute('stroke-miterlimit', stroke.miterlimit);
};

var setFill = function($el, fill) {
  switch (typeof fill) {
    case 'undefined' || 'object':
      return;
    case 'string':
      if (fill == 'default') {
        fill = icons.settings.fill;
      } else {
        fill = fill;
      }
      break;
  }
  $el.setAttribute('fill', fill);
};

// CONTAINER ELEMENTS

var createSVG = function(attributes) {
  var $svg = $doc.createElementNS(svgNs, 'svg');
  $svg.setAttribute('version', '1.1');
  setId($svg, attributes ? attributes.id : null);
  if (attributes) {
    if (attributes.class) $svg.setAttribute('class', attributes.class);
    if (attributes.width) $svg.setAttribute('width', attributes.width);
    if (attributes.height) $svg.setAttribute('height', attributes.height);
    if (attributes.width && attributes.height)
      $svg.setAttribute(
        'viewbox',
        '0 0 ' + attributes.width + ' ' + attributes.height
      );
  }
  return $svg;
};

var createGroup = function(attributes) {
  var $group = $doc.createElementNS(svgNs, 'g');
  setId($group, attributes ? attributes.id : null);
  if (attributes) {
    if (attributes.mask)
      $group.setAttribute('mask', 'url(#' + attributes.mask + ')');
    if (attributes.class) $group.setAttribute('class', attributes.class);
  }
  return $group;
};

var createDefs = function(attributes) {
  var $defs = $doc.createElementNS(svgNs, 'defs');
  setId($defs, attributes ? attributes.id : null);
  if (attributes && attributes.class)
    $defs.setAttribute('class', attributes.class);
  return $defs;
};

var createMask = function(attributes) {
  var $mask = $doc.createElementNS(svgNs, 'mask');
  setId($mask, attributes ? attributes.id : null);
  if (attributes) {
    if (attributes.class) $mask.setAttribute('class', attributes.class);
    if (attributes.maskUnits)
      $mask.setAttribute('maskUnits', attributes.maskUnits);
    if (attributes.x) $mask.setAttribute('x', attributes.x);
    if (attributes.y) $mask.setAttribute('y', attributes.y);
    if (attributes.width) $mask.setAttribute('width', attributes.width);
    if (attributes.height) $mask.setAttribute('height', attributes.height);
  }
  return $mask;
};

var createClipPath = function(attributes) {
  var $clipPath = $doc.createElementNS(svgNs, 'clipPath');
  setId($clipPath, attributes ? attributes.id : null);
  if (attributes && attributes.class)
    $clipPath.setAttribute('class', attributes.class);
  return $clipPath;
};

// CORE ELEMENTS

var createLine = function(attributes) {
  var $line = $doc.createElementNS(svgNs, 'line');
  setId($line, attributes ? attributes.id : null);
  $line.setAttribute('x1', attributes.x1);
  $line.setAttribute('y1', attributes.y1);
  $line.setAttribute('x2', attributes.x2);
  $line.setAttribute('y2', attributes.y2);
  if (attributes) {
    if (attributes.mask)
      $line.setAttribute('mask', 'url(#' + attributes.mask + ')');
    if (attributes.class) $line.setAttribute('class', attributes.class);
  }
  setStroke($line, attributes.stroke);
  return $line;
};

var createPath = function(attributes) {
  var $path = $doc.createElementNS(svgNs, 'path');
  setId($path, attributes ? attributes.id : null);
  $path.setAttribute('d', attributes.d);
  if (attributes) {
    if (attributes.mask)
      $path.setAttribute('mask', 'url(#' + attributes.mask + ')');
    if (attributes.class) $path.setAttribute('class', attributes.class);
  }
  setFill($path, attributes.fill);
  setStroke($path, attributes.stroke);
  return $path;
};

var createCircle = function(attributes) {
  var $circle = $doc.createElementNS(svgNs, 'circle');
  setId($circle, attributes ? attributes.id : null);
  $circle.setAttribute('cx', attributes.cx);
  $circle.setAttribute('cy', attributes.cy);
  $circle.setAttribute('r', attributes.r);
  if (attributes) {
    if (attributes.mask)
      $circle.setAttribute('mask', 'url(#' + attributes.mask + ')');
    if (attributes.class) $circle.setAttribute('class', attributes.class);
  }
  setFill($circle, attributes.fill);
  setStroke($circle, attributes.stroke);
  return $circle;
};

var createPolygon = function(attributes) {
  var $polygon = $doc.createElementNS(svgNs, 'polygon');
  setId($polygon, attributes ? attributes.id : null);
  $polygon.setAttribute('points', attributes.points);
  if (attributes) {
    if (attributes.mask)
      $polygon.setAttribute('mask', 'url(#' + attributes.mask + ')');
    if (attributes.class) $polygon.setAttribute('class', attributes.class);
  }
  setFill($polygon, attributes.fill);
  setStroke($polygon, attributes.stroke);
  return $polygon;
};

/**
 * Creates a svg icon from given path and circle data
 * @param  {string} iconName             Icon name from the content/icons.js
 * @param  {object} containerAttributes  SVG attributes for container element: id,width,height
 * @param  {string} container            Container for the icon: svg, group, defs or mask
 * @param  {object} childAttributes      Attributes for all child elements: stroke,fill
 * @return {element}                     Container element (<g>,<svg>,etc)
 */
var createIcon = function(
  iconName,
  containerAttributes,
  container,
  childAttributes
) {
  var iconData = icons.list[iconName];

  container =
    typeof container !== 'undefined' && container !== null ? container : 'svg';
  var $iconContainer;
  var createContainer = {
    svg: createSVG,
    group: createGroup,
    defs: createDefs,
    mask: createMask
  };

  $iconContainer = createContainer[container](
    objectAssign(
      { width: iconData.width, height: iconData.height },
      containerAttributes
    )
  );

  var i;
  if (typeof iconData.paths !== 'undefined') {
    for (i = 0; i < iconData.paths.length; i++) {
      var $path = createPath(objectAssign(iconData.paths[i], childAttributes));
      $iconContainer.appendChild($path);
    }
  }

  if (typeof iconData.circles !== 'undefined') {
    for (i = 0; i < iconData.circles.length; i++) {
      var $circle = createCircle(
        objectAssign(iconData.circles[i], childAttributes)
      );
      $iconContainer.appendChild($circle);
    }
  }

  return $iconContainer;
};

export {
  createSVG,
  createGroup,
  createDefs,
  createMask,
  createClipPath,
  createLine,
  createPath,
  createCircle,
  createPolygon,
  createIcon
};
