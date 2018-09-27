<template>
  <el-dialog ref="dialog" :visible.sync="musicSettingDialogVisible" title="提示" v-bind="$attrs"  width="650px">
    <el-form label-width="0px">
      <el-form-item v-for="(item,index) in data" :key="index">
        <div class="music-line">
          <el-button type="danger"  size="small" icon="el-icon-delete" circle @click.stop="deletePageAudio(index)"></el-button>
          <span> 第{{index+1}}段声音:</span>
          <x-upload v-model="item.url" accept="audio/*">
            <el-tooltip  effect="dark" content="单击试听" placement="left" v-if="item.url">
                <el-button icon="el-icon-service" circle  @click.stop="playPageAudio(index)"></el-button>
            </el-tooltip>
            <audio ref="pageAudio" :src="item.url" v-if="item.url" style="display:none;" >您的浏览器不支持 audio 标签。</audio>
          </x-upload>
          <span>播放时间点({{item.mark}}):</span>
          <el-slider v-model="item.mark" style="width:220px;" :max="timelength"></el-slider>
        </div>
      </el-form-item>
       <el-form-item style="text-align:center">
         <el-button  icon="el-icon-circle-plus-outline"  round @click="addMusic">添加一段声音</el-button>
       </el-form-item>
    </el-form>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close">确 定</el-button>
    </span> -->
  </el-dialog>

</template>

<script>
export default {
  props: {
    data: Array
  },
  data () {
    return {
      musicSettingDialogVisible: false,
      timelength: 100
    }
  },
  methods: {
    playPageAudio (index) {
      this.$refs.pageAudio[index].play()
    },
    deletePageAudio (index) {
      this.data.splice(index, 1)
    },
    setTime (timelength) {
      this.timelength = timelength
    },
    close () {
      this.musicSettingDialogVisible = false
    },
    open () {
      this.musicSettingDialogVisible = true
    },
    addMusic () {
      this.data.push({
        id: new Date().getTime(),
        url: '',
        mark: 0
      })
      this.$forceUpdate()
    }
  },
  created () {

  }
}
</script>

<style scoped lang="less">
.music-line{
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}
</style>
