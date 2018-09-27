<template>
  <div class="screen-select-box">
      <img :src="url" class="qr" ref="qr">
      <!-- <div class="tip">请使用微信或浏览器扫码登录后选择要投放的映游</div> -->
      <!-- <div class="tip2" v-if="tick>0">二维码将在{{tick}}s后失效</div>
      <div class="tip3" v-else @click="resetQr">重新生成二维码</div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      tick: 120,
      url: '',
      token: ''
    }
  },
  methods: {
    startTick () {
      this.tick = 120
      this.inter = setInterval(() => {
        if (this.tick <= 0) {
          this.inter && clearInterval(this.inter)
          return
        }
        this.tick--
      }, 1000)
    },
    resetQr () {
      this.getUrl()
    },
    pollLoginResp () {
      this.inter = setInterval(async () => {
        let res = await this.$get('/staff/user/screenStatus', {screenToken: this.token})
        if (res.data.advId) {
          this.inter && clearInterval(this.inter)
          let screen = res.data.config
          screen.qrCode = JSON.parse(res.data.qrCode)
          screen.advId = res.data.advId
          screen.poll = res.data.poll
          screen.interval = res.data.interval
          screen.screenToken = this.token
          window.localStorage.setItem('PAGE_PREVIEW_SCREEN', JSON.stringify(screen))
          this.$router.push('/play')
        }
      }, 2000)
    },
    async getUrl () {
      let res = await this.$get('/staff/user/getToken')
      this.token = res.data.screenToken
      let domain = 'g.zmaxfilm.com'
      if (this.$route.query.domain) {
        domain = this.$route.query.domain
      }
      let res2 = await fetch(`/api/cinema/index/showQrCode?token=${this.token}&text=${encodeURIComponent(`http://${domain}/#/cinema_login?token=` + this.token)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      let blob = await res2.blob()
      this.$refs.qr.src = window.URL.createObjectURL(blob)
      this.pollLoginResp()
      // this.startTick()
    }
  },
  destroyed () {
    this.inter && clearInterval(this.inter)
  },
  created () {
    this.getUrl()
  }
}
</script>

<style scoped>
.screen-select-box{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f1f5f6;
  height: 100%;
  width: 100%;
  background-image: url('~@/assets/common/scan_bg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.qr{
  height: 300px;
  margin-bottom: 30px;
}
.tip{
  font-size: 18px;
  color:#333;
  margin-top: 40px;
}
.tip2,.tip3{
  font-size: 16px;
  color:#f56c6c;
  margin-top: 20px;
}
.tip3{
  color:#409EFF;
  cursor: pointer;
}
</style>
