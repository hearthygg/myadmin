<template>
  <!-- 课表组件 -->
  <div class="myCourse">
    <el-calendar ref="calendar">
      <template #header="{ date }">
        <div class="course-desc mb-2" style="width: 100%">
          <span class="text-xl">
            <i class="iconfont icon-kebiao"></i> 我的课表
            <el-tooltip class="box-item" effect="dark" content="当前页面可以查看个人课表某一天最多只展现两条数据，点击某一天可以查看详细的课表" placement="bottom">
              <i class="ml-2 text-xl iconfont icon-icon_help"></i>
            </el-tooltip>
          </span>
          <span class="text-xl font-bold">{{ date }}</span>
          <el-button-group>
            <el-button @click="selectDate('prev-month')"> 上个月 </el-button>
            <el-button @click="selectDate('today')">今天</el-button>
            <el-button @click="selectDate('next-month')"> 下个月 </el-button>
          </el-button-group>
        </div>
      </template>
      <template #date-cell="{ data }">
        <div class="dateItem" @click="dateChangeHandler(data.day, 'detail')">
          <div class="text-lg time-border" :class="{'active-border': isShowCourse(data)}">{{ data.day.split('-')[2] }}</div>
          <!-- <div class="text-center mb-1">
            <el-tag :type="data.day.split('-')[2] % 2 === 0 ? 'success' : 'warning'">{{ data.day.split('-')[2] }}</el-tag>
          </div> -->
          <template v-if="isShowCourse(data)">
            <!-- <div v-for="(item, index) in state.courseList[data.day.split('-')[2]]" :key="index" class="text-center text-gray-600 mb-1 truncate">{{ item }}</div> -->
            <div class="text-center">
              <el-tag class="mb-1 w-full" v-for="(item, index) in state.courseList[data.day.split('-')[2]]" :key="index">
                <div class="truncate w-full">{{ item }}</div>
              </el-tag>
            </div>
          </template>
        </div>
      </template>
    </el-calendar>
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="1300px" destroy-on-close @close="closeDialog">
      <el-form @keyup.enter="handleDialogQuery" ref="dialogQueryFormRef" :model="state.dialogQueryParams" label-position="left">
        <el-row class="mb-2" :gutter="15">
          <el-col :span="9">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker class="w-full" v-model="state.dialogQueryParams.startTime" type="datetime" placeholder="开始时间" value-format="x" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker class="w-full" v-model="state.dialogQueryParams.endTime" type="datetime" placeholder="结束时间" value-format="x" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="dialog-footer">
              <el-button class="searchbtn" type="primary" @click="handleDialogQuery"><i class="iconfont icon-sousuo"></i>搜索</el-button>
              <el-button class="resetbtn" type="info" @click="resetDialogQuery"><i class="iconfont icon-zhongzhi"></i>重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        class="tablearea-inputStudent"
        ref="dialogTableRef"
        :data="state.courseDetail"
        height="calc(100vh - 350px)"
        :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
        :stripe="true"
        :border="true"
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="55" :align="'center'" />
        <el-table-column label="所属课程" prop="startTime" show-overflow-tooltip :align="'center'" />
        <el-table-column label="实验名称" prop="startTime" show-overflow-tooltip :align="'center'" />
        <el-table-column label="实验类型" prop="startTime" show-overflow-tooltip :align="'center'" />
        <el-table-column label="任课教师" prop="startTime" show-overflow-tooltip :align="'center'" />
        <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip :align="'center'" />
        <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip :align="'center'" />
        <el-table-column label="状态" prop="endTime" show-overflow-tooltip :align="'center'" />
        <el-table-column label="操作" width="180" :align="'center'">
          <!-- <template #default="scope">

          </template> -->
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
      <div class="paginationarea mt-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
        <el-pagination
          v-model:current-page="state.dialogQueryParams.pageNum"
          v-model:page-size="state.dialogQueryParams.pageSize"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          :total="state.dialogTableTotal"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleDialogQuery"
          @current-change="handleDialogQuery"
        >
        </el-pagination>
      </div>
      <!-- <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template> -->
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import type { CalendarDateType, CalendarInstance } from 'element-plus';
import { CourseExpTimeQuery } from '@/api/examSet/types';
import { ElForm, ElMessage } from 'element-plus';
import { getCourseExpTimePagesApi } from '@/api/examSet';
const dialogQueryFormRef = ref(ElForm);
const state = reactive({
  // 当前时间yyyy-MM-dd格式时间
  currentTime: '',
  // 某个月开始时间
  startOfMonthTimestamp: 0,
  // 某个月结束时间
  endOfMonthTimestamp: 0,
  // 课表数据
  courseList: {
    '01': ['单级放大实验11111111111111111111111111111', '单级放大实验2'],
    '05': ['测试实验1', '测试实验2'],
    '15': ['频率计实验'],
    '30': ['测试实验3'],
    '31': ['仿真实验1', '仿真实验2']
  } as any,
  // 某天课表详情
  courseDetail: [] as any,
  dialogQueryParams: {
    pageNum: 1,
    pageSize: 10
  } as CourseExpTimeQuery,
  // 总数
  dialogTableTotal: 0,
  dialog: {
    title: '',
    visible: false
  } as DialogType
});
const calendar = ref<CalendarInstance>();
/**日历按钮触发事件 */
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
  dateChange(val);
};

