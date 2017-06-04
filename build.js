var fs = require('fs')
var path = require('path')
var gulp = require('gulp')
var concat = require('gulp-concat')
path.delimiter = "/"

function lookIntoFolder(dir, intendedExtension){
	var sources = []
	var folderContent = fs.readdirSync( dir )
	folderContent.forEach(function( filename ){
		var filepath = dir+"/"+ filename
		filepath = filepath.replace(/\\/gi, "/")
		var stat = fs.lstatSync( filepath )
		if(stat.isFile()){
			var extension = filename.split('.')[1]
			if(extension == intendedExtension){
				sources.push(filepath)
			}
		}else if(stat.isDirectory()){
			var sourcesInDirectory = lookIntoFolder(dir+"/"+filename, intendedExtension)
			sources = sources.concat(sourcesInDirectory)
		}
	})
	return sources
}

var javascriptSource = lookIntoFolder(path.resolve(__dirname, "src"), "js")
var cssSource = lookIntoFolder(path.resolve(__dirname, "src"), "css")


console.log("Main Files:", javascriptSource, cssSource)

gulp.src(javascriptSource)
	.pipe(concat('caretaker.js'))
	.pipe(gulp.dest("dist") )

gulp.src(cssSource)
	.pipe(concat('caretaker.css'))
	.pipe(gulp.dest("dist"))

var extension_path = path.resolve(__dirname, "src_extension")
var extension_folders = fs.readdirSync( extension_path )
console.log("Compiling Extensions: ")
extension_folders.forEach(function(filename){

	var folderDir = path.resolve(extension_path,filename)
	var stat = fs.lstatSync( folderDir )
	if(stat.isDirectory()){
		var jsFiles = lookIntoFolder( folderDir, "js" )
		var cssFiles = lookIntoFolder( folderDir, "css")

		console.log("compiling "+filename+" :")
		console.log(jsFiles, cssFiles)

		gulp.src(jsFiles)
		.pipe(concat('caretaker.extension.'+filename+'.js'))
		.pipe(gulp.dest("dist/"+filename))

		gulp.src(cssFiles)
		.pipe(concat('caretaker.extension.'+filename+'.css'))
		.pipe(gulp.dest("dist/"+filename))
	}
})
console.log("Extensions compiled")
