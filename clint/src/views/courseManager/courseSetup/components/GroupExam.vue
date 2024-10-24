<template>
  <div>
    <div class="fullDialog">
      <el-dialog destroy-on-close :title="state.dialog.title" v-model="state.dialog.visible" :fullscreen="true">
        <div class="sys-container">
          <el-row>
            <el-col :span="4">
              <div class="search-container">
                <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
                  <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
                  <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker class="w-full" v-model="state.queryParams.startTime" type="datetime" placeholder="开始时间" value-format="x" />
                  </el-form-item>
                  <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker class="w-full" v-model="state.queryParams.endTime" type="datetime" placeholder="结束时间" value-format="x" />
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
                  <div class="table-total">分组实验时间安排管理</div>
                  <div class="flex justify-between items-center">
                    <!-- 引导页面 -->
                    <!-- <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn> -->
                    <el-button class="addbtn" type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
                  </div>
                </div>
                <el-table
                  class="tablearea"
                  ref="dataTableRef"
                  v-loading="state.loading"
                  :data="state.courseExpTimeList"
                  height="calc(100vh - 240px)"
                  :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
                  :stripe="true"
                  :border="true"
                  @selection-change="handleSelectionChange"
                  highlight-current-row
                  row-key="courseExpTimeUuid"
                >
                  <!-- reserve-selection分页刷新数据之后是否保留勾选数据 -->
                  <el-table-column type="selection" width="55" :align="'center'" :reserve-selection="true" />
                  <el-table-column type="index" label="序号" width="55" :align="'center'" />
                  <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip :align="'center'" />
                  <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip :align="'center'" />
                  <el-table-column label="当前实验人数" prop="currentHumanNumber" show-overflow-tooltip :align="'center'" />
                  <el-table-column label="最大实验人数" prop="maxHumanNumber" show-overflow-tooltip :align="'center'" />
                  <el-table-column label="操作" width="250" :align="'center'">
                    <template #default="scope">
                      <el-button type="primary" link @click.stop="handlePreview(scope.row)"> <i class="iconfont icon-icon_xueshengguanli"></i>分配学生 </el-button>
                      <el-button type="primary" link @click.stop="handleUpdate(scope.row)"> <i class="iconfont icon-bianji"></i>编辑 </el-button>
                      <el-button type="danger" link @click.stop="handleDelete(scope.row)"> <i class="iconfont icon-shanchu"></i>删除 </el-button>
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
                  <el-button class="deletebtn" type="danger" :disabled="state.ids.length === 0" @click="handleDelete()"> <i class="iconfont icon-shanchu"></i>批量删除 </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>
    <!-- 避免多层嵌套全屏弹窗引起的样式混乱 -->
    <div id="manyDialog">
      <!-- dialog -->
      <el-dialog :title="state.formDialog.title" v-model="state.formDialog.visible" width="800px" destroy-on-close @close="closeDialog">
        <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="120px" label-position="left">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker class="w-full" v-model="state.formData.startTime" type="datetime" placeholder="开始时间" value-format="x" />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker class="w-full" v-model="state.formData.endTime" type="datetime" placeholder="结束时间" value-format="x" />
          </el-form-item>
          <el-form-item label="最大人数" prop="maxHumanNumber">
            <el-input-number v-model="state.formData.maxHumanNumber" :step="1" step-strictly controls-position="right" :min="1" :max="999" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
            <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
          </div>
        </template>
      </el-dialog>
      <!-- 导入学生弹窗 -->
      <el-dialog :title="state.viewDialog.title" v-model="state.viewDialog.visible" destroy-on-close width="1000px">
        <el-form @keyup.enter="handleQueryStudent" ref="queryStudentFormRef" :model="state.studentQueryParams" label-position="left">
          <el-row class="mb-2" :gutter="15">
            <el-col :span="9">
              <el-form-item label="学生学号" prop="userUid">
                <el-input v-model="state.studentQueryParams.userUid" placeholder="学生学号" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="学生姓名" prop="userNickName">
                <el-input v-model="state.studentQueryParams.userNickName" placeholder="学生姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div class="dialog-footer">
                <el-button class="searchbtn" type="primary" @click="handleQueryStudent"><i class="iconfont icon-sousuo"></i>搜索</el-button>
                <el-button class="resetbtn" type="info" @click="resetStudentQuery"><i class="iconfont icon-zhongzhi"></i>重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          class="tablearea-inputStudent"
          ref="studentTableRef"
          :data="state.studentList"
          height="calc(100vh - 250px)"
          :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
          :stripe="false"
          :border="true"
          @selection-change="handleSelectionStudentChange"
          highlight-current-row
          row-key="userId"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="勾选" width="55" :align="'center'">
            <template #default="scope">
              <el-checkbox :disabled="scope.row.timeId && state.currentTimeId !== scope.row.timeId" v-model="scope.row.isChecked" @change="handleCheckedStudentChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="55" :align="'center'" />
          <!-- <el-table-column label="学生头像" prop="avatar" show-overflow-tooltip :align="'center'">
            <template #default="scope">
              <img v-if="scope.row.avatar" :src="scope.row.avatar" style="width: 50px;height: 50px;" />
              <el-tag v-else type="info">暂无数据</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="学生账号" prop="userName" show-overflow-tooltip :align="'center'" />
          <el-table-column label="学生学号" prop="uid" show-overflow-tooltip :align="'center'" />
          <el-table-column label="学生名称" prop="nickName" show-overflow-tooltip :align="'center'" />
          <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip :align="'center'" />
          <el-table-column label="所属班级" prop="claName" show-overflow-tooltip :align="'center'" />
          <!-- <el-table-column label="性别" prop="sex" show-overflow-tooltip :align="'center'">
            <template #default="scope">
              <span v-if="scope.row.sex">{{ scope.row.sex === 1 ? '男' : '女' }}</span>
              <el-tag v-else type="info">暂无数据</el-tag>
            </template>
          </el-table-column> -->
          <template #empty>
            <el-empty description="暂无数据" />
          </template>
        </el-table>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="handleSubmitStudent"><i class="iconfont icon-queding"></i>确定</el-button>
            <el-button @click="state.viewDialog.visible = false"><i class="iconfont icon-quxiao"></i>取消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox, ElTable } from 'element-plus';
