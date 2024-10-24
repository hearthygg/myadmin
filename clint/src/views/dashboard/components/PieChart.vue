<!-- 饼图 -->
<template>
  <el-row  class="home-card">
    <img class="bgImg" src="../../../assets/images/dash-bottom-chat.png" alt="" srcset="">
    <el-col class="chart-title"> 实验人数统计 </el-col>
    <div :id="id" class="ChartName"></div>
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
    default: 'pieChart'
  },
  courseList:{
    type: Object as PropType<CourseInfoStatisticsVo[]>,
    default: () => [] as CourseInfoStatisticsVo[]
  }
});

interface ChartSeriesData {
  name: string;
  value: number;
}


let options = {
  title:'',
  grid: {
    left: '2%',
    right: '2%',
    bottom: '10%',
    containLabel: true
  },
  legend: {
    top: 'bottom',
    textStyle: {
      color: '#999'
    }
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [50, 130],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 1,
        color: function (params: any) {
          //自定义颜色
          const colorList = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C'];
          return colorList[params.dataIndex];
        }
      },
      data: [
        { value: 26, name: '模拟电路' },
        { value: 27, name: '数字电路' },
        { value: 24, name: '电子电工' },
        { value: 23, name: '电路分析' }
      ]
    }
  ]
};
let chartData = ref<EChartsType | null>(null);
watch(
  () => props.courseList,
  (newCourseList) => {
    // 将新的数据赋值给 chartData
    const newList: ChartSeriesData[] = [];
  // 使用 forEach 遍历 courseList
  newCourseList.forEach((element) => {
      newList.push({
        name: element.lessonName as string,
        value: element.courseTotal as number,
      })
    });
    options.series[0].data = newList;
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
.ChartName{
  position: absolute;
  width:100%;
  height: calc(100% - 50px);
  margin-top: px2Rem(40px);
}
</style>
