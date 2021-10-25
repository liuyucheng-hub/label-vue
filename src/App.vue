<template>
  <div id="app">
    <label-vue v-bind:img-url="imgUrl"/>
  </div>
</template>

<script>
import LabelVue from './components/LabelVue/LabelVue.vue'

export default {
  name: 'App',
  components: {
    LabelVue
  },
  data: function () {
    return {
      imgUrl: 'http://192.168.199.120:8887/cat.jpg',
    }
  }
}
</script>

<style>
</style>
