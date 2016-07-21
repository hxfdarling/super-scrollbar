'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');
var del = require('del');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var insert = require('gulp-insert');
var path = require('path');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var stream = require('event-stream');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

var packageInfo = require('./package');
var name = packageInfo.name;
var version = '/* ' + name + ' v' + packageInfo.version + "/\n*" + packageInfo.description + ' */\n';

gulp.task('lint', function () {
	return gulp.src(['./src/**/*.js', './gulpfile.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('clean:js', function () {
	return del(['./dist/js/*.js']);
});

gulp.task('clean:js:min', function () {
	return del(['./dist/js/*.min.js']);
});

var jsEntries = [
	'./src/js/adaptor/global.js',
	'./src/js/adaptor/jquery.js'
];
var cssEntries = [
	'./src/css/main.css'
];

var autoPrefixerConfig = {
	browsers: ['> 0%'], // '> 0%' forces autoprefixer to use all the possible prefixes. See https://github.com/ai/browserslist#queries for more details. IMO 'last 3 versions' would be good enough.
	cascade: false
};

gulp.task('js', ['clean:js'], function () {
	var tasks = jsEntries.map(function (src) {
		return browserify([src]).bundle()
			.pipe(source(path.basename(src)))
			.pipe(buffer())
			.pipe(insert.prepend(version))
			.pipe(rename(function (path) {
				if (path.basename === 'global') {
					path.basename = name;
				}
				else if (path.basename === 'jquery') {
					path.basename = name + '.jquery';
				}
			}))
			.pipe(gulp.dest('./dist/js'))
			.pipe(connect.reload());
	});
	return stream.merge.apply(null, tasks);
});

gulp.task('js:min', ['clean:js:min'], function () {
	var tasks = jsEntries.map(function (src) {
		return browserify([src]).bundle()
			.pipe(source(path.basename(src)))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(insert.prepend(version))
			.pipe(rename(function (path) {
				if (path.basename === 'global') {
					path.basename = name + '.min';
				}
				else if (path.basename === 'jquery') {
					path.basename = name + '.jquery.min';
				} else {
					path.basename = path.basename + '.min';
				}
			})
		)
			.
			pipe(gulp.dest('./dist/js'))
			.pipe(connect.reload());
	});
	return stream.merge.apply(null, tasks);
})
;

gulp.task('clean:css', function () {
	return del(['./dist/css/' + name + '.css']);
});

gulp.task('clean:css:min', function () {
	return del(['./dist/css/' + name + '.min.css']);
});

gulp.task('css', ['clean:css'], function () {
	var tasks = cssEntries.map(function (src) {
		return gulp.src(src)
			.pipe(sass())
			.pipe(autoprefixer(autoPrefixerConfig))
			.pipe(insert.prepend(version))
			.pipe(rename(name + '.css'))
			.pipe(gulp.dest('./dist/css'))
			.pipe(connect.reload());
	});
	return stream.merge.apply(null, tasks);
});

gulp.task('css:min', ['clean:css:min'], function () {
	var tasks = cssEntries.map(function (src) {
		return gulp.src(src)
			.pipe(sass())
			.pipe(autoprefixer(autoPrefixerConfig))
			.pipe(insert.prepend(version))
			.pipe(rename(name + '.min.css'))
			.pipe(gulp.dest('./dist/css'))
			.pipe(connect.reload());
	});
	return stream.merge.apply(null, tasks);
});

gulp.task('build', ['js', 'js:min', 'css', 'css:min']);

gulp.task('connect', ['build'], function () {
	connect.server({
		root: __dirname,
		livereload: true
	});
});

gulp.task('watch', function () {
	gulp.watch(['src/js/**/*'], ['js']);
	gulp.watch(['src/css/**/*'], ['css']);
});

gulp.task('serve', ['connect', 'watch']);

gulp.task('compress', function () {
	return gulp.src('./dist/**')
		.pipe(zip(name + '.zip'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['lint', 'build']);
