<!-- C位展示 -->
<template>
  <el-row  class="home-card">
    <img class="w-full bgImg" src="../../../assets/images/dash-middle.png" alt="" srcset="">
    <el-row class="rollWrap w-full flex justify-center align-center !absolute" >
      <div class="ml-4 mr-4 roll-num" v-for="(item,i) in countNum" :key="i">
        <count-up :end-val="item"></count-up>
      </div>
    </el-row>

    <el-col class="chart-title"><span>当前实验人数</span></el-col>
    <div class="absolute dashBall ball1">
      <div class="text-content">
        <div><count-up :end-val="countRate" class="inline-block"></count-up>%</div>
        <div>实验</div>
        <div>完成率</div>
      </div>
      <img class="w-full bgImg" src="../../../assets/images/dash-ball1.png" alt="" srcset="">
    </div>
    <div class="absolute dashBall ball2">
      <div class="text-content">
        <div><count-up :end-val="completedRate" class="inline-block"></count-up>%</div>
        <div>设备</div>
        <div>使用率</div>
      </div>
      <img class="w-full bgImg" src="../../../assets/images/dash-ball2.png" alt="" srcset="">
    </div>
  </el-row>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted,ref,watch } from 'vue';
import CountUp from 'vue-countup-v3';
const props = defineProps({
  id: {
    type: String,
    default: 'radarChart'
  },
  onlineExUser:{
    type: Number,
    default: 0
  },
  courseCompletedRate:{
    type: Number,
    default: 0
  },
  equipmentUtilizationRate:{
    type: Number,
    default: 0
  }
});

let countNum = ref(formatToFourDigits(props.onlineExUser));
let countRate = ref(props.courseCompletedRate);
let completedRate = ref(props.equipmentUtilizationRate);

const options = {
  grid: {
    left: '2%',
    right: '2%',
    bottom: '10%',
    containLabel: true
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['课程数量', '实验数量', '设备数量','学生人数','试卷份数'],
    textStyle: {
      color: '#999'
    }
  },
  radar: {
    // shape: 'circle',
    radius: '60%',
    indicator: [
      { name: '电子技术基础仿真实验室' },
      { name: '通信技术仿真实验室' },
      { name: '电子技术基础线上实验室' },
      { name: '电子技术线上实验室' },
      { name: '通信技术线上实验室' },
      { name: '其他精品课程实验室' }
    ]
  },
  series: [
    {
      name: 'Budget vs spending',
      type: 'radar',
      itemStyle: {
        borderRadius: 6,
        color: function (params: any) {
          //自定义颜色
          const colorList = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C','#9a60b4'];
          return colorList[params.dataIndex];
        }
      },
      data: [
        {
          value: [16, 20, 12, 14, 26, 18],
          name: '课程数量'
        },
        {
          value: [36, 48, 46, 32, 45, 24],
          name: '实验数量'
        },
        {
          value: [50, 50, 100, 60, 80, 100],
          name: '设备数量'
        },
        {
          value: [135, 90, 180, 90, 45, 135],
          name: '学生人数'
        },
        {
          value: [20, 24, 18, 12, 14, 20],
          name: '试卷份数'
        }
      ]
    }
  ]
};

function formatToFourDigits(num:number) {
  if (num < 0) {
    throw new Error("Number must be greater than zero.");
  }

  // 最大值设为9999
  num = Math.min(num, 9999);

  // 将数字转换为字符串并补零
  const formattedNum = String(num).padStart(4, '0');

  // 将每个字符转换为数字并返回数组
  return formattedNum.split('').map(Number);
}

watch(
  () => props.onlineExUser,
  (onlineExUser:any) => {
    countNum.value = formatToFourDigits(onlineExUser);
  },
  { immediate: true, deep: true } // 深度监听 // 立即执行以初始化 chartData
     // 立即执行以初始化 chartData
);

watch(
  () => props.courseCompletedRate,
  (courseCompletedRate:any) => {
    countRate.value = courseCompletedRate;
  },
  { immediate: true, deep: true } // 深度监听 // 立即执行以初始化 chartData
     // 立即执行以初始化 chartData
);

watch(
  () => props.equipmentUtilizationRate,
  (equipmentUtilizationRate:any) => {
    completedRate.value = equipmentUtilizationRate;
  },
  { immediate: true, deep: true } // 深度监听 // 立即执行以初始化 chartData
     // 立即执行以初始化 chartData
);

onMounted(() => {
  // const chart = echarts.init(
  //   document.getElementById(props.id) as HTMLDivElement
  // );
  // chart.setOption(options);

  // window.addEventListener('resize', () => {
  //   chart.resize();
  // });
});
</script>

<style lang="scss" scoped>
  // PX 转 rem
  @function px2Rem($px) {
    $rem: 16px;
    @return calc($px / $rem) * 1rem;
  }
  .home-card{
    position: relative;
    height: 100%;
    width: 100%;
  }
  .chart-title{
    width: 100%;
    text-align: center;
    position: absolute;
    font-size: px2Rem(28px);
    text-align: center;
    margin-top: px2Rem(120px);
    margin-left: px2Rem(-10px);
    font-weight: bold;

    span{
      background: linear-gradient(180deg, #9CAFE0 0%, #082F94 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .radarChart{
    width: 100%;
    height: calc(100% - px2Rem(50px));
    position: absolute;
  }
  .roll-num{
    display: flex;
    justify-content: center;
    align-items: center;
    width: px2Rem(70px) !important;
    height: px2Rem(70px) !important;
    border: 2px solid #e4e7ed94;
    border-radius: px2Rem(6px);
    margin-top: px2Rem(35px);
    background: var(--kanban-bg-color);
    box-shadow:inset 0px 0px 5px 1px var(--kanban-bg-color);

    :deep(.countup-wrap span){
      font-weight: bold;
      font-size: 64px;
      line-height: 75px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      background: linear-gradient(180deg, #FFFFFF 0%, #57DFF3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .dashBall{
    .text-content{
      color: white;
      position: absolute;
      top: px2Rem(16px);
      text-align: center;
      left: px2Rem(32px);
      div:nth-child(1){
        font-size: px2Rem(26px);
      }
    }
  }
  :deep(.ball1){
      // top: px2Rem(200px);
      left: px2Rem(70px);
      animation: ballMove1 2s infinite alternate; /* 应用动画 */
    }

  :deep(.ball2){
    // top: px2Rem(200px);
    left: px2Rem(650px);
    animation: ballMove2 2s infinite alternate; /* 应用动画 */
  }

  @keyframes ballMove1 {
      from {
        top: px2Rem(200px); /* 从 180px */
      }
      to {
        top: px2Rem(240px); /* 从 180px */
      }
  }
  @keyframes ballMove2 {
      from {
        top: px2Rem(220px); /* 从 180px */
      }
      to {
        top: px2Rem(160px); /* 从 180px */
      }
  }

  // 侧边缩放效果
.sidebarOpened{
  .ball2{
    left: px2Rem(710px);
  }
}
</style>
