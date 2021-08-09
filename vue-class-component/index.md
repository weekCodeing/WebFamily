Vue 类组件是一个库，可让您以类样式语法制作 Vue 组件。

用于类样式 Vue 组件的 ECMAScript / TypeScript 装饰器。

```
<template>
  <div>
    <button v-on:click="decrement">-</button>
    {{ count }}
    <button v-on:click="increment">+</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

// Define the component in class-style
@Component
export default class Counter extends Vue {
  // Class properties will be component data
  count = 0

  // Methods will be component methods
  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}
</script>
```

Vue 属性装饰器提供的@Prop和@Watch装饰器

运行以下命令创建一个新项目：
```
$ vue create hello-world
```
系统会询问您是否使用预设。选择“手动选择功能”：
```
Manually select features
```
检查 TypeScript 功能以使用 Vue 类组件。

您可以使用npm命令安装 Vue 类组件。请确保同时安装 Vue 核心库，因为 Vue 类组件依赖于它：
```
$ npm install --save vue vue-class-component
```
yarn如果您愿意，可以使用命令：
```
$ yarn add --save vue vue-class-component
```
tsconfig.json在您的项目根目录上创建并指定experimentalDecorators选项，以便它转换装饰器语法：
```
{
  "compilerOptions": {
    "target": "es5",
    "module": "es2015",
    "moduleResolution": "node",
    "strict": true,
    "experimentalDecorators": true
  }
}
```
安装`@babel/plugin-proposal-decorators和@babel/plugin-proposal-class-properties：`
```
$ npm install --save-dev @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
```
然后.babelrc在您的项目根目录上配置：
```
{
  "plugins": [
    ["@babel/proposal-decorators", { "legacy": true }],
    ["@babel/proposal-class-properties", { "loose": true }]
  ]
}
```
类组件
@Component 装饰器使您的类成为 Vue 组件：
```
import Vue from 'vue'
import Component from 'vue-class-component'

// HelloWorld class will be a Vue component
@Component
export default class HelloWorld extends Vue {}
```
数据
Initialdata可以声明为类属性：
```
<template>
  <div>{{ message }}</div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Declared as component data
  message = 'Hello World!'
}
</script>
```
上面的组件Hello World!在<div>元素中呈现message为组件数据。

请注意，如果初始值为undefined，则类属性将不会响应，这意味着不会检测到属性的更改：
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // `message` will not be reactive value
  message = undefined
}
```
为避免这种情况，您可以使用nullvalue 或使用datahook：
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // `message` will be reactive with `null` value
  message = null

  // See Hooks section for details about `data` hook inside class.
  data() {
    return {
      // `hello` will be reactive as it is declared via `data` hook.
      hello: undefined
    }
  }
}
```
方法
组件methods可以直接声明为类原型方法：
```
<template>
  <button v-on:click="hello">Click</button>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Declared as component method
  hello() {
    console.log('Hello World!')
  }
}
</script>
```
计算属性
计算属性可以声明为类属性 getter/setter：
```
<template>
  <input v-model="name">
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  firstName = 'John'
  lastName = 'Doe'

  // Declared as computed property getter
  get name() {
    return this.firstName + ' ' + this.lastName
  }

  // Declared as computed property setter
  set name(value) {
    const splitted = value.split(' ')
    this.firstName = splitted[0]
    this.lastName = splitted[1] || ''
  }
}
</script>
```
data，render并且所有 Vue 生命周期钩子也可以直接声明为类原型方法，但您不能在实例本身上调用它们。声明自定义方法时，应避免使用这些保留名称。
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Declare mounted lifecycle hook
  mounted() {
    console.log('mounted')
  }

  // Declare render function
  render() {
    return <div>Hello World!</div>
  }
}
```

对于所有其他选项，将它们传递给装饰器函数：
```
<template>
  <OtherComponent />
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import OtherComponent from './OtherComponent.vue'

@Component({
  // Specify `components` option.
  // See Vue.js docs for all available options:
  // https://vuejs.org/v2/api/#Options-Data
  components: {
    OtherComponent
  }
})
export default class HelloWorld extends Vue {}
</script>
```
如果您使用一些 Vue 插件（如Vue Router ），您可能希望类组件解析它们提供的钩子。在这种情况下，Component.registerHooks允许您注册此类挂钩：
```
// class-component-hooks.js
import Component from 'vue-class-component'

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])
```
注册钩子后，类组件将它们实现为类原型方法：
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // The class component now treats beforeRouteEnter,
  // beforeRouteUpdate and beforeRouteLeave as Vue Router hooks
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter')
    next()
  }

  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate')
    next()
  }

  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave')
    next()
  }
}
```
建议将此注册代码编写在单独的文件中，因为您必须在任何组件定义之前注册它们。您可以通过将import钩子注册的语句放在主文件的顶部来确保执行顺序：
```
// main.js

// Make sure to register before importing any components
import './class-component-hooks'

import Vue from 'vue'
import App from './App'

new Vue({
  el: '#app',
  render: h => h(App)
})
```
建议将此注册代码编写在单独的文件中，因为您必须在任何组件定义之前注册它们。您可以通过将import钩子注册的语句放在主文件的顶部来确保执行顺序：
```
// main.js

// Make sure to register before importing any components
import './class-component-hooks'

import Vue from 'vue'
import App from './App'

new Vue({
  el: '#app',
  render: h => h(App)
})
```
自定义装饰器
您可以通过创建自己的装饰器来扩展此库的功能。Vue 类组件提供createDecorator了创建自定义装饰器的助手。createDecorator期望回调函数作为第一个参数，回调将接收以下参数：

