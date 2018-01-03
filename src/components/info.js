import { createEl } from 'utilities/helpers';

/*
 * Info constructor
 * @param  {object} args - Argument object with projectSlug, sectionSlug and content properties
 * @return {element} - Wrapper element
 */
function Info(args) {
  this.projectSlug = args.projectSlug;
  this.sectionSlug = args.sectionSlug;
  this.element = this._init(args);
}

Info.prototype = {
  _init: function(args) {
    var $info = createEl('div');
    $info.innerHTML =
      '<h2>Info</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at mauris ante. Phasellus sit amet venenatis orci. Vestibulum sit amet nunc scelerisque, aliquet orci eu, ultrices leo.</p>';
    return $info;
  }
};

export default Info;
