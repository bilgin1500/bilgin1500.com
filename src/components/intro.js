import { createEl } from 'utilities/helpers';
import { getInfo } from 'utilities/orm';
import 'css/intro';

var $wrapper = createEl('div', { id: 'intro' });
var $text = createEl('p');
$text.innerHTML = getInfo('intro');
$wrapper.appendChild($text);

export default $wrapper;
