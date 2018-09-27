<template>
  <div>
    <el-form inline>
      <el-form-item label="公众号名称">
        <el-input v-model="params.name" placeholder="请输入公众号名称"></el-input>
      </el-form-item>
      <el-form-item >
         <el-button type="primary" @click="$refs.tablePage.refresh()">查询</el-button>
         <el-button type="success" @click="newWechat">新建</el-button>
      </el-form-item>
    </el-form>
    <TablePage ref="tablePage" :fetch="fetchTableData" :params="params" style="width: 100%">
       <el-table-column type="index"></el-table-column>
       <el-table-column width="180" prop="name" label="公众号名称"></el-table-column>
        <el-table-column width="120" prop="appType" label="类型"></el-table-column>
       <el-table-column width="180" prop="appId" label="AppId"></el-table-column>
       <el-table-column width="150" prop="secret" label="Secret" show-overflow-tooltip></el-table-column>
       <el-table-column width="150" prop="weChatId" label="原始ID" show-overflow-tooltip></el-table-column>
       <el-table-column width="150" prop="encodingAESKey" label="消息加解密密钥" show-overflow-tooltip></el-table-column>
       <el-table-column width="120"  prop="operator" label="操作员"></el-table-column>
       <el-table-column width="160" prop="createTime" label="创建时间"></el-table-column>
       <el-table-column width="160" prop="modifyTime" label="修改时间"></el-table-column>
       <el-table-column min-width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="warning" plain size="small" @click="editWechat(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="small" @click="delWechat(scope.row)">删除</el-button>
          </template>
       </el-table-column>
    </TablePage>
    <el-dialog :title="isEdit? '编辑公众号':'新建公众号'" :visible.sync="dialogVisible" width="500px">
      <el-form  label-width="120px" :model="newParams" :rules="rules" ref="form">
        <el-form-item label="公众号类型">
          <el-select  v-model="newParams.appType" >
            <el-option label="订阅号" value="1"> </el-option>
            <el-option label="服务号" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公众号名称"  prop="name">
          <el-input v-model="newParams.name" placeholder="请输入公众号名称"></el-input>
        </el-form-item>
        <el-form-item label="AppId" prop="appId">
          <el-input v-model="newParams.appId" placeholder="请输入AppId"></el-input>
        </el-form-item>
        <el-form-item label="Secret" prop="secret">
          <el-input v-model="newParams.secret" placeholder="请输入Secret"></el-input>
        </el-form-item>
        <el-form-item label="原始ID" prop="weChatId">
          <el-input v-model="newParams.weChatId"  placeholder="请输入原始ID"></el-input>
        </el-form-item>
        <el-form-item label="消息加解密密钥">
          <el-input v-model="newParams.encodingAESKey"  placeholder="请输入消息加解密密钥"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitNewWechat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      params: {
        name: ''
      },
      newParams: {
        name: '',
        appId: '',
        secret: '',
        weChatId: '',
        encodingAESKey: '',
        appType: '1'
      },
      rules: {
        name: { required: true, message: '请输入公众号名称', trigger: 'blur' },
        appId: { required: true, message: '请输入AppId', trigger: 'blur' },
        secret: { required: true, message: '请输入Secret', trigger: 'blur' },
        weChatId: { required: true, message: '请输入原始ID', trigger: 'blur' }
      },
      dialogVisible: false,
      isEdit: false
    }
  },
  methods: {
    fetchTableData (params) {
      return this.$get('/platform/admin/getWechatList', params)
    },
    newWechat () {
      this.newParams = { name: '', appId: '', secret: '', weChatId: '', appType: '1', encodingAESKey: '' }
      this.isEdit = false
      this.dialogVisible = true
    },
    editWechat (item) {
      this.newParams = item
      this.isEdit = true
      this.dialogVisible = true
    },
    delWechat (item) {
      this.$confirm(`确定删除【${item.name}】?`, '提示').then(async () => {
        await this.$post('/platform/admin/editWechat', {id: item.id, isDel: 1})
        this.$message.success('操作成功')
        this.$refs.tablePage.refresh()
      })
    },
    async submitNewWechat () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await this.$post('/platform/admin/editWechat', this.newParams)
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
