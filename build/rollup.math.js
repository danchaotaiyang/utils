import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

export default {
    input: './src/utils/math.ts',
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
        file: './lib/math.js',
        format: 'umd',
        name: 'math'
    }
};
