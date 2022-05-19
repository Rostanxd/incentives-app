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
import * as reactDayPicker from "react-datepicker";

import pkg from './package.json';

export default {
    input: "src/index.tsx",
    inlineDynamicImports: true,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      }
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
      terser({
        output: {
          comments: false
        }
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
  };
