/*
 * Copyright Regione Piemonte - 2023
 * SPDX-License-Identifier: EUPL-1.2
 */

const gulp = require('gulp');
// Cancellare cose
const del = require('del');
// Crea un file zip
const zip = require('gulp-zip');

// const project = 'space-platform';
const date = new Date();
const junk = ['../dist/*.zip'];
const zipSource = '../dist/spa/**/*';
const zipDest = '../dist';

function clean() {
    return del(junk, { force: true });
}

function compress() {
    return gulp
        .src(zipSource)
        .pipe(zip(`bundle-${+date}.zip`))
        .pipe(gulp.dest(zipDest));
}


// Gulp series
const bundlezip = gulp.series(clean, compress);

// Generici
exports.clean = clean;
exports.compress = bundlezip;