- options：Vue 组件选项对象。此对象的更改将影响提供的组件。
- key：应用装饰器的属性或方法键。
- parameterIndex：如果自定义装饰器用于参数，则为装饰参数的索引。
创建Log装饰器的示例，该装饰器在调用装饰方法时打印带有方法名称和传递参数的日志消息：
```
// decorators.js
import { createDecorator } from 'vue-class-component'

// Declare Log decorator.
export const Log = createDecorator((options, key) => {
  // Keep the original method for later.
  const originalMethod = options.methods[key]

  // Wrap the method with the logging logic.
  options.methods[key] = function wrapperMethod(...args) {
    // Print a log.
    console.log(`Invoked: ${key}(`, ...args, ')')

    // Invoke the original method.
    originalMethod.apply(this, args)
  }
})
```
将其用作方法装饰器：
```
import Vue from 'vue'
import Component from 'vue-class-component'
import { Log } from './decorators'

@Component
class MyComp extends Vue {
  // It prints a log when `hello` method is invoked.
  @Log
  hello(value) {
    // ...
  }
}
```
在上面的代码中，当hello用 with 调用方法时42，会打印如下日志：
```
Invoked: hello( 42 )
```
您可以将现有的类组件扩展为本机类继承。假设您有以下超类组件：
```
// super.js
import Vue from 'vue'
import Component from 'vue-class-component'

// Define a super class component
@Component
export default class Super extends Vue {
  superValue = 'Hello'
}
```
您可以使用本机类继承语法来扩展它：
```
import Super from './super'
import Component from 'vue-class-component'

// Extending the Super class component
@Component
export default class HelloWorld extends Super {
  created() {
    console.log(this.superValue) // -> Hello
  }
}
```
请注意，每个超类都必须是类组件。换句话说，它需要继承Vue构造函数作为祖先并被装饰@Component器装饰。

混合

Vue 类组件提供了mixins辅助函数以类样式方式使用mixin。通过使用mixinshelper，TypeScript 可以推断 mixin 类型并在组件类型上继承它们。

声明 mixinHello和 的示例World：
```
// mixins.js
import Vue from 'vue'
import Component from 'vue-class-component'

// You can declare mixins as the same style as components.
@Component
export class Hello extends Vue {
  hello = 'Hello'
}

@Component
export class World extends Vue {
  world = 'World'
}
```
在类样式组件中使用它们：
```
import Component, { mixins } from 'vue-class-component'
import { Hello, World } from './mixins'

// Use `mixins` helper function instead of `Vue`.
// `mixins` can receive any number of arguments.
@Component
export class HelloWorld extends mixins(Hello, World) {
  created () {
    console.log(this.hello + ' ' + this.world + '!') // -> Hello World!
  }
}
```
与超类一样，所有的 mixin 都必须声明为类组件。

this 属性初始值设定项中的值
如果将箭头函数定义为类属性并this在其中访问，它将不起作用。这是因为this在初始化类属性时只是 Vue 实例的代理对象：
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class MyComp extends Vue {
  foo = 123

  // DO NOT do this
  bar = () => {
    // Does not update the expected property.
    // `this` value is not a Vue instance in fact.
    this.foo = 456
  }
}
```
在这种情况下，您可以简单地定义一个方法而不是类属性，因为 Vue 会自动绑定实例：
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class MyComp extends Vue {
  foo = 123

  // DO this
  bar() {
    // Correctly update the expected property.
    this.foo = 456
  }
}
```
始终使用生命周期钩子而不是 constructor
由于调用原始构造函数来收集初​​始组件数据，建议不要自行声明constructor：
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Posts extends Vue {
  posts = []

  // DO NOT do this
  constructor() {
    fetch('/posts.json')
      .then(res => res.json())
      .then(posts => {
        this.posts = posts
      })
  }
}
```
上面的代码打算在组件初始化时获取 post 列表，但由于 Vue 类组件的工作方式，该获取将被意外调用两次。

建议编写生命周期钩子，例如created而不是constructor：
```
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Posts extends Vue {
  posts = []

  // DO this
  created() {
    fetch('/posts.json')
      .then(res => res.json())
      .then(posts => {
        this.posts = posts
      })
  }
}
```
Vue 类组件没有为 props 定义提供专门的 API。但是，您可以使用规范Vue.extendAPI来做到这一点：
```
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// Define the props by using Vue's canonical way.
const GreetingProps = Vue.extend({
  props: {
    name: String
  }
})

// Use defined props by extending GreetingProps.
@Component
export default class Greeting extends GreetingProps {
  get message(): string {
    // this.name will be typed
    return 'Hello, ' + this.name
  }
}
</script>
```
由于Vue.extend推断定义的 prop 类型，可以通过扩展在类组件中使用它们。

如果你有一个超类组件或 mixins 来扩展，使用mixinshelper 将定义的 props 与它们组合起来：
```
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component, { mixins } from 'vue-class-component'
import Super from './super'

// Define the props by using Vue's canonical way.
const GreetingProps = Vue.extend({
  props: {
    name: String
  }
})

// Use `mixins` helper to combine defined props and a mixin.
@Component
export default class Greeting extends mixins(GreetingProps, Super) {
  get message(): string {
    // this.name will be typed
    return 'Hello, ' + this.name
  }
}
</script>
```

> 属性类型声明
有时，您必须在类组件之外定义组件属性和方法。例如，Vuex，正式状态管理库的Vue，提供mapGetters和mapActions助手到商店映射到组件的属性和方法。这些助手需要在组件选项对象中使用。

即使在这种情况下，您也可以将组件选项传递给@Component装饰器的参数。但是，当它们在运行时工作时，它不会自动声明类型级别的属性和方法。

您需要在类组件中手动声明它们的类型：
```
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters, mapActions } from 'vuex'

