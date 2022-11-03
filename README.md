<p align="center">
  <a href="https://github.com/stsonline/fudge-api" target="_blank" rel="noopener noreferrer">
    <img width="192" src="https://api.fudge.tech/assets/icons/android-chrome-192x192.png" alt="Fudge Logo" style="max-width: 192px;">
  </a>
</p>
<br/>

# 🍬 Fudge: Promotions gallery

> Front-end promotions gallery web component that implements the Fudge promotions API for displaying offers in various layouts such as carousels and page cards.

- 🌟 Built using **[Vue 2](https://v2.vuejs.org/v2/guide/)**
- 📦 Compiled using the **[Vue CLI web components](https://cli.vuejs.org/guide/build-targets.html#web-component)**
- 🚀 Display promotional offers in different areas.

## :rocket: Getting Started

### Prerequisite

- Node JS 16
- Vue JS 2

### Installation

```bash
# install dependencies
npm install

# run the server
npm run serve
```

## 📦 Building

To make the most out of caching abilities, we build the web component locally and push the `dist` folder to the repo, to build the project, run:

```bash
# build web component
npm run build:wc
```

## :rocket: Usage

To deploy the package, you'll need to ensure that you've installed Vue JS as an external dependency into your project, then, link to our [web component](https://cli.vuejs.org/guide/build-targets.html#web-component) and you'll be able to configure it in the page as an element.

```html
<script src="https://unpkg.com/browse/vue@2.7.13/dist/vue.min.js"></script>
<script src="path/to/fudge-promotions-gallery.js"></script>

<!-- use in plain HTML, or in any other framework -->
<fudge-promotions-gallery></fudge-promotions-gallery>
```
