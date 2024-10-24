<!-- 实验开设设置 -->
<template>
  <!-- 实验开设弹框 -->
  <div class="fullDialog">
    <el-dialog :title="state.examSetDialog.title" v-model="state.examSetDialog.visible" :fullscreen="true">
      <div class="mb-2 bg-gray-50 rounded-lg p-3.5 flex justify-between items-center">
        <div class="text-2xl font-bold">课程: {{ state.currentCourseSet.lessonName }}</div>
        <div class="flex justify-between items-center">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="`当前页面可以在：${state.currentCourseSet.lessonName}课程下，新增，编辑，删除实验。表格展示的数据是当前课程的实验信息，表格操作区域的省略号内可以给当前行的实验导入学生。`"
            placement="bottom"
          >
            <el-button type="primary"><i class="iconfont icon-icon_help"></i>帮助</el-button>
          </el-tooltip>
          <!-- <el-button class="importbtn" type="warning"><i class="iconfont icon-daoru"></i>批量导入</el-button> -->
          <!-- 引导页面 -->
          <!-- <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn> -->
          <el-button type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
        </div>
      </div>
      <el-table
        v-loading="state.loading"
        :data="state.examSetList"
        height="calc(100vh - 220px)"
        :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
        :border="true"
        @selection-change="handleSelectionChange"
        highlight-current-row
      >
        <el-table-column type="selection" width="55" :align="'center'" />
        <el-table-column type="index" label="序号" width="55" :align="'center'" />
        <el-table-column label="开课学期" prop="termName" show-overflow-tooltip :align="'center'" />
        <el-table-column label="课程" prop="lessonName" show-overflow-tooltip :align="'center'" />
        <el-table-column label="实验" prop="expName" show-overflow-tooltip :align="'center'" />
        <el-table-column label="实验室" prop="labName" show-overflow-tooltip :align="'center'" />
        <el-table-column label="实验负责教师" prop="teacherName" show-overflow-tooltip :align="'center'" />
        <el-table-column label="实验类型" prop="courseExpTypeName" show-overflow-tooltip :align="'center'" />
        <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip :align="'center'" />
        <el-table-column label="操作" width="200" :align="'center'">
          <template #default="scope">
            <el-button type="primary" link @click.stop="handleUpdate(scope.row)"> <i class="iconfont icon-bianji"></i>编辑 </el-button>
            <el-button type="danger" link @click.stop="handleDelete(scope.row)"> <i class="iconfont icon-shanchu"></i>删除 </el-button>
            <el-popover placement="bottom" trigger="hover">
              <template #reference>
                <el-button type="primary" link>
                  <i class="iconfont icon-shenglvehao"></i>
                </el-button>
              </template>
              <template #default>
                <div class="text-center w-full mb-2">
                  <el-button type="primary" link @click.stop="openInputStudent(scope.row)"> <i class="iconfont icon-shujuyulan"></i>导入学生 </el-button>
                </div>
                <!-- 分组实验才会显示时间分配按钮 -->
                <div class="text-center w-full" v-if="scope.row.courseExpType === 3">
                  <el-button type="primary" link @click.stop="openGroupExam(scope.row)"> <i class="iconfont icon-shijian"></i>时间分配 </el-button>
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
      <template #footer>
        <div class="paginationarea rounded-lg flex justify-between items-center px-2">
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
      </template>
      <!-- 新增/编辑栏目弹框 -->
      <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" @close="closeDialog" :append-to-body="true">
        <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="125px" label-position="left">
          <el-form-item label="实验项目" prop="expId">
            <el-select :disabled="state.formData.courseExpId" class="w-full" v-model="state.formData.expId" placeholder="实验项目" filterable>
              <el-option v-for="item in state.examSelectOption" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验室" prop="labId">
            <el-select class="w-full" v-model="state.formData.labId" placeholder="实验室" filterable>
              <el-option v-for="item in state.labSelectOption" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验负责教师" prop="teacherId">
            <el-select :disabled="true" class="w-full" v-model="state.formData.teacherId" placeholder="实验负责教师" filterable>
              <el-option v-for="item in state.teacherSelectOption" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验类型" prop="courseExpType">
            <el-select class="w-full" v-model="state.formData.courseExpType" placeholder="实验类型" filterable>
              <el-option v-for="item in selectEnum.businessEnumTypes.courseExpTypeOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定实验台" prop="withDesk">
            <el-select class="w-full" v-model="state.formData.withDesk" placeholder="绑定实验台" filterable>
              <el-option v-for="item in selectEnum.businessEnumTypes.courseExpWithDeskOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="state.formData.withDesk === 1" label="实验台容纳人数" prop="deskPerUser">
            <el-input-number v-model="state.formData.deskPerUser" :step="1" step-strictly controls-position="right" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="实验时长(分)" prop="timeLength">
            <el-input-number v-model="state.formData.timeLength" :step="1" step-strictly controls-position="right" :min="1" :max="120"></el-input-number>
          </el-form-item>
          <el-form-item v-if="state.formData.courseExpType === 2" label="实验开始时间" prop="startTime">
            <el-date-picker class="w-full" v-model="state.formData.startTime" type="datetime" placeholder="实验开始时间" value-format="x" />
          </el-form-item>
          <el-form-item v-if="state.formData.courseExpType !== 1" label="实验结束时间" prop="endTime">
            <el-date-picker class="w-full" v-model="state.formData.endTime" type="datetime" placeholder="实验结束时间" value-format="x" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
          </div>
        </template>
      </el-dialog>
      <!-- 导入学生弹窗 -->
      <InputStudent ref="inputStudent" />
      <!-- 分组实验实验预约弹窗 -->
      <GroupExam ref="groupExamRef" />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import InputStudent from '@/components/InputStudent/index.vue';
import { reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { getExamSelect } from '@/api/exam';
import { getAllLab } from '@/api/lab';
import { getAllTeacher } from '@/api/user';
import { getExamSetData, getExamSetDetail, updateExamSet, deleteExamSets, addExamSet } from '@/api/examSet';
import { ExamSetTable, ExamSetForm, ExamSetQuery } from '@/api/examSet/types';
import { CourseTable } from '@/api/courseSet/types';
import { useSelectEnum } from '@/store/selectEnum';
import GroupExam from './GroupExam.vue';
const selectEnum = useSelectEnum();
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
// 导入学生弹框对象
const inputStudent = ref();
const groupExamRef = ref(GroupExam);
// 响应式数据
const state = reactive({
  loading: false,
  // 实验开设弹框状态
  examSetDialog: {
    title: '实验开设',
    visible: false
  } as DialogType,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as ExamSetQuery,
  // 总数
  total: 0,
  // 实验开设列表数据
  examSetList: [] as ExamSetTable[],
  // 实验开设添加/编辑弹框
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  // 实验开设表单数据
  formData: {} as ExamSetForm,
  // 增加/编辑栏目校验规则
  rules: {
    expId: [{ required: true, message: '请选择实验项目', trigger: 'change' }],
    labId: [{ required: true, message: '请选择实验室', trigger: 'change' }],
    teacherId: [{ required: true, message: '请选择实验负责教师', trigger: 'change' }]
  },
  // 实验开设多选
  ids: [] as number[],
  // 当前开课数据
  currentCourseSet: {} as CourseTable,
  // 实验项目选择器数据
  examSelectOption: [] as SelectOptionType[],
  // 实验室选择器数据
  labSelectOption: [] as SelectOptionType[],
  // 教师选择器数据
  teacherSelectOption: [] as SelectOptionType[]
});
/**
 * 打开实验开设弹框
 */
function openDialog(row: CourseTable) {
  state.examSetDialog.visible = true;
  state.currentCourseSet = row;
  // 初始化选择器数据
  initSelect();
  state.queryParams.courseId = row.courseId;
  handleQuery();
  state.formData.teacherId = state.currentCourseSet.teacherId;
}
/**打开分组实验实验预约弹框 */
function openGroupExam(row: ExamSetTable) {
  groupExamRef.value.openDialog(row);
}
/**
 * 查询栏目数据
 */
function handleQuery() {
  state.loading = true;
  getExamSetData(state.queryParams)
    .then(({ data }) => {
      state.examSetList = data.courseExpVoPage;
      state.total = data.total;
      state.loading = false;
    })
    .catch(() => {
      state.loading = false;
    });
}
/**
 * 关闭添加/编辑栏目弹框
 */
function closeDialog() {
  state.dialog.visible = false;
  dataFormRef.value.resetFields();
  state.formData = {} as ExamSetForm;
  state.formData.teacherId = state.currentCourseSet.teacherId;
}
/**
 * 新增实验开设点击
 */
function handleAdd() {
  state.dialog.title = '新增数据';
  state.dialog.visible = true;
}
/**
 * 编辑实验开设点击
 */
function handleUpdate(row: ExamSetTable) {
  state.dialog.title = '编辑数据';
  state.dialog.visible = true;
  getExamSetDetail(row.courseExpId).then(({ data }) => {
    state.formData = data.courseExpForm;
  });
}
/**
 * 提交编辑或者新增实验开设
 */
function handleSubmit() {
  // state.loading = true;
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      // 前置条件内含某门开课的信息
      state.formData.courseId = state.currentCourseSet.courseId;
      state.formData.termId = state.currentCourseSet.termId;
      state.formData.deptId = state.currentCourseSet.deptId;
      state.formData.lessonId = state.currentCourseSet.lessonId;
      if (state.formData.courseExpId) {
        updateExamSet(state.formData).then(() => {
          ElMessage.success('编辑成功');
          closeDialog();
          handleQuery();
          // state.loading = false;
        });
        // .catch(() => {
        //   state.loading = false;
        // });
      } else {
        addExamSet(state.formData).then(() => {
          ElMessage.success('新增成功');
          closeDialog();
          handleQuery();
          // state.loading = false;
        });
        // .catch(() => { state.loading = false });
      }
    }
  });
}
/**
 *  删除/批量删除
 */
function handleDelete(row: ExamSetTable = {} as ExamSetTable) {
  const ids = row.courseExpId ? [row.courseExpId] : [...state.ids];
  // const ids = [row.courseExpId || state.ids].join(',');
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteExamSets(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
/**
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: ExamSetTable[]) {
  state.ids = selection.map((item: ExamSetTable) => item.courseExpId);
}
/**
 * 打开导入学生弹框
 */
function openInputStudent(row: ExamSetTable) {
  inputStudent.value.openDialog(row.courseExpId, 'examSet');
}
/**
 * 初始化获取选择器数据
 */
function initSelect() {
  getExamSelect(state.currentCourseSet.lessonId).then(({ data }) => {
    state.examSelectOption = data.expOptions;
  });
  getAllLab().then(({ data }) => {
    state.labSelectOption = data.LabOptions;
  });
  getAllTeacher().then(({ data }) => {
    state.teacherSelectOption = data.teacherOptions;
  });
}
defineExpose({
  openDialog
});
</script>
<style lang="scss">
.exam-set {
  .el-dialog {
    border-radius: 0 !important;
  }
}
.btn-center {
  display: flex;
  flex-direction: column;
}
</style>
