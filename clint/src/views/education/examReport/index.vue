<template>
  <div class="sys-container">
    <el-row class="w-full">
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="开课学期：" prop="termId">
              <el-select @change="updateSelectData('termId')" class="w-full" v-model="state.queryParams.termId" placeholder="请选择开课学期" filterable>
                <el-option v-for="item in state.termSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="state.queryParams.termId" label="开设课程：" prop="courseId">
              <el-select @change="updateSelectData('courseId')" class="w-full" v-model="state.queryParams.courseId" placeholder="请选择开设课程(开课号)" filterable>
                <el-option v-for="item in state.courseSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="state.queryParams.courseId" label="开设实验：" prop="courseExpId">
              <el-select class="w-full" v-model="state.queryParams.courseExpId" placeholder="请选择开设实验" filterable>
                <el-option v-for="item in state.examSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任课教师：" prop="teacherId">
              <el-select class="w-full" v-model="state.queryParams.teacherId" placeholder="请选择任课教师" filterable>
                <el-option v-for="item in state.teacherSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="userStore.ugroup === 2" label="学生姓名：" prop="username">
              <el-input v-model="state.queryParams.username" placeholder="学生姓名"></el-input>
            </el-form-item>
            <el-form-item label="提交状态：" prop="submitStatus">
              <el-select class="w-full" v-model="state.queryParams.submitStatus" placeholder="提交状态">
                <el-option :value="1" label="未提交"></el-option>
                <el-option :value="2" label="已提交"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批改状态：" prop="correctionStatus">
              <el-select class="w-full" v-model="state.queryParams.correctionStatus" placeholder="批改状态">
                <el-option :value="1" label="未批改"></el-option>
                <el-option :value="2" label="已批改"></el-option>
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
        <div class="table-container" style="overflow: auto">
          <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <div class="table-total">实验报告</div>
            <div class="flex justify-between items-center">
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
            </div>
          </div>
          <el-table
            class="tablearea"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.reportList"
            height="calc(100vh - 232px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            highlight-current-row
          >
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="学生名称" prop="userNickName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="实验名称" prop="lessonName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="任课教师" prop="teacherName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="所属班级" prop="claName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="提交状态" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag :type="scope.row.submitStatus === 2 ? 'success' : 'warning'">{{ scope.row.submitStatus === 2 ? '已提交' : '未提交' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="批改状态" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag :type="scope.row.correctionStatus === 2 ? 'success' : 'warning'">{{ scope.row.correctionStatus === 2 ? '已批改' : '未批改' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="提交时间" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.uploadTime">{{ scope.row.uploadTime }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="批改时间" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.correctedTime">{{ scope.row.correctedTime }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="分数" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.score">{{ scope.row.score }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" :align="'center'">
              <template #default="scope">
                <el-button type="primary" link @click.stop="handleViewReport(scope.row)"> <i class="iconfont icon-shujuyulan"></i>预览 </el-button>
                <!-- 教师用户才可以批改实验报告 -->
                <el-button v-if="userStore.ugroup === 2" type="primary" link @click.stop="handleCorrect(scope.row)"> <i class="iconfont icon-bianji"></i>批改 </el-button>
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
          </div>
          <!-- <span class="dialog-footer">
          <el-button @click="state.paperDialog.visible = false"><i class="iconfont icon-quxiao"></i>关闭</el-button>
        </span> -->
        </div>
      </el-col>
    </el-row>
    <studentReportInfo @finishCorrect="handleQuery" ref="studentReportInfoRef"></studentReportInfo>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { ExamReportQueryParams, ExamReportRecord } from '@/api/examReport/types';
import { Step } from 'intro.js';
import { getReportApi, getReportBaseInfoApi } from '@/api/examReport';
import { OnlineExamList } from '@/api/onlineExam/types';
import { getAllTerm } from '@/api/term';
import { getCourseOptionsByTermIdApi, getCourseExpOptionsByCourseIdApi } from '@/api/course';
import { getAllTeacher } from '@/api/user';
import studentReportInfo from './components/studentReportInfo.vue';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
// 试题基本信息表单对象
const queryFormRef = ref(ElForm);
const studentReportInfoRef = ref(studentReportInfo);
const state = reactive({
  // 引导页相关数据
  guideArr: [] as Step[],
  // 表格刷新动画
  loading: false,
  total: 0,
  // 条件查询
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as ExamReportQueryParams,
  // 实验报告列表数据数据
  reportList: [] as ExamReportRecord[],
  // 当前弹框状态
  dialog: {
    title: '',
    visible: false
  },
  parentInfo: {} as OnlineExamList,
  termSelectList: [] as SelectOptionType[],
  teacherSelectList: [] as SelectOptionType[],
  courseSelectList: [] as SelectOptionType[],
  examSelectList: [] as SelectOptionType[]
});
// 开启弹窗
function openDialog(params: OnlineExamList, courseId: number) {
  // 这里区分教师还是学生
  if (userStore.ugroup === 2) {
    // 教师查询所带学生的实验报告列表
    state.queryParams.courseExpId = params.courseExpId;
    state.queryParams.courseId = courseId;
    state.dialog.title = params.expName + '实验报告';
    state.dialog.visible = true;
    state.parentInfo = params;
    handleQuery();
  } else {
    // 学生查询自己的实验报告
    getReportBaseInfoApi(params.courseExpId, userStore.userId as number).then(({ data }) => {
      studentReportInfoRef.value.openDialog(data, params, 'view');
    });
  }
}
/**
 * 取消
 */
function closeDialog() {
  state.dialog.visible = false;
}
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getReportApi(state.queryParams).then(({ data }) => {
    state.reportList = data.records;
    state.total = data.total;
    state.loading = false;
  });
}
/**
 * 重置查询
 */
function resetQuery() {
  // 恢复查询表单默认值
  queryFormRef.value.resetFields();
  handleQuery();
}
/**预览实验报告记录 */
function handleViewReport(row: ExamReportRecord) {
  if(row.submitStatus === 2) {
    studentReportInfoRef.value.openDialog(row, 'view');
  } else {
    ElMessage.error('该实验报告还未提交，暂时无法预览！');
  }
}
/**批改实验报告 */
function handleCorrect(row: ExamReportRecord) {
  if(row.submitStatus === 2) {
    studentReportInfoRef.value.openDialog(row, 'correct');
  } else {
    ElMessage.error('该实验报告还未提交，暂时无法批改！');
  }
}
function updateSelectData(type: string) {
  if (type === 'init') {
    // 初始化学期和教师选择器数据
    getAllTerm().then(({ data }) => {
      state.termSelectList = data.termOption;
    });
    getAllTeacher().then(({ data }) => {
      state.teacherSelectList = data.teacherOptions;
    });
  } else if (type === 'termId') {
    // 更新开设课程选择器数据
    getCourseOptionsByTermIdApi(state.queryParams.termId as number).then(({ data }) => {
      state.courseSelectList = data;
    });
  } else if (type === 'courseId') {
    // 更新开设实验选择器数据
    getCourseExpOptionsByCourseIdApi(state.queryParams.courseId).then(({ data }) => {
      state.examSelectList = data;
    });
  }
}
onMounted(() => {
  updateSelectData('init');
  // 如果当前用户是教师的话可以选择器默认选中当前教师
  if(userStore.ugroup === 2) state.queryParams.teacherId = userStore.userId;
  handleQuery();
});
// 暴露变量
defineExpose({
  openDialog
});
</script>

