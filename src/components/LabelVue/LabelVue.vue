<template src="./LabelVue.html"></template>

<script>
import LabelLineStrip from "../LabelLineStrip.vue";
import LabelCircle from "../LabelCircle.vue";
import LabelRectangle from "../LabelRectangle.vue";
import LabelTextBox from "../LabelTextBox";
import LabelToolBar from "../LabelToolBar/LabelToolBar";
import LabelList from "../LabelList/LabelList";

export default {
  name: "label-vue",

  components: {
    LabelLineStrip,
    LabelCircle,
    LabelRectangle,
    LabelTextBox,
    LabelToolBar,
    LabelList,
  },

  props: {
    // 背景图片地址
    imgUrl: String,
  },

  data: function () {
    return {
      // 组件状态相关属性
      // 图形元素的key序列
      key: null,
      // 编辑框的scroll值
      editorScrollTopRate: null,
      editorScrollLeftRate: null,
      // 加载图片的高度、宽度
      boardHeight: null,
      boardWidth: null,
      // 画板的缩放比例
      boardScale: null,
      // 画板填满编辑窗的缩放比例
      fitWindowScale: null,
      // 画板的margin值
      boarderMarginTop: null,
      boarderMarginLeft: null,
      textBoxShow: null,
      textBoxPositionX: null,
      textBoxPositionY: null,
      textBoxGraph: null,

      // 操作模式，创建/编辑
      model: null,
      // 选择的创建模式
      selectCreateGraph: '',
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
      // 手动操作添加的图形和连接点
      operateGraphs: []
    }
  },

  computed: {
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
     * 计算编辑框的style属性
     */
    editorStyleObject: function () {
      let boarderLessEditor = this.boarderMarginLeft > 0 && this.boarderMarginTop > 0;
      return {
        'overflow': boarderLessEditor ? 'hidden' : 'auto',
      }
    },


    /**
     * 计算board的style属性
     */
    boardStyleObject: function () {
      return {
        'cursor': this.isCreateModel ? 'crosshair' : 'auto',
        'height': this.boardHeight + 'px',
        'width': this.boardWidth + 'px',
        'margin-top': this.boarderMarginTop + 'px',
        'margin-left': this.boarderMarginLeft + 'px',
        'transform': `scale(${this.boardScale}, ${this.boardScale})`,
        '-webkit-transform': `scale(${this.boardScale}, ${this.boardScale})`,
      }
    },

    /**
     * svg的style属性
     */
    svgStyleObject: function () {
      return {
        'height': this.boardHeight,
        'width': this.boardWidth,
      }
    }
  },

  methods: {
    /**
     * 初始化board
     */
    initStatus: function () {
      this.key = 0;
      this.boardScale = 1;
      this.fitWindowScale = 1;
      this.boardHeight = 0;
      this.boardWidth = 0;
      this.boarderMarginTop = 0;
      this.boarderMarginLeft = 0;
      this.editorScrollTopRate = 0;
      this.editorScrollLeftRate = 0;
      this.textBoxShow = false;
      this.textBoxPositionX = 0;
      this.textBoxPositionY = 0;
      this.textBoxGraph = {};
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

    setTextBoxShow: function (graph) {
      this.textBoxShow = true;
      this.textBoxGraph = graph;
    },

    setTextBoxHidden: function () {
      this.textBoxGraph = {};
      this.textBoxShow = false;
    },

    /**
     * 设置画板的缩放比例
     */
    setBoardScale: function (scale) {
      this.completeEditorScrollRate();
      this.boardScale = scale;
      this.completeBoarderMargin();
      // 等待先渲染
      setTimeout(() => {
        this.completeEditorScrollValue();
      }, 0);
    },

    /**
     * 计算画板margin的值
     */
    completeBoarderMargin: function () {
      this.completeBoarderMarginTop();
      this.completeBoarderMarginLeft();
    },

    /**
     * 计算画板margin-top的值
     */
    completeBoarderMarginTop: function () {
      let editorHeight = 0;
      if (this.$refs.editor !== null && this.$refs.editor !== undefined) {
        editorHeight = this.$refs.editor.offsetHeight;
      }

      if (this.isGrateZero(editorHeight) &&
          this.isGrateZero(this.boardHeight)) {
        let diff = editorHeight - this.boardHeight * this.boardScale;
        this.boarderMarginTop = diff > 0 ? diff / 2 : 0
      } else {
        this.boarderMarginTop = 0
      }
    },
    /**
     * 计算画板margin-left的值
     */
    completeBoarderMarginLeft: function () {
      let editorWidth = 0;
      if (this.$refs.editor !== null && this.$refs.editor !== undefined) {
        editorWidth = this.$refs.editor.offsetWidth
      }
      if (this.isGrateZero(editorWidth) &&
          this.isGrateZero(this.boardWidth)) {
        let diff = editorWidth - this.boardWidth * this.boardScale;
        this.boarderMarginLeft = diff > 0 ? diff / 2 : 0
      } else {
        this.boarderMarginLeft = 0;
      }
    },

    /**
     * 计算editor的滑动比例
     */
    completeEditorScrollRate: function () {
      if (this.isEditorScrollTop()) {
        // 纵向滑动量,等价scrollTop / scrollHeight - clientHeight
        const scrollHeightValue = this.boardHeight * this.boardScale - this.$refs.editor.clientHeight;
        this.editorScrollTopRate = this.$refs.editor.scrollTop / scrollHeightValue
      } else {
        this.editorScrollTopRate = 0;
      }
      if (this.isEditorScrollLeft()) {
        // 横向滑动量,等价scrollLeft / scrollWidth - clientWidth
        const scrollWidthValue = this.boardWidth * this.boardScale - this.$refs.editor.clientWidth;
        this.editorScrollLeftRate = this.$refs.editor.scrollLeft / scrollWidthValue
      } else {
        this.editorScrollLeftRate = 0;
      }
    },

    /**
     * 根据滑动比例计算滑动量
     */
    completeEditorScrollValue: function () {
      if (!this.isEditorScrollTop() &&
          !this.isEditorScrollLeft()) {
        return
      }

      let ele = document.getElementById('label-vue-editor');
      if (this.isEditorScrollTop()) {
        // 从不滑动放大到需要滑动，取中间50%
        if (this.editorScrollTopRate === 0) {
          this.editorScrollTopRate = 0.5
        }
        const scrollHeightValue = this.boardHeight * this.boardScale - ele.clientHeight;
        ele.scrollTop = this.editorScrollTopRate * scrollHeightValue;
      }
      if (this.isEditorScrollLeft()) {
        if (this.editorScrollLeftRate === 0) {
          this.editorScrollLeftRate = 0.5
        }
        const scrollWidthValue = this.boardWidth * this.boardScale - ele.clientWidth;
        ele.scrollLeft = this.editorScrollLeftRate * scrollWidthValue;
      }
    },

    /**
     * editor纵向有发生滑动
     */
    isEditorScrollTop: function () {
      return this.boardHeight * this.boardScale >= this.$refs.editor.clientHeight
    },

    /**
     * editor横向有发生滑动
     */
    isEditorScrollLeft: function () {
      return this.boardWidth * this.boardScale >= this.$refs.editor.clientWidth
    },

    /**
     * 同步鼠标事件的坐标值
     */
    syncPosition: function (position, event) {
      position.x = event.offsetX;
      position.y = event.offsetY;
    },

    /**
     * 图形的连接点同步鼠标偏移量
     */
    syncMovementPosition: function (graph, event) {
      // 高分屏幕像素比例问题
      const mx = event.movementX / window.devicePixelRatio / this.boardScale;
      const my = event.movementY / window.devicePixelRatio / this.boardScale;
      graph.points.forEach(p => {
        p.x += mx;
        p.y += my
      })
    },

    /**
     * 计算画板属性
     */
    fullBoard: function () {
      this.completeBoardScale();
    },

    /**
     * board占满整个editor
     */
    completeBoardScale: function () {
      const editorHeight = this.$refs.editor.offsetHeight;
      const editorWidth = this.$refs.editor.offsetWidth;
      if (!this.isGrateZero(editorHeight) ||
          !this.isGrateZero(editorWidth) ||
          !this.isGrateZero(this.boardHeight) ||
          !this.isGrateZero(this.boardWidth)) {
        return;
      }

      const heightScaleRate = editorHeight / this.boardHeight;
      const widthScaleRate = editorWidth / this.boardWidth;
      let scale;
      if (heightScaleRate > widthScaleRate) {
        scale = parseInt(widthScaleRate / 0.25, 10) * 0.25;
      } else {
        scale = parseInt(heightScaleRate / 0.25, 10) * 0.25
      }
      this.setBoardScale(scale);
      this.fitWindowScale = this.boardScale;
    },

    isGrateZero: function (value) {
      return value !== null &&
          value !== undefined &&
          value > 0;
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
     * 通过手动操作添加图形
     */
    addGraphForOperate: function (graph) {
      this.addGraph(graph);
      this.operateGraphs.push({
        graph: graph
      });
    },

    /**
     * 添加图形
     */
    addGraph: function (graph) {
      if (this.isLine(graph.type)) {
        this.lines.push(graph)
        this.graphs.push(graph)
      } else if (this.isLineStrip(graph.type)) {
        this.lineStrips.push(graph)
        this.graphs.push(graph)
      } else if (this.isCircle(graph.type)) {
        this.circles.push(graph)
        this.graphs.push(graph)
      } else if (this.isRectangle(graph.type)) {
        this.rectangles.push(graph)
        this.graphs.push(graph)
      } else if (this.isPolygon(graph.type)) {
        this.polygons.push(graph)
        this.graphs.push(graph)
      }
    },

    /**
     * 通过手动操作在图形中添加连接点
     */
    addPointForOperate: function (graph, point, index) {
      this.addPoint(graph, point, index)
      this.operateGraphs.push({
        graph: graph,
        point: point,
      });
    },

    /**
     * 图形中添加连接点
     */
    addPoint: function (graph, point, index) {
      if (index !== null &&
          index !== undefined) {
        graph.points.splice(index + 1, 0, point)
      } else {
        graph.points.push(point)
      }
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

      if (this.selectGraph === graph) {
        this.selectGraph = null;
      }
    },

    /**
     * 删除图形中的一个连接点
     */
    deletePoint: function (graph, point) {
      if (graph.points.length <= 1) {
        this.deleteGraph(graph);
      } else {
        graph.points = graph.points
            .filter(item => item.key !== point.key);
      }

      if (this.selectPoint === point) {
        this.selectPoint = null;
      }
    },

    /**
     * 当前操作的图形创建完成
     * 1.将当前图形设置为完成
     * 2.清除已选择图形、连接点
     */
    completeSelectGraph: function () {
      if (this.selectGraph !== null &&
          this.selectGraph !== undefined &&
          !this.selectGraph.complete) {
        this.selectGraph.complete = true;
        this.setTextBoxShow(this.selectGraph);
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
        return this.genNewLine(event);
      } else if (this.isLineStrip(this.selectCreateGraph)) {
        return this.genNewLineStrip(event);
      } else if (this.isCircle(this.selectCreateGraph)) {
        return this.genNewCircle(event);
      } else if (this.isRectangle(this.selectCreateGraph)) {
        return this.genNewRectangle(event);
      } else if (this.isPolygon(this.selectCreateGraph)) {
        return this.genNewPolygon(event);
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
        tag: '',
        content: '',
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
        tag: '',
        content: '',
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
        tag: '',
        content: '',
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
        tag: '',
        content: '',
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
        tag: '',
        content: '',
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
      if (this.isCreateModel) {
        this.onMousemoveForCreateModel(event);
      } else if (this.isEditModel) {
        this.onMousemoveForEditModel(event)
      }
    },

    /**
     * 创建模式下鼠标移动事件处理
     */
    onMousemoveForCreateModel: function (event) {
      if (this.selectGraph !== null &&
          this.selectGraph !== undefined) {
        this.syncPosition(this.selectGraph.position, event)
      }
    },

    /**
     * 编辑模式下鼠标移动事件处理
     */
    onMousemoveForEditModel: function (event) {
      // 优先移动点
      if (this.dragPoint !== null &&
          this.dragPoint !== undefined) {
        this.syncPosition(this.dragPoint, event)
        return;
      }
      if (this.dragGraph !== null &&
          this.dragGraph !== undefined) {
        this.syncMovementPosition(this.dragGraph, event);
      }
    },

    /**
     * 鼠标单击事件处理
     */
    onMouseClick: function (event) {
      if (this.isCreateModel) {
        this.onMouseClickForCreateModel(event);
      }
      if (this.isEditModel) {
        this.onMouseClickForEditModel(event);
      }
    },

    /**
     * 创建模式下鼠标单击事件处理
     */
    onMouseClickForCreateModel: function (event) {
      if (this.selectGraph === null ||
          this.selectGraph === undefined) {
        // 没有正在处理的图形对象
        let newGraph = this.genNewGraph(event);
        this.selectGraph = newGraph;
        this.addGraphForOperate(newGraph);
      } else {
        // 有正在处理的图形对象
        this.addPointForOperate(this.selectGraph, this.genPoint(event))
      }
    },

    /**
     * 编辑模式下鼠标单击事件处理
     */
    onMouseClickForEditModel: function (event) {
      // 在已选择连接点的前面添加连接点
      if (this.selectGraph !== null &&
          this.selectGraph !== undefined &&
          this.selectPoint !== null &&
          this.selectPoint !== undefined &&
          event.ctrlKey) {
        const index = this.selectGraph.points.indexOf(this.selectPoint);
        if (index > -1) {
          const newPoint = this.genPoint(event);
          this.addPointForOperate(this.selectGraph, newPoint, index)
          // 以新建立的节点为基点
          this.selectPoint.select = false;
          newPoint.select = true;
          this.selectPoint = newPoint;
        }
      }
    },

    /**
     * 图片加载事件
     */
    onImgLoad: function () {
      this.boardHeight = this.$refs.img.height
      this.boardWidth = this.$refs.img.width
      this.fullBoard()
    },

    /**
     * 图形点击事件处理
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

      this.clearSelectGraphAndPoint();
      matchGraph.select = true;
      this.selectGraph = matchGraph;
    },

    /**
     * 显示标注文本框
     */
    onGraphAltClick: function (graphKey) {
      if (this.isEditModel) {
        this.onGraphClick(graphKey);
        if (this.selectGraph !== null &&
            this.selectGraph !== undefined) {
          this.setTextBoxShow(this.selectGraph);
        }
      }
    },

    onGraphDragStart: function (graphKey) {
      if (this.isCreateModel) {
        return;
      }

      let matchGraph = this.graphs
          .find(item => item.key === graphKey);
      if (matchGraph === null || matchGraph === undefined) {
        return;
      }

      this.dragGraph = matchGraph;
    },

    onGraphDragEnd: function (graphKey) {
      if (this.isCreateModel) {
        return;
      }

      let matchGraph = this.graphs
          .find(item => item.key === graphKey);
      if (matchGraph === null || matchGraph === undefined) {
        return;
      }

      this.dragGraph = null;
    },

    /**
     * 图形的连接点点击事件处理
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

      this.dragPoint = matchPoint;
    },

    /**
     * 图形连接点完成拖动事件处理
     */
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

      this.dragPoint = null;
    },

    /**
     * 图形新建完成事件处理
     */
    onComplete: function () {
      this.completeSelectGraph();
    },

    /**
     * textBox点击确认按钮
     */
    onTextBoxOK: function () {
      this.setTextBoxHidden();
    },

    /**
     * hotKey事件处理
     */
    onHotKey: function (event) {
      // Delete: 删除操作 ctrl+z: 撤销操作 alt+`: 编辑模式
      // alt+1: 创建矩形 alt+2: 创建多边形 alt+3: 创建线条
      // alt+4: 创建连线 alt+5: 创建圆形 enter: 创建完成
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
        if (event.key === '+') {
          this.onZoomIn();
        }
        if (event.key === '-') {
          this.onZoomOut();
        }
      } else if (event.key === 'Delete') {
        this.onDelete();
      } else if (event.key === 'Enter') {
        this.completeSelectGraph()
      }
    },

    /**
     * 撤销操作处理
     */
    onRevoke: function () {
      let lastOperate = this.operateGraphs.pop();
      if (lastOperate === null || lastOperate === undefined) {
        return;
      }

      if (lastOperate.point !== null && lastOperate.point !== undefined) {
        this.deletePoint(lastOperate.graph, lastOperate.point)
      } else {
        this.deleteGraph(lastOperate.graph)
      }
    },

    /**
     * 删除操作处理
     */
    onDelete: function () {
      if (this.isEditModel) {
        this.onDeleteForEditModel();
      }
    },

    /**
     * 编辑模式下删除操作处理
     */
    onDeleteForEditModel: function () {
      // 优先point
      if (this.selectPoint !== null) {
        this.deletePoint(this.selectGraph, this.selectPoint);
        return;
      }
      if (this.selectGraph !== null) {
        this.deleteGraph(this.selectGraph);
      }
    },

    /**
     * 创建线条操作处理
     */
    onCreateLine: function () {
      if (this.isCreateModel &&
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
      if (this.isCreateModel &&
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
      if (this.isCreateModel &&
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
      if (this.isCreateModel &&
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
      if (this.isCreateModel &&
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
     * 放大画板
     */
    onZoomIn: function () {
      this.setBoardScale(this.boardScale + 0.25)
    },

    /**
     * 缩小画板
     */
    onZoomOut: function () {
      if (this.boardScale - 0.25 > 0) {
        this.setBoardScale(this.boardScale - 0.25)
      }
    },

    /**
     * 画板恢复到填充满编辑窗
     */
    onFitWindow: function () {
      this.fullBoard();
    },

    /**
     * 画板恢复到图片原始大小
     */
    onOriginalSize: function () {
      this.setBoardScale(1)
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
    this.registerHotKey();
    this.initStatus();
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