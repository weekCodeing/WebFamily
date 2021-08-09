const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: "development",
	entry: __dirname + "/index.js",
	output: {
		filename: "[name].boundle.js",
		path: __dirname + "/build"
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'DevOps Monitor',
			template: 'index.html',
			templateParameters: {
				param1: 'tony stark',
				param2: 'bruce banner'
			},
			minify: {
				removeComments: true, // 移除注解
				collapseWhitespace: true, // 压缩document中空白的文本节点
				collapseInlineTagWhitespace: true, // 压缩行级元素的空白，会保留&nbsp;实体空格
			}
		})
	]
}

index.html

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF8">
	<title>document</title>
</head>
<body>
	<div>
	<!-- 这里有一行注解 -->
		<p><%= param1 %>   </p>
		<p><%= param2 %>&nbsp;</p>
	</div>
</body>
</html>

打包后生成的index.html:

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>document</title>
</head>
<body>
	<div>
		<p>tony stark</p>
		<p>bruce banner </p>
	</div>
	<script type="text/javascript" src="main.boundle.js"></script>
</body>
</html>

多页面

index.html -> indexController.js -> underscor.js eventbus.js

about.html -> aboutController.js -> eventbus.js

list.html -> listController.js

entry:{
    "main":__dirname + "/src/indexController.js",
    "about":__dirname + "/src/aboutController.js",
    "list":__dirname + "/src/listController.js",
},

html文件则需要分别引用对应的入口文件并生成对应的访问入口：

plugins:[
	//index.html
	new HtmlWebpackPlugin({
		title:'MainPage',
		template:'src/index.html',
		filename:'index.html',
		templateParameters:{
			param1:'tony stark',
			param2:'bruce banner'
		},
		chunks:['main'],
   }),
	//about.html
	new HtmlWebpackPlugin({
		title:'AboutPage',
		template:'src/about.html',
		filename:'about.html',
		templateParameters:{
			param1:'tony stark',
			param2:'bruce banner'
		},
		chunks:['about'],
   }),
   //list.html
   new HtmlWebpackPlugin({
		title:'ListPage',
		template:'src/list.html',
		filename:'list.html',
		templateParameters:{
			param1:'tony stark',
			param2:'bruce banner'
		},
		chunks:['list'],
   }),
],

使用SCSS作为预编译语言，其他预处理语言配置方式基本一致：

const HtmlWebpackPlugin = require('html-webpack-plugin');//用于自动生成html入口文件的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//将CSS代码提取为独立文件的插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");//CSS模块资源优化插件

module.exports = {
  mode:'development',
  entry:'./main.js',
  output:{
    filename:'main.bundle.js',
    path:__dirname + '/build'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/, //排除node_modules文件夹
        use: [{
             loader: MiniCssExtractPlugin.loader//建议生产环境采用此方式解耦CSS文件与js文件
          },{
            loader: 'css-loader',//CSS加载器
            options: {importLoaders: 2}//指定css-loader处理前最多可以经过的loader个数     
          },{
            loader: 'postcss-loader',//承载autoprefixer功能
          },{
            loader: 'sass-loader'//SCSS加载器，webpack默认使用node-sass进行编译
          }
        ]
      }
    ]
  },
  plugins:[
      new HtmlWebpackPlugin(),//生成入口html文件
      new MiniCssExtractPlugin({
        filename: "[name].css"
      })//为抽取出的独立的CSS文件设置配置参数
  ],
  optimization:{
    //对生成的CSS文件进行代码压缩 mode='production'时生效
    minimizer:[
       new OptimizeCssAssetsPlugin()
    ]
  }
}

postcss.config.js的配置较为简单：

module.exports = {
    plugins:[
        require('autoprefixer')
    ]
}

package.json中增加新的参数指定打包需要支持的浏览器类别：

"browerslist": [
	"last 2 versions",
	"IE 8",
	"UCAndroid"
]

SCSS代码:

//变量定义
$grey: #1e1e1d;
$yellow: #ffad15;
$offwhite: #f8f8f8;
$darkerwhite: darken($offwhite, 15);//SCSS函数
$baseFontSize:14px;

//循环
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}

//mixin
@mixin px2rem($name, $px){
  #{$name}: $px / $baseFontSize * 1rem;
}

//嵌套
.class3{
    font-weight: bold;
    display:flex;
    &-small{
        color: $offwhite;
        @include px2rem('font-size',14px);
    }
}

//autoprefixer
::placeholder{
    width:10px;
}

在webpack.config.js中添加对图片文件的处理规则:

{
	test:/\.(jpg|png|svg|gif)/,
	use:[{
	  loader:'file-loader',
	  options:{
		outputPath:'imgs/'
	  }
	}]
}

执行打包命令可以看到png图片资源的名称被替换为hash并输出至构建文件夹。

CSS文件中对图片的引用也被替换为修改后的hash名称：

.with-img {
	background-image: url(imgs/23r3tlfjsflsjf.png);
}

html文件中静态资源引用替换需要通过html-loader。

在webpack.config.js中添加url-loader相关配置:

{
	test:/\.(jpg|png|svg|gif)/,
	use:[{
	  loader:'url-loader',
	  options:{
		limit:8129,//小于limit限制的图片将转为base64嵌入引用位置
		fallback:'file-loader',//大于limit限制的将转交给指定的loader处理
		outputPath:'imgs/'//options会直接传给fallback指定的loader
	  }
	}]
},
  
