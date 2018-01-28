# Vue Router

* http://www.runoob.com/vue2/vue-routing.html
  * 範例:開始 -- https://jsfiddle.net/yyx990803/xgrjzsup/
  * 範例:动态路由匹配 -- https://jsfiddle.net/yyx990803/4xfa2f19/
  * 範例:嵌套路由 -- https://jsfiddle.net/yyx990803/L7hscd8h/
  * 範例:命名视图 -- https://jsfiddle.net/posva/6du90epg/
* codepen 
  * 多 panel 完整範例 VueJS Playgroud -- https://codepen.io/chasebank/pen/qZQbOP

## router-link

```
<router-link> 组件支持用户在具有路由功能的应用中（点击）导航。 通过 to 属性指定目标地址，默认渲染成带有正确链接的 <a> 标签，可以通过配置 tag 属性生成别的标签.。另外，当目标路由成功激活时，链接元素自动设置一个表示激活的 CSS 类名。

<router-link> 比起写死的 <a href="..."> 会好一些，理由如下：

无论是 HTML5 history 模式还是 hash 模式，它的表现行为一致，所以，当你要切换路由模式，或者在 IE9 降级使用 hash 模式，无须作任何变动。

在 HTML5 history 模式下，router-link 会守卫点击事件，让浏览器不再重新加载页面。

当你在 HTML5 history 模式下使用 base 选项之后，所有的 to 属性都不需要写（基路径）了。
```

## HTML5 History 模式

vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。

如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。

```
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

当你使用 history 模式时，URL 就像正常的 url， ttp://yoursite.com/user/id，也好看！

不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404，这就不好看了。

所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。

* Nginx 可用 

```
location / {
  try_files $uri $uri/ /index.html;
}
```

* Express 可用 -- https://github.com/bripkens/connect-history-api-fallback