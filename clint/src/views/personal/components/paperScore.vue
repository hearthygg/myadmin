<template>
  <!-- 个人中心我的成绩 -->
  <div>
    <div class="course-desc mb-4">
      <span class="text-xl"><i class="iconfont icon-chengji"></i> 我的成绩</span>
      <span class="view-more" @click="router.push('/exam/onlineExam')">查看更多 <i class="iconfont icon-youjiantou"></i></span>
    </div>
    <el-scrollbar max-height="565px">
      <el-row :gutter="15" class="w-full">
        <el-col class="mb-4" v-for="item in 5" :key="item">
          <el-card class="item-card">
            <template #header>
              <span>试卷标题</span>
              <el-tag class="ml-4" type="warning">已完成</el-tag>
            </template>
            <el-descriptions :column="2" :border="true">
              <el-descriptions-item>
                <template #label>
                  <span>试卷总分</span>
                </template>
                <span>100分</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span>考试得分</span>
                </template>
                <span>70分</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span>提交时间</span>
                </template>
                <span>2021-08-15 14:30:42</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span>成绩等级</span>
                </template>
                <el-tag type="success">合格</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <div class="text-right mt-2 mr-2">
              <el-button type="primary"><i class="iconfont icon-chengji"></i>成绩分析</el-button>
              <el-button type="primary"><i class="iconfont icon-shujuyulan"></i>查看详情</el-button>
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

