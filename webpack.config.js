module.exports = {
    entry: './main.js',
    devtool: 'source-map',
    mode: 'development', //development / production
    output: {
        filename: './bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
