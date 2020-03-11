module.exports = config =>
  config.set({
    frameworks: ['karma-typescript', 'mocha'],
    files: [ 'src/**/*.ts' ],
    preprocessors: { 'src/**/*.ts': ['karma-typescript'] },
    reporters: ['progress', 'karma-typescript'],
    // coverageReporter: { type: 'lcov' },
    browsers: ['Chrome'],
    singleRun: true
  })
