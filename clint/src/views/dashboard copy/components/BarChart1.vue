<!-- 柱状图 -->
<template>
  <el-card class="home-card">
    <template #header> 班级学生人数柱状图 </template>
    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted } from 'vue';
const props = defineProps({
  id: {
    type: String,
    default: 'barChart'
  },
  className: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '200px',
    required: true
  },
  height: {
    type: String,
    default: '200px',
    required: true
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
    data: ['学生人数'],
    textStyle: {
      color: '#999'
    }
  },
  xAxis: [
    {
      type: 'category',
      data: ['一班', '二班', '三班', '四班', '五班'],
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      max: 80,
      // interval: 2000,
      axisLabel: {
        formatter: '{value} '
      }
    },
  ],
  series: [
    {
      name: '学生人数',
      type: 'bar',
      data: [45, 36, 52, 63, 77],
      barWidth: 20,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      }
    },
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
