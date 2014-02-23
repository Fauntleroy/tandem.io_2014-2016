var spawn = require('child_process').spawn;
var path = require('path');
var vinyl_source = require('vinyl-source-stream');
var watchify = require('watchify');
var gulp = require('gulp');
var gulp_less = require('gulp-less');

gulp.task( 'compile css', function(){
	gulp.src('./assets/styles/index.less')
		.pipe( gulp_less({
			paths: [ path.join( __dirname, 'assets', 'styles' ) ]
		}))
		.pipe( gulp.dest('./assets/compiled') );
});

gulp.task( 'compile js', function(){
	var w = watchify('./assets/scripts/room.js');
	w.transform('hbsfy');
	w.transform('browserify-shim');
	var bundle = function(){
		return w.bundle()
			.pipe( vinyl_source('room.js') )
			.pipe( gulp.dest('./assets/compiled') );
	};
	w.on( 'update', bundle );
	w.on( 'error', function(){
		console.log('error', arguments);
	})
	return bundle();
});

gulp.task( 'watch css', function(){
	gulp.watch( './assets/styles/**/*.{less,css}', ['compile css'] );
});

gulp.task( 'start application', function(){
	spawn( 'node', ['index.js'], {
		stdio: 'inherit'
	});
});

gulp.task( 'default', ['compile css', 'compile js', 'watch css', 'start application'] );