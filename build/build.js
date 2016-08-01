var compile = require('./compile'),
  pkg = require('../package.json'),
  babel = require('./rollup-babel'),
  banner = `/*
 * ${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
 * Copyright (c) 2016 ${pkg.author}
 * Released under the ${pkg.license} license
 * support IE6+ and other browsers
 *${pkg.homepage}
 */`

compile('dist/utility.js', {
  module: pkg.namespace,
  entry: pkg.main,
  useStrict: false,
  banner: banner,
  plugins: [babel()]
})
