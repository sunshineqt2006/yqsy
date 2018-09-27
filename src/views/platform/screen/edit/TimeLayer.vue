<template>
  <div v-moveable="{setXY}"  class="layer" :style="layerStyle">
    {{countdown}}
  </div>
</template>

<script>
import layerMixin from './layerMixin.js'
export default {
  mixins: [layerMixin],
  data () {
    return {
      countdown: '00:00'
    }
  },
  watch: {
    'layer.time' (val) {
      this.dealCountdown()
    }
  },
  computed: {
    layerStyle () {
      let style = this.getBaseStyle()
      style.color = this.layer.color
      style.fontSize = this.layer.size + 'px'
      return style
    }
  },
  methods: {
    dealCountdown () {
      this.leastTime = this.layer.time
      this.countdownInter && clearInterval(this.countdownInter)
      this.countdownInter = setInterval(() => {
        if (this.leastTime <= 0) {
          // this.dealCountdown()
          this.$emit('timeout')
          this.countdownInter && clearInterval(this.countdownInter)
        }
        this.$root.$emit('leasttime', this.leastTime, this.layer.time)
        this.countdown = this.formateOffsetTime(this.leastTime--)
      }, 1000)
    },
    formateOffsetTime (offsetTime) {
      if (offsetTime < 0) {
        offsetTime = 0
      }
      let min = parseInt((offsetTime % 3600) / 60)
      let sed = parseInt((offsetTime % 3600) % 60)
      if (min < 10) {
        min = '0' + min
      }
      if (sed < 10) {
        sed = '0' + sed
      }
      return min + ':' + sed
    }

  },
  destroyed () {
    this.countdownInter && clearInterval(this.countdownInter)
  },
  created () {
    this.dealCountdown()
  }
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
