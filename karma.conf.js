module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: ['spec/helper.js', 'spec/*.js'],
    preprocessors: {'spec/*.js': 'browserify'},
    browserify: {
      debug: true,
      transform: [require('browserify-istanbul')({
        instrumenter: require('isparta'),
        ignore: ['**/node_modules/**', '**/spec/**']
      }), 'babelify']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {type: 'lcov'},
    port: 9876,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true
  })
}
