<template>
  <div>
    <el-form inline>
      <CinemaSelector v-model="params.cinemaCode"></CinemaSelector>
      <el-form-item label="模版名称">
        <el-input v-model="params.name" placeholder="请输入模版名称"></el-input>
      </el-form-item>
      <el-form-item label="模版状态">
        <el-select v-model="params.status" placeholder="请选择">
          <el-option v-for="item in statusOptions"  :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item >
         <el-button type="primary" @click.native="$refs.tablePage.refresh()">查询</el-button>
         <el-tooltip class="item" effect="dark" content="选择后生成的映游归属于该账户关联的影院" placement="right">
           <el-button type="success" @click.native="selectScreen">选择模版</el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <TablePage ref="tablePage" :fetch="fetchTableData" :params="params" style="width: 100%">
       <el-table-column type="index"></el-table-column>
       <el-table-column width="300" prop="name" label="映游名称"></el-table-column>
       <el-table-column width="180" prop="cinemaName" label="归属影院"></el-table-column>
       <el-table-column width="180" prop="gameName" label="关联游戏"></el-table-column>
       <el-table-column width="100" prop="statusName" label="状态"></el-table-column>
       <el-table-column width="160" prop="createTime" label="创建时间"></el-table-column>
       <el-table-column min-width="400" label="操作">
          <template slot-scope="scope">
            <el-button plain size="small" @click="play(scope.row)">播放</el-button>
            <el-button type="warning" plain size="small" @click="editScreen(scope.row)">编辑</el-button>
            <el-button type="success" plain  size="small" @click="linkGame(scope.row)">关联游戏</el-button>
            <el-button v-if="scope.row.status==='0'" type="success" plain  size="small" @click="editScreenStatus(scope.row,1)">启用</el-button>
            <el-button v-if="scope.row.status==='1'" type="danger" plain  size="small"  @click="editScreenStatus(scope.row,0)">停用</el-button>
            <el-button type="danger" plain  size="small"  @click="delScreen(scope.row,1)">删除</el-button>
          </template>
       </el-table-column>
    </TablePage>
    <!-- <div class="line"></div>
    <div class="list-plane">
       <el-card :body-style="{ padding: '0px' }" v-for="(item,index) in dataList" :key="index" shadow="hover">
          <img :src="item.image" class="layer">
          <div class="cover">
              <div class="ellipsis">{{item.name}}</div>
              <div class="bottom clearfix">
                <el-button type="text" class="button" @click.native="editTemplate(item)">编辑</el-button>
                <el-button type="text" class="button" @click.native="deleteTemplate(item)">删除</el-button>
              </div>
          </div>
      </el-card>
    </div> -->
    <el-dialog title="选择模版" :visible.sync="dialogVisible" width="750px">
      <TablePage ref="tablePage2" :fetch="fetchTemplateTableData" :params="selectParams" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column min-width="200" prop="name" label="映游模版名称"></el-table-column>
        <el-table-column width="180"  prop="weChat" label="关联公众号"></el-table-column>
        <el-table-column width="160" prop="modifyTime" label="修改时间"></el-table-column>
        <el-table-column width="100" label="操作">
            <template slot-scope="scope">
              <el-button plain size="small" @click="previewScreen(scope.row)">预览</el-button>
            </template>
        </el-table-column>
      </TablePage>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectScreenSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关联游戏" :visible.sync="dialogVisible2" width="700px">
      <TablePage ref="tablePage3" :fetch="fetchGameTableData" :params="{}">
        <el-table-column min-width="200" prop="name" label="游戏名称"></el-table-column>
        <el-table-column width="100" prop="time" label="时长(秒)"></el-table-column>
        <el-table-column width="250" prop="desc" label="简述" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="操作">
            <template slot-scope="scope">
              <el-button plain size="small" @click="selectGame(scope.row)">选择</el-button>
            </template>
        </el-table-column>
      </TablePage>
      <span slot="footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <a :href="openUrl" target="_blank" ref="openWind"></a> -->
  </div>
</template>

