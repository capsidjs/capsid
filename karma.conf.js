module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha', 'chai'],
    files: ['class-component-spec.js'],
    preprocessors: {
      'class-component-spec.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [require('browserify-istanbul')({ignore: ['**/node_modules/**', '**/*-spec.js']})]
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [{type: 'html'}, {type: 'lcov'}]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true
  })
}
