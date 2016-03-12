# Musical Weathervane

## Structure

	.
	├── dist               (created and managed by Gulp)
	├── audio
	├── fonts
	├── img
	├── node_modules       (created and managed by NPM)
	├── src
	│   ├── scripts
	│   └── styles
	├── .jscsrc
	├── .jshintrc
	├── favicon.ico
	├── gulpfile.js
	│   ├── tasks
	│   ├── utilities
	│   ├── config.js
	│   └── index.js
	├── humans.txt
	├── index.html
	├── package.json
	├── README.md
	└── releasenotes.md

The `/src` folder contains all JavaScript and Sass. Gulp will process these files using the configuration outlined in `/gulpfile.js`, create the `/dist` folder and save the proccessed files into the `/dist` folder.

[Browserify](http://browserify.org/) is used to manage and bundle JavaScript modules.

[JSCS](http://jscs.info/rules.html) and [JS Hint](http://jshint.com/docs/options/) are used to highlights stylisitic and syntactical JS issues. Rules used are listed in `.jscsrc` and `.jshintrc` respectively.

Keep the `humans.txt` updated and ensure the site has a `favicon.ico`.

Note: Please view the README.md files within each folder for more info.

## Installation

*Run (in this directory):*

	npm install

This ensures the all the node packages are installed. Follow the [NPM guide](https://docs.npmjs.com/cli/install) to install new packages.

## Build

[Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) is a task based build tool. It has been configured to run in two modes, development and production. Gulp will create, clean and manage the `dist` folder.

### Development

Styles and scripts will be processed and watched for changes. Scripts will be linted.

*Run (in this directory):*

    npm run gulp

### Production

Styles and scripts will be processed and minified. Modernizr will be custom built based on features used in the Sass and JavaScript.

*Run (in this directory):*

    npm run gulp --production

## References

* [p5.js](http://p5js.org/)
* [Forecast.io JS API](https://github.com/iantearle/forecast.io-javascript-api)
* [Moment.js](http://momentjs.com/)
* [JS Promises Polyfill](https://www.npmjs.com/package/es6-promise-polyfill)

##To do

* Remove unused code from Forecast.io JS API
* Add loading message for pre-js state
