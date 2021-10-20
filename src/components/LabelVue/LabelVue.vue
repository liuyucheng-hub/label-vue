<template src="./LabelVue.html"></template>

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
    // 初始的高度和宽度
    height: {
      type: Number,
      default: 600,
    },
    width: {
      type: Number,
      default: 800,
    },
    // 背景图片地址
    imgUrl: String,
  },

  data: function () {
    return {
      key: null,

      // 工具栏相关属性
      // 操作模式，创建/编辑
      model: null,
      // 选择的创建模式
      selectCreateGraph: '',

      // 编辑窗相关属性
      // 当前操作图形对象
      selectGraph: null,
      // 当前操作图形连接点对象
      selectPoint: null,
      // 当前拖动的图形对象
      dragGraph: null,
      // 当前拖动的图形连接点对象
      dragPoint: null,

      // 各种图形对象集合
      lines: [],
      lineStrips: [],
      circles: [],
      rectangles: [],
      polygons: [],
      // 所有图形对象集合
      graphs: [],
    }
  },

  methods: {
    /**
     * 当前是创建模式
     */
    isCreateModel: function () {
      return this.model === modelType.create;
    },

    /**
     * 当前是编辑模式
     */
    isEditModel: function () {
      return this.model === modelType.edit
    },

    /**
     * 检查图形类型
     */
    isLine: function (type) {
      return graphType.line === type;
    },
    isLineStrip: function (type) {
      return graphType.lineStrip === type;
    },
    isCircle: function (type) {
      return graphType.circle === type;
    },
    isRectangle: function (type) {
      return graphType.rectangle === type;
    },
    isPolygon: function (type) {
      return graphType.polygon === type;
    },

    /**
     * 设置创建模式
     */
    setCreateModel: function (graphType) {
      this.model = modelType.create;
      this.selectCreateGraph = graphType;
    },

    /**
     * 设置编辑模式
     */
    setEditModel: function () {
      this.model = modelType.edit;
      this.selectCreateGraph = null;
    },

    /**
     * 同步鼠标事件的坐标值
     */
    syncPosition(position, event) {
      position.x = event.offsetX;
      position.y = event.offsetY;
    },

    /**
     * 删除一种图形的最后一个图形
     */
    deleteLastGraph: function (type) {
      if (type === null || type === undefined) {
        return;
      }
      if (this.isLine(type)) {
        this.lines.pop()
      } else if (this.isLineStrip(type)) {
        this.lineStrips.pop();
      } else if (this.isCircle(type)) {
        this.circles.pop();
      } else if (this.isRectangle(type)) {
        this.rectangles.pop();
      } else if (this.isPolygon(type)) {
        this.polygons.pop();
      }
      this.graphs.pop();
      this.selectGraph = null;
    },

    /**
     * 删除一个图形
     */
    deleteGraph: function (graph) {
      if (graph === null || graph === undefined) {
        return;
      }

      if (this.isLine(graph.type)) {
        this.lines = this.lines
            .filter(item => item.key !== graph.key)
      } else if (this.isLineStrip(graph.type)) {
        this.lineStrips = this.lineStrips
            .filter(item => item.key !== graph.key)
      } else if (this.isCircle(graph.type)) {
        this.circles = this.circles
            .filter(item => item.key !== graph.key)
      } else if (this.isRectangle(graph.type)) {
        this.rectangles = this.rectangles
            .filter(item => item.key !== graph.key)
      } else if (this.isPolygon(graph.type)) {
        this.polygons = this.polygons
            .filter(item => item.key !== graph.key)
      }
      this.graphs = this.graphs
          .filter(item => item.key !== graph.key)
    },

    /**
     * 当前操作的图形创建完成
     * 1.将当前图形设置为完成
     * 2.清除已选择图形、连接点
     */
    completeSelectGraph: function () {
      if (this.selectGraph !== null) {
        this.selectGraph.complete = true;
      }
      this.clearSelectGraphAndPoint();
    },

    /**
     * 清除已选择图形、连接点
     */
    clearSelectGraphAndPoint: function () {
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
     * 创建图形对象
     */
    genNewGraph: function (event) {
      if (this.isLine(this.selectCreateGraph)) {
        const newLine = this.genNewLine(event);
        this.selectGraph = newLine;
        this.lines.push(newLine)
        this.graphs.push(newLine)
      } else if (this.isLineStrip(this.selectCreateGraph)) {
        const newLineStrip = this.genNewLineStrip(event);
        this.selectGraph = newLineStrip;
        this.lineStrips.push(newLineStrip)
        this.graphs.push(newLineStrip)
      } else if (this.isCircle(this.selectCreateGraph)) {
        const newCircle = this.genNewCircle(event);
        this.selectGraph = newCircle;
        this.circles.push(newCircle)
        this.graphs.push(newCircle)
      } else if (this.isRectangle(this.selectCreateGraph)) {
        const newRectangle = this.genNewRectangle(event);
        this.selectGraph = newRectangle;
        this.rectangles.push(newRectangle)
        this.graphs.push(newRectangle)
      } else if (this.isPolygon(this.selectCreateGraph)) {
        const newPolygon = this.genNewPolygon(event);
        this.selectGraph = newPolygon;
        this.polygons.push(newPolygon)
        this.graphs.push(newPolygon)
      }
    },

    /**
     * 创建线条对象
     */
    genNewLine: function (event) {
      return {
        key: this.getNextKey(),
        type: graphType.line,
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },

    /**
     * 创建连线对象
     */
    genNewLineStrip: function (event) {
      return {
        key: this.getNextKey(),
        type: graphType.lineStrip,
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },

    /**
     * 创建圆形对象
     */
    genNewCircle: function (event) {
      return {
        key: this.getNextKey(),
        type: graphType.circle,
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },

    /**
     * 创建矩形对象
     */
    genNewRectangle: function (event) {
      return {
        key: this.getNextKey(),
        type: graphType.rectangle,
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },

    /**
     * 创建多边形对象
     */
    genNewPolygon: function (event) {
      return {
        key: this.getNextKey(),
        type: graphType.polygon,
        select: false,
        complete: false,
        points: [this.genPoint(event)],
        position: this.genPoint(event),
      }
    },

    /**
     * 创建连接点对象
     */
    genPoint: function (event) {
      let p = {
        key: this.getNextKey(),
        select: false,
      }
      this.syncPosition(p, event)

      return p;
    },

    /**
     * 重置key
     */
    resetKey: function () {
      this.key = 0;
    },

    /**
     * 获取下一个key
     */
    getNextKey: function () {
      this.key = this.key + 1;
      return this.key;
    },

    /**
     * 注册全局快捷键事件处理
     */
    registerHotKey: function () {
      window.addEventListener('keyup', this.onHotKey);
    },

    /**
     * 销毁全局快捷键事件处理
     */
    removeHotKey() {
      window.removeEventListener('keyup', this.onHotKey)
    },

    /**
     * 鼠标移动事件处理
     */
    onMousemove: function (event) {
      if (this.isCreateModel()) {
        this.onMouseMoveForCreateModel(event);
      } else if (this.isEditModel()) {
        this.onMouseMoveForEditModel(event)
      }
    },

    /**
     * 创建模式下鼠标移动事件处理
     */
    onMouseMoveForCreateModel: function (event) {
      if (this.selectGraph !== null &&
          this.selectGraph !== undefined) {
        this.syncPosition(this.selectGraph.position, event)
      }
    },

    /**
     * 编辑模式下鼠标移动事件处理
     */
    onMouseMoveForEditModel: function (event) {
      if (this.dragPoint !== null &&
          this.dragPoint !== undefined) {
        this.syncPosition(this.dragPoint, event)
      }
    },

    /**
     * 鼠标点击事件处理
     */
    onMouseClick: function (event) {
      if (this.isCreateModel()) {
        this.onMouseClickForCreateModel(event);
      }
    },

    /**
     * 创建模式下鼠标点击事件处理
     */
    onMouseClickForCreateModel: function (event) {
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
     * 鼠标双击事件处理
     */
    onMouseDoubleClick: function () {
      this.completeSelectGraph();
    },

    /**
     * 图形点击事件处理
     */
    onGraphClick: function (graphKey) {
      if (this.isCreateModel()) {
        return;
      }

      let matchGraph = this.graphs
          .find(item => item.key === graphKey);
      if (matchGraph === null || matchGraph === undefined) {
        return;
      }

      this.clearSelectGraphAndPoint();
      matchGraph.select = true;
      this.selectGraph = matchGraph;
    },

    /**
     * 图形的连接点点击事件处理
     */
    onPointClick: function (graphKey, pointKey) {
      if (this.isCreateModel()) {
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

      this.clearSelectGraphAndPoint();
      matchGraph.select = true;
      this.selectGraph = matchGraph;
      matchPoint.select = true;
      this.selectPoint = matchPoint;
    },

    /**
     * 图形连接点开始拖动事件处理
     */
    onPointDragStart: function (graphKey, pointKey) {
      if (this.isCreateModel()) {
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

    /**
     * 图形连接点完成拖动事件处理
     */
    onPointDragEnd: function (graphKey, pointKey) {
      if (this.isCreateModel()) {
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
     * hotKey事件处理
     */
    onHotKey: function (event) {
      // Delete: 删除操作 ctrl+z: 撤销操作 alt+`: 编辑模式
      // alt+1: 创建矩形 alt+2: 创建多边形 alt+3: 创建线条
      // alt+4: 创建连线 alt+5: 创建圆形
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
    },

    /**
     * 撤销操作处理
     */
    onRevoke: function () {
      if (this.isCreateModel()) {
        this.onRevokeForCreateModel();
      } else if (this.isEditModel()) {
        this.onRevokeForEditModel();
      }
    },

    /**
     * 创建模式下撤销操作处理
     */
    onRevokeForCreateModel: function () {
      if (this.selectGraph === null ||
          this.selectGraph === undefined) {
        return;
      }

      // 正在创建图形仅有一个点，删除当前图形，其余情况删除最后一个点
      if (this.selectGraph.points.length > 1) {
        this.selectGraph.points.pop()
      } else {
        this.deleteLastGraph(this.selectGraph.type);
      }
    },

    /**
     * 编辑模式下撤销操作处理
     */
    onRevokeForEditModel: function () {
      if (this.graphs.length > 0) {
        this.deleteLastGraph(this.graphs[this.graphs.length - 1].type)
      }
    },

    /**
     * 删除操作处理
     */
    onDelete: function () {
      if (this.isEditModel()) {
        this.onDeleteForEditModel();
      }
    },

    /**
     * 编辑模式下删除操作处理
     */
    onDeleteForEditModel: function () {
      //todo 选中节点和图形的关系
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
    },

    /**
     * 创建线条操作处理
     */
    onCreateLine: function () {
      if (this.isCreateModel() &&
          this.isLine(this.selectCreateGraph)) {
        return;
      }
      this.setCreateModel(graphType.line)
      this.completeSelectGraph();
    },

    /**
     * 创建连线操作处理
     */
    onCreateLineStrip: function () {
      if (this.isCreateModel() &&
          this.isLineStrip(this.selectCreateGraph)) {
        return;
      }
      this.setCreateModel(graphType.lineStrip)
      this.completeSelectGraph();
    },

    /**
     * 创建圆形操作处理
     */
    onCreateCircle: function () {
      if (this.isCreateModel() &&
          this.isCircle(this.selectCreateGraph)) {
        return;
      }
      this.setCreateModel(graphType.circle)
      this.completeSelectGraph();
    },

    /**
     * 创建矩形操作处理
     */
    onCreateRectangle: function () {
      if (this.isCreateModel() &&
          this.isRectangle(this.selectCreateGraph)) {
        return;
      }
      this.setCreateModel(graphType.rectangle)
      this.completeSelectGraph();
    },

    /**
     * 创建多边形操作处理
     */
    onCreatePolygon: function () {
      if (this.isCreateModel() &&
          this.isPolygon(this.selectCreateGraph)) {
        return;
      }
      this.setCreateModel(graphType.polygon)
      this.completeSelectGraph();
    },

    /**
     * 编辑操作处理
     */
    onEdit: function () {
      this.setEditModel();
      this.completeSelectGraph();
    },

    /**
     * 保存操作处理
     */
    onSave: function () {
      this.completeSelectGraph();
      console.log(this.graphs);
    },
  },

  created() {
    this.resetKey();
    this.registerHotKey();
  },

  destroyed() {
    this.removeHotKey();
  },
}

const graphType = {
  line: "line",
  lineStrip: "lineStrip",
  circle: "circle",
  rectangle: "rectangle",
  polygon: "polygon",
};

const modelType = {
  create: "create",
  edit: "edit",
}
</script>

<style src="./LabelVue.css"></style>