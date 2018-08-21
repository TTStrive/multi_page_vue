# monitor

> 配置vue多页面应用

# 文件结构

├── README.md <br />
├── build <br />
│   ├── build.js<br />
│   ├── check-versions.js<br />
│   ├── dev-client.js<br />
│   ├── dev-server.js<br />
│   ├── utils.js<br />
│   ├── vue-loader.conf.js<br />
│   ├── webpack.base.conf.js<br />
│   ├── webpack.dev.conf.js<br />
│   └── webpack.prod.conf.js<br />
├── config<br />
│   ├── dev.env.js<br />
│   ├── index.js<br />
│   └── prod.env.js<br />
├── package.json<br />
├── src<br />
│   ├── assets<br />
│   │   └── logo.png<br />
│   ├── components<br />
│   │   ├── Hello.vue<br />
│   │   └── cell.vue<br />
│   └── pages<br />
│       ├── file<br />
│       │   ├── file.html<br />
│       │   ├── file.js<br />
│       │   └── file.vue<br />
│       └── index<br />
│           ├── index.html<br />
│           ├── index.js<br />
│           ├── index.vue<br />
│           └── router<br />
│               └── index.js<br />
└── static<br />

#主要修改的是四个文件

├── build<br />
│   ├── utils.js<br />
│   ├── webpack.base.conf.js<br />
│   ├── webpack.dev.conf.js<br />
│   └── webpack.prod.conf.js<br />

# 修改utils.js

再utils.js中添加

// ****************开始***********************<br />
// glob 安装依赖<br />
const glob = require('glob');<br />
// 页面模板<br />
const HtmlWbpackPuilugin = require('html-webpack-plugin');<br />
// 取得响应的页面路径<br />
const PAGE_PATH = path.resolve(__dirname,"../src/pages");<br />
// 用户响应的merge处理(合并)<br />
const merge = require('webpack-merge');<br />

//通过glob模块读取pages文件夹下的所有对应文件下的js后缀文件,如果存在那么就作为入口<br />
exports.entries = ()=>{<br />
  // 获取所有后缀为js的<br />
  var entryFiles = glob.sync(PAGE_PATH+"/*/*.js");<br />
  var map = {};<br />
  entryFiles.forEach((filePath)=>{<br />
    // 截取js名字   从最后一个 / 到 . 之间<br />
    var filename = filePath.substring(filePath.lastIndexOf('\/')+1,filePath.lastIndexOf('.'));<br />
    map[filename] = filePath;<br />
    })<br />
    return map;<br />
}<br />

// 多页面输出<br />
// 与上面多页面入口配置相同，读取pages文件下相对应的html文件<br />
exports.htmlPlugin = ()=>{<br />
  var entryHtml = glob.sync(PAGE_PATH+"/*/*.html");<br />
  var arr = [];<br />
  entryHtml.forEach((filePath)=>{<br />
    var filename = filePath.substring(filePath.lastIndexOf('\/')+1,filePath.lastIndexOf('.'));<br />
    var conf = {<br />
      // 模板来源<br />
      template:filePath,<br />
      // 文件名<br />
      filename:filename+".html",<br />
      // 页面需要加对应的js脚本<br />
      chunks:['manifest','vendor',filename],<br />
      // 注入<br />
      inject:true<br />
    }<br />
    if(process.env.NODE_ENV === 'production'){<br />
      conf = marge(conf,{<br />
        minif:{<br />
          removeComments:true,<br />
          collapseWhitespace:true,<br />
          removeAttributeQuotes:true<br />
        },<br />
        chunksSortMode:'dependency'<br />
      })<br />
    }<br />
    arr.push(new HtmlWbpackPuilugin(conf))<br />
  })<br />
  return arr;<br />
}<br />
// ************************结束*************************<br />

# 修改 webpack.base.conf.js<br />
'use strict'<br />
const path = require('path')<br />
const utils = require('./utils')<br />
const config = require('../config')<br />
const vueLoaderConfig = require('./vue-loader.conf')<br />

//*************************添加 *******************<br />
// 获取路径<br />
const entries = utils.entries();<br />

