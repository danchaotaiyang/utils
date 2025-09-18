// import path from 'path';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: './src/utils/index.ts',
    plugins: [
        typescript(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**'
        }),
        json(),
        resolve(),
        commonjs()
    ],
    output: {
        file: './lib/utils.js',
        format: 'umd',
        name: 'utils'
    }
};
