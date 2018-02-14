import { createEl } from 'utilities/helpers';
import { getIntroContent } from 'utilities/orm';
import 'css/intro';

var $wrapper = createEl('div', { id: 'intro' });
var $text = createEl('p');
$text.innerHTML = getIntroContent();
$wrapper.appendChild($text);

export default $wrapper;
