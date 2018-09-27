<template>
  <div v-moveable="{setXY}"  class="layer" :style="layerStyle"></div>
</template>

<script>
import layerMixin from './layerMixin.js'
export default {
  mixins: [layerMixin],
  computed: {
    layerStyle () {
      let style = this.getBaseStyle()
      style.height = this.layer.size / this.layer.ratio + 'px'
      style.width = this.layer.size + 'px'
      style.backgroundImage = 'url(' + this.layer.image + ')'
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
