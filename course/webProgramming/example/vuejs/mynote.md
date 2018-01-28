# Vue.js

## 簡介

* [Vue.js 菜鳥教程](http://www.runoob.com/vue2/) (讚！)
  * http://www.runoob.com/vue2/vue-loop.html (看到這裡)
* https://cn.vuejs.org/v2/guide/index.html (讚！)
  * 創建者： [尤小右](https://www.weibo.com/arttechdesign?is_all=1)

## Server Side Rendering

* https://ssr.vuejs.org/zh/
  * 服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在服务器和客户端上运行。
  * 在对你的应用程序使用服务器端渲染(SSR)之前，你应该问第一个问题是否真的需要它。这主要取决于内容到达时间(time-to-content)对应用程序的重要程度。例如，如果你正在构建一个内部仪表盘，初始加载时的额外几百毫秒并不重要，这种情况下去使用服务器端渲染(SSR)将是一个小题大作之举。然而，内容到达时间(time-to-content)要求是绝对关键的指标，在这种情况下，服务器端渲染(SSR)可以帮助你实现最佳的初始加载性能。
  * npm install vue vue-server-renderer --save
  * 虽然没有完全遵循 [MVVM模型](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)，Vue 的设计无疑受到了它的启发。因此在文档中经常会使用 vm (ViewModel 的简称) 这个变量名表示 Vue 实例。 

## View

```html
<!-- v-bind 與 缩写-->
<a v-bind:href="url">...</a>
<a :href="url">...</a>

<!-- v-on 與縮寫 -->
<a v-on:click="doSomething">...</a>
<a @click="doSomething">...</a>

```

## Class 与 Style 绑定

```html
<div class="static"
     v-bind:class="{ active: isActive, 'text-danger': hasError }">
</div>

+ 

data: {
  isActive: true,
  hasError: false
}

=

<div class="static active"></div>
```

## Component

* https://cn.vuejs.org/v2/guide/components.html
  * Component 的 data 必须是函数
  * HTML 特性是不区分大小写的。所以，当使用的不是字符串模板时，camelCase (驼峰式命名) 的 prop 需要转换为相对应的 kebab-case (短横线分隔式命名)：
  * 与绑定到任何普通的 HTML 特性相类似，我们可以用 v-bind 来动态地将 prop 绑定到父组件的数据。每当父组件的数据变化时，该变化也会传导给子组件：
  * 如果你想把一个对象的所有属性作为 prop 进行传递，可以使用不带任何参数的 v-bind (即用 v-bind 而不是 v-bind:prop-name)。例如，已知一个 todo 对象：
  * Prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是反过来不会。这是为了防止子组件无意间修改了父组件的状态，来避免应用的数据流变得难以理解。
  * 另外，每次父组件更新时，子组件的所有 prop 都会更新为最新值。这意味着你不应该在子组件内部改变 prop。如果你这么做了，Vue 会在控制台给出警告。
* Vue 组件的 API 来自三部分——prop、事件和插槽：
  * Prop 允许外部环境传递数据给组件；
  * 事件允许从组件内触发外部环境的副作用；
  * 插槽允许外部环境将额外的内容组合在组件中。

```html
<my-component
  :foo="baz"
  :bar="qux"
  @event-a="doThis"
  @event-b="doThat"
>
  <img slot="icon" src="...">
  <p slot="main-text">Hello!</p>
</my-component>
```

## 電子書

* [gitbook: Vue.js 2.0 完全入门记录](https://www.gitbook.com/book/hiscc/vue-js-2-0/details)


## 文章

* [Vue.js 30天 系列](https://ithelp.ithome.com.tw/users/20103424/ironman/1049)

## 課程

* [vuejs入门基础 1 1 1 课程简介及框架简介](https://www.youtube.com/watch?v=JObvb5y6R7U)
* [Vue.js 2.0 In 60 Minutes](https://www.youtube.com/watch?v=z6hQqgvGI4Y)
* 六角學院 @ YouTube
  * [Vue.js 教學 - 幼幼班入門篇 (上)](https://www.youtube.com/watch?v=8O3teHziU_E)
  * [Vue.js 教學 - 幼幼班入門篇 (下)](https://www.youtube.com/watch?v=yzrUSzkLQNU)
  * [Vue.js 教學 - 從 Vuejs 初探 Web Component 的世界 (HD)](https://www.youtube.com/watch?v=T2JsTE0Hq58)
* [Vuedinner #1 第一次用 Vue.js 就愛上 by Kuro](https://www.youtube.com/watch?v=jXdZlbH_ut8)

## 擴展到手機

* https://weex.apache.org/cn/
  * Weex = React Native 的 Vue 版

## boilerplate

* https://github.com/vuejs-templates/webpack
* https://github.com/petervmeijgaard/vue-2-boilerplate