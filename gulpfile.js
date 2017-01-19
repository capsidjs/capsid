const gulp = require('gulp')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const rollup = require('rollup-stream')
const uglify = require('gulp-uglify')
const flow = require('rollup-plugin-flow')

const paths = {
  src: {
    index: 'src/index.js',
    jquery: 'src/jquery.js'
  },
  dist: 'dist'
}

gulp.task('browser', () => (
  rollup({
    entry: 'src/index.js',
    format: 'iife',
    moduleName: 'capsid',
    plugins: [flow()]
  })
    .pipe(source('capsid.js'))
    .pipe(buffer())
    .pipe(babel())
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist))
))

gulp.task('cjs', () => (
  rollup({
    entry: 'src/index.js',
    format: 'cjs',
    plugins: [flow()]
  })
    .pipe(source('capsid-commonjs.js'))
    .pipe(buffer())
    .pipe(babel())
    .pipe(gulp.dest(paths.dist))
))

gulp.task('jquery', () => (
  rollup({
    entry: 'src/plugins/jquery-plugin.js',
    format: 'iife',
    plugins: [flow()]
  })
    .pipe(source('capsid-jquery.js'))
    .pipe(buffer())
    .pipe(babel())
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist))
))

gulp.task('dist', ['browser', 'cjs', 'jquery'])
