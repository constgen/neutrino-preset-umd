# Neutrino UMD preset

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
    "start": "neutrino start --use neutrino-preset-umd",
    "build": "neutrino build --use neutrino-preset-umd"
  }
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

## Usage

### More advanced setup

Usually you like to use several presets for different tasks in your project. Edit your project's `package.json` to add commands for starting and building the application:

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

Now you can add another presets to `"use"` list and they will be included to the build configuration.

### Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this preset builds. You can modify the preset settings from `.neutrinorc.js` by overriding with an options object. Use an array pair instead of a string to supply these options in `.neutrinorc.js`.

The following shows how you can pass an options object to the preset and override its options, showing the defaults:

**.neutrinorc.js**
```js
module.exports = {
  use: [
    ['neutrino-preset-umd', {
      // A file name of a bundle without an extension. By default "name" from the packaje.json is used.
      name: '',

      // A name of a namespace in the global object. If empty all module properties are exposed to a global scope.
      library: '',

      // An output folder path
      output: 'dist',

      // Modules that shouldn't be bundled. They will be imported in a runtime.
      externals: {
         http: 'http',
         https: 'https',
         url: 'url',
         fs: 'fs',
         path: 'path'
      },

      // NodeJS global variales
      globals: {
         __filename: true,
         __dirname: true,
         global: true,
         process: false,
         setImmediate: false,
         Buffer: false
      },

      // enable minification
      minify: true
    }]
  ]
};
```

*Example: Customize bundling for personal needs*

**.neutrinorc.js**

```js
module.exports = {
  use: [
    ['neutrino-preset-umd', {
       // produce my-library.js
      name: 'my-library',

      // `window.myLibrary` is declared only when included using `<script>`
      library: 'myLibrary',

      // We may need `setImmediate` polyfill (increases a bundle size)
      globals: {
         setImmediate: true
      },

      // don't minify
      minify: false
    }]
  ]
};
```

## Customizing

Consumers may provide their custom configurations for different parts of the current preset that will override its defaults. Also if you want to construct your own preset based on `neutrino-preset-umd` you can use information below.

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization). `neutrino-preset-umd` creates some conventions to make overriding the configuration easier once you are ready to make changes.

### Entry points

By default UMD preset creates a single entry point to your application:

- `index`: maps to the `index.js` file in the `src` directory. This value is provided by `neutrino.options.mains`.


### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `babel-minify`: Minifies code;
- `clean`: Clears the contents of build prior to creating a production bundle;

### Override configuration

By following the [customization guide](https://neutrino.js.org/customization) and knowing the plugin IDs above, you can override and augment the build by providing a function to your `.neutrinorc.js` use array. You can also make these changes from the Neutrino API in a custom middleware.