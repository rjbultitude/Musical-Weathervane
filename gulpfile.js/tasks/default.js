'use strict';

var config  = require('../config');
var gulp    = require('gulp');

gulp.task('default', ['clean'], function() {

    return gulp.start(config.production ? ['modernizr', 'scripts', 'styles'] : ['modernizr', 'jshint', 'jscs', 'scripts', 'styles', 'watch']);

});
