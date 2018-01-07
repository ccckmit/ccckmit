# Component (組件)

## 自定义事件

父组件是使用 props 传递数据给子组件，但如果子组件要把数据传递回去，就需要使用自定义事件！

我们可以使用 v-on 绑定自定义事件, 每个 Vue 实例都实现了事件接口(Events interface)，即：

使用 $on(eventName) 监听事件
使用 $emit(eventName) 触发事件
另外，父组件可以在使用子组件的地方直接用 v-on 来监听子组件触发的事件。

* http://www.runoob.com/try/try.php?filename=vue2-component6