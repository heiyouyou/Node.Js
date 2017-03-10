var fs = require("fs");
var path = require("path");
var file = require("./file");
module.exports =  {
    create:function(model){
        var rootPath = path.dirname(__dirname);
        console.log(rootPath);

        var routeTemplate = rootPath+"/template/template.js";
        var modelJs = rootPath+"/routes/"+model+".js";
        file.mkdirs(modelJs,function(){
            file.createFile(modelJs,file.readFile(routeTemplate).replace(/(\[model\])/ig,model));
        });
        var addPage = rootPath+"/views/"+model+"/add.html";
        var listPage = rootPath+"/views/"+model+"/list.html";
        var editPage = rootPath+"/views/"+model+"/edit.html";

        var addTemplate = rootPath+"/template/add.html";
        var editTemplate = rootPath+"/template/edit.html";
        var listTemplate = rootPath+"/template/list.html";

        file.mkdirs(addPage,function(){
            file.createFile(addPage,file.readFile(addTemplate).replace(/(\[model\])/ig,model));
        });

        file.mkdirs(editPage,function(){
            file.createFile(editPage,file.readFile(editTemplate).replace(/(\[model\])/ig,model));
        });

        file.mkdirs(listPage,function(){
            file.createFile(listPage,file.readFile(listTemplate).replace(/(\[model\])/ig,model));
        });


        var jsTemplate = rootPath+"/template/model.js";
        var jsPage = rootPath+"/public/js/"+model+"/"+model+".js";
        file.mkdirs(jsPage,function(){
            file.createFile(jsPage,file.readFile(jsTemplate).replace(/(\[model\])/ig,model));
        });
    }
};
