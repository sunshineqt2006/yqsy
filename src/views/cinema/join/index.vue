<template>
  <div>
    <el-form inline>
      <el-form-item label="影院名称">
        <el-input v-model="params.name" placeholder="请输入影院名称"></el-input>
      </el-form-item>
      <el-form-item >
         <el-button type="primary" @click="$refs.tablePage.refresh()">查询</el-button>
         <el-button type="success" @click="newCinema">新建</el-button>
      </el-form-item>
    </el-form>
    <TablePage ref="tablePage" :fetch="fetchTableData" :params="params" style="width: 100%">
       <el-table-column width="200" prop="cinemaCode" label="影院编码"></el-table-column>
       <el-table-column min-width="100" prop="cinemaName" label="影院名称"></el-table-column>
       <el-table-column width="120" prop="account" label="影院账号"></el-table-column>
       <el-table-column width="120" prop="createTime" label="创建时间"></el-table-column>
       <el-table-column width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="warning" plain size="small">编辑</el-button>
          </template>
       </el-table-column>
    </TablePage>
    <el-dialog title="新建影院" :visible.sync="dialogVisible" width="500px">
      <el-form  label-width="100px">
        <el-form-item label="影院名称">
          <el-input v-model="newParams.cinemaName" placeholder="请输入影院名称"></el-input>
        </el-form-item>
        <el-form-item label="影院编码">
          <el-input v-model="newParams.cinemaCode" placeholder="请输入编码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      params: {
        name: '',
        status: ''
      },
      newParams: {
        cinemaName: '',
        cinemaCode: ''
      },
      dialogVisible: false
    }
  },
  methods: {
    fetchTableData () {
      let res = {
        data: {
          list: [
            {cinemaCode: '35010411', cinemaName: 'mgf私影汇', account: 'test1', createTime: '2018/03/02'},
            {cinemaCode: '23128111', cinemaName: '安达市隆美影城', account: 'test2', createTime: '2018/03/02'},
            {cinemaCode: '43072101', cinemaName: '安化电影院安化巨幕影城', account: 'test2', createTime: '2018/03/02'}
          ],
          page: {
            total: 1
          }
        }
      }
      return Promise.resolve(res)
    },
    newCinema () {
      this.dialogVisible = true
      // this.$router.push('/cinema/join_new')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
