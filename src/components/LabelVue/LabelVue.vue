<script>
import LabelLine from "../LabelLine.vue";
import LabelLineStrip from "../LabelLineStrip.vue";
import LabelCircle from "../LabelCircle.vue";
import LabelRectangle from "../LabelRectangle.vue";
import LabelPolygon from "../LabelPolygon.vue";


export default {
  name: "label-vue",
  components: {
    LabelLine,
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
    // 鼠标移动处理
    onMousemove: function (event) {
      if (this.isCreateModel) {
        this.onMouseMoveForCreateModel(event);
      } else if (this.isEditModel) {
        this.onMouseMoveForEditModel(event)
      }
    },
    onMouseMoveForCreateModel: function (event) {
      if (this.selectGraph === null ||
          this.selectGraph === undefined) {
        return;
      }
      this.selectGraph.position.x = event.offsetX;
      this.selectGraph.position.y = event.offsetY;
    },
    onMouseMoveForEditModel: function (event) {
      // dragPoint优先
      if (this.dragPoint !== null && this.dragPoint !== undefined) {
        this.dragPoint.x = event.offsetX;
        this.dragPoint.y = event.offsetY;
      }
      if (this.dragGraph !== null && this.dragGraph !== undefined) {
        this.dragGraph.position.x = event.offsetX;
        this.dragGraph.position.y = event.offsetY;
      }
    },

    // 鼠标点击处理
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

    // 撤销操作处理
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
      // 正在创建图形
      if (this.selectGraph.points.length > 1) {
        // 撤销最后一个点
        this.selectGraph.points.pop()
      } else {
        // 仅有一个点，删除当前图形
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

    // 删除操作处理
    onDelete: function () {
      // 仅编辑模式下
      if (this.isEditModel) {
        // 优先point
        if (this.selectPoint !== null) {
          if (this.selectGraph.points.length === 1) {
            this.deleteGraph(this.selectGraph);
          }
          return;
        }
        if (this.selectGraph !== null) {
          this.deleteGraph(this.selectGraph);
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
      } else if (graph.type === this.graphType.lineStrips) {
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

    // 编辑操作处理
    onEdit: function () {
      this.model = this.modelType.edit;
      this.selectCreateGraph = null;
    },

    // 创建线条操作处理
    onCreateLine: function () {
      this.model = this.modelType.create;
      this.selectCreateGraph = this.graphType.line;
    },

    // 创建连线操作处理
    onCreateLineStrip: function () {
      this.model = this.modelType.create;
      this.selectCreateGraph = this.graphType.lineStrip;
    },

    // 创建圆形操作处理
    onCreateCircle: function () {
      this.model = this.modelType.create;
      this.selectCreateGraph = this.graphType.circle;
    },

    // 创建矩形操作处理
    onCreateRectangle: function () {
      this.model = this.modelType.create;
      this.selectCreateGraph = this.graphType.rectangle;
    },

    // 创建多边形操作处理
    onCreatePolygon: function () {
      this.model = this.modelType.create;
      this.selectCreateGraph = this.graphType.polygon;
    },

    onComplete: function () {
      this.selectGraph = null;
    },

    onGraphClick: function (graphKey) {
      if (this.isCreateModel) {
        return;
      }

      let matchGraph = this.graphs
          .find(item => item.key === graphKey);
      if (matchGraph === null || matchGraph === undefined) {
        return;
      }

      if (this.selectGraph !== null && this.selectGraph !== undefined) {
        this.selectGraph.select = false;
      }
      this.selectGraph = matchGraph;
      this.selectGraph.select = true;
    },
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

      if (this.selectGraph !== null && this.selectGraph !== undefined) {
        this.selectGraph.select = false;
      }
      this.selectGraph = matchGraph;
      this.selectGraph.select = true;
      if (this.selectPoint !== null && this.selectPoint !== undefined) {
        this.selectPoint.select = false;
      }
      this.selectPoint = matchPoint;
      this.selectPoint.select = true;
    },

    onSave: function () {
      console.log(this.graphs);
    },

    // 新创建图形
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
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genNewLineStrip: function (event) {
      return {
        key: this.getNextKey(),
        type: 'lineStrip',
        select: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genNewCircle: function (event) {
      return {
        key: this.getNextKey(),
        type: 'circle',
        select: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genNewRectangle: function (event) {
      return {
        key: this.getNextKey(),
        type: 'rectangle',
        select: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genNewPolygon: function (event) {
      return {
        key: this.getNextKey(),
        type: 'polygon',
        select: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },
    genPoint: function (event) {
      return {
        key: this.getNextKey(),
        select: false,
        x: event.offsetX,
        y: event.offsetY
      };
    },
    getNextKey: function () {
      this.key = this.key + 1;
      return this.key;
    },
    // hotKey事件处理
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
<style scoped src="./LabelVue.css"></style>