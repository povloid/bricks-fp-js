const path = require('path')

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bricks-fp.js',
        path: path.resolve(__dirname, 'lib'),
        library: { name: 'bricksFP', type: 'umd' }
    },
    mode: 'production'
}
