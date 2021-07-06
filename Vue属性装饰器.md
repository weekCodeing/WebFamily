vue-class-component

安装：

```
npm i -S vue-property-decorator
```

用法：

有几个装饰器和1个函数

```
@Prop

@Prop(options: (PropOptions | Constructor[] | Constructor) = {}) decorator

import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Prop(Number) readonly propA: number | undefined
  @Prop({ default: 'default value' }) readonly propB!: string
  @Prop([String, Boolean]) readonly propC: string | boolean | undefined
}
is equivalent to

export default {
  props: {
    propA: {
      type: Number,
    },
    propB: {
      default: 'default value',
    },
    propC: {
      type: [String, Boolean],
    },
  },
}

如果您想type从其类型定义中设置每个 prop 值的属性，您可以使用反射元数据。

1.设置emitDecoratorMetadata为true。
2.导入reflect-metadata 前导入vue-property-decorator（reflect-metadata只需要导入一次。）

import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  @Prop() age!: number
}

每个 prop 的默认值都需要定义为与上面显示的示例代码相同。

它不支持定义每个default像财产@Prop() prop = 'default value'。

It's not supported to define each default property like @Prop() prop = 'default value' .

@PropSync

import { Vue, Component, PropSync } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @PropSync('name', { type: String }) syncedName!: string
}

is equivalent to

export default {
  props: {
    name: {
      type: String,
    },
  },
  computed: {
    syncedName: {
      get() {
        return this.name
      },
      set(value) {
        this.$emit('update:name', value)
      },
    },
  },
}

@PropSync@Prop除了它将 propName 作为装饰器的参数之外，它的工作原理还类似于在幕后创建一个计算得到的 getter 和 setter。通过这种方式，您可以与属性进行交互，就好像它是一个常规数据属性一样，同时使它像.sync在父组件中附加修饰符一样简单。

@Model

@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator

import { Vue, Component, Model } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Model('change', { type: Boolean }) readonly checked!: boolean
}
is equivalent to

export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: {
      type: Boolean,
    },
  },
}

@Model属性还可以type通过reflect-metadata.

@ModelSync

@ModelSync(propName: string, event?: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator
import { Vue, Component, ModelSync } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @ModelSync('checked', 'change', { type: Boolean })
  readonly checkedValue!: boolean
}

is equivalent to

export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: {
      type: Boolean,
    },
  },
  computed: {
    checkedValue: {
      get() {
        return this.checked
      },
      set(value) {
        this.$emit('change', value)
      },
    },
  },
}

@ModelSync属性还可以type通过reflect-metadata.

@Watch(path: string, options: WatchOptions = {}) decorator

@Watch

import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Watch('child')
  onChildChanged(val: string, oldVal: string) {}

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged1(val: Person, oldVal: Person) {}

  @Watch('person')
  onPersonChanged2(val: Person, oldVal: Person) {}
}
is equivalent to

export default {
  watch: {
    child: [
      {
        handler: 'onChildChanged',
        immediate: false,
        deep: false,
      },
    ],
    person: [
      {
        handler: 'onPersonChanged1',
        immediate: true,
        deep: true,
      },
      {
        handler: 'onPersonChanged2',
        immediate: false,
        deep: false,
      },
    ],
  },
  methods: {
    onChildChanged(val, oldVal) {},
    onPersonChanged1(val, oldVal) {},
    onPersonChanged2(val, oldVal) {},
  },
}

@Provide

@Provide(key?: string | symbol) / @Inject(options?: { from?: InjectKey, default?: any } | InjectKey) decorator
import { Component, Inject, Provide, Vue } from 'vue-property-decorator'

const symbol = Symbol('baz')

@Component
export class MyComponent extends Vue {
  @Inject() readonly foo!: string
  @Inject('bar') readonly bar!: string
  @Inject({ from: 'optional', default: 'default' }) readonly optional!: string
  @Inject(symbol) readonly baz!: string

  @Provide() foo = 'foo'
  @Provide('bar') baz = 'bar'
}

is equivalent to

const symbol = Symbol('baz')

export const MyComponent = Vue.extend({
  inject: {
    foo: 'foo',
    bar: 'bar',
    optional: { from: 'optional', default: 'default' },
    baz: symbol,
  },
  data() {
    return {
      foo: 'foo',
      baz: 'bar',
    }
  },
  provide() {
    return {
      foo: this.foo,
      bar: this.baz,
    }
  },
})

@Inject

@ProvideReactive

@ProvideReactive(key?: string | symbol) / @InjectReactive(options?: { from?: InjectKey, default?: any } | InjectKey) decorator

这些装饰器是@Provideand 的反应式版本@Inject。如果父组件修改了提供的值，则子组件可以捕获此修改。这些装饰器是@Provideand 的反应式版本@Inject。如果父组件修改了提供的值，则子组件可以捕获此修改。

const key = Symbol()
@Component
class ParentComponent extends Vue {
  @ProvideReactive() one = 'value'
  @ProvideReactive(key) two = 'value'
}

@Component
class ChildComponent extends Vue {
  @InjectReactive() one!: string
  @InjectReactive(key) two!: string
}

@InjectReactive

@Emit

由@Emit $emit它们的返回值和它们的原始参数修饰的函数。如果返回值是一个promise，它会在发出之前被解析。

如果未通过event参数提供事件名称，则使用函数名称。在这种情况下，camelCase 名称将转换为 kebab-case。

import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  count = 0

  @Emit()
  addToCount(n: number) {
    this.count += n
  }

  @Emit('reset')
  resetCount() {
    this.count = 0
  }

  @Emit()
  returnValue() {
    return 10
  }

  @Emit()
  onInputChange(e) {
    return e.target.value
  }

  @Emit()
  promise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(20)
      }, 0)
    })
  }
}

is equivalent to

export default {
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    addToCount(n) {
      this.count += n
      this.$emit('add-to-count', n)
    },
    resetCount() {
      this.count = 0
      this.$emit('reset')
    },
    returnValue() {
      this.$emit('return-value', 10)
    },
    onInputChange(e) {
      this.$emit('on-input-change', e.target.value, e)
    },
    promise() {
      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })

      promise.then((value) => {
        this.$emit('promise', value)
      })
    },
  },
}

@Ref(refKey?: string) decorator

import { Vue, Component, Ref } from 'vue-property-decorator'

import AnotherComponent from '@/path/to/another-component.vue'

@Component
export default class YourComponent extends Vue {
  @Ref() readonly anotherComponent!: AnotherComponent
  @Ref('aButton') readonly button!: HTMLButtonElement
}

is equivalent to

export default {
  computed() {
    anotherComponent: {
      cache: false,
      get() {
        return this.$refs.anotherComponent as AnotherComponent
      }
    },
    button: {
      cache: false,
      get() {
        return this.$refs.aButton as HTMLButtonElement
      }
    }
  }
}

@VModel

VModel(propsArgs?: PropOptions) decorator

import { Vue, Component, VModel } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @VModel({ type: String }) name!: string
}

is equivalent to

export default {
  props: {
    value: {
      type: String,
    },
  },
  computed: {
    name: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}

@Component(provided by use-class-component)由vue-class-component提供

Mixins(the helper function named mixins provided by vue-class-component)
mixinx由vue-class-component提供的名为helper函数
```
