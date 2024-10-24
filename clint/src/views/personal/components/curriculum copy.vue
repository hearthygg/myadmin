<template>
  <!-- 课表组件 -->
  <div>
    <div class="course-desc mb-2" style="width: 870px">
      <span class="text-xl"><i class="iconfont icon-kebiao"></i> 我的课表</span>
      <el-select v-model="state.currentTerm" style="width: 200px">
        <el-option v-for="(v, index) in state.termList" :key="index" :value="v.value" :label="v.lebel"></el-option>
      </el-select>
    </div>
    <div class="curriculum">
      <div class="time-group">
        <div class="time-item tiem-first">
          <el-select class="w-full" v-model="state.currentWeek" filterable>
            <el-option v-for="v in 16" :key="v" :value="v" :label="`第${v}周`"></el-option>
          </el-select>
        </div>
        <div class="time-item" v-for="(item, index) in state.timerList" :key="index">
          {{ item }}
        </div>
      </div>
      <div class="week-group">
        <div class="week-head">
          <div class="week-head-item" v-for="(item, index) in state.weekList" :key="index">{{ item }} {{ getCurrentDate(index + 1) }}</div>
        </div>
        <div class="week-body">
          <div class="week-body-item" v-for="item in 20" :key="item">
            <div v-if="isShow(item)">
              <div class="mt-4 font-bold">{{ state.kbList[getIndex(item)].title }}</div>
              <div class="mt-2">
                {{ state.kbList[getIndex(item)].address }} <el-tag type="success">{{ state.kbList[getIndex(item)].room }}</el-tag>
              </div>
              <div class="mt-2">
                <el-tag>{{ state.kbList[getIndex(item)].teacher }}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
  // 那个学期
  currentTerm: 2,
  termList: [
    { value: 1, lebel: '2022 - 2023下学期' },
    { value: 2, lebel: '2023 - 2024上学期' }
  ],
  // 学期开始时间
  termStartTime: '2023-09-01',
  // 学期结束时间
  termEndTime: '2023-12-22',
  // 第几周
  currentWeek: 1,
  // 纵轴时间 '19:00 - 20:40'
  timerList: ['08:00 - 09:40', '10:00 - 11:40', '14:00 - 15:40', '16:00 - 17:40'],
  // 横轴时间
  weekList: ['周一', '周二', '周三', '周四', '周五'],
  // 课表数据
  // 横轴 周一到周日 1 - 7
  // 纵轴 上午两节大课 下午两节 晚上一节 1 - 5
  kbList: [
    { x: 3, y: 4, title: '模拟电路', teacher: '王老师', address: 'A栋西八区', room: '410' },
    { x: 1, y: 2, title: '模拟电路', teacher: '王老师', address: 'A栋西八区', room: '410' },
    { x: 2, y: 1, title: '模拟电路', teacher: '王老师', address: 'A栋西八区', room: '410' },
    { x: 3, y: 3, title: '模拟电路', teacher: '王老师', address: 'A栋西八区', room: '410' },
    { x: 4, y: 5, title: '模拟电路', teacher: '王老师', address: 'A栋西八区', room: '410' }
  ]
});

// 判断当前区域是否显示信息 5行7列
function isShow(index: number) {
  let x = Math.ceil(index / 5);
  let y = index % 5 === 0 ? 5 : index % 5;
  let tempIndex = state.kbList.findIndex(v => v.x == x && v.y == y);
  return tempIndex !== -1;
}

// 获取课表渲染数据
function getIndex(index: number) {
  let x = Math.ceil(index / 5);
  let y = index % 5 === 0 ? 5 : index % 5;
  return state.kbList.findIndex(v => v.x == x && v.y == y);
}

// 获取当前课程日期
function getCurrentDate(index: number) {
  const startDate = new Date(state.termStartTime);
  // getTime获取毫秒时间戳
  const endDate = new Date(startDate.getTime() + ((state.currentWeek - 1) * 7 + (index - 1)) * 24 * 60 * 60 * 1000);
  // toISOString().slice(0, 10)方法将结束日期转换为ISO 8601格式的字符串，并截取前10个字符以获取日期部分
  return endDate.toISOString().slice(0, 10);
}
</script>
<style lang="scss" scoped>
.curriculum {
  display: flex;
  .time-group {
    .time-item {
      width: 120px;
      height: 120px;
      border: 1px solid #e4e7ed;
      font-size: 16px;
      font-weight: bold;
      color: #787d82;
      background-color: #ecf5ff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
    }
    .tiem-first {
      height: 50px;
      background-color: #fff;
      color: #fff;
      :deep(.el-select__wrapper) {
        height: 50px;
      }
    }
  }
  .week-group {
    .week-head {
      display: flex;
      .week-head-item {
        height: 50px;
        width: 150px;
        border: 1px solid #e4e7ed;
        font-size: 16px;
        font-weight: bold;
        color: #787d82;
        background-color: #ecf5ff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
      }
    }
    .week-body {
      display: flex;
      flex-wrap: wrap;
      .week-body-item {
        width: 150px;
        height: 120px;
        border: 1px solid #e4e7ed;
        font-size: 14px;
        color: #787d82;
        background-color: #fafcfe;
        border-radius: 5px;
        text-align: center;
      }
    }
  }
}
</style>
