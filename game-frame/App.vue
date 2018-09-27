<template>
  <div class="full">
    <div class="full step_1" v-if="step===1">
      <!-- <img src="@/assets/game-frame/1.png" width="100%"/> -->
      <!-- <div class="loading load5">
        <div class="loader">Loading...</div>
      </div> -->
      <!-- <div class="wait-tip">小伙伴们请耐心等待游戏开始</div> -->
    </div>
    <iframe  v-if="step===2" ref="iframe0" :src="gameUrl"  frameborder="0" scrolling = 'no'  class="full step_2"></iframe>
    <div class="full step_3" v-if="step===3">
      <div class="score">你的得分</div>
      <div class="score">{{score.text}}</div>
      <div class="reset" v-if="palyAgain" @click="reset"></div>
    </div>
    <div class="full step_3" v-if="step===4">
      <div class="score">游戏已结束了</div>
    </div>
  </div>

</template>

<script>
  // require('./loader.less')
  export default {
    data(){
      return {
        gameUrl:'',
        eventKey:'',
        openid:'',
        step:1,
        score:{
          value:'',
          text:''
        },
        palyAgain:false
      }
    },
    methods:{
      pollGameBegin(){
        this.inter = setInterval(async ()=>{
          let res = await this.$get('/event/game/gameStatus',{eventKey:this.eventKey})
          if(res.data.endTime){
             this.step = 4
             this.inter && clearInterval(this.inter)
          }
          else if(this.step===1&&res.data.startTime){
            this.step = 2
            //this.inter && clearInterval(this.inter)
            // this.$nextTick(()=>{
            //   this.$refs.iframe0.height = document.body.clientHeight
            //   this.$refs.iframe0.width = document.body.clientWidth
            // })
          }

        },1500)

      },
      async setScore(score,isBegin){
        console.log("setScore success")
        this.setScoreTemp(score)
        if(!isBegin){
           this.step = 3
          let res = await this.$get('/event/game/gameStatus',{eventKey:this.eventKey})
          this.palyAgain = !res.data.endTime
          console.log("res",res,this.palyAgain )
        }
      },
      setScoreTemp(score){
        this.score = score
        this.$post('/event/game/gameData',{
          eventKey:this.eventKey,
          openId:this.openid,
          scoreValue:score.value,
          scoreText:score.text
        })
      },
      getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2]);
        return null;
      },
      reset(){
        this.step=2
      },
      // iosIframeWidthBug(){
      //   setTimeout(()=>{
      //     alert(this.$refs.iframe0.contentWindow.document.body.style.height)
      //   },2000)

      //   //不是 iphone ipad就不执行了
      //   // if (!navigator.userAgent.match(/iPad|iPhone/i))
      //   // return false
      //   // //获取子iframevar
      //   // let iframebody = this.$refs.iframe0.contentWindow.document.body
      //   // iframebody.style.width = document.body.clientWidth+'px'
      //   // iframebody.style.height = document.body.clientHeight+'px'
      //   // alert(iframebody.style.height  )
      // }
    },
    destroyed(){
       this.inter&&clearInterval(this.inter)
    },
    mounted(){
       if (!navigator.userAgent.match(/iPad|iPhone/i)) {
          this.$ref.iframe0.setAttribute('scrolling','yes')
       }
    },
    created(){
      // fetch(`/Api/public/attachment/20180518/739693ee3d45786c55eebe55522b51fc482bff4c/index.html`, { method:'GET' } ).then(resp=>{
      //   resp.text().then(text=>{
      //     this.indexHtml = text
      //     //console.log("resp",text)
      //   })
      // })
     // this.gameUrl = '/Api/public/attachment/20180520/cf5084be40aaad935e824ad4f397e4352adaca4b/'
     //http://192.168.10.165:8080/game-frame.html?eventKey=2ca16d916463729ae5814bade8cda193&openid=oU8F_0ezon8SWVliNnhkhZ3cm9wE&gUrl=/public/attachment/20180524/9d17f0d6fb1fe4b8c24b491d0e249856a4c05005/
     // console.log('gUrl',this.getQueryString('gUrl').replace('http://g.api.zmaxfilm.com',''))
    //  this.gameUrl = '/api'+this.getQueryString('gUrl').replace('http://g.api.zmaxfilm.com','')+'/'
     //  console.log('gUrl2',this.gameUrl )
      this.gameUrl = this.getQueryString('gUrl');// this.getQueryString('gUrl') //'http://images.zmaxfilm.com/attachment/20180528/9827cbb33ec24f56a420041ab5a9bd37616a4b16/index.html'
       console.log('gameUrl',this.gameUrl )
      this.eventKey = this.getQueryString('eventKey')
      this.openid = this.getQueryString('openid')
      this.pollGameBegin()
      // this.gameUrl = '/Api/public/attachment/20180520/204167b5eaecb75fb25fc096b4204d4633c6aba8/'
      window.setScore = this.setScore
    }
  }
</script>
<style lang="less">
body,
html,.full {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}
.step_1{
  background-image: url('~@/assets/game-frame/1.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .wait-tip{
    font-size: 16px;
    margin-top: 20px;
  }
  .loading{
    width: 150px;
    height: 150px;
    position: relative;
    overflow: hidden;
  }
}
.step_2{
  //-webkit-overflow-scrolling:touch;
  // overflow-y:scroll;
  height: 100%;
  width: 1px;
  min-width: 100%;
}
.step_1,
.step_3,
.step_4{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.step_3{
  .score{
    font-size: 26px;
    color:#fff;
    margin-top: 15px;
  }
  .reset{
    background-image: url('~@/assets/game-frame/btn.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width:144px;
    height:63px;
    margin-top: 30px;
  }
  background-image: url('~@/assets/game-frame/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
