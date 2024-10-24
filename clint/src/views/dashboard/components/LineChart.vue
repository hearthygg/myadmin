<!-- 折线图 -->
<template>
  <el-row  class="home-card">
    <!-- 设备工作状态 -->
    <el-row class="w-full h-5 text-white">
      <el-col :span="19"><span class="text-lg">>>> 设备工作状态</span></el-col>
      <el-col :span="5" class="!flex">
        <div class="devState1 devStateBorder">在线</div>
        <div class="devState2 devStateBorder">离线</div>
        <div class="devState3 devStateBorder">维修</div>
      </el-col>
    </el-row>
    <div>
      <el-row :gutter="10"  shadow="always" class="w-full !m-0">
        <template v-for="(item, index) in 12" :key="index">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-row class="p-2 data-box" :class="getDeviceClass(devList[index]?.deviceState)">
              <el-col :span="10" class="text-center textEllipsis">
                {{ devList[index] && devList[index].deviceNum }}
              </el-col>
              <el-col :span="14" class="text-center textEllipsis">
                {{ devList[index] && devList[index].deviceType }}
              </el-col>
            </el-row>
          </el-col>
        </template>
      </el-row>
    </div>
    <!-- <img class="bgImg" src="../../../assets/images/dash-middle-bottom-chat.png" alt="" srcset=""> -->
    <!-- <el-col class="chart-title"> 设备利用率统计 </el-col> -->
    <!-- <div :id="id" class="lineChat" ></div> -->
  </el-row >
</template>

<script setup lang="ts">
// import * as echarts from 'echarts';
import { onMounted, watch,PropType, ref } from 'vue';
import { DeviceInfo } from '@/api/statistic/types';

let devList = ref<DeviceInfo[]>([]);
const props = defineProps({
  id: {
    type: String,
    default: 'lineChart'
  },
  deviceStateList:{
    type: Object as PropType<DeviceInfo[]>,
    default: () => [] as DeviceInfo[]
  }
});

watch(
  () => props.deviceStateList,
  (newCourseList) => {
    // 将新的数据赋值给 chartData
    const newList: DeviceInfo[] = [];
    // 使用 forEach 遍历 courseList
    newCourseList.forEach((element) => {
      newList.push( element )
      // console.log("element",element);
    });
    devList.value = newList;
  },
  { immediate: true, deep: true } // 深度监听 // 立即执行以初始化 chartData
     // 立即执行以初始化 chartData
);

function getDeviceClass(deviceState:string) {
    switch (deviceState) {
      case '默认状态':
      case 'BOX允许使用':
        return 'devState1';
      case 'BOX禁止使用':
        return 'devState2';
      default:
        return 'devState3';
    }
  }

onMounted(() => {
  // const chart = echarts.init(document.getElementById(props.id) as HTMLDivElement);
  // chart.setOption(options);

  // window.addEventListener('resize', () => {
  //   chart.resize();
  // });
});
</script>

<style lang="scss" space>
// PX 转 rem
@function px2Rem($px) {
  $rem: 16px;
  @return calc($px / $rem) * 1rem;
}



.chart-card{
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid var(--kanban-text-color);
}

.lineChat{
  width: 110%;
  height: calc(100%);
  position: absolute;
}

.devStateBorder{
  width:px2Rem(50px);
  text-align: center;
  margin-left: 4px;
  padding: 4px;
}
.devState1{
  border:2px solid var(--kanban-dev-online-border);
  background:var(--kanban-dev-online-bg);
}
.devState2{
  border:2px solid var(--kanban-dev-offline-border);
  background:var(--kanban-dev-offline-bg);
}
.devState3{
  border:2px solid var(--kanban-dev-maintain-border);
  background:var(--kanban-dev-maintain-bg);
}
</style>
