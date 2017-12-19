var gulp = require('gulp')
var rename = require("gulp-rename")
var replace = require("gulp-replace")

gulp.task('mde2md', function(){
  return gulp.src('**/*.mde')
    .pipe(rename(function (path) {
       path.extname = ".md";
       console.log('path=', path)
    }))
    .pipe(replace(/\$(.*?)\$/g, function(match, p1, offset, string) {
        console.log('match=', match, ' p1=', p1)
        return `<img src="https://latex.codecogs.com/gif.latex?${encodeURIComponent(p1)}"/>`
    }))
    .pipe(gulp.dest(''))
})

gulp.task('default', [ 'mde2md' ])
