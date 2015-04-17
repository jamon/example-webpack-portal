var webpack = require('webpack');
module.exports = {
    context: __dirname + '/src',
    entry: './index.js',
    output: {
        filename: "[name].js",
        libraryTarget: "amd",
        path: "/",
        sourceMapFilename: "[file].map"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'jsx-loader?insertPragma=React.DOM&harmony'
        }]
    },
    externals: {
         'lib/angular': "amd angular",
         'lib/react': "amd react",
         'lib/ngReact': "amd ngReact"
    },
    plugins: [
        new webpack.OldWatchingPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ],
    debug: true,
    devtool: 'source-map'
};
