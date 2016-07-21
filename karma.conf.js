module.exports = config => config.set({
  frameworks: ['browserify', 'mocha'],
  files: ['test/helper.js', 'test/*.js'],
  preprocessors: {'test/*.js': 'browserify'},
  browserify: {
    debug: true,
    transform: [['babelify', {presets: ['es2015'], plugins: ['istanbul']}]]
  },
  reporters: ['progress', 'coverage'],
  coverageReporter: {type: 'lcov'},
  browsers: ['Chrome'],
  singleRun: true
})
