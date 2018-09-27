<template>
  <video v-moveable="{setXY}"  class="layer" :style="layerStyle" autoplay :src="layer.url"> </video>
</template>

<script>
import layerMixin from './layerMixin.js'
export default {
  mixins: [layerMixin],
  computed: {
    layerStyle () {
      let style = this.getBaseStyle()
      style.width = this.layer.size + 'px'
      return style
    }
  }
}
</script>

<style lang="less" scoped>
.layer {

}
</style>
