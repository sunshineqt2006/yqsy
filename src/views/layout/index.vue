<template>
    <el-container class="layout-box">
        <el-aside width="200px">
            <sidebar></sidebar>
        </el-aside>
        <el-container>
            <el-header height="48px">
                <navbar></navbar>
            </el-header>
            <el-main>
                 <router-view></router-view>
            </el-main>
            <el-footer height="40px">
                <x-footer></x-footer>
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import XFooter from './Footer'
export default {
  name: 'layout',
  components: { Navbar, Sidebar, XFooter },
  methods: {
    setUserInfo () {
      if (this.$root.userInfo) {
        if (this.$root.userInfo.roleId === '2') {
          this.$root.role = 'admin'
        } else if (this.$root.userInfo.roleId === '3') {
          this.$root.role = 'cinema'
        } else if (this.$root.userInfo.roleId === '4') {
          this.$root.role = 'employee'
        } else if (this.$root.userInfo.roleId === '5') {
          this.$root.role = 'brand'
        } else {
          this.logout()
        }
        window.sessionStorage.setItem('_USER_INFO', JSON.stringify(this.$root.userInfo))
        console.log('ROLE', this.$root.role)
      } else if (window.sessionStorage.getItem('_USER_INFO')) {
        this.$root.userInfo = JSON.parse(window.sessionStorage.getItem('_USER_INFO'))
        this.setUserInfo()
      } else {
        this.logout()
      }
    },
    logout () {
      this.$root.userInfo = null
      window.sessionStorage.removeItem('_USER_INFO')
      this.$router.push('/login')
    }
  },
  created () {
    this.setUserInfo()
  }
}
</script>
<style lang='less'>
.layout-box {
  position: relative;
  height: 100%;
  width: 100%;
  .el-header {
    padding: 0;
  }
  .el-footer{
    border-top: solid 1px #e6e6e6;
  }
  .el-main{
      background-color: #f1f5f6;
      padding: 30px;
      height: 100%;
  }
}
</style>
