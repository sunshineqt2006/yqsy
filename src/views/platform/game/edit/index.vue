<template>
  <div>
    <el-form :model="params" :rules="rules" ref="form" label-width="120px">
         <el-form-item label="游戏名称"  prop="name">
            <el-input placeholder="请输入游戏名称"  v-model="params.name"></el-input>
         </el-form-item>
          <el-form-item label="游戏简介"  prop="desc">
            <el-input type="textarea" placeholder="请输入游戏简介内容" v-model="params.desc"></el-input>
         </el-form-item>
          <el-form-item label="游戏时长(秒)"  prop="time">
            <el-input-number v-model="params.time" :min="0" :max="150"></el-input-number>
         </el-form-item>
         <el-form-item label="游戏包"  prop="attachment">
            <x-upload v-model="params.attachment"> <span>{{params.attachment.fileName}}</span></x-upload>
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
        name: '',
        desc: '',
        time: 60,
        attachment: ''
      },
      rules: {
        name: { required: true, message: '请输入游戏名称', trigger: 'blur' },
        desc: { required: true, message: '请输入游戏简介内容', trigger: 'blur' },
        time: { required: true, message: '请输入游戏时长', trigger: 'blur' },
        attachment: { required: true, message: '请上传游戏包', trigger: 'change' }
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let params = Object.assign({}, this.params)
          params.attachment = JSON.stringify(params.attachment)
          await this.$post('/platform/admin/editGame', params)
          this.$message.success('操作成功')
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
