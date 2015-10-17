'use strict';

var browserSync = require('browser-sync');
var config      = require('../config');
var gulp        = require('gulp');
var path        = require('path');

gulp.task('watch', ['modernizr', 'scripts', 'styles'], function() {

    // Create browserSync server
    browserSync(config.browserSync);

    // Watch .scss files
    gulp.watch(path.join(config.styles.src, '**', '*.scss'), ['styles']);

    // Watch .js files
    gulp.watch(path.join(config.scripts.src, '**', '*.js'), ['jshint', 'jscs']);

});
