const gulp = require('gulp')
const gulpif = require('gulp-if')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const rollup = require('rollup-stream')
const uglify = require('gulp-uglify')
const flow = require('rollup-plugin-flow')
const replace = require('rollup-plugin-replace')
const merge = require('merge-stream')

const paths = {
  src: {
    index: 'src/index.js',
    jqueryPlugin: 'src/plugins/jquery-plugin.js'
  },
  dist: 'dist'
}

const replaceVars = isProduction => replace({ __DEV__: `${!isProduction}` })

const rollupStream = ({ input, format, name, output, mode }) => rollup({
  input,
  format,
  name,
  plugins: [flow(), replaceVars(mode === 'production')]
})
  .pipe(source(output))
  .pipe(gulpif(mode !== 'production', rename({ suffix: `.${mode}` })))

const build = ({ input, format, name, output, minify, modes }) => {
  const pipeline = merge.apply(null, modes.map(mode => rollupStream({
    input, format, name, output, mode
  })))
    .pipe(buffer())
    .pipe(babel())
    .pipe(gulp.dest(paths.dist))

  if (!minify) { return pipeline }

  return pipeline
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist))
}

gulp.task('browser', () => build({
  input: paths.src.index,
  format: 'iife',
  name: 'capsid',
  output: 'capsid.js',
  minify: true,
  modes: ['production', 'development']
}))

gulp.task('cjs', () => build({
  input: paths.src.index,
  format: 'cjs',
  output: 'capsid-cjs.js',
  minify: false,
  modes: ['production', 'development']
}))

gulp.task('jquery-plugin', () => build({
  input: paths.src.jqueryPlugin,
  format: 'iife',
  output: 'capsid-jquery.js',
  minify: true,
  modes: ['production']
}))

gulp.task('dist', ['browser', 'cjs', 'jquery-plugin'])
