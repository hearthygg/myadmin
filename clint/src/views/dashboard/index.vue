<script setup lang="ts">
// 组件引用
import SvgIcon from '@/components/SvgIcon/index.vue';
import BarChart from './components/BarChart.vue';
import PieChart from './components/PieChart.vue';
// import RadarChart from './components/RadarChart.vue';
// import BarChart1 from './components/BarChart1.vue';
import LineChart from './components/LineChart.vue';
import NoticeDetail from '@/layout/components/notice/noticeDetail.vue';
import MiddleChart from './components/MiddleChart.vue';
import { computed, onMounted,reactive,onBeforeUnmount } from 'vue';
import scrollTab from './components/scrollTab.vue';
import { useAppStore } from '@/store/modules/app';

import { getCourseStatistics,getBasicInfoStatistics,getDeviceStatisticss } from '@/api/statistic';
import CountUp from 'vue-countup-v3';
import { useRouter } from 'vue-router';
import { ref, watch,ComputedRef } from 'vue';
import { BaseInfoStatisticsVo,CourseInfoStatisticsVo,DeviceInfo } from '@/api/statistic/types';

const appStore = useAppStore();

// 获取路由实例
const router = useRouter();
const dataViewTheme = ref(true);
const sidebarOpenState = ref(false);

// 监听路由变化和 appStore.sidebar.opened 的变化
watch(
  () => [router.currentRoute.value.fullPath, appStore.sidebar.opened],
  ([fullPath, sidebarOpened]) => {
    if (!sidebarOpened) {
      sidebarOpenState.value = true;
    } else {
      sidebarOpenState.value = false;
    }
  },
  { immediate: true }
);

//
let countListData = computed(()=>{
  return [{
    title:'课程总数',
    countNum: topStatistics.lessonCount
  },{
    title:'实验总数',
    countNum: topStatistics.expCount
  },{
    title:'设备数量',
    countNum: topStatistics.deviceCount
  },{
    title:'试题总数',
    countNum: topStatistics.questionCount
  },{
    title:'试卷份数',
    countNum: topStatistics.examPaperCount
  },{
    title:'使用人数',
    countNum: topStatistics.userCount
  }]
});

let monitorData = computed(() => {
  return [
    {
      name: '在线实验人数',
      icon: '/assets/icons/peoples.svg',
      num: bottomStatistics.onlineExperimentsUserCount
    },
    {
      name: '在线设备总数',
      icon: '/assets/icons/peoples.svg',
      num: bottomStatistics.onLineDeviceCount
    },
    {
      name: '提交试卷份数',
      icon: '/assets/icons/peoples.svg',
      num: bottomStatistics.examPaperCount
    }
  ]
})

// 响应式数据
const courseState = reactive({
  courseStatistics:{
    title:'实验课程统计',
    data:[] as CourseInfoStatisticsVo[],
    header:[{
        prop: 'lessonName',
        label: '课程名称',
    },{
      prop: 'courseTeacher',
        label: '任课教师',
    },{
      prop: 'courseExpNum',
      label: '实验数量',
      width: 100
    },{
      prop: 'courseAverage',
      label: '课程平均分',
      width: 100
    }]
  },  // 返回的课程统计数据
});

let topStatistics:BaseInfoStatisticsVo = reactive({
  lessonCount: 45,  // 课程总数
  expCount: 265,  // 实验总数
  questionCount: 958,  // 试题总数
  deviceCount: 120,  // 设备总数
  examPaperCount: 342, // 试卷份数
  userCount: 2453, // 用户总数
});
let middleStatistics:BaseInfoStatisticsVo = reactive({
  courseCompletedRate: 86,  // 实验完成率
  equipmentUtilizationRate: 92,  // 设备使用率
});
// 返回的设备统计数据
let bottomStatistics:BaseInfoStatisticsVo = reactive({
  onlineExperimentsUserCount: 458, // 在线实验人数
  onLineDeviceCount: 120, // 在线设备数量
  examPaperCount: 342, // 试卷份数
});  // 返回的设备统计数据
let BasicInfoStatistics = reactive<BaseInfoStatisticsVo>({});
let exLessonList = ref<CourseInfoStatisticsVo[]>([]) // 实验人数统计
let exLessonIndex = ref(0); // 每4个循环 课程下标
let pushExList = (lessons:CourseInfoStatisticsVo[]) => {
  exLessonList.value = [];
   // 从当前索引开始提取4个课程数据
   const newLessons:CourseInfoStatisticsVo[] = [] ;
  for (let i = 0; i < 4; i++) {
    newLessons.push(lessons[exLessonIndex.value]);
    exLessonIndex.value = (exLessonIndex.value + 1) % lessons.length; // 循环索引
  }
  exLessonList.value = newLessons;
}

