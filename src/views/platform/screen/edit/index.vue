<template>
  <div class="edit-box">
    <el-card class="base-area"  shadow="hover">
       <div slot="header" style="overflow:auto"><i class="el-icon-tickets"></i>&nbsp;基础信息 </div>
       <el-form inline :model="screen" :rules="rules" ref="form" >
            <el-form-item label="模版名称"  prop="name">
              <el-input v-model="screen.name"></el-input>
            </el-form-item>
            <el-form-item label="关联公众号" prop="appId" v-if="!editCinema">
               <el-select v-model="screen.appId"  @change="wechatChange" filterable placeholder="请选择,可搜索">
                  <el-option v-for="item in wechatOptions" :key="item.appId" :label="item.name" :value="item.appId">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="游戏开始页" prop="gameBeginPage">
               <el-select v-model="screen.gameBeginPage">
                  <el-option v-for="item in pages" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="屏幕">
               <el-select v-model="screen.screenRatioText" @change="screenRatioChange">
                  <el-option  key="0" label="横屏" value="0"> </el-option>
                  <el-option  key="1" label="竖屏" value="1"> </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="背景音乐" prop="backgroundMusic">
              <x-upload v-model="screen.backgroundMusic" accept="audio/*">
                <audio :src="screen.backgroundMusic" v-if="screen.backgroundMusic" style="vertical-align: middle;"  controls="controls">您的浏览器不支持 audio 标签。</audio>
              </x-upload>
            </el-form-item>
          </el-form>
    </el-card>
    <div class="top-area">
      <el-card class="left-area"  shadow="hover">
         <div slot="header"><i class="el-icon-tickets"></i>&nbsp;页面信息</div>
         <div class="page-body">
            <el-card class="page-thumb" :style="pageThumbStyle(page)"  :class="{active:currentPage.id===page.id}" v-for="(page,index ) in pages" :key="index" @click.native="pageSelect(page)" >
                <div class="page-name">{{page.name}}</div>
            </el-card>
            <el-card class="page-thumb" :style="pageThumbStyle()" @click.native="addPage" title="添加页面">
              <i class="el-icon-plus"></i>
            </el-card>
         </div>
      </el-card>
      <el-card class="middle-area"  shadow="hover" @click.native="pageClick" :style="{height:screen.screenH+'px',width:screen.screenW+'px'}">
        <transition :enter-active-class="currentPage.animationIn" :leave-active-class="currentPage.animationOut">
          <div class="page-main"  v-show="!animationPlay" :style="{backgroundImage:'url('+currentPage.image+')',height:screen.screenH+'px',width:screen.screenW+'px'}">
            <component :is="layer.typeName+'Layer'" :edit-cinema="editCinema" @click.native.stop="layerClick(layer)" :selected="elementType===1&&currentBlock.id===layer.id" :layer="layer" v-for="(layer,index) in currentPage.layers" :key="index"></component>
          </div>
        </transition>
      </el-card>
      <el-card class=""  shadow="hover">
        <div slot="header"><i class="el-icon-tickets"></i>&nbsp;页面元素信息</div>
        <div v-if="elementType===0" >
          <el-form label-width="80px">
            <el-form-item label="页面名称">
              <el-input v-model="currentPage.name"></el-input>
            </el-form-item>
            <el-form-item label="背景图片">
              <x-upload v-model="currentPage.image" accept="image/*"></x-upload>
            </el-form-item>
             <el-form-item label="添加图层">
               <el-select v-model="layerType" placeholder="请选择图层类型" @change="addLayer">
                    <el-option v-for="item in layerTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <x-upload ref="imgUpload"  v-show="false" @success="uploadLayerSuccess" accept="image/*"></x-upload>
            </el-form-item>
            <el-form-item label="进场动画">
               <el-select v-model="currentPage.animationIn" @change="animationChange" placeholder="请选择动画">
                    <el-option v-for="item in animationInOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="出场动画">
               <el-select v-model="currentPage.animationOut" @change="animationChange" placeholder="请选择动画" >
                    <el-option v-for="item in animationOutOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="背景声音">
               <el-button icon="el-icon-setting" type="success"  @click.stop="openMusicSetting">设置</el-button>
            </el-form-item>
            <el-form-item  label="背景音乐">
              <x-upload v-model="currentPage.backgroundMusic" accept="audio/*">
                <el-tooltip  effect="dark" content="单击试听" placement="left" v-if="currentPage.backgroundMusic">
                   <el-button icon="el-icon-service" circle  @click.stop="playPageAudio"></el-button>
                </el-tooltip>
                <audio ref="pageAudio" :src="currentPage.backgroundMusic" v-if="currentPage.backgroundMusic" style="display:none;" >您的浏览器不支持 audio 标签。</audio>
                 <el-button type="danger"  size="small" icon="el-icon-delete" circle @click.stop="deleteBackgroundMusic"></el-button>
              </x-upload>
            </el-form-item>
            <el-tooltip v-if="appTypeId=='1'" effect="dark" content="设置语音播报播放的时间点,到达该时间点后将播放游戏编码的语音提示信息" placement="left" >
            <el-form-item label="语音播报">
               <el-slider v-if="timeLength" v-model="currentPage.gameSoundMask" :min="-1" :max="timeLength"></el-slider>
               <span v-else style="color:red">请先设置好倒计时时间</span>
            </el-form-item>
            </el-tooltip>
             <el-form-item>
               <el-button type="danger" @click="removePage" v-if="!currentPage.editCinema">移除</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="elementType===1">
          <template v-if="editCinema&&currentBlock.lock" >
            <div class="locked"><i class="el-icon-lock"></i>已锁定</div>
          </template>
          <template v-else>
            <el-form label-width="80px">
              <el-form-item label="图层编号">
                <el-input v-model="currentBlock.id"></el-input>
              </el-form-item>
              <el-form-item label="图层大小">
                <el-slider v-model="currentBlock.size" :min="20" :max="500"></el-slider>
              </el-form-item>
              <el-form-item label="颜色" v-if="currentBlock.type===1||currentBlock.type===5">
                <el-color-picker v-model="currentBlock.color" show-alpha></el-color-picker>
              </el-form-item>
              <el-form-item label="时长(秒)" v-if="currentBlock.type===1">
                <el-slider v-model="currentBlock.time" :min="10" :max="300"></el-slider>
              </el-form-item>
              <el-form-item label="视频地址" v-if="currentBlock.type===3">
                  <el-input v-model="currentBlock.url"></el-input>
              </el-form-item>
              <el-form-item label="最大排名" v-if="currentBlock.type===2">
                <el-slider v-model="currentBlock.maxRank" :min="3" :max="20"></el-slider>
              </el-form-item>
              <el-form-item label="是否锁定" >
                <el-switch v-model="currentBlock.lock" v-if="!editCinema"></el-switch>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="topIndex">置顶</el-button>
                  <el-button type="danger" @click="removeBlock">移除</el-button>
              </el-form-item>
            </el-form>
          </template>

        </div>
      </el-card>
    </div>
     <div class="oper-bar">
          <el-button icon="el-icon-view" @click="preview">预览</el-button>
          <el-button type="primary" icon="el-icon-edit"  @click="beforeSave">保存</el-button>
          <el-button type="warning" icon="el-icon-document"  @click="$router.go(-1)">取消</el-button>
    </div>
    <music-setting ref="musicSetting" :data="currentPage.sounds"></music-setting>
  </div>
</template>

<script>
import ImageLayer from './ImageLayer.vue'
import TimeLayer from './TimeLayer.vue'
import VideoLayer from './VideoLayer.vue'
import RankLayer from './RankLayer.vue'
import WechatLayer from './WechatLayer.vue'
import CodeLayer from './CodeLayer.vue'
import MusicSetting from './MusicSetting.vue'
require('@/styles/animate.css')
export default {
  data () {
    return {
      zIndex: 0,
      elementType: 0, // 0 页面 1浮动块
      currentPage: null,
      currentBlock: null,
      pages: [],
      layerType: '',
      layerTypeOptions: [
        { value: 0, label: '图片' },
        { value: 1, label: '倒计时' },
        { value: 2, label: '排行榜' },
        { value: 3, label: '视频' },
        { value: 4, label: '公众号二维码' },
        { value: 5, label: '游戏编码' }
      ],
      animationInOptions: [
        { value: 'bounceIn', label: '弹入' },
        { value: 'fadeIn', label: '渐入' },
        { value: 'rotateIn', label: '转入' }
      ],
      animationOutOptions: [
        { value: 'bounceOut', label: '弹出' },
        { value: 'fadeOut', label: '渐出' },
        { value: 'rotateOut', label: '转出' }
      ],
      screen: {
        name: '',
        backgroundMusic: '',
        appId: '',
        screenRatio: 1920 / 1080,
        screenRatioText: '0',
        screenW: 960,
        screenH: 540
      },
      wechatOptions: [],
      animationPlay: false,
      rules: {
        name: { required: true, message: '请输入模版名称', trigger: 'blur' },
        gameBeginPage: { required: true, message: '请选择游戏开始页面', trigger: 'change' },
        appId: { required: true, message: '请选择关联公众号', trigger: 'change' }
      },
      editId: '',
      editCinema: false,
      musicSettingDialogVisible: false,
      appTypeId: '' // 公众号类型
    }
  },
  components: {ImageLayer, TimeLayer, VideoLayer, RankLayer, WechatLayer, CodeLayer, MusicSetting},
  computed: {
    timeLength () {
      let timeLayer = this.currentPage.layers.filter(e => e.typeName === 'time')
      if (timeLayer.length > 0) {
        timeLayer = timeLayer[0]
        return timeLayer.time
      } else {
        return null
      }
    }
  },
  watch: {
    currentPage (val) {
      if (!val.sounds) {
        val.sounds = []
      }
      console.log('currentPage', val)
    }
  },
  methods: {
    pageSelect (page) {
      this.elementType = 0
      this.currentPage = page
    },
    uploadLayerSuccess (res, file) {
      var image = new Image()
      image.onload = () => {
        let ratio = image.width / image.height
        // console.log('ratio', ratio, image.width, image.height)
        this.currentBlock = {
          id: new Date().getTime(),
          type: 0,
          typeName: 'image',
          image: res, // URL.createObjectURL(file.raw),
          ratio: ratio,
          size: 200,
          zIndex: 0,
          top: this.screen.screenH / 2 - 200 / ratio / 2,
          left: this.screen.screenW / 2 - 200 / 2,
          lock: !this.editCinema,
          editCinema: this.editCinema
        }
        this.currentPage.layers.push(this.currentBlock)
        this.elementType = 1
      }
      image.src = file.url
    },
    addPage () {
      if (this.pages.length >= 5) {
        this.$message.warning('最大5个页面')
        return
      }
      this.pages.push({
        id: new Date().getTime(), image: '', name: `页面${this.pages.length + 1}-未命名`, layers: [], animationIn: 'bounceIn', animationOut: 'bounceOut', editCinema: this.editCinema, backgroundMusic: '', sounds: [], gameSoundMask: -1
      })
    },
    pageElementUnique (type, text) {
      if (this.currentPage.layers.findIndex(layer => layer.type === type) >= 0) {
        this.$message.warning('页面只能有一个' + text + '元素')
        return false
      } else {
        return true
      }
    },
    addLayer (val) {
      let block = {
        id: new Date().getTime(),
        top: this.screen.screenH / 2,
        left: this.screen.screenW / 2,
        // screenRatio: this.screenRatio,
        zIndex: 0,
        lock: !this.editCinema,
        editCinema: this.editCinema
      }
      if (val === 0) {
        this.$refs.imgUpload.$refs.btn.$el.click()
      } else {
        if (val === 1) {
          if (!this.pageElementUnique(val, '时间')) {
            return
          }
          this.currentBlock = Object.assign(block, {
            type: 1,
            typeName: 'time',
            size: 40,
            color: '#333333',
            time: 200
          })
        } else if (val === 2) {
          if (!this.pageElementUnique(val, '排行榜')) {
            return
          }
          this.currentBlock = Object.assign(block, {
            type: 2,
            typeName: 'rank',
            maxRank: 5,
            size: 300
          })
        } else if (val === 3) {
          if (!this.pageElementUnique(val, '视频')) {
            return
          }
          this.currentBlock = Object.assign(block, {
            type: 3,
            typeName: 'video',
            top: block.top - 100,
            left: block.left - 100,
            size: 300,
            url: 'https://mov.bn.netease.com/open-movie/nos/mp4/2017/01/03/SC8U8K7BC_sd.mp4'
          })
        } else if (val === 4) {
          if (this.screen.wechat === '') {
            this.$message.warning('请先选择关联公众号')
            this.layerType = ''
            return
          }
          this.currentBlock = Object.assign(block, {
            type: 4,
            typeName: 'wechat',
            top: block.top - 100,
            left: block.left - 100,
            size: 200,
            image: 'https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=7bcb659c9745d688a302b5a29cf91a23/2934349b033b5bb571dc8c5133d3d539b600bc12.jpg'
          })
        } if (val === 5) {
          this.currentBlock = Object.assign(block, {
            type: 5,
            typeName: 'code',
            size: 40,
            color: '#333333'
          })
        }
        console.log('this.currentBlock', this.currentBlock)
        this.currentPage.layers.push(this.currentBlock)
        this.elementType = 1
      }
      this.layerType = ''
    },
    pageClick () {
      this.elementType = 0
    },
    layerClick (layer) {
      this.currentBlock = layer
      this.elementType = 1
    },
    topIndex () {
      let zIndexs = this.currentPage.layers.map(layer => layer.zIndex)
      let maxZindex = Math.max.apply(Math, zIndexs)
      this.currentBlock.zIndex = maxZindex + 1
    },
    preview () {
      let screen = Object.assign({}, this.screen)
      screen.pages = this.pages
      window.localStorage.setItem('PAGE_PREVIEW_SCREEN', JSON.stringify(screen))
      window.open('http://' + window.location.host + '/#/preview?preview=true', '_blank')
    },
    removePage () {
      if (this.pages.length <= 1) {
        this.$message.warning('最后一个页面不能移除')
        return
      }
      this.pages.splice(this.pages.findIndex(page => page.id === this.currentPage.id), 1)
      this.currentPage = this.pages[0]
    },
    removeBlock () {
      let index = this.currentPage.layers.findIndex(layer => layer.id === this.currentBlock.id)
      this.currentPage.layers.splice(index, 1)
      this.elementType = 0
      this.currentBlock = null
    },
    animationChange () {
      this.animationPlay = true
      setTimeout(() => {
        this.animationPlay = false
      }, 1000)
    },
    beforeSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save()
        }
      })
    },
    async save () {
      let screen = Object.assign({}, this.screen)
      screen.pages = this.pages
      let params = {
        name: screen.name,
        status: 0,
        appId: screen.appId,
        config: JSON.stringify(screen)
      }
      if (this.editId) {
        params.id = this.editId
      }
      await this.$post(this.editCinema ? '/cinema/index/editTemplate' : '/platform/admin/editTemplate', params)
      this.$message.success('操作成功')
      this.$router.go(-1)
    },
    async fetchInitData () {
      this.editCinema = !!this.$route.meta.cinema
      // 获取公众号下拉
      let res = await this.$get('/platform/admin/getWechatList', {pageSize: 10000})
      this.wechatOptions = res.data.list
      // 如果是编辑
      this.editId = this.$route.query.id
      if (this.editId) {
        let res = await this.$get(this.editCinema ? '/cinema/index/editTemplate' : '/platform/admin/editTemplate', {id: this.editId})
        if (this.editCinema) {
          this.screen = res.data.config
          this.pages = res.data.config.pages
        } else {
          this.screen = res.data.tplConfig
          this.pages = res.data.tplConfig.pages
        }
        this.wechatChange(this.screen.appId)
        this.currentPage = this.pages[0]
      }
    },
    playPageAudio () {
      this.$refs.pageAudio.play()
    },
    screenRatioChange (val) {
      if (val === '0') {
        this.screen.screenRatio = 1920 / 1080
        this.screen.screenW = 960
        this.screen.screenH = 540
      } else if (val === '1') {
        this.screen.screenRatio = 1080 / 1920
        this.screen.screenW = 540
        this.screen.screenH = 960
      }
    },
    pageThumbStyle (page) {
      let style = {
        height: '80px',
        width: '150px',
        marginLeft: '0px'
      }
      if (page) {
        style.backgroundImage = 'url(' + page.image + ')'
      }
      if (this.screen.screenRatioText === '1') {
        style.height = '150px'
        style.width = '80px'
        style.marginLeft = '32px'
      }
      return style
    },
    openMusicSetting () {
      if (this.timeLength) {
        this.$refs.musicSetting.open()
        this.$refs.musicSetting.setTime(this.timeLength)
      } else {
        this.$message.warning('请先选择倒计时图层,并设置好倒计时时间再操作')
      }
    },
    wechatChange (val) {
      let wechat = this.wechatOptions.filter(e => e.appId === val)
      this.appTypeId = wechat[0].appTypeId
    },
    deleteBackgroundMusic () {
      this.currentPage.backgroundMusic = ''
    }
  },
  created () {
    this.fetchInitData()
    this.addPage()
    this.currentPage = this.pages[0]
  }
}
</script>

<style lang="less" scoped>
.edit-box {
  // flex-direction: column;
  // justify-content: space-between;
 // width:100%;
  overflow: auto;

}
.base-area{
  width:1530px;
  min-height: 100px;
  margin-bottom: 20px;
}
.top-area {
  width:1550px;
  overflow: auto;
  padding-bottom: 20px;
  >div{
    float: left;
  }
  clear: both;
}
.bottom-area {
  height: 150px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  margin-top: 20px;
  display: none;
  /* padding: 0 10px; */
}
.left-area{
   width: 192px;
   min-height: 540px;
  .page-body{
    width: 100%;
    overflow-x: hidden;
    // overflow-y: auto;
    // height: 450px;
  }
}
.middle-area {
  height: 540px;
  width: 960px;
  position: relative;
  //border: 1px solid #ccc;
  overflow: hidden;
  margin: 0px 20px;
  .page-main{
    background-size: 100% 100%;
    position:absolute;
    top:0;
    left:0;
    height: 540px;
    width: 960px;
  }
}
.right-area {
  width: 350px;
  min-height: 540px;
  //border:1px solid #ccc;
}
.page-thumb {
  color:#696969;
  cursor: pointer;
  height: 80px;
  width: 150px;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100% 100%;
  &:hover,
  &.active {
    border: 1px solid #409eff;
    color: #409eff;
  }
  .page-name {
    padding: 4px 6px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
  }
  .el-icon-plus,.el-icon-view {
    font-size: 40px;
  }
}
.oper-bar{
  width: 1500px;
  text-align: center;
}
.locked{
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin-top: 160px;
  color:#737373;
}
</style>
