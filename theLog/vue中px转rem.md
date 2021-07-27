vue中px转rem

amfe-flexible

- 根据网页宽度自动更改html字体大小
- yarn add amfe-flex
- npm i amfe-flexible -S
- main.js中引入 import "amfe-flexible"

postcss

- 下载 yarn add postcss postcss-pxtorem@5.1.1 -D
- 自动将px转换为rem
- 根目录下创建postcss.config.js文件

```
module.exports = {
	plugins: {
		'postcss-pxtorem': {
			rootValue: 37.5,
			propList: ['*']
		}
	}
}
```