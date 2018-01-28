<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li v-for="essentialLink in essentialLinks">
        <a :href="essentialLink.link" target="_blank">{{ essentialLink.text }}</a>
      </li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li v-for="ecosystem in ecosystems">
        <a :href="ecosystem.link" target="_blank">{{ ecosystem.text }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      ecosystems: [
        {
          link: 'http://router.vuejs.org/',
          text: 'vue-router'
        },
        {
          link: 'http://vuex.vuejs.org/',
          text: 'vuex'
        },
        {
          link: 'http://vue-loader.vuejs.org/',
          text: 'vue-loader'
        },
        {
          link: 'https://github.com/vuejs/awesome-vue',
          text: 'awesome-vue'
        }
      ],
      essentialLinks: [
        {
          link: 'https://vuejs.org',
          text: 'Core Docs'
        },
        {
          link: 'https://forum.vuejs.org',
          text: 'Forum'
        },
        {
          link: 'https://gitter.im/vuejs/vue',
          text: 'Gitter Chat'
        },
        {
          link: 'https://github.com/vuejs/awesome-vue',
          text: 'awesome-vue'
        },
        {
          link: 'https://twitter.com/vuejs',
          text: 'Twitter'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
