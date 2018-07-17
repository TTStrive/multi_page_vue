'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')


exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

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
// *************************************************结束
