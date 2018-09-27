<template>
  <div>
    <el-form inline>
      <el-form-item label="影院名称">
        <el-input v-model="params.cinemaName" placeholder="请输入影院名称"></el-input>
      </el-form-item>
      <el-form-item >
         <el-button type="primary" @click="$refs.tablePage.refresh()">查询</el-button>
         <el-button type="success" @click="newCinema">新建</el-button>
      </el-form-item>
    </el-form>
    <TablePage ref="tablePage" :fetch="fetchTableData" :params="params" style="width: 100%">
       <el-table-column type="index"></el-table-column>
       <el-table-column width="200" prop="cinemaCode" label="影院编码"></el-table-column>
       <el-table-column width="250" prop="cinemaName" label="影院名称"></el-table-column>
       <el-table-column width="180" prop="createTime" label="创建时间"></el-table-column>
       <el-table-column min-width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="warning" plain size="small" @click="editCinema(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="small" @click="delCinema(scope.row)">删除</el-button>
          </template>
       </el-table-column>
    </TablePage>
    <el-dialog :title="isEdit? '编辑影院':'新建影院'" :visible.sync="dialogVisible" width="500px">
      <el-form  label-width="100px"  :model="newParams" :rules="rules" ref="form">
        <el-form-item label="影院名称" prop="cinemaName">
          <el-input v-model="newParams.cinemaName" placeholder="请输入影院名称"></el-input>
        </el-form-item>
        <el-form-item label="影院编码" prop="cinemaCode">
          <el-input v-model="newParams.cinemaCode" :disabled="isEdit" placeholder="请输入编码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitNewCinema">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      params: {
        cinemaName: ''
      },
      newParams: {
        cinemaName: '',
        cinemaCode: ''
      },
      rules: {
        cinemaName: { required: true, message: '请输入影院名称', trigger: 'blur' },
        cinemaCode: { required: true, message: '请输入编码', trigger: 'blur' }
      },
      dialogVisible: false,
      isEdit: false
    }
  },
  methods: {
    fetchTableData (params) {
      return this.$get('/platform/admin/getCinemaList', params)
    },
    newCinema () {
      this.newParams = { cinemaName: '', cinemaCode: '' }
      this.isEdit = false
      this.dialogVisible = true
    },
    editCinema (item) {
      this.newParams = item
      this.isEdit = true
      this.dialogVisible = true
    },
    delCinema (item) {
      this.$confirm(`确定删除【${item.cinemaName}】?`, '提示').then(async () => {
        await this.$post('/platform/admin/editCinema', {cinemaCode: item.cinemaCode, isDel: 1})
        this.$message.success('操作成功')
        this.$refs.tablePage.refresh()
      })
    },
    async submitNewCinema () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await this.$post('/platform/admin/editCinema', this.newParams)
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.$refs.tablePage.refresh()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
