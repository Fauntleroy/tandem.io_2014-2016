var path = require('path');
var vinyl_source = require('vinyl-source-stream');
var _ = require('underscore');
var browserify = require('browserify');
var watchify = require('watchify');
var gulp = require('gulp');
var gulp_util = require('gulp-util');
var gulp_less = require('gulp-less');
var gulp_livereload = require('gulp-livereload');
var gulp_uglify = require('gulp-uglify');
var gulp_minify_css = require('gulp-minify-css');

var generateCssStream = function(){
	var stream = gulp.src('./assets/styles/index.less')
		.pipe( gulp_less({
			paths: [ path.join( __dirname, 'assets', 'styles' ) ]
		}))
		.pipe( gulp.dest('./assets/compiled') );
	return stream;
};

gulp.task( 'compile css', function(){
	generateCssStream();
});

gulp.task( 'compile and watch css', function(){
	var stream = generateCssStream();
	stream.pipe( gulp_livereload() );
	gulp.watch( './assets/styles/**/*.{less,css}', ['compile css'] );
});

var generateBrowserifyBundler = function(){
	var bundler = browserify( './assets/scripts/room.jsx', watchify.args );
	bundler.transform('reactify');
	bundler.transform('browserify-shim');
	return bundler;
};

var generateBrowserifyStream = function( bundler ){
	var stream = bundler.bundle()
		.on( 'error', gulp_util.log.bind( gulp_util, 'Browserify Error' ) )
		.pipe( vinyl_source('room.js') )
		.pipe( gulp.dest('./assets/compiled') );
	return stream;
};

gulp.task( 'compile js', function(){
	var bundler = generateBrowserifyBundler();
	return generateBrowserifyStream( bundler );
});

gulp.task( 'compile and watch js', function(){
	var bundler = watchify( generateBrowserifyBundler() );
	var rebundle = function() {
		console.log('[watchify] Bundling js...');
		return generateBrowserifyStream( bundler );
	};
	bundler.on( 'update', rebundle );
	bundler.on( 'time', function( bundle_time ){
		console.log('[watchify] Bundled in '+ bundle_time +'ms');
	});
	return rebundle();
});

gulp.task( 'minify', function(){
	gulp.src('./assets/compiled/**/*.js')
		.pipe( gulp_uglify() )
		.pipe( gulp.dest('./assets/compiled') );
	gulp.src('./assets/compiled/**/*.css')
		.pipe( gulp_minify_css({
			keepSpecialComments: 0
		}))
		.pipe( gulp.dest('./assets/compiled') );
});

gulp.task( 'compile', ['compile css', 'compile js', 'minify'] );
gulp.task( 'default', ['compile and watch css', 'compile and watch js'] );
