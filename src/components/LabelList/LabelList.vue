<template>
  <div id="label-vue-list">

  </div>
</template>

<script>
export default {
  name: "LabelList",

  props: {
    graphs: Array,
  },

}
</script>

<style scoped>
#label-vue-list {
  float: right;
  width: 40px;
  height: calc(100% - 0px);
}
</style>