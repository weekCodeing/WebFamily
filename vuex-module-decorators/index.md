```
npm install vuex-module-decorators
# or
yarn add vuex-module-decorators
```
Typescript/ES7 装饰器使 Vuex 模块变得轻而易举

## 具有严格类型安全性的 Typescript 类
创建不会出错的模块。编译时类型检查确保您不能改变不属于模块的数据，或访问不可用的字段

## 声明性代码的装饰器
使用 @Action 或 @Mutation 注释您的函数，以自动将其转换为 Vuex 模块方法

## 动作和突变的自动完成Autocomplete for actions and mutations
模块的形状是完全类型化的，因​​此您可以使用类型安全访问动作和变异函数并获得自动完成帮助

> 类型安全的好处

而不是使用通常的方式来调度和提交......

```
store.commit('updatePosts', posts)
await store.dispatch('fetchPosts')
```
......这不提供类型安全的有效载荷和在IDE中没有自动完成的帮助，您现在可以使用更多的使用类型安全的机制getModule访问
```
import { getModule } from 'vuex-module-decorators'
import Posts from `~/store/posts.js`

const postsModule = getModule(Posts)

// access posts
const posts = postsModule.posts

// use getters
const commentCount = postsModule.totalComments

// commit mutation
postsModule.updatePosts(newPostsArray)

// dispatch action
await postsModule.fetchPosts()
```

> 命名空间模块

如果你打算以命名空间的方式使用你的模块，那么你需要在@Module装饰器中指定。
```
@Module({ namespaced: true, name: 'mm' })
class MyModule extends VuexModule {
  wheels = 2

  @Mutation
  incrWheels(extra: number) {
    this.wheels += extra
  }

  get axles() {
    return this.wheels / 2
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})
```

name装饰器中的字段应与您在创建商店时将分配给模块的实际名称相匹配。

手动保持这两个相同并不是很优雅，但这很重要。我们必须将this.store.dispatch('action') 调用转换为this.store.dispatch('name/action')，并且我们需要 name在装饰器中正确才能使其工作

> 在命名空间模块中注册全局操作

为了全局注册命名空间模块的操作，您可以root: true向@Action和@MutationAction装饰方法添加参数。
```
@Module({ namespaced: true, name: 'mm' })
class MyModule extends VuexModule {
  wheels = 2

  @Mutation
  setWheels(wheels: number) {
    this.wheels = wheels
  }
  
  @Action({ root: true, commit: 'setWheels' })
  clear() {
    return 0
  }

  get axles() {
    return this.wheels / 2
  }
}

const store = new Vuex.Store({
  modules: {
    mm: MyModule
  }
})
```
这样虽然在命名空间模块中，但将通过调度调用@Action clear of 。同样的事情只需传递给装饰器选项即可。MyModuleclearmm@MutationAction{ root: true }

> 笔记

当全局注册一个动作时，它不能被命名空间的名称调用。例如，这意味着不能通过调度来调用操作mm/clear！

> 动态模块

模块可以简单地通过向@Module装饰器传递一些属性来动态注册，但该过程的一个重要部分是，我们首先创建商店，然后将商店传递给模块。

#第 1 步：创建商店
```
// @/store/index.ts
import Vuex from 'vuex'

const store = new Vuex.Store({
  /*
  Ideally if all your modules are dynamic
  then your store is registered initially
  as a completely empty object
  */
})
```
#步骤 2：创建动态模块
```
// @/store/modules/MyModule.ts
import store from '@/store'
import {Module, VuexModule} from 'vuex-module-decorators'

@Module({dynamic: true, store, name: 'mm'})
export default class MyModule extends VuexModule {
  /*
  Your module definition as usual
  */
}
```


> state

```
import { Module, VuexModule } from 'vuex-module-decorators'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2
}

export default {
  state: {
    wheels: 2
  }
}

If state value cannot be determined, it MUST be initialized with null. 
Just like wheels: number | null = null.
```

> getters

