<template src="./LabelToolBar.html"></template>

<script>
export default {
  name: "LabelToolBar",

  methods: {
    onCreateRectangle: function () {
      this.$emit("createRectangle");
    },
    onCreatePolygon: function () {
      this.$emit("createPolygon");

    },
    onCreateLine: function () {
      this.$emit("createLine");

    },
    onCreateLineStrip: function () {
      this.$emit("createLineStrip");

    },
    onCreateCircle: function () {
      this.$emit("createCircle");

    },
    onEdit: function () {
      this.$emit("edit");

    },
    onRevoke: function () {
      this.$emit("revoke");

    },
    onDelete: function () {
      this.$emit("delete");

    },
    onZoomIn: function () {
      this.$emit("zoomIn");

    },
    onZoomOut: function () {
      this.$emit("zoomOut");
    },
    onFitWindow: function () {
      this.$emit("fitWindow");
    },
    onOriginalSize: function () {
      this.$emit("originalSize");

    },
    onSave: function () {
      this.$emit("save");
    },
  },
}
</script>

<style scoped src="./LabelToolBar.css"></style>