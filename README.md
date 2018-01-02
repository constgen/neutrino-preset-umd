# Neutrino Svelte preset

[![npm](https://img.shields.io/npm/v/neutrino-preset-umd.svg)](https://www.npmjs.com/package/neutrino-preset-umd)
[![npm](https://img.shields.io/npm/dt/neutrino-preset-umd.svg)](https://www.npmjs.com/package/neutrino-preset-umd)

`neutrino-preset-umd` is a [Neutrino](https://neutrino.js.org) preset for creation of JavaScript libraries in an UMD format.

## Features

- Zero upfront configuration necessary to start developing and building a cross-platform
- Incremental re-building
- Production-optimized bundles with Babel Minify minification and source maps
- Extensible to customize your project as needed

## Requirements

- Node.js v6.9+
- Neutrino v8

## Installation

`neutrino-preset-umd` can be installed from NPM. Make sure `neutrino`, and `neutrino-preset-umd` are development dependencies in your project.

```
❯ npm install --save-dev neutrino neutrino-preset-umd
```

## Project Layout

`neutrino-preset-umd` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This means that by default all project source code should live in a directory named `src` in the root of the project. This includes only JavaScript files. Other formats are not supported by this preset. You may need to use additional middlwares for additional file formats. Only files explicitly imported or lazy loaded to your project will be bundled.

## Quickstart

After installing Neutrino and the UMD preset, add a new directory named `src` in the root of the project, with a single JS file named `index.js` in it. Edit your `src/index.js` file with the following:

```js
module.exports = function MyLibrary(){}
```

You can change this code base to better match your needs.

Now edit your project's `package.json` to add commands for starting and building the application:

```json
{
  "scripts": {
    "start": "neutrino start",
    "build": "neutrino build"
  }
}
```
And add the new file `.neutrinorc.js` in the root of the project:

```js
module.exports = {
  use: [
    'neutrino-preset-umd'
  ]
}
```

Start an incremental re-building. 

```
❯ npm start
✔ Build completed
```

Now a library will be automatically re-built when source files changes detected.

## Building

`neutrino-preset-umd` builds a library to the `dist` directory by default when running `neutrino build`. 

```
❯ npm run build
```

By design the bundled version of a library can be used with both a browser and NodeJS. `"main"` property in your `package.json` should target to the JS file in the `dist` folder.