import { Step } from 'intro.js';
import { ExamSetTable, CourseExpTimeQuery, CourseExpTimeList, CourseExpTimeForm, CourseExpStudentList, CourseExpStudentQuery } from '@/api/examSet/types';
import { getCourseExpTimePagesApi, getExamSetDetail, addCourseExpTimeApi, updateCourseExpTimeApi, getourseExpTimeDetailApi, getStudentListApi, addStudentApi } from '@/api/examSet';
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 搜索学生表格表单对象
const queryStudentFormRef = ref(ElForm);
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
const dataTableRef = ref(ElTable);
const studentTableRef = ref(ElTable);
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as CourseExpTimeQuery,
  studentQueryParams: {} as CourseExpStudentQuery,
  // 表格数据
  courseExpTimeList: [] as CourseExpTimeList[],
  // 总数
  total: 0,
  // 表格多选
  ids: [] as number[],
  studentIds: [] as number[],
  // 增加/编辑弹框状态
  dialog: {
    title: '分组实验时间安排管理',
    visible: false
  } as DialogType,
  formDialog: {
    title: '',
    visible: false
  } as DialogType,
  viewDialog: {
    title: '',
    visible: false
  } as DialogType,
  // 增加/编辑表单
  formData: {} as CourseExpTimeForm,
  studentList: [] as CourseExpStudentList[],
  // 增加/编辑表单校验规则
  rules: {
    startTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
    endTime: [{ required: true, message: '结束时间不能为空', trigger: 'change' }],
    maxHumanNumber: [{ required: true, message: '请输入实验最大人数', trigger: 'blur' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  // 分配学生最大人数
  maxStudentNum: 0,
  currentTimeId: 0
});

/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getCourseExpTimePagesApi(state.queryParams).then(({ data }) => {
    state.courseExpTimeList = data.records;
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
  clearSelection();
}
/**
 * 重置学生
 */
function resetStudentQuery() {
  // 恢复查询表单默认值
  queryStudentFormRef.value.resetFields();
  handleQueryStudent();
}
/**
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: CourseExpTimeList[]) {
  state.ids = selection.map((item: CourseExpTimeList) => item.courseExpTimeUuid) as number[];
}
/**
 * 分配学生表格勾选数据
 */
function handleSelectionStudentChange(selection: CourseExpStudentList[]) {
  state.studentIds = selection.map(item => item.userId) as number[];
}
/**
 * 学生表格勾选处理限制勾选最大人数
 */
function handleCheckedStudentChange(row: CourseExpStudentList) {
  let currentNum = state.studentList.filter(v => v.isChecked).length;
  if (currentNum > state.maxStudentNum) {
    ElMessage.warning(`最多只能选择${state.maxStudentNum}人`);
    row.isChecked = !row.isChecked;
  }
}
/**
 * 新增点击
 */
function handleAdd() {
  state.formDialog = {
    title: '添加分组实验时间安排',
    visible: true
  };
}
/**
 * 编辑点击
 */
function handleUpdate(row: CourseExpTimeList) {
  state.formDialog = {
    title: '修改分组实验时间安排',
    visible: true
  };
  getourseExpTimeDetailApi(row.courseExpTimeUuid as number).then(({ data }) => {
    state.formData = data;
  });
}
/**预览点击 */
function handlePreview(row: CourseExpTimeList) {
  state.viewDialog = {
    title: '分配学生',
    visible: true
  };
  state.studentQueryParams.courseExpId = state.queryParams.courseExpId;
  // state.studentQueryParams.timeId = row.courseExpTimeUuid as number;
  state.studentQueryParams.teacherId = state.queryParams.teacherId as number;
  state.maxStudentNum = row.maxHumanNumber as number;
  state.currentTimeId = row.courseExpTimeUuid as number;
  handleQueryStudent();
}
/**
 * 查询学生列表
 */
function handleQueryStudent() {
  getStudentListApi(state.studentQueryParams).then(({ data }) => {
    state.studentList = data;
    state.studentList.map(item => {
      item.isChecked = false;
      if (item.timeId && item.timeId === state.currentTimeId) {
        // 被选中
        item.isChecked = true;
      }
    });
  });
}
/**标记被禁用的行 */
const tableRowClassName = ({ row, rowIndex }: { row: CourseExpStudentList; rowIndex: number }) => {
  if (row.timeId && state.currentTimeId !== row.timeId) {
    return 'warning-row';
  }
  return '';
};
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      state.formData.courseExpId = state.queryParams.courseExpId;
      state.formData.teacherId = state.queryParams.teacherId;
      if (state.formData.courseExpTimeId) {
        updateCourseExpTimeApi(state.formData).then(() => {
          ElMessage.success('修改成功');
          closeDialog();
          handleQuery();
        });
      } else {
        addCourseExpTimeApi(state.formData).then(() => {
          ElMessage.success('新增成功');
          closeDialog();
          handleQuery();
        });
      }
    }
  });
}
/**
 * 取消
 */
