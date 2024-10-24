<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="开课学期" prop="termId">
              <el-select class="w-full" v-model="state.queryParams.termId" placeholder="请选择开课学期" filterable>
                <el-option v-for="item in state.termSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属课程" prop="lessonId">
              <el-select class="w-full" v-model="state.queryParams.lessonId" placeholder="请选择所属课程" filterable>
                <el-option v-for="item in state.courseOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任课教师" prop="teacherId">
              <el-select class="w-full" v-model="state.queryParams.teacherId" placeholder="请选择任课教师" filterable>
                <el-option v-for="item in state.teacherSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择状态" prop="status">
              <el-select class="w-full" v-model="state.queryParams.status" placeholder="请选择选中状态" filterable>
                <el-option v-for="item in selectEnum.businessEnumTypes.chooseOption" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-row :sm="24" :md="12" :lg="12" class="mb20 mr10">
              <el-col
                ><el-button class="searchbtn" type="primary" @click="handleQuery"><i class="iconfont icon-sousuo"></i>搜索</el-button></el-col
              >
            </el-row>
            <el-row :sm="24" :md="12" :lg="12" class="mb20">
              <el-col
                ><el-button class="resetbtn" type="info" @click="resetQuery"><i class="iconfont icon-zhongzhi"></i>重置</el-button></el-col
              >
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="table-container">
          <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <div class="table-total">实验选课</div>
            <div class="flex justify-between items-center">
              <!-- 引导页面 -->
              <el-tooltip class="box-item" effect="dark" content="当前页面主要是用于学生预约选课，可以在表格选择相应的实验，选择教师设置的时间段进行选课。" placement="bottom">
                <el-button type="primary"><i class="iconfont icon-icon_help"></i>帮助</el-button>
              </el-tooltip>
              <!-- <el-button class="addbtn" type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button> -->
            </div>
          </div>
          <el-table
            class="tablearea"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.courseSelectList"
            height="calc(100vh - 232px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            highlight-current-row
            row-key="lessonId"
          >
            <!-- reserve-selection分页刷新数据之后是否保留勾选数据 -->
            <!-- <el-table-column type="selection" width="55" :align="'center'" :reserve-selection="true" /> -->
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="开课学期" prop="termName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="所属课程" prop="lessonName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="实验名称" prop="expName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="选择状态" prop="courseExpChooseState" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag v-if="scope.row.courseExpChooseState === 0" type="warning">未选择</el-tag>
                <el-tag v-else-if="scope.row.courseExpChooseState === 1" type="success">已选择</el-tag>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="选课截止时间" prop="courseExpEndTime" show-overflow-tooltip :align="'center'" />
            <el-table-column label="操作" width="220" :align="'center'">
              <template #default="scope">
                <el-tag v-if="isPastDeadline(scope.row.courseExpEndTime)" type="danger">已超时</el-tag>
                <el-button v-else-if="scope.row.courseExpChooseState === 0" type="primary" link @click.stop="openTimeDialog(scope.row, 'add')"> <i class="iconfont icon-fabu1"></i>预约选课 </el-button>
                <el-button v-else type="danger" link @click.stop="openTimeDialog(scope.row, 'edit')"> <i class="iconfont icon-quxiao"></i>取消选课 </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
          </el-table>
          <div class="paginationarea mt-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <el-pagination
              v-model:current-page="state.queryParams.pageNum"
              v-model:page-size="state.queryParams.pageSize"
              :pager-count="5"
              :page-sizes="[10, 20, 30]"
              :total="state.total"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="handleQuery"
              @current-change="handleQuery"
            >
            </el-pagination>
            <!-- <el-button class="deletebtn" type="danger" :disabled="state.ids.length === 0" @click="handleDelete()"> <i class="iconfont icon-shanchu"></i>批量删除 </el-button> -->
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- dialog -->
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="1000px" destroy-on-close @close="closeDialog">
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
        :data="state.dialogTableData"
        height="calc(100vh - 350px)"
        :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
        :stripe="true"
        :border="true"
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="55" :align="'center'" />
        <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip :align="'center'" />
        <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip :align="'center'" />
        <el-table-column label="当前实验人数" prop="currentHumanNumber" show-overflow-tooltip :align="'center'" />
        <el-table-column label="最大实验人数" prop="maxHumanNumber" show-overflow-tooltip :align="'center'" />
        <el-table-column label="操作" width="200" :align="'center'">
          <template #default="scope">
            <el-button v-if="state.dialogState === 'add'" type="primary" link @click.stop="handleOperate(scope.row)"> <i class="iconfont icon-dianji"></i>点击预约 </el-button>
            <el-button v-else-if="scope.row.courseExpTimeUuid === state.currentSelectCourse.courseExpTimeId" type="danger" link @click.stop="handleOperate(scope.row)"> <i class="iconfont icon-quxiao"></i>取消选课 </el-button>
            <el-tag v-else type="info">暂未选择</el-tag>
          </template>
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
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage, ElTable } from 'element-plus';
import { Step } from 'intro.js';
import { getGuideData } from '@/components/Guide/guideData';
import { NoticeInfo } from '@/api/notice/types';
import { getCourseSelect } from '@/api/course';
import { getAllTerm } from '@/api/term';
import { getAllTeacher } from '@/api/user';
import { getCourseSelectListApi, setCourseSelect, resetCourseSelect } from '@/api/courseSet';
import { CourseSelectList, CourseSelectQuery } from '@/api/courseSet/types';
import { useSelectEnum } from '@/store/selectEnum';
import { CourseExpTimeList, CourseExpTimeQuery } from '@/api/examSet/types';
import { getCourseExpTimePagesApi } from '@/api/examSet';
const selectEnum = useSelectEnum();