/**获取日历按钮改变的时间 */
const dateChange = (val: CalendarDateType) => {
  let year = parseInt(state.currentTime.split('-')[0]);
  let month = parseInt(state.currentTime.split('-')[1]);
  let day = '01';
  let changeTime = '';
  if (val === 'prev-month') {
    // 上一个月
    if (month === 1) {
      year--;
      month = 12;
    } else {
      month--;
    }
    changeTime = `${year}-${String(month).padStart(2, '0')}-${day}`;
  } else if (val === 'next-month') {
    // 下一个月
    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
    }
    changeTime = `${year}-${String(month).padStart(2, '0')}-${day}`;
  } else if (val === 'today') {
    // 今天
    changeTime = getCurrentDate(new Date().getTime());
  }
  dateChangeHandler(changeTime);
};
// 获取某个时间的 yyyy-MM-dd
function getCurrentDate(time: any) {
  const now = new Date(time);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
// 设备当前点击的日期
const dateChangeHandler = (date: string, type = 'list') => {
  if (state.currentTime === '' || date.split('-')[1] !== state.currentTime.split('-')[1]) {
    // 月份发生变化查询新数据
    // 根据当前日期获取到当前月份的开始时间和结束时间的时间戳
    const now = new Date(date);
    const year = now.getFullYear();
    const month = now.getMonth();

    // 当前月份的第一天
    const startOfMonth = new Date(year, month, 1);
    state.startOfMonthTimestamp = startOfMonth.getTime();

    // 当前月份的最后一天 其中 23, 59, 59, 999 表示当天的最后一秒和最后一毫秒。
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999); // 注意月份从0开始，+1表示下个月，0表示上个月的最后一天
    state.endOfMonthTimestamp = endOfMonth.getTime();
    console.log(getCurrentDate(state.startOfMonthTimestamp), getCurrentDate(state.endOfMonthTimestamp));
  } else {
    // 月份未发生变化
  }
  state.currentTime = date;

  if (type === 'detail') {
    // type: query只查询当前月份的粗略课表 detail查询当天点击的详细课表信息
    const now = new Date(state.currentTime);
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    // 当天开始时间和结束时间的时间戳
    let startTime = new Date(year, month, day, 0, 0, 0, 0).getTime();
    let endTime = new Date(year, month, day, 23, 59, 59, 999).getTime();
    state.dialog.visible = true;
    state.dialog.title = `${state.currentTime}：详情课表`;
  }
};
// 控制是否显示课表数据
const isShowCourse = (data: any) => {
  // 避免其他月份数据显示
  return state.currentTime && data.day.split('-')[1] === state.currentTime.split('-')[1] && state.courseList[data.day.split('-')[2]] && state.courseList[data.day.split('-')[2]].length > 0;
};
function handleDialogQuery() {
  getCourseExpTimePagesApi(state.dialogQueryParams).then(({ data }) => {
    state.courseDetail = data.records;
    state.dialogTableTotal = data.total;
  });
}
// 重置表格查询
function resetDialogQuery() {
  dialogQueryFormRef.value.resetFields();
  handleDialogQuery();
}
/**
 * 关闭弹窗
 */
function closeDialog() {
  state.dialog.visible = false;
}
onMounted(() => {
  dateChangeHandler(getCurrentDate(new Date().getTime()));
});
</script>
<style lang="scss" scoped>
.myCourse {
  :deep(.el-calendar__header) {
    padding: 0;
    border-bottom: 0;
    background-color: #f8f8f8;
  }
  :deep(.el-calendar__body) {
    padding: 10px 12px 15px;
    box-shadow: 0 0 2px #d3e3fd;
    border-radius: 5px;
  }
  :deep(.el-calendar-day) {
    padding: 0;
  }
  :deep(.el-tag__content) {
    width: 100%;
  }
  .dateItem {
    width: 100%;
    height: 100%;
    padding: 5px;
    .time-border {
      border: 1px solid #ccc;
      width: 30px;
      height: 26px;
      text-align: center;
      margin-bottom: 2px;
      border-radius: 50%;
    }
    .active-border {
      border: 1px solid red;
    }
  }
}
</style>
