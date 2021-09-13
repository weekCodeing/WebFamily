<template>
  <div id="app">
    <el-button @click="show">点我</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    show() {
      this.$message.success('Toast from element-ui')
    }
  }
}
</script>