原始CSS文件中对资源的引用:

.with-img{
    background-image: url('../imgs/pic1.png');
}
.with-small-img{
    background-image: url('../imgs/6k.gif');
}

打包后变为如下形式，可以看到小于8k的资源被直接内嵌进了CSS文件而没有
生成独立的资源文件：

.with-img {
	background-image: url(imgs/wfjsl34536334.png)
}

也可以根据实际需求选择svg-url-loader,image-webpack-loader等其他插件。

位图资源，可以使用webpack-spritesmith插件进行处理，在webpack.config.js的plugins配置项中实例化插件并传入配置信息：

new SpritesmithPlugin({
	//设置源icons,即icon的路径，必选项
	src: {
	  cwd: __dirname + '/imgs/pngs',
	  glob: '*.png' //正则匹配，照着填即可
	},
	//设置导出的sprite图及对应的样式文件，必选项
	target: {
	  image: __dirname + '/build/imgs/sprite.png',
	  css: __dirname + '/build/imgs/sprite.css' 
	},
	//设置sprite.png的引用格式，会自己加入sprite.css的头部
	apiOptions: {
	  cssImageRef: './sprite.png' //cssImageRef为必选项
	},
	//配置spritesmith选项，非必选
	spritesmithOptions: {
	  algorithm: 'top-down',//设置图标的排列方式
	  padding: 4 //每张小图的补白,避免雪碧图中边界部分的bug
	}
})
  
运行webpack后可以得到sprites.css和合成的雪碧图

源代码中的引用:

.class1{
    background-image: url('../imgs/svgs/001-home.svg') no-repeat 0 0;
}

使用inline-svg-loader加载器打包后的引用：

.class1{
    background-image: url("<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 16 16\"><path fill=\"#000000\" d=\"M16 9.226l-8-6.21-8 6.21v-2.532l8-6.21 8 6.21zM14 9v6h-4v-4h-4v4h-4v-6l6-4.5z\"></path></svg>") no-repeat 0 0;
}

webpack.config.js:

...  
module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
             loader: 'babel-loader'
          }
        ]
      }
    ]
  },
 ...
 
.babelrc:

{
    "presets":[
        ["env",{
            "targets":{
                "browsers":"last 2 versions"
            }
        }
        ]],
    "plugins": [
         "babel-plugin-transform-runtime" 
    ]
},

webpack的输出的文件中可以看到如下的部分：

/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

splitChunks中默认的代码自动分割要求是下面这样的：

node_modules中的模块或其他被重复引用的模块

就是说如果引用的模块来自node_modules,那么只要它被引用，那么满足其他条件时就可以进行自动分割。否则该模块需要被重复引用才继续判断其他条件。
（对应的就是下文配置选项中的minChunks为1或2的场景）

分离前模块最小体积下限（默认30k，可修改）

30k是官方给出的默认数值，它是可以修改的，上一节中已经讲过，每一次分包对应的都是服务端的性能开销的增加，所以必须要考虑分包的性价比。

对于异步模块，生成的公共模块文件不能超出5个（可修改）

触发了懒加载模块的下载时，并发请求不能超过5个，对于稍微了解过服务端技术的开发者来说，【高并发】和【压力测试】这样的关键词应该不会陌生。

对于入口模块，抽离出的公共模块文件不能超出3个（可修改）

也就是说一个入口文件的最大并行请求默认不得超过3个，原因同上。

module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',//默认只作用于异步模块，为`all`时对所有模块生效,`initial`对同步模块有效
      minSize: 30000,//合并前模块文件的体积
      minChunks: 1,//最少被引用次数
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',//自动命名连接符
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minChunks:1,//敲黑板
          priority: -10//优先级更高
        },
        default: {
          test: /[\\/]src[\\/]js[\\/]/
          minChunks: 2,//一般为非第三方公共模块
          priority: -20,
          reuseExistingChunk: true
        }
      },
      runtimeChunk:{
          name:'manifest'
      }
    }
  }

webpack打包后输出文件的基本结构是下面这个样子的：

(function(modules) { // webpackBootstrap
    // 模块缓存对象
    var installedModules = {};

    // webpack内部的模块引用函数
    function __webpack_require__(moduleId) {

        // 加载入口JS

        // 输出
        return module.exports;
    }

    // 挂载模块数组
    __webpack_require__.m = modules;
    // ...
    // 在__webpack_require__挂载多个属性

    // 传入入口JS模块ID执行函数并输出模块
    return __webpack_require__(__webpack_require__.s = 0);
});
// 包含所有模块的数组
([
    /* id为0 */
    (function(module, exports) {
        console.log('1')
    })
]);
简化以后实际上就是一个自执行函数:

(function(modules){
    return __webpack_require__(0);
}([Module0,Module1...]))

可以看到__webpack_reqruie__( )这个方法的参数就是模块的唯一ID标识，返回值就是module.exports，所以webpack对于CommonJs规范是原生支持的。


先使用import命令加载一个CommonJs规范导出的模块，查看打包后的代码可以看到模块引用的部分被转换成了下面这样：

__webpack_require__.r(__webpack_exports__);
/* harmony import */ 
var _components_component10k_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./components/component10k.js");
/* harmony import */
var _components_component10k_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_components_component10k_js__WEBPACK_IMPORTED_MODULE_0__);
简化一下再来看：

__webpack_require__.r(__webpack_exports__);
var a = __webpack_require__("./components/component10k.js");
var b = __webpack_require__.n(a);

