module.exports = config =>
  config.set({
    frameworks: ['karma-typescript', 'mocha'],
    files: [ 'src/**/*.ts' ],
    preprocessors: { 'src/**/*.ts': ['karma-typescript'] },
    reporters: ['progress', 'karma-typescript'],
    karmaTypescriptConfig: {
      coverageOptions: {
        exclude: [
          /test-fixture\.ts/,
          /test-helper\.ts/,
          /.*test\.ts$/,
          // We don't like to test this sort of thing.
          /src\/util\/debug-message.ts/,
          // This file is covered but istanbul reports it isn't covered, so we ignore this.
          /src\/decorators\/on\.click\.at\.ts/
        ]
      },
    },
    browsers: ['Chrome'],
    singleRun: true
  })
