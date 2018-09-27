<template>
  <div>
      <el-form inline>
      <el-form-item label="模版名称">
        <el-input v-model="params.name" placeholder="请输入模版名称"></el-input>
      </el-form-item>
       <el-form-item >
         <el-button type="primary" @click.native="$refs.tablePage.refresh()">查询</el-button>
         <el-button type="success" @click.native="newScreen">新建</el-button>
      </el-form-item>
    </el-form>
    <TablePage ref="tablePage" :fetch="fetchTableData" :params="params">
       <el-table-column type="index"></el-table-column>
       <el-table-column width="250"  prop="name" label="映游模版名称"></el-table-column>
       <el-table-column width="200"  prop="weChat" label="关联公众号"></el-table-column>
       <el-table-column width="180"  prop="cinemasName" label="下发影院" show-overflow-tooltip></el-table-column>
       <el-table-column width="120"  prop="statusName" label="状态"></el-table-column>
       <el-table-column width="120"  prop="operator" label="操作员"></el-table-column>
       <el-table-column width="160"  prop="createTime" label="创建时间"></el-table-column>
       <el-table-column width="160"  prop="modifyTime" label="修改时间"></el-table-column>
       <el-table-column min-width="400" label="操作">
          <template slot-scope="scope">
            <el-button  plain size="small" @click="previewScreen(scope.row)">预览</el-button>
            <el-button type="warning" plain size="small" @click="editScreen(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status==='0'" type="success" plain size="small" @click="editScreenStatus(scope.row,1)">启用</el-button>
            <el-button v-else type="danger" plain size="small" @click="editScreenStatus(scope.row,0)">停用</el-button>
            <el-button type="success" plain size="small" @click="dispatchCinema(scope.row)">下发影院</el-button>
            <el-button type="danger" plain  size="small" @click="delScreen(scope.row)">删除</el-button>
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
     <el-dialog title="下发影院" :visible.sync="dialogVisible" width="540px">
        <el-switch  v-model="xfParams.isAll" active-text="全部影院" inactive-text="选择下发影院"></el-switch>
        <el-transfer style="margin-top:20px;" v-if="!xfParams.isAll" filterable :titles="['未选择影院', '已选择影院']" :filter-method="filterMethod" filter-placeholder="请输入城市拼音" v-model="xfParams.cinemas" :data="cinemas"></el-transfer>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dispatchCinemaSave">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
// import testpng from '@/assets/1.jpg'
export default {
  data () {
    return {
      params: {
        name: ''
      },
      xfParams: {
        id: '',
        isAll: false,
        cinemas: []
      },
      dialogVisible: false,
      cinemas: this.$root.userInfo.cinemaList.map(e => {
        return {
          key: e.value,
          label: e.label
        }
      })
    }
  },
  methods: {
    fetchTableData (params) {
      return this.$get('/platform/admin/getTemplateList', params)
    },
    newScreen () {
      this.$router.push('/platform/screen_new')
    },
    filterMethod (query, item) {
      return item.label.indexOf(query) > -1
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
    editScreen (item) {
      this.$router.push({path: '/platform/screen_new', query: {id: item.id}})
    },
    async editScreenStatus (item, enable) {
      await this.$post('/platform/admin/editTemplate', {id: item.id, enable})
      this.$message.success('操作成功')
      this.$refs.tablePage.refresh()
    },
    delScreen (item) {
      this.$confirm(`确定删除【${item.name}】?`, '提示').then(async () => {
        await this.$post('/platform/admin/editTemplate', {id: item.id, isDel: 1})
        this.$message.success('操作成功')
        this.$refs.tablePage.refresh()
      })
    },
    dispatchCinema (item) {
      this.xfParams.id = item.id
      this.xfParams.isAll = item.cinemas === -1 || item.cinemas === null
      this.xfParams.cinemas = item.cinemas === -1 || item.cinemas === null ? [] : item.cinemas
      this.dialogVisible = true
    },
    async dispatchCinemaSave () {
      let params = {
        id: this.xfParams.id,
        cinemas: -1
      }
      if (!this.xfParams.isAll) {
        params.cinemas = JSON.stringify(this.xfParams.cinemas)
      }
      await this.$post('/platform/admin/dispatchCinema', params)
      this.$message.success('操作成功')
      this.dialogVisible = false
      this.$refs.tablePage.refresh()
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
