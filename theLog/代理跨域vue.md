找到vue项目的config中的index.js文件

```
proxy: {
      '/api': {
        target: 'http://10.1.1.227:9007/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
```

```
module.exports = {
	dev: {
		proxyTable: {
			'/api': {
				target: 'http://192.168.111.101:8080',
				changeOrign: true,
				pathRewrite: {
					'^/api': ''
				}
			},
		}
	}
}
```


```
// 代理跨域请求 //xxxx是指文件接收的接口
proxy: {
	"/xxxx": {
		// target: "http://localhost:8080/api",
		target: "http://127.0.0.1:2273/",
		changeOrigin: true,
		secure: false,
		pathRewrite: {
			// "^/api": "./"
			"^/xxxx": "/xxxx"
		}
	}
}

const debug = process.env.NODE_ENV !== "production";
 
module.exports = {
    configureWebpack: (config) => {
        if (debug) {
            config.devtool = "source-map";
        }
    },
    publicPath: "/dist",
    lintOnSave: false,
    productionSourceMap: debug,
    runtimeCompiler: true,
    devServer: {
        // 默认会自动打开浏览器
        open: false,
        https: false,
        port: 8090, // 端口
        // 错误、警告在页面弹出
        overlay: {
            // warnings: true,
            errors: true
        },
        // 代理跨域请求
        proxy: {
            "/xxxx": {
                // target: "http://localhost:8080/api",
                target: "http://127.0.0.1:2273/",
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    // "^/api": "./"
                    "^/xxxx": "/xxxx"
                }
            }
        }
       
 
    },
}
```