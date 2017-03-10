/**
 * Created by Administrator on 2017/1/6.
 */
var fs = require("fs");
var path = require("path");
var file = require("./file");
module.exports = {
    create: function (app) {
        app.use('/', require('../routes/index'));
        var files = fs.readdirSync("./routes");
        files.forEach(function (data) {
            if (data != "index.js") {
                var fname = path.basename(data, ".js");
                app.use('/' + fname, require('../routes/' + data));
            }
        });
    }
};



