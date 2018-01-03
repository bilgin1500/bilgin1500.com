import { createEl } from 'utilities/helpers';

/*
 * Video constructor
 * @param  {object} args - Argument object with projectSlug, sectionSlug and content properties
 * @return {element} - Wrapper element
 */
function Video(args) {
  this.projectSlug = args.projectSlug;
  this.sectionSlug = args.sectionSlug;
  this.element = this._init(args);
}

Video.prototype = {
  /**
   * Creates the <video> element
   * @param  {object} args Argument object with projectSlug and content properties
   * @return {element} - Wrapper element
   */
  _init: function(args) {
    // Poster image for video
    var videoPoster = require('content/' +
      args.projectSlug +
      '/' +
      args.content.poster);

    // Create <video> tag
    var $wrapper = createEl('video', {
      poster: videoPoster,
      preload: 'none',
      width: args.content.width,
      height: args.content.height,
      muted: true,
      loop: true
    });

    // Append the sources
    for (var i = 0; i < args.content.sources.length; i++) {
      var videoSource = require('content/' +
        args.projectSlug +
        '/' +
        args.content.sources[i].source);

      $wrapper.appendChild(
        createEl('source', {
          src: videoSource,
          type: 'video/' + args.content.sources[i].type
        })
      );
    }

    return $wrapper;
  },

  // Api wrapper for video's pause method
  pause: function() {
    this.element.pause();
  },

  // Api wrapper for video's pause method
  play: function() {
    this.element.play();
  }
};

export default Video;
