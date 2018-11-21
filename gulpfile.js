const gulp = require('gulp')
const gulpif = require('gulp-if')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const rename = require('gulp-rename')
const rollup = require('rollup-stream')
const terser = require('gulp-terser')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const merge = require('merge-stream')

const paths = {
  src: {
    index: 'src/index.js',
    outsideEventsPlugin: 'src/plugins/outside-events-plugin.js',
    debugPlugin: 'src/plugins/debug-plugin.js'
  },
  dist: 'dist'
}

const replaceVars = isProduction => replace({ __DEV__: `${!isProduction}` })

const rollupStream = ({ input, format, name, output, mode }) =>
  rollup({
    input,
    format,
    name,
    plugins: [babel(), replaceVars(mode === 'production')]
  })
    .pipe(source(output))
    .pipe(gulpif(mode !== 'production', rename({ suffix: `.${mode}` })))

const build = ({ input, format, name, output, minify, modes }) => {
  const pipeline = merge
    .apply(
      null,
      modes.map(mode =>
        rollupStream({
          input,
          format,
          name,
          output,
          mode
        })
      )
    )
    .pipe(buffer())
    .pipe(gulp.dest(paths.dist))

  if (!minify) {
    return pipeline
  }

  return pipeline
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist))
}

gulp.task('browser', () =>
  build({
    input: paths.src.index,
    format: 'iife',
    name: 'capsid',
    output: 'capsid.js',
    minify: true,
    modes: ['production', 'development']
  })
)

gulp.task('cjs', () =>
  build({
    input: paths.src.index,
    format: 'cjs',
    output: 'capsid-cjs.js',
    minify: false,
    modes: ['production', 'development']
  })
)

gulp.task('debug-plugin', () =>
  build({
    input: paths.src.debugPlugin,
    format: 'umd',
    output: 'capsid-debug.js',
    name: 'capsidDebugPlugin',
    minify: false,
    modes: ['production']
  })
)

gulp.task('outside-events-plugin', () =>
  build({
    input: paths.src.outsideEventsPlugin,
    format: 'umd',
    output: 'capsid-outside-events.js',
    name: 'capsidOutsideEventsPlugin',
    minify: true,
    modes: ['production', 'development']
  })
)

gulp.task('dist', ['browser', 'cjs', 'debug-plugin', 'outside-events-plugin'])
