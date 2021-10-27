const path = require('path')

module.exports = {
    entry: { 'bricks-fp': './index.js' },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
        library: { name: 'bricksFP', type: 'umd' },
        globalObject: 'this'
    },
    devtool: 'source-map',
    mode: 'production'
}
