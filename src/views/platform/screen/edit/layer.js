
class Layer {
  constructor () {
    this.type = -1
    this.id = new Date().getTime()
    this.zIndex = new Date().getTime()
    this.screenH = 540
    this.screenW = 960
  }

  static setScreen (width = 960, height = 540) {
    this.screenH = height
    this.screenW = width
    this.screenRatio = width / height
  }
}

class ImageLayer extends Layer {
  constructor (imageWidth = 100, imageHeight = 100, imageUrl) {
    super()
    this.type = 0
    this.url = imageUrl
    this.ratio = imageWidth / imageHeight
    this.width = 100 * this.ratio
    this.height = 100
    this.top = this.screenH / 2 - this.height / 2
    this.left = this.screenW / 2 - this.width / 2
  }
}

class TimeLayer extends Layer {
  constructor () {
    super()
    this.type = 1
    this.size = 40
    this.color = '#fff9c3'
    this.time = 200
    this.top = this.screenH / 2 - 40 / 2
    this.left = this.screenW / 2 - 40 / 2
  }
}

class VideoLayer extends Layer {
  constructor (url = 'https://mov.bn.netease.com/open-movie/nos/mp4/2017/01/03/SC8U8K7BC_sd.mp4') {
    super()
    this.type = 1
    this.width = 200
    this.url = url
    this.top = this.screenH / 2
    this.left = this.screenW / 2 - 200 / 2
  }
}
export default {
  ImageLayer,
  TimeLayer,
  VideoLayer
}
