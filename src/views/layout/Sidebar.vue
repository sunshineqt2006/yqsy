<template>
<el-menu  :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" class="sidebar-box" router>
  <img  class="logo" src="~@/assets/logo.png">
  <el-submenu index="2" v-if="$root.role==='admin'">
    <template slot="title">
      <i class="el-icon-pingtai"></i>
      <span slot="title">平台管理</span>
    </template>
    <el-menu-item index="/platform/cinema" route="/platform/cinema">影院接入</el-menu-item>
    <el-menu-item index="/platform/wechat" route="/platform/wechat">公众号接入</el-menu-item>
    <el-menu-item index="/platform/account" route="/platform/account">账号管理</el-menu-item>
    <el-menu-item index="/platform/game" route="/platform/game">游戏配置</el-menu-item>
    <el-menu-item index="/platform/screen" route="/platform/screen">映游模版配置</el-menu-item>
  </el-submenu>
  <el-submenu index="3">
    <template slot="title">
      <i class="el-icon-yingyuan"></i>
      <span slot="title">影院管理</span>
    </template>
    <!-- <el-menu-item index="3-1" route="/platform/screen">游戏配置</el-menu-item> -->
    <el-menu-item index="/platform/account" route="/platform/account"  v-if="$root.role==='cinema'">账号管理</el-menu-item>
    <el-menu-item index="/cinema/screen"  v-if="$root.role==='cinema'||$root.role==='admin'" route="/cinema/screen">映游配置</el-menu-item>
    <el-menu-item index="/cinema/statistics" route="/cinema/statistics">运营统计</el-menu-item>
  </el-submenu>
</el-menu>

</template>

<script>

export default {

}
</script>
<style lang='less'>
.sidebar-box {
    height: 100%;
    border:0 !important;
    .el-submenu .el-menu-item{
      padding-left: 54px !important;
    }
  .logo{
    margin: 20px auto 20px 20px;
  }
}

</style>