function resolve (dir) {<br />
  return path.join(__dirname, '..', dir)<br />
}<br />
//*************************结束 *******************<br />
module.exports = {<br />
  context: path.resolve(__dirname, '../'),<br />
  entry: entries,<br />
  output: {<br />
    path: config.build.assetsRoot,<br />
    filename: '[name].js',<br />
    publicPath: process.env.NODE_ENV === 'production'<br />
      ? config.build.assetsPublicPath<br />
      : config.dev.assetsPublicPath<br />
  },<br />
  resolve: {<br />
    extensions: ['.js', '.vue', '.json'],<br />
    alias: {<br />
      'vue$': 'vue/dist/vue.esm.js',<br />
//*************************修改 *******************<br />
      '@': resolve('src'),<br />
      'pages':resolve('src/pages'),<br />
      'components':resolve('src/components')<br />
//*************************结束 *******************<br />
    }<br />
  }<br />
}<br />
# 修改 webpack.dev.conf.js
<br />
plugins: [<br />
    new webpack.DefinePlugin({<br />
      'process.env': require('../config/dev.env')<br />
    }),<br />
    new webpack.HotModuleReplacementPlugin(),<br />
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.<br />
    new webpack.NoEmitOnErrorsPlugin(),<br />
//*************************注释**********************<br />
    // https://github.com/ampedandwired/html-webpack-plugin<br />
    // new HtmlWebpackPlugin({<br />
    //   filename: 'index.html',<br />
    //   template: 'index.html',<br />
    //   inject: true<br />
    // }),<br />
    // copy custom static assets<br />
//************************结束**********************<br />
    new CopyWebpackPlugin([<br />
      {<br />
        from: path.resolve(__dirname, '../static'),<br />
        to: config.dev.assetsSubDirectory,<br />
        ignore: ['.*']<br />
      }<br />
    ])<br />
//**********************添加*************************<br />
  ].concat(utils.htmlPlugin())<br />
  
  # 修改 webpack.prod.conf.js<br />
  <br />
  plugins: [<br />
  //*************************注释**********************<br />
    // generate dist index.html with correct asset hash for caching.<br />
    // you can customize output by editing /index.html<br />
    // see https://github.com/ampedandwired/html-webpack-plugin<br />
注释<br />
    // new HtmlWebpackPlugin({	<br />
    //   filename: config.build.index,<br />
    //   template: 'index.html',<br />
    //   inject: true,<br />
    //   minify: {<br />
    //     removeComments: true,<br />
    //     collapseWhitespace: true,<br />
    //     removeAttributeQuotes: true<br />
    //     // more options:<br />
    //     // https://github.com/kangax/html-minifier#options-quick-reference<br />
    //   },<br />
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin<br />
    //   chunksSortMode: 'dependency'<br />
    // }),<br />
    // keep module.id stable when vendor modules does not change<br />
//************************结束**********************<br />
    new webpack.HashedModuleIdsPlugin(),<br />
    // enable scope hoisting<br />
    new webpack.optimize.ModuleConcatenationPlugin(),<br />
//**********************添加*************************<br />
    ].concat(utils.htmlPlugin())<br />
    
# 特别注意

file.js<br />

在这个文件里，按照写法，应该是这样的吧：<br />

import Vue from 'Vue'<br />
import file from './file.vue'<br />
<br />
new Vue({<br />
    el:'#app'，// 这里参考cell.html和cell.vue的根节点id，保持三者一致<br />
    teleplate：'<file/>',<br />
    components:{ file}<br />
})<br />

修改成：<br />
<br />
import Vue from 'Vue'<br />
import file from './file.vue'<br />

/* eslint-disable no-new */<br />
new Vue({<br />
  el: '#app',<br />
  render: h => h(file)<br />
})<br />

# 页面跳转
最开始写的是：<br />

 <!-- index.html --><br />
<a href='../file/file.html'></a><br />

改成这样既可：<br />

 <!-- index.html --><br />
<a href='cell.html'></a><br />

这样他就会自己找file.html这个文件。<br />
