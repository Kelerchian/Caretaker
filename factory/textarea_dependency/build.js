const webpack = require('webpack')
const path = require('path')
const gulp = require('gulp')
var modulename = "CaretakerTextareaHTMLDependency"
var concat = require('gulp-concat')
path.delimiter = "/"

var caretakerDependencyFolderPath = path.resolve("./src_extension/caretaker_editor/caretaker_dependency")

//registering webpack config file
var outputConfig = {
	filename: modulename+".js",
	path: caretakerDependencyFolderPath
}

var config = {
	entry : path.resolve(__dirname, "textarea_raw.js"),
	output: outputConfig,
	externals: {
		"react": "React",
		"react-dom": "ReactDOM"
	}
}

//installing cssfile
var cssFilePath = [
	path.resolve("./factory/textarea_dependency/textarea_style.css"),
	path.resolve("./node_modules/draft-js/dist/draft.css")
]
gulp.src( cssFilePath )
		.pipe( concat(modulename+'.css') )
		.pipe( gulp.dest(caretakerDependencyFolderPath) )

module.exports = config
