<template>
    <el-menu mode="horizontal"  class="navbar-box">
        <i class="el-icon-caidan" style="margin-right:10px;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumb" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="flex:1"></div>
        <!-- <div>
            PETER<i class="el-icon-head"></i>
        </div> -->
        <!-- <el-badge :value="12" class="item" >
            <i class="el-icon-bell"></i>
        </el-badge> -->

         <el-submenu index='1'>
            <template slot="title">{{$root.userInfo.nick}}</template>
            <el-menu-item index='1-1' @click="modifyPassword">修改密码</el-menu-item>
            <el-menu-item index='1-2' @click="logout">安全退出</el-menu-item>
         </el-submenu>
        <!-- <el-button type="text" @click="logout">安全退出</el-button> -->
    </el-menu>
</template>

<script>
export default {
  data () {
    return {
      breadcrumb: [],
      userInfo: ''
    }
  },
  watch: {
    '$route' (val) {
      this.breadcrumb = val.matched.map(val => val.meta.title)
    }
  },
  methods: {
    logout () {
      this.$root.userInfo = null
      window.sessionStorage.removeItem('_USER_INFO')
      this.$router.push('/login')
    },
    modifyPassword () {
      this.$message.info('暂不支持')
    }
  },
  created () {
    this.breadcrumb = this.$route.matched.map(val => val.meta.title)
  }
}
</script>
<style lang='less'>
.navbar-box {
    height: 48px;
    display: flex;
    padding: 0 20px !important;
    align-items: center;
    .el-icon-caidan{
      font-size: 18px;
    }
    .el-icon-bell{
        font-size: 20px;
    }
    .el-submenu__title{
       height: 46px !important;
       line-height:46px !important;
    }
}
</style>