// Interface of post
import { Post } from './post'

@Component({
  computed: mapGetters([
    'posts'
  ]),

  methods: mapActions([
    'fetchPosts'
  ])
})
export default class Posts extends Vue {
  // Declare mapped getters and actions on type level.
  // You may need to add `!` after the property name
  // to avoid compilation error (definite assignment assertion).

  // Type the mapped posts getter.
  posts!: Post[]

  // Type the mapped fetchPosts action.
  fetchPosts!: () => Promise<void>

  mounted() {
    // Use the mapped getter and action.
    this.fetchPosts().then(() => {
      console.log(this.posts)
    })
  }
}
```

> $refs 类型扩展

$refs组件的类型被声明为最广泛的类型来处理所有可能的引用类型。虽然理论上是正确的，但在大多数情况下，每个 ref 在实践中只有一个特定的元素或组件。

您可以通过覆盖$refs类组件中的type 来指定特定的 ref 类型：
```
<template>
  <input ref="input">
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class InputFocus extends Vue {
  // annotate refs type.
  // The symbol `!` (definite assignment assertion)
  // is needed to get rid of compilation error.
  $refs!: {
    input: HTMLInputElement
  }

  mounted() {
    // Use `input` ref without type cast.
    this.$refs.input.focus()
  }
}
</script>
```
您可以在input没有类型转换的情况下访问类型，因为$refs.input在上面的示例中的类组件上指定了类型。

请注意，它应该是类型注释（使用冒号:）而不是赋值（=）。

钩子自动完成
Vue的类元器件提供了内置的钩子类型，这使得能够自动完成对data，render和其他生命周期的钩子类组件声明，为打字原稿。要启用它，您需要导入位于vue-class-component/hooks.
```
// main.ts
import 'vue-class-component/hooks' // import hooks type to enable auto-complete
import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')
```
如果你想让它与自定义钩子一起工作，你可以自己手动添加：
```
import Vue from 'vue'
import { Route, RawLocation } from 'vue-router'

declare module 'vue/types/vue' {
  // Augment component instance type
  interface Vue {
    beforeRouteEnter?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void

    beforeRouteLeave?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void

    beforeRouteUpdate?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void
  }
}
```

在装饰器中注释组件类型
在某些情况下，您希望在@Component装饰器参数中的函数上使用您的组件类型。例如，要访问监视处理程序中的组件方法：
```
@Component({
  watch: {
    postId(id: string) {
      // To fetch post data when the id is changed.
      this.fetchPost(id) // -> Property 'fetchPost' does not exist on type 'Vue'.
    }
  }
})
class Post extends Vue {
  postId: string

  fetchPost(postId: string): Promise<void> {
    // ...
  }
}
```
上面的代码产生一个类型错误，表明在监视处理程序fetchPost中不存在this。这是因为this在型@Component装饰的说法是基本Vue类型。

要使用您自己的组件类型（在本例中为Post），您可以通过其类型参数注释装饰器。
```
// Annotate the decorator with the component type 'Post' so that `this` type in
// the decorator argument becomes 'Post'.
@Component<Post>({
  watch: {
    postId(id: string) {
      this.fetchPost(id) // -> No errors
    }
  }
})
class Post extends Vue {
  postId: string

  fetchPost(postId: string): Promise<void> {
    // ...
  }
}
```
[](https://class-component.vuejs.org/)