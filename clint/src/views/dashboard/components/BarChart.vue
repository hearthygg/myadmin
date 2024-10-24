<!--  线 + 柱混合图 -->
<template>
  <el-row  class="home-card">
    <img class="bgImg" src="../../../assets/images/dash-bottom-chat.png" alt="" srcset="">
    <el-col class="chart-title"> 实验完成情况柱状图 </el-col>
    <div :id="id" class="barChat"></div>
  </el-row >
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts'; // 引入 EChartsType 类型
import { onMounted , watch, ref,reactive,PropType } from 'vue';
import { CourseInfoStatisticsVo } from '@/api/statistic/types';

const props = defineProps({
  id: {
    type: String,
    default: 'barChart'
  },
  courseList:{
    type: Object as PropType<CourseInfoStatisticsVo[]>,
    default: () => [] as CourseInfoStatisticsVo[]
  }
});

const options = {
  grid: {
    left: '2%',
    right: '2%',
    bottom: '10%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['开课人数', '实验报告数', '课程平均分'],
    textStyle: {
      color: '#999'
    }
  },
  xAxis: [
    {
      type: 'category',
      data: ['单极放大', '两级放大', '差动放大', '波形发生器', '电压比较器'],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value} '
      }
    },
    {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '开课人数',
      type: 'bar',
      data: [7000, 7100, 7200, 7300, 7400],
      barWidth: 20,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      }
    },
    {
      name: '实验报告数',
      type: 'bar',
      data: [8000, 8200, 8400, 8600, 8800],
      barWidth: 20,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#25d73c' },
          { offset: 0.5, color: '#1bc23d' },
          { offset: 1, color: '#179e61' }
        ])
      }
    },
    {
      name: '课程平均分',
      type: 'line',
      yAxisIndex: 1,
      data: [70, 75, 80, 85, 90],
      itemStyle: {
        color: '#188df0'
      }
    },
  ]
};
interface ChartSeriesData {
  name: string;
  value: number;
}
let chartData = ref<EChartsType | null>(null);
watch(
  () => props.courseList,
  (newCourseList) => {
    // 将新的数据赋值给 chartData
    const xArr:any[] = [];
    const series1:any[] = [];
    const series2:any[] = [];
    const series3:any[] = [];
    // 使用 forEach 遍历 courseList
    newCourseList.forEach((element) => {
      xArr.push(element.lessonName as string);
      series1.push(element.courseTotal as number);
      series2.push(element.courseExpNum as number);
      series3.push(element.courseAverage as number);
    });
    options.xAxis[0].data = xArr;
    options.series[0].data = series1;
    options.series[1].data = series2;
    options.series[2].data = series3;
    chartData.value?.setOption(options);
    // console.log("data",newCourseList);
  },
  { immediate: true, deep: true } // 深度监听 // 立即执行以初始化 chartData
     // 立即执行以初始化 chartData
);
onMounted(() => {
  const chartContainer = document.getElementById(props.id) as HTMLDivElement;
  // 初始化图表
  chartData.value = echarts.init(chartContainer);
  chartData.value.setOption(options);
  window.addEventListener('resize', () => {
    chartData.value?.resize();
  });
});
</script>


<style lang="scss" space>
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
  margin-top: px2Rem(5px);
}
.barChat{
  position: absolute;
  width:100%;
  height: calc(100% - 50px);
  margin-top: px2Rem(40px);
}
</style>
