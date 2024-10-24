<!-- 雷达图 -->
<template>
  <el-row  class="home-card">
    <img class="bgImg" src="../../../assets/images/dash-middle-top-chat.png" alt="" srcset="">
    <el-col class="chart-title"> 实验课程统计 </el-col>
    <div :id="id" class="w-full radarChart"></div>
  </el-row>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted } from 'vue';
const props = defineProps({
  id: {
    type: String,
    default: 'radarChart'
  },
});

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

onMounted(() => {
  const chart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );
  chart.setOption(options);

  window.addEventListener('resize', () => {
    chart.resize();
  });
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
    font-size: px2Rem(20px);
    text-align: center;
    color: #0EFCFF;
    margin-top: px2Rem(4px);
  }
  .radarChart{
    width: 100%;
    height: calc(100% - px2Rem(50px));
    position: absolute;
  }
</style>
