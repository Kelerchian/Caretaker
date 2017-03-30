const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const concat = require('gulp-concat')
path.delimiter = "/"

var javascriptSource = [];
var cssSource = [];
(function lookIntoFolder(dir){

	var folderContent = fs.readdirSync( path.resolve(__dirname, dir) )
	folderContent.forEach(function( filename ){
		var filepath = "./"+ dir+"/"+ filename 
		filepath = filepath.replace(/\\/gi, "/")
		var stat = fs.lstatSync( filepath )
		if(stat.isFile()){
			var extension = filename.split('.')[1]
			if(extension == "js"){
				javascriptSource.push(filepath)
			}else if(extension == "css"){
				cssSource.push(filepath)
			}
		}else if(stat.isDirectory()){
			lookIntoFolder(dir+"/"+filename)
		}
	})

})("src")

console.log(javascriptSource, cssSource)

gulp.task('script', function(){
	gulp.src(javascriptSource)
			.pipe(concat('caretaker.js'))
			.pipe(gulp.dest("dist") )
})
