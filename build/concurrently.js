const concurrently = require('concurrently');

concurrently([
    'rollup -c build/rollup.utils.js',
    'rollup -c build/rollup.math.js',
    'rollup -c build/rollup.sign.js',
    'rollup -c build/rollup.axios.js',
    'rollup -c build/rollup.ajax.js',
    'rollup -c build/rollup.tools.js',
    'rollup -c build/plugins/rollup.signatureBoard.js'
]);
