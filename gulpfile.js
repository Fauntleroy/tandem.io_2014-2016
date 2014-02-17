var spawn = require('child_process').spawn;
var gulp = require('gulp');
var gulp_handlebars = require('gulp-handlebars');
var gulp_browserify = require('gulp-browserify');
var gulp_jshint = require('gulp-jshint');

gulp.task( 'compile templates', function(){
	gulp.src('./assets/templates/**/*.hbs')
	.pipe( gulp_handlebars({
		outputType: 'commonjs',
		wrapped: true
	}) )
	.pipe( gulp.dest('./assets/compiled/templates') );
});

gulp.task( 'compile js', function(){
	gulp.run('compile templates');
	gulp.src('./assets/scripts/room.js')
	.pipe( gulp_jshint() )
	.pipe( gulp_jshint.reporter('default') )
	.pipe( gulp_browserify({
		transform: ['hbsfy']
	}) )
	.pipe( gulp.dest('./assets/compiled') );
});

gulp.task( 'watch', function(){
	gulp.watch( ['./assets/scripts/**/*.js', './assets/templates/**/*.hbs'], ['compile js'] );
});

gulp.task( 'start application', function(){
	spawn( 'node', ['index.js'], {
		stdio: 'inherit'
	});
});

gulp.task( 'default', ['compile js', 'watch', 'start application'] );