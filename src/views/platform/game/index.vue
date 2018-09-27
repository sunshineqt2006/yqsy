<template>
  <div>
      <el-form inline>
      <el-form-item label="游戏名称">
        <el-input v-model="params.name" placeholder="请输入游戏名称"></el-input>
      </el-form-item>
       <el-form-item >
         <el-button type="primary" @click.native="$refs.tablePage.refresh()">查询</el-button>
         <el-button type="success" @click.native="newGame">新建</el-button>
      </el-form-item>
    </el-form>
    <TablePage ref="tablePage" :fetch="fetchTableData" :params="params">
       <el-table-column type="index"></el-table-column>
       <el-table-column  width="250" prop="name" label="游戏名称"></el-table-column>
       <el-table-column width="100" prop="time" label="时长(秒)"></el-table-column>
       <el-table-column width="300" prop="desc" label="简述" show-overflow-tooltip></el-table-column>
       <el-table-column  width="200" prop="createTime" label="创建时间"></el-table-column>
       <el-table-column min-width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" plain size="small"  @click="delGame(scope.row)">删除</el-button>
          </template>
       </el-table-column>
    </TablePage>
  </div>
</template>

<script>
export default {
  data () {
    return {
      params: {
        name: ''
      }
    }
  },
  methods: {
    fetchTableData (params) {
      return this.$get('/platform/admin/getGameList', params)
    },
    newGame () {
      this.$router.push('/platform/game_new')
    },
    delGame (item) {
      this.$confirm(`确定删除【${item.name}】?`, '提示').then(async () => {
        await this.$post('/platform/admin/editGame', {id: item.id, isDel: 1})
        this.$message.success('操作成功')
        this.$refs.tablePage.refresh()
      })
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
