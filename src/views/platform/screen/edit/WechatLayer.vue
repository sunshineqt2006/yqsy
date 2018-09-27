<template>
  <div v-moveable="{setXY}"  class="layer" :style="layerStyle"></div>
</template>

<script>
import layerMixin from './layerMixin.js'
export default {
  mixins: [layerMixin],
  props: {
    qrcode: String
  },
  computed: {
    layerStyle () {
      let style = this.getBaseStyle()
      style.height = this.layer.size + 'px'
      style.width = this.layer.size + 'px'
      if (this.qrcode) {
        style.backgroundImage = 'url(' + this.qrcode + ')'
      } else {
        style.backgroundImage = 'url(' + this.layer.image + ')'
      }
      return style
    }
  }
}
</script>

<style lang="less" scoped>
.layer {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
