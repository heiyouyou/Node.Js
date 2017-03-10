var express = require('express');
var router = express.Router();
// 载入可以截取含有html标签内容组件模块
var trimHtml = require('trim-html');
// 载入工具方法模块
var util = require('../utils/util');
//引入nContents表(集合)对象模块
var nContents = require("../dao/content");

// 定义默认分页的参数
var pageParams = {
  pageNo:0,//默认取第一页的第一条数据
  pageSize:3//每页3条数据
}
/* GET home page. */
router.get('/', function(req, res, next) {
  // session设置
  // req.session.user = JSON.stringify({username:"wzy",age:22});

  // 查询数据库的已经发布而且是未删除的数据
  var queryContents = nContents.find({status:1,isdelete:0},function(err,result){
    if(!err){
      // count()将过滤出来的数据进行总数统计,注意：使用queryContents对象调用count统计出来的是当前分页的数据总数
      // 而使用表对象nContents调用count统计出来的是已经发布而且是未删除的总数
      nContents.count({status:1,isdelete:0},function(err,count){
        var newDataArr = result.map(function(doc,index,docArr){
          // 后端对数据进一步的处理
          var data = {
            // trimHtml(html,options)返回值为一个对象,注意html必须属于字符串类型的值,limit:限制显示的内容字符数，suffix:可以控制追加显示的内容
            // content:trimHtml(doc.content,{limit:300,suffix:'wzy'}).html,//对内容展示进行截取
            // content:trimHtml(doc.content,{limit:300}).html,//对内容展示进行截取
            // title:doc.getTitle()
            // 或者
            // title:nContents.findTitle(doc.title)
          };
          // 返回混合后的数据
          return util.mix(doc,data);
        });
        // result和totalCount属于同级别的作用域字段，在视图页面拿值要注意../的使用
        res.render('index', {result:newDataArr,totalCount:count});
      });

      // 或者
      // nContents.count({status:1,isdelete:0}).count(function(err,count){
      //   var newDataArr = result.map(function(doc,index,docArr){
      //     // 后端对数据进一步的处理
      //     var data = {
      //       // trimHtml(html,options)返回值为一个对象,注意html必须属于字符串类型的值,limit:限制显示的内容字符数，suffix:可以控制追加显示的内容
      //       // content:trimHtml(doc.content,{limit:300,suffix:'wzy'}).html,//对内容展示进行截取
      //       // content:trimHtml(doc.content,{limit:300}).html,//对内容展示进行截取
      //       title:doc.getTitle()
      //       // 或者
      //       // title:nContents.findTitle(doc.title)
      //     };
      //     return util.mix(doc,data);
      //   });
      //   res.render('index', {result:newDataArr,totalCount:count});
      // });
    }
  }).sort({ctime:'desc'}).skip(0).limit(2);//按时间字段降序，并且每次请求（分页）两条数据输出数据
});

// 搜索查询业务
router.post('/search',function(req,res,next){
  // 获取ajax请求的分页参数，没有则使用默认值，注意通过req对象获取的数字属于字符串类型的
  pageParams.pageNo = req.body.pageNo*1 || 0;
  pageParams.pageSize = req.body.pageSize*1 || 3;//默认值数据量为3
  var cid = req.body.type*1 || 0;//默认值为0，表示不分类查询所有
  // 获取模糊查询的参数
  var keyword = req.body.keyword;
  console.log(keyword);
  // 查询条件（and查询），首先判断是否有分类参数传递，没有就查询所有
  var params = cid?{isdelete:0,status:1,cid:cid}:{isdelete:0,status:1};
  // and查询与模糊查询的结合
  // var params = cid?{isdelete:0,status:1,cid:cid,title:{$regex:keyword,$options:"i"}}:{isdelete:0,status:1,title:{$regex:keyword,$options:"i"}};
  
  // 检查是否有关键字的查询
  if(keyword){
    // or查询与模糊查询的结合
    // 模糊查询的条件，mongodb是采用正则表达式的形式进行模糊查询操作的
    var likeArr =[
      {title:{$regex:keyword,$options:"i"}},//标题模糊查询，忽略大小写
      {content:{$regex:keyword,$options:"i"}}//内容模糊查询，忽略大小写
    ];
    // or查询使用的是数组格式的对象字段
    params["$or"] = likeArr;
  };
  // 查询所有符合条件的数据
  nContents.find(params,function(err,result){
    if(!err){
      // 符合条件的数据总数统计
      nContents.count(params,function(err,count){
        console.log("总数为"+count);
        if(!err){
          // 1.通过返回数据的形式，前端就通过字符串模板进行拼接
          // res.send({result:result,totalCount:count});

          // 2.通过页面跳转的形式，将数据进行渲染后，直接获取该页面的html代码，前端ajax直接获取数据插入指定区域,不需要拼接字符串模板
          res.render("partials/contentTemplate",{result:result,totalCount:count,layout:null});
        }
      });
    };
  })
  .sort({ctime:"desc"})
  .skip(pageParams.pageNo)//注意：分页参数属于Number类型
  .limit(pageParams.pageSize);
});

// 添加内容页
router.get('/add',function(req,res,next){
  res.render('add');
});

// 内容添加保存的数据请求地址
router.post('/save/new',function(req,res,next){
  // 数据添加
  new nContents(req.body).save(function(err,result){
    err?res.json({code:500,message:"添加失败"}):res.json({code:200,message:"添加成功"});
  });
});

// 内容详情页
router.get('/pages/:id',function(req,res,next){
  nContents.findOne({_id:req.params.id},function(err,result){
    if(!err)res.render('pages',result);
  })
});

// 内容编辑页
router.get('/edit/:id',function(req,res,next){
  nContents.findOne({_id:req.params.id},function(err,result){
    if(!err)res.render('edit',result);
  })
});

// 内容更新数据的请求地址
router.post('/update/:id',function(req,res,next){
  // 数据更新操作
  // nContents.update({_id:req.params.id},req.body,function(err,result){
    // 使用{$set:updateParams}可以有助于防止使用{name'jason borne'}意外覆盖您的文档。
  nContents.findOneAndUpdate({_id:req.params.id},{$set:req.body},function(err,result){
    err?res.json({code:400,message:"修改失败"}):res.json({code:200,message:"修改成功"});
  });
});

//内容删除业务
router.get('/delete/:id',function(req,res,next){
  nContents.remove({_id:req.params.id},function(err,data){
    console.log(data);
    if(err) return handleError(err);
    res.send({code:200,msg:"删除成功！"});
  });
});

module.exports = router;
