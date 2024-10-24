<!-- 饼图 -->
<template>
  <el-card class="home-card">
    <template #header> 课程人数饼图 </template>
    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted } from 'vue';
const props = defineProps({
  id: {
    type: String,
    default: 'pieChart'
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
