const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', function() {
  // place code for your default task here
  gulp.src('es6/*.js')
  .pipe(babel())
  .pipe(gulp.dest('es5'));  
});
