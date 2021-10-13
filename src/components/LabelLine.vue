<template>
  <g>
    <polyline stroke="orange"
              stroke-width="1"
              v-on:click="onGraphClick()"
              v-bind:points="pointCoordinates"/>

    <circle v-for="item of points"
            v-bind:cx="item.x"
            v-bind:cy="item.y"
            v-bind:key="item.key"
            v-on:click="onPointClick(item.key)"
            r="2" stroke="red" stroke-width="1"/>
  </g>
</template>

<script>
export default {
  name: "label-line",
  components: {},
  props: {
    metaData: Object,
    editModel: Boolean,
    createModel: Boolean
  },

  computed: {
    pointCoordinates: function () {
      let coordinates = [];
      this.points.forEach(item => {
        coordinates.push(item.x, item.y);
      })
      return coordinates;
    },
    points: function () {
      let points;
      if (this.metaData.points !== null &&
          this.metaData.points !== undefined) {
        points = this.metaData.points;
      } else {
        points = [];
      }

      if (points.length > 1) {
        this.$emit("complete", this.metaData.key);
        return;
      }

      // 创建模式下预览鼠标位置的下一个节点
      if (this.createModel) {
        if (this.metaData.position !== null &&
            this.metaData.position !== undefined) {
          points.push(this.metaData.position)
        }
      }

      return points;
    },
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