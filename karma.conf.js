module.exports = config =>
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: ['src/__tests__/helper.js', 'src/**/*.js'],
    preprocessors: { 'src/**/*.js': 'browserify' },
    browserify: {
      debug: true,
      transform: [
        [
          'babelify',
          {
            presets: ['@babel/preset-env', 'power-assert'],
            plugins: [
              'istanbul',
              [
                '@babel/plugin-proposal-decorators',
                { decoratorsBeforeExport: false }
              ],
              '@babel/plugin-proposal-class-properties'
            ]
          }
        ]
      ]
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: { type: 'lcov' },
    browsers: ['Chrome'],
    singleRun: true
  })
