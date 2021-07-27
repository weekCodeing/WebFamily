axios基本用法

1. 下载 axios

yarn add axios -S
npm i axios -S

2. 封装请求工具

src文件下创建 utils / request.js

```
import axios from 'axios'
const request = axios.create({
	baseURL: '接口统一的前缀地址'
})
export default ({ method = 'GET', url, params, data, headers }) => {
	return request({ method, url, params, data, headers })
}
```

以后换库, 只需要改这里, 逻辑页面不用动, 保证代码的复用性和独立性(高内聚低耦合)

封装接口工具

src文件下创建 api / 各种接口函数文件

```
import $http from '@/utils/request.js'
const customFn = ( data, params, headers ) => {
	// 形参按需传入
	return $http({
		method: 'GET',
		url: '',
		data,params,headers,//按需接收
	})
}
export { customFn } // 按需导出
```

项目应用

按需导入接口函数文件
调用函数发送请求

```
import { customFn } from '@/api/接口函数文件'
async function Fn( data, params, headers ) {
	// 形参按需传入
	try {
		const { data: res } = await customFn ( data, params, headers ) // 按需接收
		console.log(res)
	} catch(error) {
		console.log(error)
	}
}
```

> async 和await 只能接收成功状态的返回值，需配合try - catch接收失败状态的返回值

axios拦截器

请求拦截器

```
axios.interceptors.request.use(function (config)) {
	return config // 发送请求时的数据
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error)
})
```

响应拦截器

```
axios.interceptors.response.use(function (response)) {
	// 对响应数据做点什么
	return response
}, function (error) {
	return Promise.reject(error)
})
```

移除拦截器

```
const myInterceptors = axios.interceptors.response.use(...)
axios.interceptors.response.eject(myInterceptors)
```
