const webpack = require('webpack')
const path = require('path')
const gulp = require('gulp')
var concat = require('gulp-concat')
path.delimiter = "/"

var caretakerDependencyFolderPath = path.resolve("./src/caretaker_editor/caretaker_dependency")

//registering webpack config file
var outputConfig = {
	filename: "CaretakerTextareaDependency.js",
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
	path.resolve("./node_modules/draft-js-inline-toolbar-plugin/lib/plugin.css"),
	path.resolve("./node_modules/draft-js/dist/draft.css")
]
gulp.src( cssFilePath )
		.pipe( concat('CaretakerTextareaDependency.css') )
		.pipe( gulp.dest(caretakerDependencyFolderPath) )

module.exports = config
