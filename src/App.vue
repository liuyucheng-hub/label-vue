<template>
  <div id="app">
    <Label v-bind:width="width"
           v-bind:height="height"
           v-bind:img-url="imgUrl"/>
  </div>
</template>

<script>
import Label from './components/Label.vue'

export default {
  name: 'App',
  components: {
    Label
  },
  data: function () {
    return {
      width: 1000,
      height: 800,
      imgUrl: 'http://127.0.0.1:8887/cat.jpg',
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
