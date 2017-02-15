module.exports = config => config.set({
  frameworks: ['browserify', 'mocha'],
  files: ['src/__tests__/helper.js', 'src/**/*.js'],
  preprocessors: { 'src/**/*.js': 'browserify' },
  browserify: {
    debug: true,
    transform: [['babelify', { presets: ['es2015', 'power-assert'], plugins: ['istanbul'] }]]
  },
  reporters: ['progress', 'coverage'],
  coverageReporter: { type: 'lcov' },
  browsers: ['Chrome'],
  singleRun: true
})
