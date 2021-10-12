<template>
  <div>
    <button v-on:click.stop="onClick(OperateEvent.createLine)">Create Line</button>
    <button v-on:click.stop="onClick(OperateEvent.createLineStrip)">Create LineStrip</button>
    <button v-on:click.stop="onClick(OperateEvent.createCircle)">Create Circle</button>
    <button v-on:click.stop="onClick(OperateEvent.createRectangle)">Create Rectangle</button>
    <button v-on:click.stop="onClick(OperateEvent.createPolygon)">Create Polygon</button>
    <button v-on:click.stop="onClick(OperateEvent.edit)">Edit</button>
    <button v-on:click.stop="onClick(OperateEvent.revoke)">Revoke</button>
    <button v-on:click.stop="onClick(OperateEvent.delete)">Delete</button>
  </div>
</template>

<script>
import {OperateEvent} from "@/helper/constant";

export default {
  name: "Toolbar",

  props: {
    status: Object,
  },

  data: function () {
    return {
      OperateEvent: OperateEvent,
    }
  },

  watch: {
    status: function ()
  }

  methods: {
    onClick: function (eventType) {
      this.$emit("operate-click", eventType);
    },

    //
    //
    // // 撤销快捷键处理
    // onRevoke: function () {
    //
    // },
    // // 删除快捷键处理
    // onDelete: function () {
    //
    // },
    // // 编辑快捷键处理
    // onEdit: function () {
    //
    // },
    // // 创建线条快捷键处理
    // onCreateLine: function () {
    //
    // },
    // // 创建连线快捷键处理
    // onCreateLineStrip: function () {
    //
    // },
    // // 创建圆形快捷键处理
    // onCreateCircle: function () {
    //
    // },
    // // 创建矩形快捷键处理
    // onCreateRectangle: function () {
    //
    // },
    // // 创建多边形快捷键处理
    // onCreatePolygon: function () {
    //
    // },
  },
}
</script>

<style scoped>

</style>