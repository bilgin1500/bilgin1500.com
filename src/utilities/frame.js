import { SVGIcon } from 'utilities/svg';
import { createEl } from 'utilities/helpers';
import frames from 'content/frames';
import 'css/frames';

/**
 * Helper function:
 * Creates a table/grid layout with rows and columns
 * Useful for browser and phone framing
 * 
 * @param  {object} options
 *         useRows: boolean / default:true
 *         columns: number / default:3 for browser 5 for phone  
 *         rows: number / default:3
 *         type: browser,phone etc. / default:null
 *         content: element / default:null
 *         url: string / default:null
 *         title: string / default:null
 * @return {element} The wrapper element (.grid-wrapper)
 */
function create(options) {
  // Little private helper to check the default variables
  var isOptionSet = function(key) {
    return (
      typeof options !== 'undefined' && typeof options[key] !== 'undefined'
    );
  };

  // Defaults
  var rows = isOptionSet('rows') ? options.rows : 3,
    useRows = isOptionSet('useRows') ? options.useRows : true,
    type = isOptionSet('type') ? options.type : null,
    content = isOptionSet('content') ? options.content : null,
    url = isOptionSet('url') ? options.url : null,
    title = isOptionSet('title') ? options.title : null;

  var defaultColumnNumber;
  if (type == 'browser') {
    defaultColumnNumber = 3;
  } else if (type == 'phone') {
    defaultColumnNumber = 5;
  }

  var columns = isOptionSet('columns') ? options.columns : defaultColumnNumber;

  // Cache
  var $cell = [],
    $row = null,
    $wrapper = createEl('div', { class: 'grid-wrapper' });

  // Columns & rows and cells
  for (var i = 0; i < columns * rows; i++) {
    if (useRows && i % columns == 0) {
      $row = createEl('div', { class: 'grid-row' });
      $wrapper.appendChild($row);
    }

    // Create cell
    $cell[i + 1] = createEl('div', { class: 'grid-cell-' + (i + 1) });

    // Append frame border images as SVGs
    if (typeof frames[type][i + 1] !== 'undefined') {
      $cell[i + 1].appendChild;
      new SVGIcon(i + 1, null, null, null, frames[type])();
    }

    if (useRows) {
      $row.appendChild($cell[i + 1]);
    } else {
      $wrapper.appendChild($cell[i + 1]);
    }
  }

  // If this is a browser frame let's mimic the url bar
  if (type == 'browser') {
    var $textUrlBarWrapper = createEl('div', { class: 'url-bar-wrapper' }),
      $textUrlBar = createEl('div', { class: 'url-bar' }),
      $text = createEl('div', { class: 'text' }),
      $tabBar = createEl('div', { class: 'tab-bar' }),
      $tabText = createEl('div', { class: 'tab-text' });
    $text.innerHTML = url;
    $tabText.innerHTML = title;
    $textUrlBar.appendChild($text);
    $textUrlBarWrapper.appendChild($textUrlBar);
    $tabBar.appendChild($tabText);
    $cell[2].appendChild($textUrlBarWrapper);
    $cell[2].appendChild($tabBar);
  }

  // Append the content to the center frame
  if (content) {
    var rowCenter = Math.ceil(rows / 2);
    var columnCenter = Math.ceil(columns / 2);
    var theCenter = (rowCenter - 1) * columns + columnCenter;
    $cell[theCenter].appendChild(content);
  }

  return $wrapper;
}

export default { create };
