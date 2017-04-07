console.log("Running factory")

var path = require('path')
var fs = require('fs')
var webpack = require('webpack')

var factoryPath = path.resolve(__dirname, "factory")
var folders = fs.readdirSync(factoryPath)


folders.forEach(function(folderName){
	console.log("Processing: ",folderName)
	var folderPath = path.resolve(factoryPath, folderName)
	var buildFilepath = path.resolve(folderPath, "build.js")
	if( fs.existsSync( buildFilepath )){
		var config = require( buildFilepath )
		var compiler = webpack(config)
		compiler.run((err, status) => {
			console.log("status: "+status)
			if(err){
				console.log(err)
			}
		})
	}
})
console.log("Done")
