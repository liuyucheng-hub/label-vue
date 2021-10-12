<template>
  <img v-bind:src="imgUrl">
</template>

<script>
export default {
  name: "background",

  props: {
    imgUrl: String
  },
}
</script>

<style scoped>

</style>