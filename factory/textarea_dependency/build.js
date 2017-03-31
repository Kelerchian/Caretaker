const webpack = require('webpack')
const path = require('path')

var outputConfig = {
	filename: "CaretakerTextareaDependency.js",
	path: path.resolve("./src/caretaker_editor/caretaker_dependency")
}

var config = {
	entry : path.resolve(__dirname, "textarea_raw.js"),
	output: outputConfig,
	externals: {
		"react": "React",
		"react-dom": "ReactDOM"
	}
}

module.exports = config
