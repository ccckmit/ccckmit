var gulp = require('gulp')
var rename = require("gulp-rename")
var replace = require("gulp-replace")

gulp.task('mde2md', function(){
  return gulp.src('**/*.ext.md')
    .pipe(rename(function (path) {
       console.log('path=%j', path)
       path.basename = path.basename.replace(/^(.*)\.ext$/, '$1')
       console.log('path.basename=%j', path.basename)
       path.extname = ".md";
    }))
    .pipe(replace(/\$\$([\s\S]*?)\$\$/gmi, function(match, p1, offset, string) {
        p1 = p1.replace(/[\n\r]/gmi, '')
        return `<center><img src="https://latex.codecogs.com/gif.latex?${encodeURIComponent(p1)}"/></center>`
    }))
    .pipe(replace(/\$(.*?)\$/g, function(match, p1, offset, string) {
        return `<img src="https://latex.codecogs.com/gif.latex?${encodeURIComponent(p1)}"/>`
    }))
    .pipe(gulp.dest(''))
})

gulp.task('default', [ 'mde2md' ])
