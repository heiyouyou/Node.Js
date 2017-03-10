# MyBlogs:
This is my project of NodeJs+Express+Mongodb+handlebars...<br>
这是我用Node.Js+Express+Mongodb+handlebars进行开发的一个简易博客项目，虽然有点简陋，但是基本的增删查改、分页查询、模糊查询、聚合查询、滚动分页等功能都具有了，这是我的第一个Node.Js项目，希望以后能够做的越来越好......

# Notice:
## 一、这里我简易说明项目里的一些文件与文件夹的结构：
1、项目的core文件夹存放的都是一些项目用到的核心工具类文件，有加密工具(encrypt.js)、mongodb数据库连接工具(connection.js)、项目用到的自定义标签方法(tag.js)。<br>
2、dao文件夹则是存放相关数据库集合(表)的配置文件。<br>
3、utils文件夹则是各种常用工具类文件，但项目只用到了utils.js。<br>
4、剩下的文件夹想必熟悉Expresss4.x的人，这些文件目录应该知道了，这里就不详细叙述了...
## 二、项目的启动前提：
1、Nodej.js环境、mongodb数据库的服务环境<br>
2、需要在本地全局安装supervisor模块用来实时监听该项目下文件的改动：npm install -g supervisor，安装好后，cmd窗口在该项目路径下直接运行npm start，就可以启动项目了。
