import { createEl } from 'utilities/helpers';
import 'css/video';

/*
 * Video constructor
 * @param  {object} args - argument:
 *                       projectSlug: current project's slug
 *                       sectionSlug: current section's slug
 *                       content: section's content property, usually an array
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
    var videoPoster = require('../projects/' +
      args.projectSlug +
      '/' +
      args.content.poster);

    // Create <video> tag
    var $video = createEl('video', {
      poster: videoPoster,
      preload: 'none',
      width: args.content.width,
      height: args.content.height,
      muted: true,
      loop: true
    });

    // Create a div wrapper
    var $wrapper = createEl('div', { class: 'video-wrapper' });
    $wrapper.appendChild($video);

    // Append the sources
    for (var i = 0; i < args.content.sources.length; i++) {
      var videoSource = require('../projects/' +
        args.projectSlug +
        '/' +
        args.content.sources[i].source);

      $video.appendChild(
        createEl('source', {
          src: videoSource,
          type: 'video/' + args.content.sources[i].type
        })
      );
    }

    // HTML5 <video> API
    this.api = $video;

    return $wrapper;
  },

  // Api wrapper for video's pause method
  pause: function() {
    this.api.pause();
  },

  // Api wrapper for video's pause method
  play: function() {
    this.api.play();
  }
};

export default Video;
