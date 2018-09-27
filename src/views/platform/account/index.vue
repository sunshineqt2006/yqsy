<template>
  <div>
    <el-form inline>
      <el-form-item label="账号名称">
        <el-input v-model="params.name" placeholder="请输入账号名称"></el-input>
      </el-form-item>
      <el-form-item >
         <el-button type="primary" @click="$refs.tablePage.refresh()">查询</el-button>
         <el-button type="success" @click="newStaff">新建</el-button>
      </el-form-item>
    </el-form>
    <TablePage ref="tablePage" :fetch="fetchTableData" :params="params" style="width: 100%">
       <el-table-column type="index"></el-table-column>
       <el-table-column width="150" prop="account" label="账号名"></el-table-column>
       <el-table-column width="150" prop="nick" label="昵称"></el-table-column>
       <el-table-column width="150" prop="roleName" label="角色"></el-table-column>
       <el-table-column width="250" prop="cinemasName" v-if="$root.role==='admin'" label="关联影院" show-overflow-tooltip></el-table-column>
       <el-table-column width="160" prop="createTime" label="创建时间"></el-table-column>
       <el-table-column width="160" prop="modifyTime" label="修改时间"></el-table-column>
       <el-table-column min-width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="warning" plain size="small"  @click="editStaff(scope.row)" v-if="!($root.role === 'cinema'&&$root.userInfo.id===scope.row.id)">编辑</el-button>
            <el-button type="danger" plain size="small" @click="delStaff(scope.row)">删除</el-button>
          </template>
       </el-table-column>
    </TablePage>
    <el-dialog :title="isEdit? '编辑账号':'新建账号'" :visible.sync="dialogVisible" width="500px">
      <el-form  label-width="100px"  :model="newParams" :rules="rules" ref="form">
        <el-form-item label="账号名" prop="account">
          <el-input v-model="newParams.account" placeholder="请输入账号名"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nick">
          <el-input v-model="newParams.nick" placeholder="请输入昵称,3~15个字符"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="newParams.password" placeholder="请输入密码,6~15个字符"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select style="width:100%" v-model="newParams.roleId" placeholder="请选择角色">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="newParams.roleId!==2&&($root.role==='admin'||$root.role==='cinema')" label="关联影院" prop="cinemas">
          <el-select style="width:100%" v-model="newParams.cinemas"  multiple filterable default-first-option placeholder="请选择影院,可中文搜索,可多选">
            <el-option v-for="item in $root.userInfo.cinemaList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitNewStaff">确 定</el-button>
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
        account: '',
        nick: '',
        password: '',
        roleId: '',
        cinemas: ''
      },
      dialogVisible: false,
      isEdit: false,
      roleOptions: [
        {id: 2, title: '平台管理员'},
        {id: 3, title: '影院管理员'},
        {id: 4, title: '影院员工'},
        {id: 5, title: '品牌主'}
      ],
      rules: {
        account: { required: true, message: '请输入账号名', trigger: 'blur' },
        nick: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 3, max: 15, message: '请输入6~15个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请输入6~15个字符', trigger: 'blur' }
        ],
        roleId: { required: true, message: '请选择角色', trigger: 'blur' },
        cinemas: { required: true, message: '请选择关联影院', trigger: 'blur' }
      }
    }
  },
  methods: {
    fetchTableData (params) {
      return this.$get('/staff/user/getStaffList', params)
    },
    async newStaff () {
      this.newParams = {
        account: '',
        nick: '',
        password: '',
        roleId: '',
        cinemas: []
      }
      if (this.$root.role === 'cinema') {
        this.roleOptions = [
          {id: 4, title: '影院员工'}
        ]
        this.newParams.roleId = 4
      } else {
        this.newParams.roleId = 3
      }
      this.isEdit = false
      this.dialogVisible = true
      // if (this.roleOptions.length <= 0) {
      //   let roles = await this.$get('/staff/user/getRoleList')
      //   this.roleOptions = roles.data
      // }
    },
    editStaff (item) {
      this.newParams = Object.assign({}, item)
      if (this.newParams.cinemas == null) {
        this.newParams.cinemas = []
      }
      if (this.$root.role === 'cinema') {
        this.roleOptions = [
          {id: 4, title: '影院员工'}
        ]
      }
      this.newParams.roleId = parseInt(this.newParams.roleId)
      this.isEdit = true
      this.dialogVisible = true
    },
    delStaff (item) {
      this.$confirm(`确定删除【${item.name}】?`, '提示').then(async () => {
        await this.$post('/staff/user/editStaff', {id: item.id, isDel: 1})
        this.$message.success('操作成功')
        this.$refs.tablePage.refresh()
      })
    },
    async submitNewStaff () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let params = Object.assign({}, this.newParams)
          params.cinemas = JSON.stringify(params.cinemas)
          await this.$post('/staff/user/editStaff', params)
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
