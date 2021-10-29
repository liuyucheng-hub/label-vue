<template>
  <div id="label-vue-text-box"
       v-bind:style="styleObject">
    <div class="label-vue-text-box-item">
      <input type="text"
             placeholder="填写标签"
             class="label-vue-text-input"
             v-model="graph.tag">
    </div>
    <div class="label-vue-text-box-item">
      <textarea cols="30" rows="5"
                placeholder="填写内容"
                class="label-vue-text-input"
                v-model="graph.content"></textarea>
    </div>
    <div class="label-vue-text-box-item" style="text-align: right">
      <button class="label-vue-text-btn" v-on:click.stop="onClick"><span>确定</span></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LabelTextBox",

  props: {
    graph: Object,
    positionX: Number,
    positionY: Number,
    show: Boolean,
  },

  computed: {
    styleObject: function () {
      let obj = {}
      if (this.show) {
        obj['transform'] = `translate(${this.positionX}px,${this.positionY}px)`;
        obj['-webkit-transform'] = `translate(${this.positionX}px,${this.positionY}px)`;
        obj['visibility'] = 'visible';
      } else {
        obj['visibility'] = 'hidden';
      }
      return obj
    },
  },

  methods: {
    onClick: function () {
      this.$emit("ok")
    },
  },
}
</script>

<style scoped>
#label-vue-text-box {
  position: fixed;
  z-index: 99999;
  width: 400px;
  padding: 10px 0;
  opacity: 1;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  box-shadow: 2px 2px 42px #0006;
}

.label-vue-text-box-item {
  margin: 10px 0;
  padding: 0 10px;
}

.label-vue-text-input {
  text-overflow: ellipsis;
  box-sizing: border-box;
  margin: 0;
  list-style: none;
  position: relative;
  display: inline-block;
  width: 100%;
  padding: 4px 11px;
  color: #000000d9;
  font-size: 12px;
  line-height: 1.4;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  resize: none;
}

.label-vue-text-btn {
  line-height: 1.4;
  position: relative;
  display: inline-block;
  text-align: center;
  border: 1px solid #d9d9d9;
  box-shadow: 0 2px #00000004;
  cursor: pointer;
  padding: 4px 15px;
  font-size: 12px;
  border-radius: 2px;
  color: #000000d9;
  background: #fff;
}

</style>