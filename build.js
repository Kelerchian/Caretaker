var fs = require('fs')
var path = require('path')
var gulp = require('gulp')
var concat = require('gulp-concat')
path.delimiter = "/"

function lookIntoFolder(dir, intendedExtension){
	var sources = []
	var folderContent = fs.readdirSync( path.resolve(__dirname, dir) )
	folderContent.forEach(function( filename ){
		var filepath = "./"+ dir+"/"+ filename
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

var javascriptSource = lookIntoFolder("src", "js")
var cssSource = lookIntoFolder("src", "css")

var javascriptExtensionSource = lookIntoFolder("src_extension", "js")
var cssExtensionSource = lookIntoFolder("src_extension", "css")

console.log("Main Files:", javascriptSource, cssSource)
console.log("Extension Files:", javascriptExtensionSource, cssExtensionSource)

gulp.src(javascriptSource)
	.pipe(concat('caretaker.js'))
	.pipe(gulp.dest("dist") )

gulp.src(cssSource)
	.pipe(concat('caretaker.css'))
	.pipe(gulp.dest("dist"))

gulp.src(javascriptExtensionSource)
	.pipe(concat('caretaker.extension.js'))
	.pipe(gulp.dest("dist"))

gulp.src(cssExtensionSource)
	.pipe(concat('caretaker.extension.css'))
	.pipe(gulp.dest("dist"))
