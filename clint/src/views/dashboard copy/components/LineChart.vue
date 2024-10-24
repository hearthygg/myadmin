<!-- 折线图 -->
<template>
  <el-card class="home-card">
    <template #header> 学生考试状况折线图 </template>
    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted } from 'vue';
const props = defineProps({
  id: {
    type: String,
    default: 'lineChart'
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
  backgroundColor: '',
  title: {
    text: '学生考试情况',
    x: 'left',
    textStyle: { fontSize: '15', color: '#909399' }
  },
  grid: { top: 70, right: 20, bottom: 30, left: 30 },
  tooltip: { trigger: 'axis' },
  legend: { data: ['合格', '不合格'], right: 0 },
  xAxis: {
    data: ['考试1', '考试2', '考试3', '考试4', '考试5', '考试6', '考试7', '考试8', '考试9', '考试10', '考试11', '考试12']
  },
  yAxis: [
    {
      type: 'value',
      name: '学生人数',
      splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } }
    }
  ],
  series: [
    {
      name: '合格',
      type: 'line',
      symbolSize: 6,
      symbol: 'circle',
      smooth: true,
      data: [0, 41.1, 30.4, 65.1, 53.3, 53.3, 53.3, 41.1, 30.4, 65.1, 53.3, 10],
      lineStyle: { color: '#fe9a8b' },
      itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#fe9a8bb3' },
          { offset: 1, color: '#fe9a8b03' }
        ])
      }
    },
    {
      name: '不合格',
      type: 'line',
      symbolSize: 6,
      symbol: 'circle',
      smooth: true,
      data: [0, 24.1, 7.2, 15.5, 42.4, 42.4, 42.4, 24.1, 7.2, 15.5, 42.4, 0],
      lineStyle: { color: '#9E87FF' },
      itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#9E87FFb3' },
          { offset: 1, color: '#9E87FF03' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: '#9E87FF' },
              { offset: 0.4, color: '#9E87FF' },
              { offset: 0.5, color: '#fff' },
              { offset: 0.7, color: '#fff' },
              { offset: 0.8, color: '#fff' },
              { offset: 1, color: '#fff' }
            ]
          },
          borderColor: '#9E87FF',
          borderWidth: 2
        }
      }
    }
  ]
};

onMounted(() => {
  const chart = echarts.init(document.getElementById(props.id) as HTMLDivElement);
  chart.setOption(options);

  window.addEventListener('resize', () => {
    chart.resize();
  });
});
</script>