// 设备状态统计
let deviceAllState = ref<DeviceInfo[]>([]);
let deviceStateList = ref<DeviceInfo[]>([]);
let deviceStateIndex = 0;
const pushDeviceList = (devices:DeviceInfo[]) => {
  // 从当前索引开始提取4个设备数据
  const newDevices:DeviceInfo[] = [];
  for (let i = 0; i < 12; i++) {
    newDevices.push(devices[deviceStateIndex]);
    deviceStateIndex = (deviceStateIndex + 1) % devices.length; // 循环索引
  }
  deviceStateList.value = newDevices;
}

/**
 * 查询
 */
const courseQuery= async () => {
  const { data:BasicInfo } = await getBasicInfoStatistics();
  const { data:CourseStatistics } = await getCourseStatistics();
  const {data:DeviceStatistics} = await getDeviceStatisticss();
  courseState.courseStatistics.data = CourseStatistics;
  BasicInfoStatistics = BasicInfo;
  // 设备状态
  const allDevices = DeviceStatistics['远程实验箱'];
  // 提取所有设备信息
  // 提取所有设备信息
  let formatDevs: DeviceInfo[] = [];
  Object.entries(allDevices).forEach(([key, devices]) => {
    formatDevs.push(...(devices as DeviceInfo[]));
  });
  deviceAllState.value = formatDevs;
  fetchBasicInfoStatistics();
}

const fetchBasicInfoStatistics = async () => {
  // 初始化
  topStatistics.lessonCount = 0;
  topStatistics.expCount = 0;
  topStatistics.deviceCount = 0;
  topStatistics.questionCount = 0;
  topStatistics.examPaperCount = 0;
  topStatistics.userCount = 0;

  middleStatistics.courseCompletedRate = 0;
  middleStatistics.equipmentUtilizationRate = 0;

  bottomStatistics.onlineExperimentsUserCount = 0;
  bottomStatistics.onLineDeviceCount = 0;
  bottomStatistics.examPaperCount = 0;
  // 实验人数统计
  pushExList(courseState.courseStatistics.data);
  // 设备状态统计
  pushDeviceList(deviceAllState.value);
  try {
    setTimeout(() => {
      topStatistics.lessonCount = BasicInfoStatistics.lessonCount;
      topStatistics.expCount = BasicInfoStatistics.expCount;
      topStatistics.deviceCount = BasicInfoStatistics.deviceCount;
      topStatistics.questionCount = BasicInfoStatistics.questionCount;
      topStatistics.examPaperCount = BasicInfoStatistics.examPaperCount;
      topStatistics.userCount = BasicInfoStatistics.userCount;

      middleStatistics.courseCompletedRate = BasicInfoStatistics.courseCompletedRate;
      middleStatistics.equipmentUtilizationRate = BasicInfoStatistics.equipmentUtilizationRate;

      bottomStatistics.onlineExperimentsUserCount = BasicInfoStatistics.onlineExperimentsUserCount;
      bottomStatistics.onLineDeviceCount = BasicInfoStatistics.onLineDeviceCount;
      bottomStatistics.examPaperCount = BasicInfoStatistics.examPaperCount;
    }, 1000);
    // console.log("getBasicInfoStatistics data", BasicInfoStatistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
  }
};
let onceTimer:any = null;
onMounted(() => {
  // 课程查询
  // courseQuery();
  // onceTimer = setInterval(()=>{
  //   fetchBasicInfoStatistics();
  // },10000)
});

onBeforeUnmount(() => {
  // 清除定时器
  clearInterval(onceTimer);
});
</script>

