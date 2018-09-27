<template>
  <div class="error-box">
    <i class="el-icon-error"></i>
    <div class="msg">{{errorMsg||'页面异常'}}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      errorMsg: ''
    }
  },
  created () {
    this.errorMsg = decodeURI(this.$route.query.msg)
  }
}
</script>

<style lang="less" scoped>
.error-box{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(60% 40%,#fff 25%, #cfe7ff 95%);
}
.el-icon-error{
  font-size: 88px;
  color:#f56c6c;
}
.msg{
  font-size: 20px;
  color:#333;
  margin-top: 20px;
}
</style>