<script>
// import testpng from '@/assets/1.jpg'
export default {
  data () {
    return {
      params: {
        cinemaCode: '',
        name: '',
        status: ''
      },
      selectParams: {
        // cinemaId: '',
        status: 1
      },
      statusOptions: [
        {value: '', label: '全部'},
        {value: 1, label: '启用'},
        {value: 0, label: '停用'}
      ],
      dialogVisible: false,
      dialogVisible2: false,
      screenSelection: [],
      operId: '',
      openUrl: ''
    }
  },
  methods: {
    fetchTableData (params) {
      return this.$get('/cinema/index/getTemplateList', params)
    },
    fetchTemplateTableData (params) {
      return this.$get('/platform/admin/getTemplateList', params)
    },
    fetchGameTableData (params) {
      return this.$get('/platform/admin/getGameList', params)
    },
    selectScreen () {
      // this.selectParams.cinemaId = this.params.cinemaId
      // if (this.selectParams.cinemaId === '') {
      //   this.$message.warning('请先选择影院')
      //   return
      // }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.tablePage2.refresh()
      })
    },
    linkGame (item) {
      this.operId = item.id
      this.dialogVisible2 = true
    },
    async previewScreen (item) {
      const loading = this.$loading({lock: true, text: '获取相关信息中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'})
      try {
        let res = await this.$get('/platform/admin/editTemplate', {id: item.id})
        let screen = res.data.tplConfig
        window.localStorage.setItem('PAGE_PREVIEW_SCREEN', JSON.stringify(screen))
        window.open('http://' + window.location.host + '/#/preview?preview=true', '_blank')
      } catch (error) {

      }
      loading.close()
    },
    selectScreenSubmit () {
      let selection = this.$refs.tablePage2.selection
      if (selection.length <= 0) {
        this.$message.warning('请勾选要使用的模版')
      } else {
        selection.forEach(async e => {
          await this.$post('/cinema/index/editTemplate', {tplId: e.id})
        })
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.$refs.tablePage.refresh()
      }
    },
    async editScreenStatus (item, enable) {
      await this.$post('/cinema/index/editTemplate', {id: item.id, enable})
      this.$message.success('操作成功')
      setTimeout(() => {
        this.$refs.tablePage.refresh()
      }, 1500)
    },
    async selectGame (item) {
      await this.$post('/cinema/index/editTemplate', {id: this.operId, gId: item.id})
      this.$message.success('操作成功')
      this.$refs.tablePage.refresh()
      this.dialogVisible2 = false
    },
    delScreen (item) {
      this.$confirm(`确定删除【${item.name}】?`, '提示').then(async () => {
        await this.$post('/cinema/index/editTemplate', {id: item.id, isDel: 1})
        this.$message.success('操作成功')
        this.$refs.tablePage.refresh()
      })
    },
    async play (item) {
      if (item.statusName === '未关联游戏') {
        this.$message.warning('请先关联游戏')
        return
      }
      const loading = this.$loading({lock: true, text: '获取相关信息中', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'})
      try {
        let res = await this.$get('/cinema/index/editTemplate', {id: item.id})
        let res2 = await this.$get('/staff/user/getToken')
        // let res2 = await this.$get('/cinema/index/qrCode', {id: item.id})
        let screen = res.data.config
        // screen.qrCode = res2.data
        screen.advId = item.id
        screen.screenToken = res2.data.screenToken
        window.localStorage.setItem('PAGE_PREVIEW_SCREEN', JSON.stringify(screen))
        window.open('http://' + window.location.host + '/#/play', '_blank')
      } catch (error) {

      }
      loading.close()
      // this.openUrl = 'http://' + window.location.host + '/#/play'
      // this.$refs.openWind.click()
    },
    editScreen (item) {
      this.$router.push({path: '/cinema/screen_new', query: {id: item.id}})
    }
  }
}
</script>

<style lang="less" scoped>
.list-plane {
    display: flex;
    margin: -10px;
    margin-top: 0px;
    flex-wrap: wrap;
  }
  .el-card {
    margin: 10px;
    width: 300px;
    height: 200px;
    position: relative;
    overflow: hidden;
    .layer{
      width: 100%;
    }
    .cover{
        background-color: #fff;
        position: absolute;
        width: 100%;
        height: 70px;
        color:#333333;
        z-index: 10;
        padding: 10px;
        bottom: 0;
    }
  }
</style>