// 搜索表格表单对象
const queryFormRef = ref(ElForm);
const dialogQueryFormRef = ref(ElForm);

const dataTableRef = ref(ElTable);
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as CourseSelectQuery,
  dialogQueryParams: {
    pageNum: 1,
    pageSize: 10
  } as CourseExpTimeQuery,
  // 表格数据
  courseSelectList: [] as CourseSelectList[],
  dialogTableData: [] as CourseExpTimeList[],
  // 总数
  total: 0,
  // 总数
  dialogTableTotal: 0,
  // 表格多选
  ids: [] as number[],
  // 增加/编辑弹框状态
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  // 增加/编辑表单
  formData: {} as NoticeInfo,
  // 增加/编辑表单校验规则
  rules: {
    noticeTitle: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
    noticeContent: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  // 一些选择器相关数据
  courseOptions: [] as SelectOptionType[],
  termSelectList: [] as SelectOptionType[],
  teacherSelectList: [] as SelectOptionType[],
  // 区分弹窗状态
  dialogState: 'add',
  // 当前选中数据
  currentSelectCourse: {} as CourseSelectList
});

/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getCourseSelectListApi(state.queryParams).then(({ data }) => {
    state.courseSelectList = data.records;
    state.total = data.total;
    state.loading = false;
  });
}
function handleDialogQuery() {
  getCourseExpTimePagesApi(state.dialogQueryParams).then(({ data }) => {
    state.dialogTableData = data.records;
    state.dialogTableTotal = data.total;
  });
}
function resetDialogQuery() {
  dialogQueryFormRef.value.resetFields();
  handleDialogQuery();
}

/**点击预约和取消预约选课 */
function handleOperate(row: CourseExpTimeList) {
  if (state.dialogState === 'add') {
    setCourseSelect(state.currentSelectCourse.courseExpId as number, state.currentSelectCourse.courseExpStudentId as number, row.courseExpTimeUuid as number).then(() => {
      ElMessage.success('预约成功');
      closeDialog();
      handleQuery();
    });
  } else if (state.dialogState === 'edit') {
    // 取消预约
    resetCourseSelect(state.currentSelectCourse.courseExpId as number, state.currentSelectCourse.courseExpStudentId as number, row.courseExpTimeUuid as number).then(() => {
      ElMessage.success('取消预约成功');
      closeDialog();
      handleQuery();
    });
  }
}

/**
 * 重置查询
 */
function resetQuery() {
  // 恢复查询表单默认值
  queryFormRef.value.resetFields();
  handleQuery();
}

/**
 * 新增/编辑点击
 */
function openTimeDialog(row: CourseSelectList, type: string) {
  state.dialogState = type;
  state.dialog = {
    title: state.dialogState == 'add' ? '预约选课' : '取消选课',
    visible: true
  };
  state.dialogQueryParams.courseExpId = row.courseExpId as number;
  state.dialogQueryParams.teacherId = row.teacherId as number;
  state.currentSelectCourse = row;
  handleDialogQuery();
}

/**
 * 取消
 */
function closeDialog() {
  state.dialog.visible = false;
}

// 获取前置的选择器数据
function getSelectList() {
  getCourseSelect().then(({ data }) => {
    state.courseOptions = data.lessonOptions;
  });
  getAllTerm().then(({ data }) => {
    state.termSelectList = data.termOption;
  });
  getAllTeacher().then(({ data }) => {
    state.teacherSelectList = data.teacherOptions;
  });
}
// 判断当前时间是否超过截止时间
function isPastDeadline(deadline: string): boolean {
  const currentTime = new Date();
  const deadlineTime = new Date(deadline);
  return currentTime > deadlineTime;
}
onMounted(() => {
  handleQuery();
  // 设置引导页相关数据
  state.guideArr = getGuideData('course') as Step[];
  getSelectList();
});
</script>
