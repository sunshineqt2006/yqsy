<template>

    <canvas id="canvas"></canvas>


</template>

<script>
  // require('./loader.less')
  const imgBg = require('@/assets/qrcode-scan/bg.jpg')
  export default {
    data(){
      return {
        qrCode:''
      }
    },
    methods:{
       getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2]);
        return null;
      },
    },
    async mounted(){
       let clientWidth = document.body.clientWidth
       let clientHeight = document.body.clientHeight
       console.log(clientWidth,clientHeight)
       let canvas = document.getElementById("canvas")
       canvas.width = clientWidth
       canvas.height = clientHeight
       let ctx = canvas.getContext("2d")
       let img = new Image()
       img.src= imgBg
       img.onload = function(){
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(this, 0, 0,this.width,this.height,0,0,clientWidth,clientHeight)
      }
      let res2 = await fetch(`/api/cinema/index/showQrCode?text=${encodeURIComponent(this.qrCode)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      let blob = await res2.blob()
      let img2 = new Image()
      img2.src= window.URL.createObjectURL(blob)
      let sw = canvas.width/414
      let sh = canvas.height/736
      img2.onload = function(){
        //console.log("SS",this.width,this.height,canvas.width,canvas.height)
        ctx.drawImage(this, 0, 0,this.width,this.height,105*sw,497*sh,94*sw,94*sh)
      }
    },
    created(){
      this.qrCode = this.getQueryString('QrCode')

    }
  }
</script>
<style lang="less">
html,body{
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
// #canvas{
//    height: 100%;
//   width: 100%;
//   overflow: hidden;
// }

</style>
