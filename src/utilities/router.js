import page from 'page';
import pageData from 'content/index';

pageData.sections.forEach(function(section) {
  var $app = document.getElementById('app');
  /*$app.appendChild(require('components/' + section.slug));

  page(section.url, function(ctx) {
    console.log(ctx); // ctx.params.work
  });*/
});

page();