<template>
  <div class="dashboard-container blacktheme" :class="sidebarOpenState?'sidebarOpened':''">
    <!-- 左侧 -->
    <el-col :gutter="10" :xs="24" :sm="12" :lg="7" class="l-side h-lvh">
      <!-- 列表 -->
      <div class="w-full pb-1 h60per">
        <!-- <div class="relative">
          <img class="w-full h-full bgImg" src="../../assets/images/RectBg.png" alt="" srcset="">

        </div> -->
        <scroll-tab :tableData="courseState.courseStatistics" :speed="60" :row-height="40" class="themebg"></scroll-tab>
      </div>
      <!-- 图表1 -->
      <el-col class="w-full h40pre" v-show="true">
        <PieChart id="pieChart" :courseList="exLessonList" class="w-full themebg"/>
      </el-col>
    </el-col>
    <!-- 中间 -->
    <el-col :gutter="10" :xs="24" :sm="12" :lg="10" class="pl-1 pr-1 m-side h-lvh" v-show="true">
      <div class="w-full pb-2 h70per">
        <!-- 统计数据细则 -->
        <el-row :gutter="10"  shadow="always" class="w-full !m-0">
          <template v-for="(item, index) in countListData" :key="index">
            <el-col :xs="24" :sm="12" :lg="8">
              <el-row class="data-box kanban-border">
                <el-col :span="12" class="pl-1 text-xl text-center">
                  <count-up :end-val="item.countNum"></count-up>
                </el-col>
                <el-col :span="12" class="text-lg text-center">{{ item.title }}</el-col>
              </el-row>
            </el-col>
          </template>
        </el-row>
        <!-- 中间区域大图 -->
        <MiddleChart id="MiddleChart" :courseCompletedRate="middleStatistics.courseCompletedRate" :equipmentUtilizationRate="middleStatistics.equipmentUtilizationRate" :onlineExUser='bottomStatistics.onlineExperimentsUserCount' class="w-full mt-chart themebg"></MiddleChart>
      </div>
      <!-- 考试情况 -->
      <div class="h30Per ">
        <el-row class="pb-1 h70per">
          <LineChart id="lineChart" :deviceStateList="deviceStateList" class="w-full themebg"></LineChart>
        </el-row>
        <!-- 监控中数据 -->
        <el-row :gutter="20" class="w-full h30Per !ml-0 rounded-lg" style="margin-top:-4px">
          <el-col :span="8" class="!flex flex-row bg-[#fff] box-border themebg relative" v-for="(item,index) in monitorData" :key="index">
            <img class="bgImg" src="@/assets/images/monitoring.png" alt="" srcset="">
            <el-col :lg="12" :span="12" class="absolute w-1/2 h-full mt-6 rotate-90 ">
              <img src="@/assets/icons/monitoring.svg" alt="" class="absolute bottom-0 w-16 h-16 left-4" >
            </el-col>
            <el-col :lg="12" :span="12" class="h-full ml-24 !flex flex-col justify-center align-center absolute">
              <div class="text-center text-white bold">{{ item.name }}</div>
              <div class="text-lg text-center text-[#00ffff]">
                <!-- {{ item.num }} -->
                <count-up :end-val="item.num"></count-up>
              </div>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <!-- 右侧 -->
    <el-col :gutter="10" :xs="24" :sm="12" :lg="7" class="r-side h-lvh" v-show="true">
      <!-- 消息通知 -->
      <div class="w-full pb-1 h60per themebg">
        <NoticeDetail userStore :dataViewTheme="dataViewTheme"/>
      </div>
      <el-col class="w-full h40pre ">
        <BarChart id="barChart" :courseList="exLessonList" class="w-full themebg"/>
      </el-col>
    </el-col>
  </div>
</template>

<style lang="scss" scoped>
// PX 转 rem
@function px2Rem($px) {
  $rem: 16px;
  @return calc($px / $rem) * 1rem;
}

.dashboard-container {
  height: calc(100vh - px2Rem(96px));
  padding: px2Rem(5px);
  position: relative;
  display: flex;
  flex-direction: row;

  .monitorRect{
    position:absolute;
    width: 100%;
    height: 100%;
  }

  .data-box {
    font-weight: bold;
    cursor: pointer;
    color: black;
    background: transparent;
    display: flex;
    justify-content: space-between;
    border-radius: 6px;
    margin:4px;
    height:2.5rem;
    div{
      line-height: 2.5rem;
    }
  }
  .kanban-border{
    border: 1px solid var(--kanban-rect-color);
  }

  .svg-icon {
    fill: currentColor !important;
  }

  .h60per{
    height: 60%;
    overflow: hidden;
  }
  .h70per{
    height: 70%;
    overflow: hidden;
  }
  .h40pre{
    height: 40%;
    overflow: hidden;
  }
  .h30Per{
    height: 30%;
    overflow: hidden;
  }

  .mt-chart{
    height: calc(100% - px2Rem(100px));
  }
}

:deep(.el-card) {
  border-radius: 10px;
  border: 1px solid #f9f9f9;
  .el-card__body {
    padding: 4px;
  }

  .el-card__header {
    background-color: #f9f9f9;
    font-size: 18px;
    font-weight: bold;
    color: #909399;
    padding: px2Rem(10px) px2Rem(15px);
    text-align: left;
  }
}
</style>
<style lang="scss">
// data view theme样式
.blacktheme{
  background-color: var(--kanban-bg-color);
  .themebg{
    background-color: var(--kanban-bg-color);
    .scrollTable{
      .el-card__header{
        background-color: var(--kanban-bg-color);
      }

      .scroll-card-title{
        background-color: var(--kanban-bg-color);
      }
    }
  }
  .bgImg{
    width: 100%;
    height: 100%;
  }

  .scrollTable{
    .warning-row {
      background:  var(--kanban-bg-color);
      color: white;
      &:hover{
        background:  var(--kanban-bg-color);
        color: white;
        opacity: 0.8;
      }
    }
    .success-row{
      background: #1d2b56!important;
      color: white;
      &:hover{
        background:  var(--kanban-bg-color);
        color: white;
        opacity: 0.8;
      }
    }
    .el-table__header{
      th{
        background: var(--kanban-bg-color);
        color:var(--kanban-text-color)
      }
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
      background: var(--kanban-bg-color);
    }
  }
  .data-box{
    color: white!important;
  }
}
</style>
