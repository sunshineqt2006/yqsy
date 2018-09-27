<template>
  <div class="screen-select-box">
      <el-form label-width="120px" class="oper-form">
        <el-form-item label="游戏轮数">
          <el-input-number v-model="poll"  :min="1" :max="100" ></el-input-number>
        </el-form-item>
        <el-form-item label="每轮间隔">
          <el-input-number v-model="interval"  :min="0" :max="200"></el-input-number>&nbsp;&nbsp;分钟
        </el-form-item>
      </el-form>
      <el-table :data="tableData" :height="screenH">
        <el-table-column min-width="200" prop="name" label="映游名称" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="操作">
            <template slot-scope="scope">
              <el-button plain size="small" @click="selectScreen(scope.row)">启动游戏</el-button>
            </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      token: '',
      screenH: '',
      poll: 1,
      interval: 1
    }
  },
  methods: {
    async fetchTableData () {
      // let params = {
      //   page: 0,
      //   pageSize: 1000,
      //   status: 1
      // }
      // let a = JSON.parse('{"status":0,"data":{"page":{"cur":1,"size":10,"total":2},"list":[{"id":"7","name":"\u65b0\u5efa \u4e16\u754c\u676f","statusName":"\u542f\u7528","status":"1","createTime":"2018-05-23 10:28:16","cinemaCode":"009955","cinemaName":"\u6d4b\u8bd5\u5f71\u9662"},{"id":"8","name":"\u65b0\u5efa \u4e16\u754c\u676f","statusName":"\u542f\u7528","status":"1","createTime":"2018-05-23 10:28:16","cinemaCode":"23321434","cinemaName":"\u6211\u7684\u6d4b\u8bd5\u5f71\u9662"}]},"content":"success"}')
      // this.tableData = a.data.list // (await this.$get('/cinema/index/getTemplateList', params)).data.list
      this.tableData = (await this.$get('/cinema/index/getTemplateList', {pageSize: 1000, status: 1, sort: 'mobile'})).data.list
    },
    async selectScreen (item) {
      await this.$get('/cinema/index/playAD', {screenToken: this.token, advId: item.id, poll: this.poll, interval: this.interval})
    }
  },
  created () {
    this.screenH = document.body.clientHeight
    this.token = this.$route.query.token
    this.fetchTableData()
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
}
.qr{
  height: 300px;
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
.oper-form{
  width:100%;
  padding: 20px 0 0px 0;
  margin-bottom: 15px;
  background-color: #fff;
}
</style>
