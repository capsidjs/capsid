module.exports = config =>
  config.set({
    frameworks: ['browserify', 'mocha'],
    files: [
      'src/__tests__/helper.ts',
      'src/__tests__/*.ts',
      'src/**/__tests__/**/*.ts'
    ],
    preprocessors: { 'src/**/*.ts': ['browserify'] },
    rollupPreprocessor: {},
    browserify: {
      debug: true,
      transform: [
        [
          'babelify',
          {
            presets: ['@babel/preset-env', 'power-assert'],
            plugins: [
              'istanbul',
              '@babel/plugin-transform-typescript',
              [
                '@babel/plugin-proposal-decorators',
                { decoratorsBeforeExport: false }
              ],
              '@babel/plugin-proposal-class-properties'
            ],
            extensions: ['.ts', '.js']
          }
        ]
      ],
      extensions: ['.ts']
    },
    mime: {
      'text/javascript': ['ts']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: { type: 'lcov' },
    browsers: ['Chrome'],
    singleRun: true
  })
