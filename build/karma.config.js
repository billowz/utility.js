var babel = require('./rollup-babel'),
  istanbul = require('rollup-plugin-istanbul'),
  multiEntry = require('rollup-plugin-multi-entry'),
  coverage = require('rollup-plugin-coverage')

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: false,
    transports: ['websocket', 'polling', 'jsonp-polling'],
    frameworks: ['mocha', 'expect'],
    reporters: ['spec', 'coverage'],
    files: ['../src/__tests__/**/*.spec.js'],
    preprocessors: {
      '../src/__tests__/**/*.spec.js': ['rollup']
    },
    rollupPreprocessor: {
      rollup: {
        plugins: [babel(), multiEntry(), coverage({
          exclude: ['../src/**/*.spec.js'],
          esModules: true,
          coverageOptions: {
            sourceMapWithCode: true
          }
        })]
      },
      bundle: {
        sourceMap: 'inline',
        useStrict: false
      }
    },
    autoWatch: true,
    coverageReporter: {
      reporters: [{
        type: 'text',
        dir: '../coverage/',
        file: 'coverage.txt',
      }, {
        type: 'text-summary'
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
