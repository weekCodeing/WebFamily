<template>
  <div id="app">
    <el-form
        :model="data"
        style="width: 500px"
        label-position="left"
        label-width="100px"
        label-suffix="："
        :inline="false"
        :rules="rules"
        :disabled="false"
        status-icon
        validate-on-rule-change
        hide-required-asterisk
        :inline-message="false"
    >
      <el-form-item
          label="用户名"
          prop="user"
          :error="error"
          :validate-status="status"
      >
        <el-input v-model="data.user" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="data.region" placeholder="活动区域" style="width:100%">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="addRule">添加校验规则</el-button>
        <el-button @click="showError">错误状态</el-button>
        <el-button @click="showSuccess">正确状态</el-button>
        <el-button @click="showValidating">验证状态</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        data: {
          user: 'sam',
          region: '区域二'
        },
        error: '',
        status: '',
        rules: {
          user: [
            { required: true, trigger: 'change', message: '用户名必须录入' }
          ]
        }
      }
    },
    methods: {
      /* eslint-disable */
      onSubmit() {
        console.log(this.data)
      },
      addRule() {
        const userValidator = (rule, value, callback) => {
          if (value.length > 3) {
            this.inputError = ''
            this.inputValidateStatus = ''
            callback()
          } else {
            callback(new Error('用户名长度必须大于3'))
          }
        }
        const newRule = [
          ...this.rules.user,
          { validator: userValidator, trigger: 'change' }
        ]
        this.rules = Object.assign({}, this.rules, { user: newRule })
      },
      showError() {
        this.status = 'error'
        this.error = '用户名输入有误'
      },
      showSuccess() {
        this.status = 'success'
        this.error = ''
      },
      showValidating() {
        this.status = 'validating'
        this.error = ''
      }
    }
  }
</script>