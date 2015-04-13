var webpack = require('webpack');
var conf = JSON.parse(require('fs').readFileSync('package.json'));
var rewriteUrl = function(replacePath) {
    return function(req, opt) {
        var queryIndex = req.url.indexOf('?');
        var query = queryIndex >= 0 ? req.url.substr(queryIndex) : "";
        req.url = req.path.replace(opt.path, replacePath) + query;
        //console.log("rewriting ", req.originalUrl, req.url);
    };
};
module.exports = {
    context: __dirname + '/src',
    entry: './index.js', // { main: ['./index.js', 'lib/react-with-addons']},
    output: {
        library: conf.name,
        filename: conf.name + ".js",
        libraryTarget: "amd",
        path: __dirname + '/public',
        sourceMapFilename: "[file].map"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'jsx-loader?insertPragma=React.DOM&harmony'
        }]
    },
    externals: {
         'lib/react': "amd ./lib/react-with-addons"
    },
    devServer: {
        contentBase: false, //'./public',
        proxy: [
            {
                path: new RegExp("/api/example/1/(.*)"),
                rewrite: rewriteUrl("/$1"),
                target: "http://127.0.0.1:3000/"
            }
        ],
        content: [
            {
                path: "*",
                target: "public"
            },
            {
                path: new RegExp("/test/(.*)"),
                rewrite: rewriteUrl("/$1"),
                target: "public"
            }
        ],
        stats: {
            colors: true
        }
    },
    plugins: [
        new webpack.OldWatchingPlugin()
        //new webpack.optimize.UglifyJsPlugin()
    ],
    debug: true,
    devtool: 'source-map'
};
