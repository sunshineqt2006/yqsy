<template>
  <div class="preview">
    <template  v-for="(page,index) in screen.pages">
        <transition :enter-active-class="page.animationIn" :leave-active-class="page.animationOut" :key="index"  mode="out-in">
          <div v-if="pageIndex==index" class="page2">
            <div :style="pageStyle(page)" class="page" >
              <component :is="layer.typeName+'Layer'" :event-key="eventKey" :qrcode="wechatQrcode" :code="eventCode" :layer="layer" v-for="(layer,index) in page.layers" :key="index" @timeout="stepTimeOut(page)" ></component>
            </div>
            <audio :src="page.backgroundMusic"  ref="audio2" autoplay v-show="false" preload>您的浏览器不支持 audio 标签。</audio>
          </div>
        </transition>
    </template>

    <!-- 图片预加载 -->
    <img :src="page.image" height="0" :key="index" v-for="(page,index) in screen.pages">
    <audio :src="screen.backgroundMusic" v-if="screen.backgroundMusic" ref="audio1" autoplay preload loop v-show="false" >您的浏览器不支持 audio 标签。</audio>
    <audio :ref="'sound'+item.id" :src="item.url" :key="item.id" v-for="(item) in audios" preload></audio>
    <!-- 口令 -->
    <audio :ref="'commandAudios'+index" :src="item" :key="item.id" v-for="(item,index) in commandAudios" preload @ended="commandAudiosEnd"></audio>
  </div>
</template>

