<template>
  <g>
    <polyline v-bind:points="displayPointCoordinates"
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
export default {
  name: "label-line-strip",

  props: {
    // 图形的元数据
    metaData: Object,
    // 图形支持的最大节点数，当>=maxPoint时完成图形创建
    maxPoint: Number,
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

    /**
     * 连接点对象的坐标数据
     */
    displayPointCoordinates: function () {
      let coordinates = [];
      this.displayPoints.forEach(item => {
        coordinates.push(item.x, item.y);
      })
      return coordinates;
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