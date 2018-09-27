<template>
  <div v-moveable="{setXY}"  class="layer" :style="layerStyle">
    {{code}}
  </div>
</template>

<script>
import layerMixin from './layerMixin.js'
export default {
  mixins: [layerMixin],
  props: {
    code: {
      type: String,
      default: '8888'
    }
  },
  data () {
    return {
      // countdown: '00:00'
    }
  },
  watch: {
    // 'layer.time' (val) {
    //   this.dealCountdown()
    // }
  },
  computed: {
    layerStyle () {
      let style = this.getBaseStyle()
      style.color = this.layer.color
      style.fontSize = this.layer.size + 'px'
      return style
    }
  }
  // methods: {

  // },
  // destroyed () {
  //   this.countdownInter && clearInterval(this.countdownInter)
  // },
  // created () {
  //   this.dealCountdown()
  // }
}
</script>

<style lang="less" scoped>
// @font-face {
//   font-family: "DIGITAL";
//   src: url("~@/assets/DIGITAL-Regular.ttf") format("truetype");
//   font-weight: normal;
//   font-style: normal;
// }
.layer {
  line-height: 1;
  font-family: DIGITAL;
}
</style>