<script>
import ImageLayer from '../edit/ImageLayer.vue'
import TimeLayer from '../edit/TimeLayer.vue'
import VideoLayer from '../edit/VideoLayer.vue'
import RankLayer from '../edit/RankLayer.vue'
import CodeLayer from '../edit/CodeLayer.vue'
import WechatLayer from '../edit/WechatLayer.vue'
require('@/styles/animate.css')
export default {
  data () {
    return {
      screen: {},
      zoom: 1,
      pageIndex: -1,
      clientSize: {
        h: document.body.clientHeight,
        w: document.body.clientWidth
      },
      wechatQrcode: '',
      eventKey: '',
      eventCode: '8888',
      preview: true,
      audios: [],
      appType: '1',
      commandAudios: [
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/0.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/1.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/2.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/3.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/4.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/5.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/6.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/7.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/8.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/9.mp3',
        'http://onmxkx5tf.bkt.clouddn.com/commandAudios/10.mp3?t=123'
      ],
      commandAudiosStep: -1
    }
  },
  components: {ImageLayer, TimeLayer, VideoLayer, RankLayer, WechatLayer, CodeLayer},
  computed: {
    // ScreenStyle () {
    //   return {
    //     zoom: this.zoom
    //   }
    // }
  },
  watch: {
    pageIndex (val) {
      if (!this.preview) {
        if (this.screen.pages[val].id === this.screen.gameBeginPage) {
          // 发送游戏开始请求
          this.$post('/event/game/gameStatus', {eventKey: this.eventKey, status: 1})
        }
      }
    }
  },
  methods: {
    pageStyle (page) {
      let style = {}
      let screenH = this.clientSize.h
      let screenW = this.clientSize.w
      let ratio = screenW / screenH
      if (ratio < this.screen.screenRatio) {
        style.zoom = screenW / this.screen.screenW
      } else {
        style.zoom = screenH / this.screen.screenH
      }
      style.backgroundImage = 'url(' + page.image + ')'
      style.height = this.screen.screenH + 'px'
      style.width = this.screen.screenW + 'px'
      // console.log('this.zoom ', screenH / page.screenH)
      return style
    },
    stepTimeOut (page) {
      if (this.screen.pages.length > this.pageIndex + 1) {
        this.pageIndex++
      } else if (!this.preview) {
        console.log('interval', this.screen.interval)
        this.screen.interval = this.screen.interval > 0 ? this.screen.interval : 0
        if (this.screen.poll > 1) {
          setTimeout(async () => {
            await this.reset()
            this.screen.poll--
            this.pageIndex = 0
          }, this.screen.interval * 1000 * 60)
        }
      }
    },
    leasttime (leasetTime, time) {
      let sounds = this.screen.pages[this.pageIndex].sounds
      if (sounds && sounds.length > 0) {
        let sound = sounds.filter(e => parseInt(e.mark) === (time - leasetTime))
        if (sound.length > 0) {
          sound = sound[0]
          let key = `sound${sound.id}`
          // console.log('sss', sound, this.$refs, key)
          this.$refs[key][0].play()
        }
      }
      // console.log('sss', this.screen.pages[this.pageIndex].gameSoundMask)
      if (this.appType === '1' && this.screen.pages[this.pageIndex].gameSoundMask >= 0 && (this.screen.pages[this.pageIndex].gameSoundMask === (time - leasetTime))) {
        this.commandAudiosStep = -1
        this.$refs['commandAudios10'][0].play()
      }
    },
    playCommandAudios () {
      if (this.commandAudiosStep === -1) { this.$refs['commandAudios10'][0].play() } else {
        let eventCode = this.eventCode.split('')
        if (this.commandAudiosStep < eventCode.length) {
          let key = `commandAudios${eventCode[this.commandAudiosStep]}`
          this.$refs[key][0].play()
        }
      }
    },
    commandAudiosEnd () {
      this.commandAudiosStep++
      // console.log('RRR', this.commandAudiosStep)
      this.playCommandAudios()
    },
    // 预加载所有音频
    preLoadAudio () {
      this.screen.pages.forEach(e => {
        if (e.sounds && e.sounds.length > 0) {
          this.audios = this.audios.concat(e.sounds)
        }
      })
    },
    async reset () {
      if (!this.preview && this.screen.advId) {
        let res2 = await this.$get('/cinema/index/qrCode', {id: this.screen.advId, screenToken: this.screen.screenToken})
        this.screen.qrCode = res2.data
        console.log('qrCode', this.screen.qrCode)
        this.wechatQrcode = this.screen.qrCode.weChatQrCode // `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${this.screen.qrCode.ticket}`
        this.eventKey = this.screen.qrCode.eventKey // '2ca16d916463729ae5814bade8cda193' // this.screen.qrCode.eventKey
        this.eventCode = this.screen.qrCode.eventCode + ''
        this.appType = this.screen.qrCode.appType + ''
      // 测试重置游戏状态
      // this.eventKey && this.$post('/event/game/resetGame', {eventKey: this.eventKey})
      }
    }
    // canplay (e) {
    //   window.location.reload()
    // }
  },
  destroyed () {
    // 测试重置游戏状态
    // this.eventKey && this.$post('/event/game/resetGame', {eventKey: this.eventKey})
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.audio1 && (this.$refs.audio1.volume = 0.2)
      this.$refs.audio2 && (this.$refs.audio2.volume = 1)
    })
  },
  async created () {
    let query = this.$route.query
    console.log('query', query)
    let screen = window.localStorage.getItem('PAGE_PREVIEW_SCREEN')
    this.screen = JSON.parse(screen)
    console.log('screen', screen)
    this.preLoadAudio()
    this.preview = query.preview
    await this.reset()

    // if (query.preview) {
    //   if (query.id) {
    //     let res = await this.$get('/platform/admin/editTemplate', {id: query.id})
    //     this.screen = res.data.tplConfig
    //   } else {
    //     let screen = window.localStorage.getItem('PAGE_PREVIEW_SCREEN')
    //     this.screen = JSON.parse(screen)
    //   }
    //   console.log('screen', this.screen)
    // } else {
    //   let res = await this.$get('/cinema/index/editTemplate', {id: query.id})
    //   let res2 = await this.$get('/cinema/index/qrCode', {id: query.id})
    //   this.wechatQrcode = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${res2.data.ticket}`
    //   this.eventKey = '2ca16d916463729ae5814bade8cda193' // res2.data.eventKey
    //   this.screen = res.data.config
    // }
    this.pageIndex = 0
    window.onresize = () => {
      this.clientSize.h = document.body.clientHeight
      this.clientSize.w = document.body.clientWidth
    }
    this.$root.$on('leasttime', this.leasttime)
  }
}
</script>

<style lang="less" scoped>
.preview{
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
}
.page{
  height: 540px;
  width: 960px;
  background-size: 100% 100%;
  top:50%;
  left:50%;
  position: absolute;
  transform: translate(-50%,-50%);
}
.page2{
   top:50%;
    left:50%;
  position: absolute;
  transform: translate(-50%,-50%);
}
</style>
