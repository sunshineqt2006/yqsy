
import moveable from '@/utils/moveable'
export default {
  props: {
    layer: Object,
    selected: Boolean,
    editCinema: Boolean,
    eventKey: String
  },
  directives: {
    moveable
  },
  methods: {
    getBaseStyle () {
      let layer = this.layer
      let style = {
        position: 'absolute',
        border: '2px dashed transparent',
        zIndex: layer.zIndex,
        top: layer.top + 'px',
        left: layer.left + 'px'
      }
      if (this.selected) {
        style.border = ' 2px dashed #409EFF'
      }
      return style
    },
    setXY (x, y) {
      this.layer.top = y
      this.layer.left = x
    }
  }
}
