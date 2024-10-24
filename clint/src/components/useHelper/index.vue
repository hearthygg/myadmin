<template>
  <!-- 引导和帮助用户使用管理系统 -->
  <div class="app-container">
    <el-steps style="max-width: 600px" :active="state.currentStep" align-center>
      <el-step title="Step 1" description="Some description" />
      <el-step title="Step 2" description="Some description" />
      <el-step title="Step 3" description="Some description" />
    </el-steps>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';

const state = reactive({
  // 当前步骤
  currentStep: 0,
  // 步骤条数据
  stepData: []
});
</script>
