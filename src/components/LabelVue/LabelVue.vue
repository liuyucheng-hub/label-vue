<script>
import LabelLineStrip from "../LabelLineStrip.vue";
import LabelCircle from "../LabelCircle.vue";
import LabelRectangle from "../LabelRectangle.vue";
import LabelPolygon from "../LabelPolygon.vue";


export default {
  name: "label-vue",
  components: {
    LabelLineStrip,
    LabelCircle,
    LabelRectangle,
    LabelPolygon,
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
      key: 0,
      graphType: null,
      modelType: null,

      // 工具栏相关属性
      // 模式
      model: null,
      // 选择的创建模式
      selectCreateGraph: '',

      // 编辑窗相关属性
      // 当前选中的图形对象
      lines: [],
      lineStrips: [],
      circles: [],
      rectangles: [],
      polygons: [],
      graphs: [],
      selectGraph: null,
      selectPoint: null,
      dragGraph: null,
      dragPoint: null,
    }
  },

  computed: {
    isEditModel: function () {
      return this.model === this.modelType.edit
    },
    isCreateModel: function () {
      return this.model === this.modelType.create;
    }
  },

  methods: {

    /**
     * 鼠标移动处理
     * @param event
     */
    onMousemove: function (event) {
      if (this.isCreateModel) {
        this.onMouseMoveForCreateModel(event);
      } else if (this.isEditModel) {
        this.onMouseMoveForEditModel(event)
      }
    },
    onMouseMoveForCreateModel: function (event) {
      if (this.selectGraph !== null &&
          this.selectGraph !== undefined) {
        this.syncPosition(this.selectGraph.position, event)
      }
    },
    onMouseMoveForEditModel: function (event) {
      // dragPoint优先
      if (this.dragPoint !== null &&
          this.dragPoint !== undefined) {
        this.syncPosition(this.dragPoint, event)

      }
      // if (this.dragGraph !== null &&
      //     this.dragGraph !== undefined) {
      //   this.syncPosition(this.dragGraph.position, event)
      // }
    },

    /**
     * 鼠标点击处理
     * @param event
     */
    onMouseClick: function (event) {
      if (this.isCreateModel) {
        this.onMouseClickForCreateModel(event);
      }
    },
    onMouseClickForCreateModel: function (event) {
      // 创建模式下处理逻辑
      if (this.selectGraph === null ||
          this.selectGraph === undefined) {
        // 没有正在处理的图形对象
        this.genNewGraph(event);
      } else {
        // 有正在处理的图形对象
        this.selectGraph.points.push(
            this.genPoint(event)
        )
      }
    },

    /**
     * 鼠标双击处理
     */
    onMouseDoubleClick: function () {
      this.completeSelectGraph();
    },

    /**
     * 撤销操作处理
     */
    onRevoke: function () {
      if (this.isCreateModel) {
        this.onRevokeForCreateModel();
      } else if (this.isEditModel) {
        this.onRevokeForEditModel();
      }
    },
    onRevokeForCreateModel: function () {
      if (this.selectGraph === null ||
          this.selectGraph === undefined) {
        return;
      }
      // 正在创建图形仅有一个点，删除当前图形，其余情况撤销最后一个点
      if (this.selectGraph.points.length > 1) {
        this.selectGraph.points.pop()
      } else {
        //
        this.deleteLastGraph(this.selectGraph.type);
      }
    },
    onRevokeForEditModel: function () {
      if (this.graphs.length > 0) {
        this.deleteLastGraph(this.graphs[this.graphs.length - 1].type)
      }
    },
    deleteLastGraph: function (type) {
      if (type === null || type === undefined) {
        return;
      }
      if (type === this.graphType.line) {
        this.lines.pop()
      } else if (type === this.graphType.lineStrip) {
        this.lineStrips.pop();
      } else if (type === this.graphType.circle) {
        this.circles.pop();
      } else if (type === this.graphType.rectangle) {
        this.rectangles.pop();
      } else if (type === this.graphType.polygon) {
        this.polygons.pop();
      }
      this.graphs.pop();
      this.selectGraph = null;
    },

    /**
     * 删除操作处理
     */
    onDelete: function () {
      // 仅编辑模式下
      if (this.isEditModel) {
        //todo 选中节点需要根据选中样式调整
        // 优先point
        if (this.selectPoint !== null) {
          // 图形只有一个节点时删除图形，有多个节点时删除对应节点
          if (this.selectGraph.points.length <= 1) {
            this.deleteGraph(this.selectGraph);
            this.selectGraph = null;
          } else {
            this.selectGraph.points =
                this.selectGraph.points.filter(item => item.key !== this.selectPoint.key);
          }
          return;
        }
        if (this.selectGraph !== null) {
          this.deleteGraph(this.selectGraph);
          this.selectGraph = null;
        }
      }
    },
    deleteGraph: function (graph) {
      if (graph === null || graph === undefined) {
        return;
      }

      if (graph.type === this.graphType.line) {
        this.lines = this.lines
            .filter(item => item.key !== graph.key)
      } else if (graph.type === this.graphType.lineStrip) {
        this.lineStrips = this.lineStrips
            .filter(item => item.key !== graph.key)
      } else if (graph.type === this.graphType.circle) {
        this.circles = this.circles
            .filter(item => item.key !== graph.key)
      } else if (graph.type === this.graphType.rectangle) {
        this.rectangles = this.rectangles
            .filter(item => item.key !== graph.key)
      } else if (graph.type === this.graphType.polygon) {
        this.polygons = this.polygons
            .filter(item => item.key !== graph.key)
      }
      this.graphs = this.graphs
          .filter(item => item.key !== graph.key)
    },

    // 创建线条操作处理
    onCreateLine: function () {
      if (this.model === this.modelType.create &&
          this.selectCreateGraph === this.graphType.line) {
        return;
      }
      this.setCreateModel(this.graphType.line)
      this.completeSelectGraph();
    },
    // 创建连线操作处理
    onCreateLineStrip: function () {
      if (this.model === this.modelType.create &&
          this.selectCreateGraph === this.graphType.lineStrip) {
        return;
      }
      this.setCreateModel(this.graphType.lineStrip)
      this.completeSelectGraph();
    },
    // 创建圆形操作处理
    onCreateCircle: function () {
      if (this.model === this.modelType.create &&
          this.selectCreateGraph === this.graphType.circle) {
        return;
      }
      this.setCreateModel(this.graphType.circle)
      this.completeSelectGraph();
    },
    // 创建矩形操作处理
    onCreateRectangle: function () {
      if (this.model === this.modelType.create &&
          this.selectCreateGraph === this.graphType.rectangle) {
        return;
      }
      this.setCreateModel(this.graphType.rectangle)
      this.completeSelectGraph();
    },
    // 创建多边形操作处理
    onCreatePolygon: function () {
      if (this.model === this.modelType.create &&
          this.selectCreateGraph === this.graphType.polygon) {
        return;
      }
      this.setCreateModel(this.graphType.polygon)
      this.completeSelectGraph();
    },
    // 编辑操作处理
    onEdit: function () {
      this.setEditModel();
      this.completeSelectGraph();
    },
    // 保存操作处理
    onSave: function () {
      this.completeSelectGraph();
      console.log(this.graphs);
    },
    setCreateModel: function (graphType) {
      this.model = this.modelType.create;
      this.selectCreateGraph = graphType;
    },
    setEditModel: function () {
      this.model = this.modelType.edit;
      this.selectCreateGraph = null;
    },

    /**
     * 图形点击事件处理
     * @param graphKey
     */
    onGraphClick: function (graphKey) {
      if (this.isCreateModel) {
        return;
      }

      let matchGraph = this.graphs
          .find(item => item.key === graphKey);
      if (matchGraph === null || matchGraph === undefined) {
        return;
      }

      this.clearSelectGraph();
      matchGraph.select = true;
      this.selectGraph = matchGraph;
    },
    /**
     * 图形的连接点点击事件处理
     * @param graphKey
     * @param pointKey
     */
    onPointClick: function (graphKey, pointKey) {
      if (this.isCreateModel) {
        return;
      }

      let matchGraph = this.graphs
          .find(item => item.key === graphKey);
      if (matchGraph === null || matchGraph === undefined) {
        return;
      }

      let matchPoint = matchGraph.points
          .find(item => item.key === pointKey);
      if (matchPoint === null || matchPoint === undefined) {
        return;
      }

      this.clearSelectGraph();
      matchGraph.select = true;
      this.selectGraph = matchGraph;
      matchPoint.select = true;
      this.selectPoint = matchPoint;
    },

    // 图形连接点开始拖动事件处理
    onPointDragStart: function (graphKey, pointKey) {
      if (this.isCreateModel) {
        return;
      }

      let matchGraph = this.graphs
          .find(item => item.key === graphKey);
      if (matchGraph === null || matchGraph === undefined) {
        return;
      }

      let matchPoint = matchGraph.points
          .find(item => item.key === pointKey);
      if (matchPoint === null || matchPoint === undefined) {
        return;
      }

      this.dragGraph = matchGraph;
      this.dragPoint = matchPoint;
    },

    // 图形连接点开始拖动事件处理
    onPointDragEnd: function (graphKey, pointKey) {
      if (this.isCreateModel) {
        return;
      }

      let matchGraph = this.graphs
          .find(item => item.key === graphKey);
      if (matchGraph === null || matchGraph === undefined) {
        return;
      }

      let matchPoint = matchGraph.points
          .find(item => item.key === pointKey);
      if (matchPoint === null || matchPoint === undefined) {
        return;
      }

      this.dragGraph = null;
      this.dragPoint = null;
    },

    /**
     * 图形新建完成事件处理
     */
    onComplete: function () {
      this.completeSelectGraph();
    },
    /**
     * 1.将当前图形设置为完成
     * 2.清除已选择图形、连接点
     */
    completeSelectGraph: function () {
      if (this.selectGraph !== null) {
        this.selectGraph.complete = true;
      }
      this.clearSelectGraph();
    },
    /**
     * 清除已选择图形、连接点
     */
    clearSelectGraph: function () {
      if (this.selectGraph !== null &&
          this.selectGraph !== undefined) {
        this.selectGraph.select = false;
      }
      if (this.selectPoint !== null &&
          this.selectPoint !== undefined) {
        this.selectPoint.select = false;
      }
      this.selectGraph = null;
      this.selectPoint = null;
    },

    /**
     * 新创建图形
     * @param event
     */
    genNewGraph: function (event) {
      if (this.selectCreateGraph === this.graphType.line) {
        const newLine = this.genNewLine(event);
        this.selectGraph = newLine;
        this.lines.push(newLine)
        this.graphs.push(newLine)
      } else if (this.selectCreateGraph === this.graphType.lineStrip) {
        const newLineStrip = this.genNewLineStrip(event);
        this.selectGraph = newLineStrip;
        this.lineStrips.push(newLineStrip)
        this.graphs.push(newLineStrip)
      } else if (this.selectCreateGraph === this.graphType.circle) {
        const newCircle = this.genNewCircle(event);
        this.selectGraph = newCircle;
        this.circles.push(newCircle)
        this.graphs.push(newCircle)
      } else if (this.selectCreateGraph === this.graphType.rectangle) {
        const newRectangle = this.genNewRectangle(event);
        this.selectGraph = newRectangle;
        this.rectangles.push(newRectangle)
        this.graphs.push(newRectangle)
      } else if (this.selectCreateGraph === this.graphType.polygon) {
        const newPolygon = this.genNewPolygon(event);
        this.selectGraph = newPolygon;
        this.polygons.push(newPolygon)
        this.graphs.push(newPolygon)
      }
    },
    genNewLine: function (event) {
      return {
        key: this.getNextKey(),
        type: 'line',
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genNewLineStrip: function (event) {
      return {
        key: this.getNextKey(),
        type: 'lineStrip',
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genNewCircle: function (event) {
      return {
        key: this.getNextKey(),
        type: 'circle',
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genNewRectangle: function (event) {
      return {
        key: this.getNextKey(),
        type: 'rectangle',
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genNewPolygon: function (event) {
      return {
        key: this.getNextKey(),
        type: 'polygon',
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genPoint: function (event) {
      let p = {
        key: this.getNextKey(),
        select: false,
      }
      this.syncPosition(p, event)

      return p;
    },
    syncPosition(position, event) {
      position.x = event.offsetX;
      position.y = event.offsetY;
    },
    getNextKey: function () {
      this.key = this.key + 1;
      return this.key;
    },


    /**
     * hotKey事件处理
     * @param event
     */
    hotKeyHandler: function (event) {
      // Delete: 删除操作
      // ctrl+z: 撤销操作
      // alt+`: 编辑模式
      // alt+1: 创建矩形
      // alt+2: 创建多边形
      // alt+3: 创建线条
      // alt+4: 创建连线
      // alt+5: 创建圆形
      if (event.ctrlKey) {
        if (event.key === 'z') {
          this.onRevoke();
        }
      } else if (event.altKey) {
        if (event.key === '`') {
          this.onEdit();
        } else if (event.key === '1') {
          this.onCreateRectangle();
        } else if (event.key === '2') {
          this.onCreatePolygon();
        } else if (event.key === '3') {
          this.onCreateLine();
        } else if (event.key === '4') {
          this.onCreateLineStrip();
        } else if (event.key === '5') {
          this.onCreateCircle();
        }
      } else if (event.key === 'Delete') {
        this.onDelete();
      }
    }
  },

  created() {
    this.key = 0;
    this.graphType = {
      line: "line",
      lineStrip: "lineStrip",
      circle: "circle",
      rectangle: "rectangle",
      polygon: "polygon",
    };
    this.modelType = {
      create: "create",
      edit: "edit",
    };
    // 注册快捷键事件处理
    window.addEventListener('keyup', this.hotKeyHandler);
  },
  destroyed() {
    // 销毁快捷键事件处理
    window.removeEventListener('keyup', this.hotKeyHandler)
  }
}
</script>

<template src="./LabelVue.html"></template>
<style src="./LabelVue.css"></style>