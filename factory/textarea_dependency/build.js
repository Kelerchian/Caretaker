const webpack = require('webpack')
const path = require('path')

var outputConfig = {
	filename: "CaretakerTextareaDependency.js",
	path: path.resolve("./example/asset/draftjs")
}

var config = {
	entry : path.resolve(__dirname, "textarea_raw.js"),
	output: outputConfig
}

module.exports = config
