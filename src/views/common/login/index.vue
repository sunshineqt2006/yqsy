<template>
  <el-container style="height:100%" class="login-box">
    <el-main>
      <div class="login">
        <img src="~@/assets/common/login_bg.png">
        <div class="form">
          <span class="title">用户登录/Login</span>
          <el-form :model="params" status-icon :rules="rules" ref="ruleForm">
            <el-form-item prop="userName">
              <el-input v-model="params.userName" prefix-icon="el-icon-yonghu"></el-input>
            </el-form-item>
            <el-form-item prop="userPwd">
              <el-input type="password" v-model="params.userPwd"  prefix-icon="el-icon-mima"></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="params.remeber">记住账号</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit()">登 录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
    <el-button type="text" @click="play">映游播放</el-button>
    <el-footer height="80px">Copyright  2018 影托邦 版权所有 </el-footer>
  </el-container>
</template>
<script>

export default {
  computed: {

  },
  data () {
    return {
      params: {
        userName: '',
        userPwd: '',
        remeber: false
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.ruleForm.validate(async valid => {
        this.rememberPw()
        if (valid) {
          try {
            this.$root.userInfo = (await this.$post('/staff/user/login', this.params)).data
            if (this.$root.userInfo.roleId === '4' || this.$root.userInfo.roleId === '5') {
              this.$router.push('/cinema/statistics')
            } else {
              this.$router.push('/cinema/screen')
            }
          } catch (error) {

          }
        }
      })
    },
    rememberPw () {
      if (this.params.remeber) {
        window.localStorage.setItem('_G_ACCOUNT', this.params.userName)
      } else {
        window.localStorage.setItem('_G_ACCOUNT', '')
      }
    },
    play () {
      this.$router.push('/screen_select')
    }
  },
  created () {
    let account = window.localStorage.getItem('_G_ACCOUNT')
    if (account) {
      this.params.userName = account
    }
  }
}
</script>
<style lang="less">
.login-box{
  background: radial-gradient(60% 40%,#fff 25%, #cfe7ff 95%);
.el-main {
  align-items: center;
  display: flex;
  .login {
    display:flex;
    align-items: center;
    max-width: 970px;
    margin: 0 auto;
    height: 100%;
    .form {
      width: 320px;
      margin-left:50px;
      .title {
        line-height: 50px;
        font-size: 20px;
        display: block;
        margin-bottom: 10px;
      }
      .el-button--primary {
        width: 100%;
      }
    }
  }
}
.el-footer {
  text-align: center;
  border-top: 1px solid #b7d9fb;
  color:#666666;
  line-height: 80px;
}
}

</style>
