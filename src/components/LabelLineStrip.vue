<template>
  <g>
    <polyline stroke="orange"
              stroke-width="1"
              v-on:click="onGraphClick()"
              v-bind:points="points"/>

    <!--    <circle v-bind:cx="p1.x"-->
    <!--            v-bind:cy="p1.y"-->
    <!--            v-on:click="onPointClick(p1.key)"-->
    <!--            r="2" stroke="red" stroke-width="1"/>-->

    <!--    <circle v-bind:cx="p2.x"-->
    <!--            v-bind:cy="p2.y"-->
    <!--            v-on:click="onPointClick(p2.key)"-->
    <!--            r="2" stroke="red" stroke-width="1"/>-->
  </g>
</template>

<script>
export default {
  name: "label-line-strip",
  components: {},
  props: {
    metaData: Object,
  },

  computed: {
    points: [30, 60, 60, 60],
    // p1: function () {
    //   if (this.metaData.points !== null &&
    //       this.metaData.points !== undefined &&
    //       this.metaData.points.length > 0) {
    //     return this.metaData.points[0];
    //   } else {
    //     return {x: 0, y: 0}
    //   }
    // },
    // p2: function () {
    //   if (this.metaData.points !== null &&
    //       this.metaData.points !== undefined &&
    //       this.metaData.points.length > 1) {
    //     this.$emit("complete", this.metaData.key);
    //     return this.metaData.points[1];
    //   } else if (this.metaData.position !== null &&
    //       this.metaData.position !== undefined) {
    //     return this.metaData.position;
    //   } else {
    //     return {x: 0, y: 0}
    //   }
    // },
  },

  methods: {
    // 图形选中
    onGraphClick: function () {
      this.$emit("graphClick", this.metaData.key)
    },
    // 点选中
    onPointClick: function (pointKey) {
      this.$emit("pointClick", this.metaData.key, pointKey)
    },
  }
}
</script>

<style scoped>

</style>