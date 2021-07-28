新建 .env.development和 .env.production

开发模式下，vue中的代理，跨域

`pathRewrite下，^/dev-api 的值，必须等于VUE_APP_BASE_API。注：^ 表示已某某开头`

```
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, 
  timeout: 60000, // request timeout
  withCredentials: true, // 携带cookie
  crossDoMain: true // 跨域
})
```

```
module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/dev-api': {
        // target: 'http://118.25.139.110:8088/', // target host
        target: 'http://api.thdtek.com', // target host
        // target: 'http://192.168.1.211:8080/', // target host
        ws: true, // proxy websockets
        changeOrigin: true, // needed for virtual hosted sites
        pathRewrite: {
          '^/dev-api': '' // rewrite path //---------------------->重写的路径值
        }
      }
    }
  },
 
}
```