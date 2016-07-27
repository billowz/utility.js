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
    files: ['../src/**/*.spec.js'],
    preprocessors: {
      '../src/**/*.spec.js': ['rollup']
    },
    rollupPreprocessor: {
      rollup: {
        plugins: [babel(), multiEntry(), coverage({
          // instrumenter, include, exclude, instrumenterConfig(codeGenerationOptions, noCompact)
          exclude: ['../src/**/*.spec.js'],
          instrumenterConfig: {
            noCompact: true
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
