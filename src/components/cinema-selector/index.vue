<template>
<el-form-item label="影院" v-show="$root.userInfo.cinemaList&&$root.userInfo.cinemaList.length>1">
  <el-select v-model="value0" v-bind="$attrs"  filterable placeholder="请选择,可中文搜索" >
     <el-option v-if="$root.userInfo.cinemaList&&$root.userInfo.cinemaList.length>1"
      key=""
      label="全部"
      value="">
    </el-option>
    <el-option
      v-for="item in $root.userInfo.cinemaList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</el-form-item>
</template>

<script>
export default {
  props: {
    value: String
  },
  data () {
    return {
      value0: ''
    }
  },
  watch: {
    value0 (val) {
      this.$emit('input', val)
    }
  },
  created () {
    if (this.$root.userInfo.cinemaList.length === 1) {
      this.value0 = this.$root.userInfo.cinemaList[0].value
    }
  }
}
</script>

<style scoped>

</style>
