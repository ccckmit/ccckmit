<template>
  <div id="app">
    <v-app dark>
      <img src="./assets/logo.png">
      <HelloWorld/>
      <VuetifyButton/>
      <VuetifyForm/>
    </v-app>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import VuetifyButton from './components/VuetifyButton'
import VuetifyForm from './components/VuetifyForm'

export default {
  name: 'app',
  components: {
    HelloWorld,
    VuetifyButton,
    VuetifyForm,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
