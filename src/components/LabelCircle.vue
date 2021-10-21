<template>
  <g>
    <circle v-bind:cx="cx"
            v-bind:cy="cy"
            v-bind:r="r"
            v-bind:class="classObject"
            v-on:click="onGraphClick"/>

    <circle r="4"
            v-for="item of displayPoints"
            v-bind:cx="item.x"
            v-bind:cy="item.y"
            v-bind:key="item.key"
            v-bind:class="classObject"
            v-on:click="onPointClick(item.key)"
            v-on:mousedown="onPointMousedown($event, item.key)"
            v-on:mouseup="onPointMouseUp($event, item.key)"/>
  </g>
</template>

<script>
// 圆形图形
export default {
  name: "label-circle",

  props: {
    metaData: Object,
  },

  computed: {
    /**
     * class数据
     */
    classObject: function () {
      return {
        'label-vue-not-complete': !this.metaData.complete,
        'label-vue-select': this.metaData.select
      }
    },

    /**
     * 连接点对象
     */
    displayPoints: function () {
      let res = [];
      if (this.metaData.points !== null &&
          this.metaData.points !== undefined) {
        res.push(...this.metaData.points.slice(0, 2))
      }

      // 已完成状态
      if (this.metaData.complete) {
        return res;
      }
      if (res.length >= 2) {
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

    cx: function () {
      const displayPoints = this.displayPoints;
      if (displayPoints.length > 0) {
        return displayPoints[0].x;
      }
      return 0;
    },

    cy: function () {
      const displayPoints = this.displayPoints;
      if (displayPoints.length > 0) {
        return displayPoints[0].y;
      }
      return 0;
    },

    r: function () {
      const displayPoints = this.displayPoints;
      let r = 0;
      if (displayPoints.length > 1) {
        let xDiff = displayPoints[1].x - displayPoints[0].x;
        let yDiff = displayPoints[1].y - displayPoints[0].y
        r = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
      }
      return r < 0 ? 0 : r;
    },
  },

  methods: {
    /**
     * 图形选中事件处理
     */
    onGraphClick: function () {
      this.$emit("graphClick", this.metaData.key)
    },

    /**
     * 连接点选中事件处理
     */
    onPointClick: function (pointKey) {
      this.$emit("pointClick", this.metaData.key, pointKey)
    },

    /**
     * 按下鼠标左键事件处理
     */
    onPointMousedown: function (event, pointKey) {
      if (event.ctrlKey) {
        this.$emit("pointDragStart", this.metaData.key, pointKey)
      } else {
        this.$emit("pointClick", this.metaData.key, pointKey)
      }
    },

    /**
     * 松开鼠标左键事件处理
     */
    onPointMouseUp: function (event, pointKey) {
      if (event.ctrlKey) {
        this.$emit("pointDragEnd", this.metaData.key, pointKey)
      }
    },
  }
}
</script>

<style scoped></style>