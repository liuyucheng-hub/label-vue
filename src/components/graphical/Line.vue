<template>

</template>

<script>
export default {
  name: "line"
}

// function genLine() {
//   return {
//     type: graphicalType.line,
//     coordinate: [],
//     point: [],
//     tag: '',
//
//     // 检查图形新建完成
//     isComplete() {
//       return this.coordinate !== null &&
//           this.coordinate !== undefined &&
//           this.coordinate.length === 2;
//     },
//
//     // 鼠标点击事件处理
//     onclick(event) {
//       if (this.isComplete()) {
//         return;
//       }
//       let x = getX(event);
//       let y = getY(event);
//       this.coordinate.push({x: x, y: y})
//     }
//   }
// }
</script>

<style scoped>

</style>