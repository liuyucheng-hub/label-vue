<template>
  <div v-bind:style="{width: width + 'px', height: height + 'px', textAlign: 'left'}" class="label-vue"
       v-on:keyup.delete="onDeleteHotKey"
       v-on:keyup.ctrl.z="onRevokeHotKey"
       v-on:keyup.alt.`="onEditHotKey"
       v-on:keyup.alt.49="onCreateRectangleHotKey"
       v-on:keyup.alt.50="onCreatePolygonHotKey"
       v-on:keyup.alt.51="onCreateLineHotKey"
       v-on:keyup.alt.52="onCreateLineStripHotKey"
       v-on:keyup.alt.53="onCreateCircleHotKey">

    <toolbar v-bind:status="this.status"
             v-on:operate-click="onOperateClick"></toolbar>
    <editor v-bind:status="this.status"
            v-bind:img-url="imgUrl" />
  </div>
</template>

<script>
import {OperateEvent} from '@/helper/constant'
import Toolbar from '@/components/Toolbar.vue'
import Editor from "@/components/Editor.vue";

export default {
  name: "label-vue-window",
  components: {
    Toolbar,
    Editor,
  },

  props: {
    height: {
      type: Number,
      default: 600,
    },
    width: {
      type: Number,
      default: 800,
    },
    imgUrl: String,
  },

  data: function () {
    return {
      status: {
        // 编辑模式
        editModel: false,
        // 创建模式
        createModel: false,
        // 选择的创建模式
        selectCreateGraph: '',
        // 当前选中的图形对象
        selectGraph: null,
      }
    }
  },

  methods: {
    // 设置为编辑模式
    setEdit() {
      this.editModel = true;
      this.createModel = false;
      this.selectCreateGraph = '';
    },
    // 设置为创建模式, 选择的创建模式
    setCreateModel(graph) {
      this.editModel = false;
      this.createModel = true;
      this.selectCreateGraph = graph
    },
    onOperateClick: function (eventType) {
      switch (eventType) {
        case OperateEvent.createLine:
          console.log("create line")
          break;
        case OperateEvent.createLineStrip:
          // todo
          break;
        case OperateEvent.createCircle:
          //todo
          break;
        case OperateEvent.createRectangle:
          //todo
          break;
        case OperateEvent.createPolygon:
          //todo
          break;
        case OperateEvent.revoke:
          //todo
          break;
        case OperateEvent.edit:
          //todo
          break;
        case OperateEvent.delete:
          // todo
          break;
      }
    },
    // 检查是撤销快捷键
    onRevokeHotKey: function (event) {
      console.log(event)
    },

    // 检查是删除快捷键
    onDeleteHotKey: function (event) {
      console.log(event)
    },

    // 检查是编辑快捷键
    onEditHotKey: function (event) {
      console.log(event)
    },

    // 检查是创建线条快捷键
    onCreateLineHotKey: function (event) {
      console.log(event)
    },

    // 检查是创建连线快捷键
    onCreateLineStripHotKey: function (event) {
      console.log(event)
    },

    // 检查是创建圆形快捷键
    onCreateCircleHotKey: function (event) {
      console.log(event)
    },

    // 检查是创建矩形快捷键
    onCreateRectangleHotKey: function (event) {
      console.log(event)
    },

    // 检查是创建多边形
    onCreatePolygonHotKey: function (event) {
      console.log(event)
    },
  }
}

// label.toolbar.setClickHandler(function (clickEvent) {
//   if (ClickEventType.isRevokeEvent(clickEvent)) {
//     toolbar.onRevoke()
//     editor.onRevoke()
//   } else if (ClickEventType.isDeleteEvent(clickEvent)) {
//     toolbar.onDelete()
//     editor.onDelete()
//   } else if (ClickEventType.isEditEvent(clickEvent)) {
//     toolbar.onEdit()
//     editor.onEdit()
//   } else if (ClickEventType.isCreateLineEvent(clickEvent)) {
//     toolbar.onCreateLine()
//     editor.onCreateLine()
//   } else if (ClickEventType.isCreateLineStripEvent(clickEvent)) {
//     toolbar.onCreateLineStrip()
//     editor.onCreateLineStrip()
//   } else if (ClickEventType.isCreateCircleEvent(clickEvent)) {
//     toolbar.onCreateCircle()
//     editor.onCreateCircle()
//   } else if (ClickEventType.isCreateRectangleEvent(clickEvent)) {
//     toolbar.onCreateRectangle()
//     editor.onCreateRectangle()
//   } else if (ClickEventType.isCreatePolygonEvent(clickEvent)) {
//     toolbar.onCreatePolygon()
//     editor.onCreatePolygon()
//   }
// });
//

</script>

<style scoped>

</style>