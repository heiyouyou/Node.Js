/**
 * Created by RockeyCai on 16/2/22.
 * 创建文件夹帮助类
 */

var fs = require("fs");
var path = require("path");

//递归创建目录 异步方法
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
           callback(dirname);
        } else {
            var cpath = path.dirname(dirname);
            mkdirs(cpath, function () {
                fs.mkdir(cpath, callback);
            });
        }
    });
};


//递归创建目录 同步方法
function mkdirsSync(dirname) {
    //console.log(dirname);
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        var path = path.dirname(dirname);
        if (mkdirsSync(path)) {
            fs.mkdirSync(path);
            return true;
        }
    }
};



function getDirAndFile(path, handleFile) {
    handleFile(path);
    fs.readdir(path, function(err, files) {
        if (err) {
            console.log('read dir error');
        } else {
            files.forEach(function(item) {
                var tmpPath = path + '/' + item;
                fs.stat(tmpPath, function(err1, stats) {
                    if (err1) {
                        console.log('stat error');
                    } else {
                        if (stats.isDirectory()) {
                            getDirAndFile(tmpPath, handleFile);
                        } else {
                            handleFile(tmpPath);
                        }
                    }
                })
            });

        }
    });
};

function getFiles(path, handleFile) {
    fs.readdir(path, function(err, files) {
        if (err) {
            console.log('read dir error');
        } else {
            files.forEach(function(item) {
                var tmpPath = path + '/' + item;
                fs.stat(tmpPath, function(err1, stats) {
                    if (err1) {
                        console.log('stat error');
                    } else {
                        if (stats.isDirectory()) {
                            getFiles(tmpPath, handleFile);
                        } else {
                            handleFile(tmpPath);
                        }
                    }
                })
            });

        }
    });
};

//创建文件
function createFile(path,data){
    fs.writeFileSync(path,data);
}

//创建文件
function readFile(path){
    return fs.readFileSync(path,"utf-8");
}



module.exports.mkdirs = mkdirs;
module.exports.mkdirsSync= mkdirsSync;
module.exports.getDirAndFile= getDirAndFile;
module.exports.getFiles= getFiles;
module.exports.createFile= createFile;
module.exports.readFile = readFile;