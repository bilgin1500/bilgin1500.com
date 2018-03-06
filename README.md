# bilgin1500.com

Hi there 👋 My name is Bilgin Özkan, I am a designer & developer from Istanbul. This is my personal website where I freely have the chance 
* to experiment with the latest web technologies, 
* to learn new libraries and
* to expand my Javascript skills.

## About

The structure of the website consists of components, utilities, styles and data files. The components (src/components) are building blocks of the webpage. While the most basic components (like page components) only do the DOM manipulation to be appended to the page, the advanced ones (like project component) export a powerful API. Utilities include [a super basic event pus/sub library](https://davidwalsh.name/pubsub-javascript) to support event based communication, an image constructor to handle the lazy loading, a basic orm to parse the json files, a router (using [page.js](https://visionmedia.github.io/page.js/)) and other helpers. Data files are JSONs stored in the src/database and are injected directly into the build .js file. Media files are stored in [Cloudinary](https://cloudinary.com). CSS is written in [Stylus](http://stylus-lang.com/). Finally the website is heavily using [GSAP](https://greensock.com/gsap).

## To run the website

I used NPM for dependency management and the website can be built using Webpack. The shortest way to start the website on your local machine is to build it with Webpack `npm run build` and run the website on webpack-dev-server with `npm start`

:point_up: ** Extra Club Membership plugins of [GSAP](https://greensock.com/gsap) are not included in the repo. To be able to compile the project '_ThrowPropsPlugin_' and '_DrawSVGPlugin_' should be included in the *src/vendors/GSAP_Plugins* folder. 

## Browser support

* Chrome / desktop and iOS (Designed and developed on)  
* Firefox
* Safari / desktop & iOS

## Goals

* [x] Learn GSAP core and its ecosystem 
* [x] Learn SVG core API and experiment with SVG.js
* [x] Learn basic Git (and GitKraken)
* [ ] Dive into the realm of TDD and unit tests
