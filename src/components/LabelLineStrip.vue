<template>
  <g>
    <polyline v-on:click="onGraphClick"
              v-bind:points="displayPointCoordinates"
              v-bind:class="{'label-vue-not-complete': !metaData.complete, 'select':metaData.select}"/>

    <circle v-for="item of displayPoints"
            v-bind:cx="item.x"
            v-bind:cy="item.y"
            v-bind:key="item.key"
            v-on:click="onPointClick(item.key)"
            v-on:mousedown="onPointMousedown($event, item.key)"
            v-on:mouseup="onPointMouseUp($event, item.key)"
            v-bind:class="{'label-vue-not-complete': !metaData.complete, 'select':metaData.select}"
            r="4"/>
  </g>
</template>

<script>
export default {
  name: "label-line-strip",
  components: {},
  props: {
    metaData: Object,
    maxPoint: Number,
  },

  computed: {
    displayPoints: function () {
      let res = [];
      if (this.metaData.points !== null &&
          this.metaData.points !== undefined) {
        res.push(...this.metaData.points)
      }

      // 已完成状态
      if (this.metaData.complete) {
        return res;
      }
      if (res.length >= this.maxPoint) {
        this.$emit("complete", this.metaData.key);
        return res;
      }

      // 未完成状态
      // 预览鼠标位置的下一个节点
      if (this.metaData.position !== null &&
          this.metaData.position !== undefined) {
        res.push(this.metaData.position)
      }
      return res;
    },
    displayPointCoordinates: function () {
      let coordinates = [];
      this.displayPoints.forEach(item => {
        coordinates.push(item.x, item.y);
      })
      return coordinates;
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
    // 鼠标down
    onPointMousedown: function (event, pointKey) {
      if (event.ctrlKey) {
        this.$emit("pointDragStart", this.metaData.key, pointKey)
      } else {
        this.$emit("pointClick", this.metaData.key, pointKey)
      }
    },
    onPointMouseUp: function (event, pointKey) {
      if (event.ctrlKey) {
        this.$emit("pointDragEnd", this.metaData.key, pointKey)
      }
    },
  }
}
</script>

<style scoped>

</style>