```
import { Module, VuexModule } from 'vuex-module-decorators'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2
  get axles() {
    return this.wheels / 2
  }
}

export default {
  state: {
    wheels: 2
  },
  getters: {
    axles: (state) => state.wheels / 2
  }
}

@Module
export default class Vehicle extends VuexModule {
  companies = []
  get company() {
    return (companyName: string) => { this.companies.find(company => company.name === companyName) };
  }
}
```

> mutations

```
import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2

  @Mutation
  puncture(n: number) {
    this.wheels = this.wheels - n
  }
}

export default {
  state: {
    wheels: 2
  },
  mutations: {
    puncture: (state, payload) => {
      state.wheels = state.wheels - payload
    }
  }
}
```

> actions

如果在操作中执行长时间运行的任务，建议将其定义为异步函数。但即使你不这样做，这个库也会将你的函数封装到Promise中并等待它。

如果你想让某件事同步发生，那就让它变成一个突变

也不要将它们定义为箭头➡️函数，因为我们需要在运行时重新绑定它们。

```
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { get } from 'request'

@Module
export default class Vehicle extends VuexModule {
  wheels = 2

  @Mutation
  addWheel(n: number) {
    this.wheels = this.wheels + n
  }

  @Action
  async fetchNewWheels(wheelStore: string) {
    const wheels = await get(wheelStore)
    this.context.commit('addWheel', wheels)
  }
}
```

```
const request = require('request')
export default {
  state: {
    wheels: 2
  },
  mutations: {
    addWheel: (state, payload) => {
      state.wheels = state.wheels + payload
    }
  },
  actions: {
    fetchNewWheels: async (context, payload) => {
      const wheels = await request.get(payload)
      context.commit('addWheel', wheels)
    }
  }
}
```

> MutationActions

```
import {VuexModule, Module, MutationAction} from 'vuex-module-decorators' 

@Module
class TypicodeModule extends VuexModule {
  posts: Post[] = [] 
  users: User[] = [] 

  @MutationAction 
  async function updatePosts() {
    const posts = await axios.get('https://jsonplaceholder.typicode.com/posts')

    return { posts }
  }
}
```

```
const typicodeModule = {
  state: {
    posts: [],
    users: []
  },
  mutations: {
    updatePosts: function (state, posts) {
      state.posts = posts
    }
  },
  actions: {
    updatePosts: async function (context) {
      const posts = await axios.get('https://jsonplaceholder.typicode.com/posts')
      context.commit('updatePosts', posts)
    }
  }
}
```

> 好处

```
// eg. /app/store/posts.ts
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { get } from 'axios'

interface PostEntity {
  comments: string[]
}

@Module
export default class Posts extends VuexModule {
  posts: PostEntity[] = [] // initialize empty for now

  get totalComments(): number {
    return this.posts
      .filter(post => {
        // Take those posts that have comments
        return post.comments && post.comments.length
      })
      .reduce((sum, post) => {
        // Sum all the lengths of comments arrays
        return sum + post.comments.length
      }, 0)
  }

  @Mutation
  updatePosts(posts: PostEntity[]) {
    this.posts = posts
  }

  @Action({ commit: 'updatePosts' })
  async fetchPosts() {
    return get('https://jsonplaceholder.typicode.com/posts')
  }
}
```

```
// equivalent eg. /app/store/posts.js
module.exports = {
  state: {
    posts: []
  },
  getters: {
    totalComments: (state) => {
      return state.posts
        .filter((post) => {
          return post.comments && post.comments.length
        })
        .reduce((sum, post) => {
          return sum + post.comments.length
        }, 0)
    }
  },
  mutations: {
    updatePosts: (state, posts) => {
      // 'posts' is payload
      state.posts = posts
    }
  },
  actions: {
    fetchPosts: async (context) => {
      // the return of the function is passed as payload
      const payload = await get('https://jsonplaceholder.typicode.com/posts')
      // the value of 'commit' in decorator is the mutation used
      context.commit('updatePosts', payload)
    }
  }
}
```

[vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators)