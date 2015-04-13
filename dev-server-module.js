var webpack = require('webpack');
var conf = JSON.parse(require('fs').readFileSync(__dirname + '/package.json'));

module.exports = {
    load: function(app, shared, options) {
        function registerStatic() {
            var regex = [
                options.static,
                conf.name,
                conf.version.substr(0, conf.version.lastIndexOf(".")),
                "(.*)"
            ].join("/");
            var source = new RegExp(regex);
            var target = __dirname + "/public";
            console.log("static", source, "=>", target);
            app.get(source, shared.rewriteUrl(source, "/$1"), shared.express.static(target));
        }
        function registerApi() {
            var proxy = conf.devServer.proxy;
            var source = new RegExp(proxy.source);
            var proxyOptions = {target: proxy.target, ws: true};
            console.log("api", source, "=>", proxy.target);
            app.all(source, shared.rewriteUrl(source, proxy.rewrite), function(req, res, next) {
                shared.proxy.web(req, res, proxyOptions, function(err) {
                    console.error("cannot proxy to " + proxyOptions.target + " (" + err.message + ")");
                });
            });

        }
        function registerWebpack() {
            var path = [
                options.static,
                conf.name,
                conf.version.substr(0, conf.version.lastIndexOf(".")),
                "" // add trailing slash
            ].join("/");
            var webpackConf = require(__dirname + "/webpack.config.js");
            var webpackDevConf = {
                noInfo: false,
                quiet: false,
                lazy: true,
                publicPath: path,
                stats: { colors: true}
            };
            app.use(shared.WebpackDevMiddleware(shared.webpack(webpackConf), webpackDevConf));


        }

        //registerWebpack();
        registerStatic();
        //registerApi();
    }
};
