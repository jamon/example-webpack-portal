var express = require('express');
var morgan = require('morgan');
var WebpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var fs = require('fs');
var async = require('async');
var httpProxy = require("http-proxy");

var app = express();
app.use(morgan('combined'));

var compiler = webpack({});

var proxy = new httpProxy.createProxyServer();

var rewriteUrl = function(path, replacePath) {
    return function(req, res, next) {
        var queryIndex = req.url.indexOf('?');
        var query = queryIndex >= 0 ? req.url.substr(queryIndex) : "";
        req.url = req.path.replace(path, replacePath) + query;
        console.log("rewriting ", req.originalUrl, req.url);
        next();
    };
};

/**
 * given a path, asynchronously read and find all directories contained within
 *
 * @param path - path to read
 * @param callback - function(err, arrayOfDirectories)
 */
var getDirs = function(path, callback) {
    // read parent directory
    fs.readdir(path, function(err, fileNames) {
        if(err) return callback(err);
        // get fs.stat for each file/directory
        async.map(fileNames, function(fileName, mapCallback) {
            // get fs.stat for an individual file/directory, return it as an object
            // containing the path to the file and the fs.stat object
            var pathFileName = path + fileName;
            fs.stat(pathFileName, function(err, stat) {
                mapCallback(err, {fileName: pathFileName, stat: stat});
            });
        }, function(err, fileStats) {
            // once we have fs.stat for each file...
            if(err) return callback(err);
            // filter so we only keep directories
            callback(null, fileStats.filter(function(fileStat) {
                return fileStat.stat.isDirectory();
            // return only the path to the file
            }).map(function(fileStat) {
                return fileStat.fileName;
            }));
        });
    });
};


var getModules = function(rootDirectory, callback) {
    getDirs(rootDirectory, function(err, dirs) {
        if(err) return callback(err);
        async.filter(dirs, function(path, mapCallback) {
            // @TODO don't repeat filename
            var moduleFile = path + "/dev-server-module.js";
            //console.log("checking", moduleFile);
            fs.exists(moduleFile, function(exists) {
                //console.log("   ", moduleFile, exists);
                mapCallback(exists);
            });
        }, function(result) {
            callback(null, result);
        });
    });
};

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

var shared = { express: express, webpack: webpack, rewriteUrl: rewriteUrl, proxy: proxy, WebpackDevMiddleware: WebpackDevMiddleware };
var conf = {"static": "/static", "api": "/api"};
getModules("../", function(err, moduleList) {
    console.log("moduleList", moduleList);
    moduleList.map(function(modulePath) {
        var moduleFile = modulePath + "/dev-server-module.js";
        console.log("loading module", moduleFile);
        // try {
            var module = require(moduleFile);
            module.load(app, shared, conf);
        // } catch(e) {
        //     console.error("Unable to load ", moduleFile, e);
        //     throw e;
        // }
    });
    var server = app.listen(8080, function () {
      var host = server.address().address;
      var port = server.address().port;

      console.log('dev-server listening at http://%s:%s', host, port);
    });
});
