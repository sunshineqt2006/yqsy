<template>
  <div>
    <el-form inline>
      <!-- <el-form-item label="影院名称">
        <el-input v-model="params.name" placeholder="请输入影院名称"></el-input>
      </el-form-item> -->
      <CinemaSelector v-model="params.cinemaCode"></CinemaSelector>
      <el-form-item label="统计时间">
        <el-date-picker value-format="yyyy-MM-dd" v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      </el-form-item>
      <el-form-item >
         <el-button type="primary" @click="query">查询</el-button>
         <el-button type="success" @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
    <el-card class="global">
      <div class="global-item"><span class="text">新增关注:</span><span class="value">{{global.subscribe}}</span></div>
      <div class="global-item"><span class="text">启动游戏次数:</span><span class="value">{{global.totalQty}}</span></div>
      <div class="global-item"><span class="text">有效启动次数:</span><span class="value">{{global.vaildQty}}</span></div>
    </el-card>
    <el-tabs type="border-card" v-model="tab">
      <el-tab-pane label="新增关注用户">
        <TablePage ref="tablePage" :fetch="fetchTableData" :params="params" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column min-width="200" prop="nickname" label="用户昵称"></el-table-column>
          <el-table-column width="100" prop="sex" label="性别"></el-table-column>
          <el-table-column width="250" prop="weChat" label="关注公众号"></el-table-column>
          <el-table-column width="250" prop="cinemaName" label="关注来源影院"></el-table-column>
          <el-table-column width="250" prop="gameName" label="关联游戏"></el-table-column>
          <el-table-column width="250" prop="tplName" label="关联映游"></el-table-column>
          <el-table-column width="200" prop="subscribeTime" label="关注时间"></el-table-column>
        </TablePage>
      </el-tab-pane>
      <el-tab-pane label="用户游戏记录">
        <TablePage ref="tablePage2" :fetch="fetchTableData2" :params="params" style="width: 100%">
          <el-table-column  type="index"></el-table-column>
          <el-table-column min-width="200" prop="nickname" label="用户昵称"></el-table-column>
          <el-table-column width="80" prop="sex" label="性别"></el-table-column>
          <el-table-column width="80" prop="rank" label="名次"></el-table-column>
          <el-table-column width="100" prop="scoreValue" label="得分"></el-table-column>
          <el-table-column width="250" prop="weChat" label="关注公众号"></el-table-column>
          <el-table-column width="250" prop="gameName" label="关联游戏"></el-table-column>
          <el-table-column width="250" prop="tplName" label="关联映游"></el-table-column>
          <el-table-column width="200" prop="startTime" label="游戏时间"></el-table-column>
        </TablePage>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: '',
      time: '',
      params: {
        name: '',
        status: ''
      },
      global: {
        subscribe: 0,
        totalQty: 0,
        vaildQty: 0
      }
    }
  },
  methods: {
    async fetchTableData (params) {
      if (this.time) {
        params.startTime = this.time[0]
        params.endTime = this.time[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      let res = await this.$get('/cinema/index/getSubscribers', params)
      this.global.subscribe = res.data.page.total
      this.global.totalQty = res.data.sum.totalQty
      this.global.vaildQty = res.data.sum.vaildQty
      return Promise.resolve(res)
    },
    fetchTableData2 (params) {
      if (this.time) {
        params.startTime = this.time[0]
        params.endTime = this.time[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      return this.$get('/cinema/index/getGameLog', params)
    },
    async exportData () {
      let params = Object.assign({}, this.params)
      params.exportType = 'excel'
      let res = {}
      if (this.tab === '0') {
        res = await this.$get('/cinema/index/getSubscribers', params)
      } else if (this.tab === '1') {
        res = await this.$get('/cinema/index/getGameLog', params)
      }
      window.open(res.data.fullName)
    },
    query () {
      this.$refs.tablePage.refresh()
      this.$refs.tablePage2.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.global{
  margin-bottom: 20px;
  .global-item{
    display: inline-block;
    margin-right: 40px;
  }
  .text{
    color:#f56c6c;
  }
  .value{
    margin-left: 10px;
    font-size: 24px;
  }
}
</style>
