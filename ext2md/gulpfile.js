var gulp = require('gulp')
var rename = require("gulp-rename")
var replace = require("gulp-replace")

gulp.task('ext2md', function(){
  return gulp.src('../**/*.ext.md')
    .pipe(rename(function (path) {
       console.log('path=%j', path)
       path.basename = path.basename.replace(/^(.*)\.ext$/, '$1')
       path.extname = ".md";
    }))
    .pipe(replace(/\$\$([\s\S]*?)\$\$/gmi, function(match, p1, offset, string) {
        p1 = p1.replace(/[\n\r]/gmi, '')
        return `<p align="center"><img src="https://latex.codecogs.com/gif.latex?${encodeURIComponent(p1)}"/></p>`
    }))
    .pipe(replace(/\$(.*?)\$/g, function(match, p1, offset, string) {
        return `<img src="https://latex.codecogs.com/gif.latex?${encodeURIComponent(p1)}"/>`
    }))
    .pipe(replace(/```puml\s*([\s\S]*?)\s*```/g, function(match, p1, offset, string) {
        return `<img src="http://plantuml.rado0x54.com/png?uml=${encodeURIComponent(p1)}"/>`
    }))
    .pipe(gulp.dest('../'))
})

gulp.task('default', [ 'ext2md' ])

/*
https://talk.commonmark.org/t/multiline-image-urls-for-e-g-plantuml/2415
http://plantuml.rado0x54.com/png?uml=%20@startuml%0A%20Hans%20-%3E%20John%20:%20Hallo%0A%20John%20-%3E%20Carla%20:%20Hi%0A%20Carla%20-%3E%20Hans%20:%20Ola%0A%20@enduml
*/