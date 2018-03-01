import { createEl, slugify, buildMediaUrl } from 'utilities/helpers';
import 'css/video';

/**
 * Video constructor
 * @param  {object} prjData - Data from database
 * @param  {number} index - Current section index
 * @param  {object} section - Parent section's instance
 */
function Video(prjData, index, section) {
  this.isActive = false;
  this.content = prjData.sections[index].content;
  this.projectSlug = prjData.slug;
  this._createDom();
}

/**
 * Creates the <video> element
 */
Video.prototype._createDom = function() {
  // Create <video> tag
  var $video = createEl('video', {
    poster: buildMediaUrl({
      project: this.projectSlug,
      name: this.content.poster
    }),
    preload: 'none',
    width: this.content.width,
    height: this.content.height
  });

  $video.muted = true;
  $video.loop = true;

  // Create a div wrapper
  var $wrapper = createEl('div', { class: 'video-wrapper' });
  $wrapper.appendChild($video);

  // Append the sources
  for (var i = 0; i < this.content.sources.length; i++) {
    $video.appendChild(
      createEl('source', {
        src: buildMediaUrl({
          project: this.projectSlug,
          name: this.content.source,
          extension: this.content.sources[i].source
        }),
        type: 'video/' + this.content.sources[i].source
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
