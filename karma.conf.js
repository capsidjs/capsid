module.exports = config =>
  config.set({
    frameworks: ['karma-typescript', 'mocha'],
    files: [ 'src/**/*.ts' ],
    preprocessors: { 'src/**/*.ts': ['karma-typescript'] },
    reporters: ['progress', 'karma-typescript'],
    karmaTypescriptConfig: {
      coverageOptions: {
        exclude: /.*__tests__.*/
      },
    },
    browsers: ['Chrome'],
    singleRun: true
  })
