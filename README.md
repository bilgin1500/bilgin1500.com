# bilginozkan.com

![bilginozkan.com](https://github.com/bilgin1500/bilginozkan.com/raw/master/src/images/favicon.png)

Hi there 👋 My name is Bilgin Özkan, I am a designer & developer from Istanbul. This is my personal website where I freely have the chance 
* to experiment with the latest web technologies, 
* to learn new libraries and
* to expand my Javascript skills.

## About

The structure of the website consists of components, utilities, styles and data files. The components (src/components) are building blocks of the webpage. While the most basic components (like page components) only do the DOM manipulation to be appended to the page, the advanced ones (like project component) export a powerful API. Utilities include [a super basic event pus/sub library](https://davidwalsh.name/pubsub-javascript) to support event based communication, an image constructor to handle the lazy loading, a basic orm to parse the json files, a router (using [page.js](https://visionmedia.github.io/page.js/)) and other helpers. Data files are JSONs stored in the src/database and are injected directly into the build .js file. Media files are stored in [Cloudinary](https://cloudinary.com). CSS is written in [Stylus](http://stylus-lang.com/). Finally the website is heavily using [GSAP](https://greensock.com/gsap).

## To run the website

I used NPM for dependency management and the website can be built using Webpack. The shortest way to start the website on your local machine is to build it with Webpack `npm run build` and run the website on webpack-dev-server with `npm start`

:point_up: Extra Club Membership plugins of [GSAP](https://greensock.com/gsap) are not included in the repo. To compile the project `ThrowPropsPlugin` and `DrawSVGPlugin` should be included in the `src/vendors/GSAP_Plugins` folder. 

## Browser support

*Still in progress*
* Chrome / desktop

## Z depth legend

| z-index | Description |
| --- | --- |
| 150 | [Loader (and its borders)](https://github.com/bilgin1500/bilginozkan.com/blob/master/src/components/loader.js#L24) |
| 120 | [About me content](https://github.com/bilgin1500/bilginozkan.com/blob/master/src/components/page-about-me.js#L142) |
| 115 | [Overlays of About Me](https://github.com/bilgin1500/bilginozkan.com/blob/master/src/css/about.styl#L130) |
| 110 | [Logo](https://github.com/bilgin1500/bilginozkan.com/blob/master/src/css/logo.styl#L12) |
| 105 | [Loader](https://github.com/bilgin1500/bilginozkan.com/blob/master/src/css/main.styl#L50) |
| 101 | [Copyright](https://github.com/bilgin1500/bilginozkan.com/blob/master/src/css/footer.styl#L39) |
| 100 | [Project window](https://github.com/bilgin1500/bilginozkan.com/blob/master/src/css/project.styl#L22) |
| 50  | [Nav social](https://github.com/bilgin1500/bilginozkan.com/blob/master/src/css/footer.styl#L11) |

## Goals

* [x] Learn GSAP core and its ecosystem 
* [x] Learn SVG core API and experiment with SVG.js
* [x] Learn basic Git (and GitKraken)
* [ ] Dive into the realm of TDD and unit tests
