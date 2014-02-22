var spawn = require('child_process').spawn;
var vinyl_source = require('vinyl-source-stream');
var watchify = require('watchify');
var gulp = require('gulp');

gulp.task( 'compile js', function(){
	var w = watchify('./assets/scripts/room.js');
	w.transform('hbsfy');
	var bundle = function(){
		return w.bundle()
			.pipe( vinyl_source('room.js') )
			.pipe( gulp.dest('./assets/compiled') );
	};
	w.on( 'update', bundle );
	return bundle();
});

gulp.task( 'start application', function(){
	spawn( 'node', ['index.js'], {
		stdio: 'inherit'
	});
});

gulp.task( 'default', ['compile js', 'start application'] );