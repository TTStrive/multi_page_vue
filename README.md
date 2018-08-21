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
│       │   ├── file.js
│       │   └── file.vue
│       └── index
│           ├── index.html
│           ├── index.js
│           ├── index.vue
│           └── router
│               └── index.js
└── static

#主要修改的是四个文件

├── build
│   ├── utils.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js

# 修改utils.js

再utils.js中添加

// ****************开始***********************
// glob 安装依赖
const glob = require('glob');
// 页面模板
const HtmlWbpackPuilugin = require('html-webpack-plugin');
// 取得响应的页面路径
const PAGE_PATH = path.resolve(__dirname,"../src/pages");
// 用户响应的merge处理(合并)
const merge = require('webpack-merge');

//通过glob模块读取pages文件夹下的所有对应文件下的js后缀文件,如果存在那么就作为入口
exports.entries = ()=>{
  // 获取所有后缀为js的
  var entryFiles = glob.sync(PAGE_PATH+"/*/*.js");
  var map = {};
  entryFiles.forEach((filePath)=>{
    // 截取js名字   从最后一个 / 到 . 之间
    var filename = filePath.substring(filePath.lastIndexOf('\/')+1,filePath.lastIndexOf('.'));
    map[filename] = filePath;
    })
    return map;
}

// 多页面输出
// 与上面多页面入口配置相同，读取pages文件下相对应的html文件
exports.htmlPlugin = ()=>{
  var entryHtml = glob.sync(PAGE_PATH+"/*/*.html");
  var arr = [];
  entryHtml.forEach((filePath)=>{
    var filename = filePath.substring(filePath.lastIndexOf('\/')+1,filePath.lastIndexOf('.'));
    var conf = {
      // 模板来源
      template:filePath,
      // 文件名
      filename:filename+".html",
      // 页面需要加对应的js脚本
      chunks:['manifest','vendor',filename],
      // 注入
      inject:true
    }
    if(process.env.NODE_ENV === 'production'){
      conf = marge(conf,{
        minif:{
          removeComments:true,
          collapseWhitespace:true,
          removeAttributeQuotes:true
        },
        chunksSortMode:'dependency'
      })
    }
    arr.push(new HtmlWbpackPuilugin(conf))
  })
  return arr;
}
// ************************结束*************************

# 修改 webpack.base.conf.js
'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

//*************************添加 *******************
// 获取路径
const entries = utils.entries();

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
//*************************结束 *******************
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
//*************************修改 *******************
      '@': resolve('src'),
      'pages':resolve('src/pages'),
      'components':resolve('src/components')
//*************************结束 *******************
    }
  }
}
# 修改 webpack.dev.conf.js

plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
//*************************注释**********************
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    // copy custom static assets
//************************结束**********************
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
//**********************添加*************************
  ].concat(utils.htmlPlugin())
  
  # 修改 webpack.prod.conf.js
  
  plugins: [
  //*************************注释**********************
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
注释
    // new HtmlWebpackPlugin({	
    //   filename: config.build.index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency'
    // }),
    // keep module.id stable when vendor modules does not change
//************************结束**********************
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
//**********************添加*************************
    ].concat(utils.htmlPlugin())
    
# 特别注意

file.js

在这个文件里，按照写法，应该是这样的吧：

import Vue from 'Vue'
import file from './file.vue'

new Vue({
    el:'#app'，// 这里参考cell.html和cell.vue的根节点id，保持三者一致
    teleplate：'<file/>',
    components:{ file}
})

修改成：

import Vue from 'Vue'
import file from './file.vue'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(file)
})

# 页面跳转
最开始写的是：

 <!-- index.html -->
<a href='../file/file.html'></a>

改成这样既可：

 <!-- index.html -->
<a href='cell.html'></a>

这样他就会自己找file.html这个文件。
