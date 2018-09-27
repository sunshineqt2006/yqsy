<template>
  <div>
     <el-form label-width="120px">
          <div class="form-line">基础信息</div>
          <el-form-item label="影院名称">
            <el-input v-model="params.cinemaName" placeholder="请输入影院名称"></el-input>
          </el-form-item>
          <el-form-item label="影院编码">
            <el-input v-model="params.cinemaCode" placeholder="请输入影院编码"></el-input>
          </el-form-item>
          <div class="form-line">账号信息</div>
          <el-form-item label="账号昵称">
            <el-input v-model="params.nick" placeholder="请输入账号昵称"></el-input>
          </el-form-item>
          <el-form-item label="影院账号">
            <el-input v-model="params.account" placeholder="请输入影院账号"></el-input>
          </el-form-item>
          <el-form-item label="影院密码">
            <el-input v-model="params.password" placeholder="请输入影院账号"></el-input>
          </el-form-item>
          <div class="form-line">公众号信息</div>
          <el-form-item label="AppID">
            <el-input v-model="params.appId" placeholder="请输入公众号AppId"></el-input>
          </el-form-item>
          <el-form-item label="Secret">
            <el-input v-model="params.secret" placeholder="请输入公众号秘钥"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      params: {
        cinemaName: '',
        cinemaCode: '',
        nick: '',
        account: '',
        password: '',
        appId: '',
        secret: ''
      }
    }
  },
  methods: {
    onSubmit () {

    }
  }
}
</script>

<style scoped>
.form-line{
  color:#888888;
  border-bottom:1px solid #dbdbdb;
  margin-bottom:20px;
  padding:8px;
}
</style>
