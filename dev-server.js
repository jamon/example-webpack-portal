var devServer = require('dev-server');
var path = require('path');
devServer({
    static: "/static",
    api: "/api",
    workspace: path.resolve("../"),
    port: 8080,
    address: "127.0.0.1",
    moduleFileName: "dev-server-module.js"
});
