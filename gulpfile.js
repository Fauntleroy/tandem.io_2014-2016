var spawn = require('child_process').spawn;
var gulp = require('gulp');
var gulp_browserify = require('gulp-browserify');
var gulp_jshint = require('gulp-jshint');

gulp.task( 'compile js', function(){
	gulp.src('./assets/scripts/index.js')
	.pipe( gulp_jshint() )
	.pipe( gulp_jshint.reporter('default') )
	.pipe( gulp_browserify() )
	.pipe( gulp.dest('./assets/compiled') );
});

gulp.task( 'watch', function(){
	gulp.watch( './assets/scripts/**/*.js', ['compile js'] );
});

gulp.task( 'start application', function(){
	spawn( 'node', ['index.js'], {
		stdio: 'inherit'
	});
});

gulp.task( 'default', ['compile js', 'watch', 'start application'] );