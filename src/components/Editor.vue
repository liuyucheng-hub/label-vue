<template>
  <div v-on:mousemove="onMousemove">
<!--    <background v-bind:img-url="imgUrl"/>-->
    <board/>
  </div>
</template>

<script>
// import Background from '@/components/Background.vue';
import Board from '@/components/Board.vue';
// import {globalStatus} from '../helper/global-status';
// import {graphicalType} from '@/helper/constant';
// import {mousePoint} from './mousePoint'
// import {board} from './board'
// import {genLine} from './graphical/line'

export default {
  name: "editor",
  components: {
    // Background,
    Board,
  },

  props: {
    imgUrl: String,
    status: Object,
  },

  data: function () {
    return {
    }
  },
  methods: {
    // // 鼠标点击处理
    // onClick: function(event) {
    //   if (globalStatus.createModel) {
    //     // 创建模式
    //     // 没有正在处理的图形，新创建一个
    //     if (this.selectGraph == null) {
    //       this.createNewGraph()
    //     }
    //     // 正在处理图形处理点击事件
    //     this.selectGraph.onClick(event);
    //     // 正在处理图形编辑完成
    //     if (this.selectGraph.isComplete()) {
    //       this.graphical.push(this.selectGraph);
    //       this.selectGraph = null;
    //     }
    //   } else if (globalStatus.editModel) {
    //     // 编辑模式
    //
    //   }
    // },
    // createNewGraph: function() {
    //   if (graphicalType.isLine(globalStatus.selectCreateModel)) {
    //     this.selectGraph = genLine()
    //   }
    //   //todo 其他图形
    // },
    //
    // 鼠标移动处理
    onMousemove: function(event) {
      if (status.selectGraph === null || status.selectGraph === undefined) {
        return;
      }
      status.selectGraph.onMousemove(event);
    },
    // // 鼠标离开处理
    // onMouseleave: function(event) {
    //
    // },
    // // 撤销快捷键处理
    // onRevoke: function() {
    //
    // },
    // // 删除快捷键处理
    // onDelete: function() {
    //
    // },
    // // 编辑快捷键处理
    // onEdit: function() {
    //
    // },
    // // 创建线条快捷键处理
    // onCreateLine: function() {
    //
    // },
    // // 创建连线快捷键处理
    // onCreateLineStrip: function() {
    //
    // },
    // // 创建圆形快捷键处理
    // onCreateCircle: function() {
    //
    // },
    // // 创建矩形快捷键处理
    // onCreateRectangle: function() {
    //
    // },
    // // 创建多边形快捷键处理
    // onCreatePolygon: function() {
    //
    // },
  }
}
</script>

<style scoped>

</style>