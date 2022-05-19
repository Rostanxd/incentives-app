import del from 'rollup-plugin-delete';
import globals from "rollup-plugin-node-globals";
import typescript from "rollup-plugin-typescript2";
import babel from '@rollup/plugin-babel';
import builtins from "rollup-plugin-node-builtins";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';

import { terser } from "rollup-plugin-terser";

import postcss from 'rollup-plugin-postcss';
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import inlineCssImports from "postcss-import";

import * as reactDom from "react-dom";
import * as react from "react";
import * as reactDayPicker from "react-day-picker";

import pkg from './package.json';

export default [
  {
    input: "src/index.tsx",
    inlineDynamicImports: true,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      {
        file: pkg.umd,
        format: 'umd',
        name: 'tentrr-components',
        exports: 'named',
        sourcemap: true
      },
    ],
    plugins: [
      del({targets: ['lib/*']}),
      image(),
      commonjs({
        include: ['node_modules/**'],
        namedExports: {
          "react": Object.keys(react),
          "react-dom": Object.keys(reactDom),
          "react-datepicker": Object.keys(reactDayPicker)
        }
      }),
      globals({
        'react': 'React',
        'react-dom': 'ReactDOM'
      }),
      builtins(),
      postcss({
        extensions: [".css"],
        modules: false,
        extract: 'global.css',
        minimize: true,
        plugins: [inlineCssImports, autoprefixer, cssnano]
      }),
      typescript(),
      resolve({
        browser: true
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      babel({
        presets: ["@babel/preset-react"],
      }),
    ]
  },
  {
    input: 'src/utils/index.ts',
    output: [
      {
        file: 'lib/utils.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: 'lib/utils.es.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      }
    ],
    plugins: [
      replace({
        exclude: 'node_modules/**',
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      typescript({
        rollupCommonJSResolveHack: true,
        clean: true
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      globals({
        'react': 'React',
        'react-dom': 'ReactDOM'
      }),
      builtins(),
      terser({
        output: {
          comments: false
        }
      })
    ]
  },
  {
    input: 'src/interfaces/index.ts',
    output: [
      {
        file: 'lib/interfaces.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: 'lib/interfaces.es.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      }
    ],
    plugins: [
      replace({
        exclude: 'node_modules/**',
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      typescript({
        rollupCommonJSResolveHack: true,
        clean: true
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      globals({
        'react': 'React',
        'react-dom': 'ReactDOM'
      }),
      builtins(),
      terser({
        output: {
          comments: false
        }
      })
    ]
  }
];
