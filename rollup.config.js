import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies || {});

export default {
  moduleId: pkg.module,
  entry: './src/index.js',
  useStrict: false,
  plugins: [babel({
    exclude: 'node_modules/**',
    presets: ["es2015-loose-rollup"],
    plugins: [
          "transform-es3-member-expression-literals",
          "transform-es3-property-literals"
        ]
  }), filesize()],
  external: external,
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: pkg.module,
      sourceMap: true
    }
  ],
  banner: `/*
 * ${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
 * Copyright (c) 2016 ${pkg.author}
 * Released under the ${pkg.license} license
 * support IE6+ and other browsers
 *${pkg.homepage}
 */`
};
