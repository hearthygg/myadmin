<template>
  <!-- 个人中心实验列表 -->
  <div>
    <div class="course-desc mb-4">
      <span class="text-xl"><i class="iconfont icon-shiyani"></i> 我的实验</span>
      <span class="view-more" @click="router.push('/exam/onlineExam')">查看更多 <i class="iconfont icon-youjiantou"></i></span>
    </div>
    <el-scrollbar max-height="565px">
      <el-row :gutter="15" class="w-full">
        <el-col class="mb-4" v-for="item in 5" :key="item">
          <el-card class="item-card">
            <template #header>
              <span>实验标题</span>
              <el-tag class="ml-4" type="warning">自由实验</el-tag>
            </template>
            <el-descriptions :column="2" :border="true">
              <el-descriptions-item>
                <template #label>
                  <span>开始时间</span>
                </template>
                <span>2021-08-15 14:30:42</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span>结束时间</span>
                </template>
                <span>2021-08-15 14:30:42</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span>实验状态</span>
                </template>
                <el-tag type="success">正常</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <div class="text-right mt-2 mr-2">
              <el-button type="success"><i class="iconfont icon-shiyani"></i>实验文档</el-button>
              <el-button type="primary" @click="toDetail"><i class="iconfont icon-fabu1"></i>进入实验</el-button>
              <el-button type="warning"><i class="iconfont icon-shujuyulan"></i>查看报告</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
function toDetail() {
  router.push('/examDetail');
}
</script>

