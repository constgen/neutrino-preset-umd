'use strict'

let path = require('path')
let deepmerge = require('deepmerge')
let { optimize } = require('webpack')
let minify = require('@neutrinojs/babel-minify')
let clean = require('@neutrinojs/clean')
let project = require(path.resolve(process.cwd(), './package.json'))

module.exports = function(neutrino, opts = {}){
	const MODULES = path.join(__dirname, 'node_modules')
	let { config, options } = neutrino
	let startCommand = (options.command === 'start')
	let buildCommand = (options.command === 'build')
	let settings = deepmerge({
		name: project.name,
		library: '',
		output: path.join(options.root, 'dist'),
		externals: {
			http: 'http',
			https: 'https',
			url: 'url',
			fs: 'fs',
			path: 'path'
		},
		node: {
			__filename: true,
			__dirname: true,
			global: true,
			process: false,
			setImmediate: false,
			Buffer: false
		},
		minify: true
	}, opts)

	function use(preset, settings){
		return function(){
			neutrino.use(preset, settings)
		}
	}

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
		.externals(settings.externals)
		.node
			.merge(settings.node)
			.end()
		.plugin('module-concat')
			.use(optimize.ModuleConcatenationPlugin)
		.when(buildCommand || startCommand, use(clean, { paths: [settings.output] }))
		.when(settings.minify, use(minify))
}