<template>
  <g class="label-vue-graph"
     v-bind:class="graphClassObject">
    <polyline class="label-vue-line"
              v-bind:points="displayPointCoordinates"
              v-bind:class="polylineClassObject"
              v-on:click="onGraphClick"
              v-on:mousedown="onGraphMousedown"
              v-on:mouseup="onGraphMouseUp"/>

    <circle r="2"
            class="label-vue-point"
            v-for="item of displayPoints"
            v-bind:cx="item.x"
            v-bind:cy="item.y"
            v-bind:key="item.key"
            v-bind:class="{'label-vue-select': item.select}"
            v-on:click="onPointClick(item.key)"
            v-on:mousedown="onPointMousedown(item.key)"
            v-on:mouseup="onPointMouseUp(item.key)"/>
  </g>
</template>

<script>
// 线条、连线、多边形图形
export default {
  name: "LabelLineStrip",

  props: {
    // 图形的元数据
    metaData: Object,
    editModel: Boolean,
    line: {
      type: Boolean,
      default: false,
    },
    lineStrip: {
      type: Boolean,
      default: false,
    },
    polygon: {
      type: Boolean,
      default: false,
    },
  },

  data: function () {
    return {
      closed: false,
    }
  },

  computed: {
    // 图形支持的最大节点数，当>=maxPoint时完成图形创建
    maxPoint: function () {
      if (this.line) {
        return 2;
      }
      return 10000;
    },

    /**
     * polyline的class数据
     */
    polylineClassObject: function () {
      return {
        'label-vue-line': this.line,
        'label-vue-lineStrip': this.lineStrip,
        'label-vue-polygon': this.polygon,
      }
    },

    /**
     * 整个图形的class数据
     */
    graphClassObject: function () {
      let obj = this.polylineClassObject;
      obj['label-vue-edit-model'] = this.editModel;
      obj['label-vue-select'] = this.metaData.select;
      return obj;
    },

    /**
     * 连接点对象
     */
    displayPoints: function () {
      let res = [];
      if (this.metaData.points !== null &&
          this.metaData.points !== undefined) {
        res.push(...this.metaData.points.slice(0, this.maxPoint))
      }

      // 已完成状态
      if (this.metaData.complete) {
        // 图形需要闭合
        if (this.polygon &&
            res.length > 1 &&
            !this.isCopyFirstAndSwapFirstPoint(res)) {
          this.copyFirstAndSwapFirstPoint(res);
        }
        return res;
      }
      if (res.length >= this.maxPoint) {
        // 图形需要闭合
        if (this.polygon &&
            res.length > 1 &&
            !this.isCopyFirstAndSwapFirstPoint(res)) {
          this.copyFirstAndSwapFirstPoint(res);
        }
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
     * 闭合图形时创建一个与第一个连接点相同坐标的连接
     * 因为svg没有z-index特性，所以将起闭合作用的连接点与第一个连接点交换位置
     * 最后渲染的节点会在图层的上面
     */
    copyFirstAndSwapFirstPoint: function (points) {
      const firstPoint = points[0];
      let copyFirstPoint = JSON.parse(JSON.stringify(firstPoint))
      copyFirstPoint.key = -1
      points[0] = copyFirstPoint;
      points.push(firstPoint);
    },

    /**
     * 检查已经完成了闭合
     */
    isCopyFirstAndSwapFirstPoint: function (points) {
      return points !== null &&
          points !== undefined &&
          points.length > 0 &&
          points[0].key === -1;
    },

    /**
     * 图形选中事件处理
     */
    onGraphClick: function (event) {
      if (event.altKey) {
        this.$emit("graphAltClick", this.metaData.key)
      } else {
        this.$emit("graphClick", this.metaData.key)
      }
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
  }
}
</script>

<style scoped></style>