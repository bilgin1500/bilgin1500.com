import { createEl, slugify } from 'utilities/helpers';
import 'css/video';

/*
 * Video constructor
 * @param  {object} sectionData - content: Section content from the database
 *                                name: Section name from the database 
 *                                type: Section type (this Constructor)
 *                                _draggable: This sections's Draggable instance
 *                                _projectName: Parent project's data
 *                                _wrapper: Section wrapper element
 */
function Video(sectionData) {
  this.isActive = false;
  this.content = sectionData.content;
  this.projectSlug = slugify(sectionData._projectName);
  this._createDom();
}

/**
 * Creates the <video> element
 */
Video.prototype._createDom = function() {
  // Poster image for video
  var videoPoster = require('../projects/' +
    this.projectSlug +
    '/' +
    this.content.poster);

  // Create <video> tag
  var $video = createEl('video', {
    poster: videoPoster,
    preload: 'none',
    width: this.content.width,
    height: this.content.height,
    muted: true,
    loop: true
  });

  // Create a div wrapper
  var $wrapper = createEl('div', { class: 'video-wrapper' });
  $wrapper.appendChild($video);

  // Append the sources
  for (var i = 0; i < this.content.sources.length; i++) {
    var videoSource = require('../projects/' +
      this.projectSlug +
      '/' +
      this.content.sources[i].source);

    $video.appendChild(
      createEl('source', {
        src: videoSource,
        type: 'video/' + this.content.sources[i].type
      })
    );
  }

  // HTML5 <video> API
  this.api = $video;
  // Cache the element
  this.element = $wrapper;
};

// Api wrapper for video's pause method
Video.prototype.pause = function() {
  this.api.pause();
};

// Api wrapper for video's pause method
Video.prototype.play = function() {
  this.api.play();
};

export default Video;
