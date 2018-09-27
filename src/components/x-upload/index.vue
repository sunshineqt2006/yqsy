<template>
   <el-upload  v-bind="$attrs" action="/api/platform/admin/upload" :show-file-list="false" :on-progress="uploadProgress"  :on-success="uploadSuccess">
      <el-button ref="btn"  class="btn" :icon="loading? 'el-icon-loading':'el-icon-upload' "  type="primary" :disabled="loading">{{label}}</el-button>
      <slot></slot>
   </el-upload>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '点击上传'
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    uploadProgress () {
      this.loading = true
    },
    uploadSuccess (res, file) {
      this.loading = false
      this.$emit('input', res.data)
      this.$emit('success', res.data, file)
    }
  }
}
</script>

<style scoped>

</style>
