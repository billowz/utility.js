const gulp = require('gulp'),
  rollup = require('rollup').rollup,
  rollupBabel = require('rollup-plugin-babel'),
  rollupUglify = require('rollup-plugin-uglify'),
  rename = require('gulp-rename'),
  util = require('gulp-util'),
  fs = require('fs'),
  pkg = require('./package.json')

function banner() {
  return `/*
 * ${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
 * Copyright (c) 2016 ${pkg.author}
 * Released under the ${pkg.license} license
 * support IE6+ and other browsers
 *${pkg.homepage}
 */`
}

function compile(opt) {
  var plugins = [rollupBabel({
    runtimeHelpers: true,
    exclude: 'node_modules/**',
    presets: ["es2015-loose-rollup"],
    plugins: [
          "transform-es3-member-expression-literals",
          "transform-es3-property-literals"
        ]
  })]

  if (opt.minify)
    plugins.push(rollupUglify())

  return rollup({
    moduleId: opt.module,
    entry: opt.entry,
    plugins: plugins,
    banner: opt.banner
  }).then(function(bundle) {
    return bundle.write({
      sourceMap: !opt.minify,
      format: 'umd',
      moduleName: opt.module,
      useStrict: opt.useStrict,
      dest: opt.dest
    });
  })
}

gulp.task('default', () => {
  return compile({
    module: pkg.module,
    useStrict: true,
    entry: './src/index.js',
    dest: './dist/utility.js',
    banner: banner()
  })
});
