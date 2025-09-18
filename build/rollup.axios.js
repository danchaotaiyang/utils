import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

export default {
    input: './src/http/axios.ts',
    plugins: [
        typescript(),
        babel({
            exclude: 'node_modules/**'
        }),
        json(),
        resolve(),
        commonjs()
    ],
    output: {
        file: './lib/axios.js',
        format: 'umd',
        name: 'axios'
    }
};