function closeDialog() {
  state.formDialog.visible = false;
  dataFormRef.value.resetFields();
  state.formData = {} as CourseExpTimeForm;
}
/**
 *  删除/批量删除
 */
function handleDelete(row: CourseExpTimeList = {} as CourseExpTimeList) {
  const ids = row.noticeId ? [row.noticeId] : [...state.ids];
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // deleteNoticesApi(ids).then(() => {
      //   ElMessage.success('删除成功');
      //   handleQuery();
      //   clearSelection();
      // });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
// 清除表格勾选数据
const clearSelection = () => {
  state.ids = [];
  dataTableRef.value.clearSelection();
};
// 打开弹窗
function openDialog(row: ExamSetTable) {
  state.dialog.visible = true;
  state.dialog.title = `实验：${row.expName} 教师：${row.teacherName} 分组实验时间安排管理`;
  // 设置引导页相关数据
  // state.guideArr = getGuideData('course') as Step[];
  getExamSetDetail(row.courseExpId).then(({ data }) => {
    state.queryParams.courseExpId = row.courseExpId;
    state.queryParams.teacherId = data.courseExpForm.teacherId;
    handleQuery();
  });
}
// 提交学生分配
function handleSubmitStudent() {
  let studentIds = state.studentList.filter(v => v.isChecked).map(item => item.userId);
  addStudentApi({
    courseExpId: state.queryParams.courseExpId,
    timeId: state.currentTimeId,
    studentIds: {
      ids: studentIds
    }
  }).then(() => {
    ElMessage.success('分配成功');
    state.viewDialog.visible = false;
    handleQuery();
  });
}
defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
.col-height {
  height: calc(100vh - 188px);
}
.fullDialog {
  :deep(.el-dialog__body) {
    height: calc(100vh - 56px) !important;
  }
}
.sys-container {
  height: 100% !important;
  .search-container,
  .table-container {
    height: 100% !important;
  }
}
</style>
<style lang="scss">
#manyDialog {
  .el-dialog {
    border-radius: 10px !important;
  }
  .el-dialog__body {
    height: 100% !important;
    padding: 20px !important;
  }
  .el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
  }
  .el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
}
</style>
