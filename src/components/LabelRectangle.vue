<template>
  <g>
    <rect v-bind:x="x"
          v-bind:y="y"
          v-bind:width="width+'px'"
          v-bind:height="height+'px'"
          v-bind:class="classObject"
          v-on:click="onGraphClick"
          v-on:mousedown="onGraphMousedown"
          v-on:mouseup="onGraphMouseUp"/>

    <circle r="4"
            v-for="item of displayPoints"
            v-bind:cx="item.x"
            v-bind:cy="item.y"
            v-bind:key="item.key"
            v-bind:class="classObject"
            v-on:click="onPointClick(item.key)"
            v-on:mousedown="onPointMousedown(item.key)"
            v-on:mouseup="onPointMouseUp(item.key)"/>
  </g>
</template>

<script>
// 矩形图形
export default {
  name: "LabelRectangle",

  props: {
    // 图形的元数据
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

    /**
     * x坐标值
     */
    x: function () {
      const displayPoints = this.displayPoints;
      if (displayPoints.length > 0) {
        return displayPoints[0].x;
      }
      return 0;
    },

    /**
     * y坐标值
     */
    y: function () {
      const displayPoints = this.displayPoints;
      if (displayPoints.length > 0) {
        return displayPoints[0].y;
      }
      return 0;
    },

    /**
     * 宽度
     */
    width: function () {
      const displayPoints = this.displayPoints;
      let width = 0;
      if (displayPoints.length > 1) {
        width = displayPoints[1].x - displayPoints[0].x;
      }
      return width < 0 ? 0 : width;
    },

    /**
     * 高度
     */
    height: function () {
      const displayPoints = this.displayPoints;
      let height = 0;
      if (displayPoints.length > 1) {
        height = displayPoints[1].y - displayPoints[0].y;
      }
      return height < 0 ? 0 : height;
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
     * 按下鼠标左键事件处理
     */
    onGraphMousedown: function () {
      this.$emit("graphDragStart", this.metaData.key)
    },

    /**
     * 松开鼠标左键事件处理
     */
    onGraphMouseUp: function () {
      this.$emit("graphDragEnd", this.metaData.key)
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
    onPointMousedown: function (pointKey) {
      this.$emit("pointDragStart", this.metaData.key, pointKey)
    },

    /**
     * 松开鼠标左键事件处理
     */
    onPointMouseUp: function (pointKey) {
      this.$emit("pointDragEnd", this.metaData.key, pointKey)
    },
  },

}
</script>

<style scoped></style>