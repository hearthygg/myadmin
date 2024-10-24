<template>
  <div>
    <div class="course-desc mb-4">
      <span class="text-xl"><i class="iconfont icon-mianshishijuan"></i> 我的试卷</span>
      <span class="view-more" @click="router.push('/examPaper/paperCenter')">查看更多 <i class="iconfont icon-youjiantou"></i></span>
    </div>
    <el-scrollbar max-height="565px">
      <el-row :gutter="15" class="w-full">
        <el-col class="mb-4" v-for="(v, k) in state.paperList" :key="k">
          <el-card class="item-card">
            <template #header>
              <div class="flex items-center">
                <span>{{ v.paperTitle }}</span>
                <el-tag class="ml-2">进行中</el-tag>
              </div>
            </template>
            <el-descriptions :column="2" :border="true">
              <el-descriptions-item>
                <template #label>
                  <span>开始时间</span>
                </template>
                <span>{{ v.paperStartTime }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span>结束时间</span>
                </template>
                <span>{{ v.paperEndTime }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span>试卷总分</span>
                </template>
                <span>{{ v.paperTotalScore }}分</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <span>考试时长</span>
                </template>
                <span>{{ v.paperExamTime }}分钟</span>
              </el-descriptions-item>
            </el-descriptions>
            <div class="text-right mt-2 mr-2">
              <el-button type="primary" @click="handleViewPaper(v.paperId)"><i class="iconfont icon-fabu1 ml-2"></i> 开始考试</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { PaperList } from '@/api/examPaper/types';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const state = reactive({
  paperList: [
    { paperTitle: '测试试卷1', paperId: '1', paperStartTime: '2021-08-15 14:30:42', paperEndTime: '2021-08-15 14:30:42', paperTotalScore: 100, paperExamTime: '90' },
    { paperTitle: '测试试卷2', paperId: '2', paperStartTime: '2021-08-15 14:30:42', paperEndTime: '2021-08-15 14:30:42', paperTotalScore: 100, paperExamTime: '90' },
    { paperTitle: '测试试卷3', paperId: '3', paperStartTime: '2021-08-15 14:30:42', paperEndTime: '2021-08-15 14:30:42', paperTotalScore: 100, paperExamTime: '90' },
    { paperTitle: '测试试卷3', paperId: '4', paperStartTime: '2021-08-15 14:30:42', paperEndTime: '2021-08-15 14:30:42', paperTotalScore: 100, paperExamTime: '90' },
    { paperTitle: '测试试卷3', paperId: '5', paperStartTime: '2021-08-15 14:30:42', paperEndTime: '2021-08-15 14:30:42', paperTotalScore: 100, paperExamTime: '90' },
    { paperTitle: '测试试卷3', paperId: '6', paperStartTime: '2021-08-15 14:30:42', paperEndTime: '2021-08-15 14:30:42', paperTotalScore: 100, paperExamTime: '90' }
  ] as PaperList[]
});

const handleViewPaper = (paperId: string) => {};
</script>
