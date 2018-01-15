'use strict'

let path = require('path')
let deepmerge = require('deepmerge')
let { optimize } = require('webpack')
let minify = require('@neutrinojs/babel-minify')
let clean = require('@neutrinojs/clean')
let project = require(path.resolve(process.cwd(), './package.json'))

const MODULES = path.join(__dirname, 'node_modules')

module.exports = function(neutrino, opts = {}){
	let { config, options } = neutrino
	let use = neutrino.use.bind(neutrino)
	let startCommand = (options.command === 'start')
	let buildCommand = (options.command === 'build')

	let settings = deepmerge({
		name: project.name,
		library: '',
		output: path.join(options.root, 'dist'),
		externals: {},
		node: {}
	}, opts)

	// Object.keys(options.mains).forEach(key => config.entry(key).add(options.mains[key]))

	use(minify)
	config
		.target('web')
		.context(options.root)
		.entry('index')
			.add(options.mains.index)
			.end()
		.output
			.path(settings.output)
			.publicPath('./')
			.filename(settings.name + '.js')
			.library(settings.library)
			.libraryTarget('umd')
			.chunkFilename('[name].js')
			.end()
		.devtool('source-map')
		.resolve
			.modules
				.add('node_modules')
				.add(options.node_modules)
				.add(MODULES)
				.end()
			.extensions
				.add('.js')
				.add('.json')
				.end()
			.end()
		.resolveLoader
			.modules
				.add(options.node_modules)
				.add(MODULES)
				.end()
			.end()
		.externals({
			http: 'http',
			https: 'https',
			url: 'url',
			fs: 'fs',
			path: 'path'
		})
		.node
			.merge({
				__filename: true,
				__dirname: true,
				global: true,
				process: false,
				setImmediate: false,
				Buffer: false
			})
			.merge(settings.node)
			.end()
		.plugin('module-concat')
			.use(optimize.ModuleConcatenationPlugin)
		.when(buildCommand || startCommand, function() {
			use(clean, { paths: [settings.output] })
		})
}