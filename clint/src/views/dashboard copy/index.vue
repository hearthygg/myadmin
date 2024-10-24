<script lang="ts">
  export default { name: 'Dashboard' };
</script>

<script setup lang="ts">
// 组件引用
import SvgIcon from '@/components/SvgIcon/index.vue';
import BarChart from './components/BarChart.vue';
import PieChart from './components/PieChart.vue';
import RadarChart from './components/RadarChart.vue';
import BarChart1 from './components/BarChart1.vue';
import LineChart from './components/LineChart.vue';
import NoticeDetail from '@/layout/components/notice/noticeDetail.vue';
import { computed, onMounted } from 'vue';

import { useUserStore } from '@/store/modules/user';
import CountUp from 'vue-countup-v3';
const userStore = useUserStore();

const date: Date = new Date();

// eslint-disable-next-line vue/return-in-computed-property
const greetings = computed(() => {
  if (date.getHours() >= 6 && date.getHours() < 8) {
    return '晨起披衣出草堂，轩窗已自喜微凉🌅！';
  } else if (date.getHours() >= 8 && date.getHours() < 12) {
    return '上午好🌞！';
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return '下午好☕！';
  } else if (date.getHours() >= 18 && date.getHours() < 24) {
    return '晚上好🌃！';
  } else if (date.getHours() >= 0 && date.getHours() < 6) {
    return '偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！';
  }
});

</script>

<template>
  <div class="dashboard-container">
    <!-- 用户信息 -->
    <!-- <el-row class="mb-8">
      <el-card class="w-full">
        <div class="flex flex-wrap justify-between">
          <div>
            <img class="user-avatar" :src="userStore.avatar + '?imageView2/1/w/80/h/80'" />
            <span class="text-[14px]">
              {{ userStore.nickname }}
            </span>
          </div>

          <div class="leading-[40px]">
            {{ greetings }}
          </div>
        </div>
      </el-card>
    </el-row> -->

    <!-- 数据卡片 -->
    <el-row :gutter="10" class="mb-1">
      <el-col :xs="12" :sm="6" :lg="3" class="mb-1 pl-0 pr-0">
        <div class="data-box">
          <div class="text-[#40c9c6] hover:!text-white hover:bg-[#40c9c6] p-2 rounded">
            <i class="iconfont icon-kebiao text-5xl"></i>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">精品课程总数</div>
            <div class="text-xl text-right">
              <count-up :end-val="45"></count-up>
            </div>
          </div>
        </div>
      </el-col>

      <!--消息数-->
      <el-col :xs="12" :sm="6" :lg="3" class="mb-1 pl-0 pr-0">
        <div class="data-box">
          <div class="text-[#36a3f7] hover:!text-white hover:bg-[#36a3f7] p-2 rounded">
            <!-- <svg-icon icon-class="message" size="3em" /> -->
            <i class="iconfont icon-shiyani text-5xl"></i>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">在线实验总数</div>
            <div class="text-xl text-right">
              <count-up :end-val="234"></count-up>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6" :lg="3" class="mb-1 pl-0 pr-0">
        <div class="data-box">
          <div class="text-[#f4516c] hover:!text-white hover:bg-[#f4516c] p-2 rounded">
            <i class="iconfont icon-banji text-5xl"></i>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">在线设备数量</div>
            <div class="text-xl text-right">
              <count-up :end-val="35"></count-up>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6" :lg="3" class="mb-1 pl-0 pr-0">
        <div class="data-box">
          <div class="text-[#f4516c] hover:!text-white hover:bg-[#f4516c] p-2 rounded">
            <i class="iconfont icon-banji text-5xl"></i>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">实验报告份数</div>
            <div class="text-xl text-right">
              <count-up :end-val="35"></count-up>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :lg="3" class="mb-1 pl-0 pr-0">
        <div class="data-box">
          <div class="text-[#34bfa3] hover:!text-white hover:bg-[#34bfa3] p-2 rounded">
            <!-- <svg-icon icon-class="shopping" size="3em" /> -->
            <i class="iconfont icon-denglu-yonghuming text-5xl"></i>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">考试试题总数</div>
            <div class="text-xl text-right">
              <count-up :end-val="235"></count-up>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6" :lg="3" class="mb-1 pl-0 pr-0">
        <div class="data-box">
          <div class="text-[#34bfa3] hover:!text-white hover:bg-[#34bfa3] p-2 rounded">
            <!-- <svg-icon icon-class="shopping" size="3em" /> -->
            <i class="iconfont icon-denglu-yonghuming text-5xl"></i>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">考试试卷份数</div>
            <div class="text-xl text-right">
              <count-up :end-val="2000"></count-up>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6" :lg="3" class="mb-1 pl-0 pr-0">
        <div class="data-box">
          <div class="text-[#34bfa3] hover:!text-white hover:bg-[#34bfa3] p-2 rounded">
            <!-- <svg-icon icon-class="shopping" size="3em" /> -->
            <i class="iconfont icon-denglu-yonghuming text-5xl"></i>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">提交试卷份数</div>
            <div class="text-xl text-right">
              <count-up :end-val="2000"></count-up>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="6" :lg="3" class="mb-1 pl-0 pr-0">
        <div class="data-box">
          <div class="text-[#34bfa3] hover:!text-white hover:bg-[#34bfa3] p-2 rounded">
            <!-- <svg-icon icon-class="shopping" size="3em" /> -->
            <i class="iconfont icon-denglu-yonghuming text-5xl"></i>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">学生使用人数</div>
            <div class="text-xl text-right">
              <count-up :end-val="2000"></count-up>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="mb-1">
      <!-- 折线图 -->
      <el-col :xs="24" :sm="16" :lg="16" class="mb-1">
        <LineChart id="lineChart" height="280px" width="100%" class="bg-[var(--el-bg-color-overlay)]"></LineChart>
      </el-col>
      <!-- 消息通知 -->
      <el-col :xs="24" :sm="8" :lg="8" class="mb-1">
        <NoticeDetail/>
      </el-col>
    </el-row>
    <!-- Echarts 图表 -->
    <el-row :gutter="10">
      <el-col :sm="24" :lg="8" class="mb-1">
        <BarChart id="barChart" height="400px" width="100%" class="bg-[var(--el-bg-color-overlay)]" />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="mb-1">
        <PieChart id="pieChart" height="400px" width="100%" class="bg-[var(--el-bg-color-overlay)]" />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="mb-1">
        <BarChart1 id="radarChart" height="400px" width="100%" class="bg-[var(--el-bg-color-overlay)]" />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="mb-1">
        <RadarChart id="radarChart1" height="400px" width="100%" class="bg-[var(--el-bg-color-overlay)]" />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
  position: relative;

  .user-avatar {
    height: 40px;
    widows: 40px;
    border-radius: 5px;
  }

  .data-box {
    font-weight: bold;
    padding: 20px;
    cursor: pointer;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    box-shadow: var(--el-box-shadow-dark);
    border-color: var(--el-border-color);
    display: flex;
    justify-content: space-between;
    border-radius: 10px;
  }

  .svg-icon {
    fill: currentColor !important;
  }
}
:deep(.el-card) {
  border-radius: 10px;
  border: 1px solid #F9F9F9;
  .el-card__header {
    background-color: #F9F9F9;
    font-size: 18px;
    font-weight: bold;
    color: #909399;
  }
}
</style>
