var fs = require('fs');
var multer = require('multer');
var Path = require('path');
var fileRender = require('../file-reader');
var uuid = require('uuid');
var rootPath;
module.exports = {
    file:function(options){
        options = options || {};
        return multer({
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    options.path = options.path || '';
                    var path;
                    if(options.path){
                        if(options.path.indexOf('/') == 0){
                            path = options.path;
                        }else{
                            path = rootPath + options.path;
                        }
                        fileRender.makeDir(useCommon.stringConcatOnce(path) + 'xx.xx',function(){
                            cb(null, path);
                        });
                    }else{

                        cb(null, rootPath);
                    }

                },
                filename: function (req, file, cb) {
                    var filename = options.filename || file.originalname;
                    filename = uuid.v1() + (Path.extname(filename) || req.body.extname || Path.extname(file.originalname));
                    cb(null, filename);
                }
            })
        }).single(options.name || 'fileName');
    },
    init:function(call){
        if(useConfig.debug){
            rootPath = Path.join(__ROOT__ ,publicDir , 'upload');
            console.log(rootPath);
            fileRender.makeDir(rootPath);
        }
        call && call();
    }
};