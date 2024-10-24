<!--  线 + 柱混合图 -->
<template>
  <el-card class="home-card">
    <template #header> 实验完成情况柱状图 </template>
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
    data: ['未完成', '已完成', '完成率'],
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
      min: 0,
      max: 10000,
      interval: 2000,
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
        formatter: '{value}%'
      }
    }
  ],
  series: [
    {
      name: '未完成',
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
      name: '已完成',
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
      name: '完成率',
      type: 'line',
      yAxisIndex: 1,
      data: [70, 75, 80, 85, 90],
      itemStyle: {
        color: '#188df0'
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
