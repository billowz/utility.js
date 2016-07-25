var babel = require('./rollup-babel'),
  istanbul = require('rollup-plugin-istanbul'),
  multiEntry = require('rollup-plugin-multi-entry')

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: true,
    transports: ['websocket', 'polling', 'jsonp-polling'],
    frameworks: ['mocha', 'expect'],
    reporters: ['spec', 'coverage'],
    files: ['../src/__tests__/**/*.spec.js'],
    preprocessors: {
      '../src/__tests__/**/*.spec.js': ['rollup']
    },
    rollupPreprocessor: {
      rollup: {
        plugins: [babel(), multiEntry(), istanbul({
          exclude: ['../src/**/*.spec.js']
        })]
      },
      bundle: {
        sourceMap: 'inline'
      }
    },
    autoWatch: true,
    coverageReporter: {
      reporters: [{
        type: 'lcov',
        dir: '../coverage',
        subdir: '.'
      }, {
        type: 'text-summary',
        dir: '../coverage',
        subdir: '.'
      }]
    },
    concurrency: Infinity,
    client: {
      clearContext: false,
      captureConsole: false,
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd'
      }
    },
    colors: true
  })
}
