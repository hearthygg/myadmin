<!-- 开课管理 -->
<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="开课部门" prop="deptId">
              <el-input v-model="state.queryParams.deptId" placeholder="开课部门" />
            </el-form-item>
            <el-form-item label="开设课程" prop="lessonId">
              <el-select class="w-full" v-model="state.queryParams.lessonId" filterable placeholder="请选择开设课程">
                <el-option v-for="item in state.courseSelectList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任课教师" prop="teacherId">
              <el-select class="w-full" v-model="state.queryParams.teacherId" filterable placeholder="请选择任课教师">
                <el-option v-for="item in state.teacherSelectList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开课学期" prop="termId">
              <el-select class="w-full" v-model="state.queryParams.termId" filterable placeholder="请选择开课学期">
                <el-option v-for="item in state.termSelectList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开课号" prop="courseOpenCode">
              <el-input v-model="state.queryParams.courseOpenCode" placeholder="开课号" />
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
            <div class="table-total">开课管理</div>
            <div class="flex justify-between items-center">
              <el-button class="importbtn" type="warning" @click="openBatchImport"><i class="iconfont icon-daoru"></i>批量导入</el-button>
              <!-- 引导页面 -->
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
              <el-button class="addbtn" type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <el-table
            class="tablearea"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.courseList"
            height="calc(100vh - 232px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            @selection-change="handleSelectionChange"
            highlight-current-row
          >
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="开课编号" prop="courseOpenCode" show-overflow-tooltip :align="'center'" />
            <el-table-column label="开设课程" prop="lessonName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="开课部门" prop="deptName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="开课学期" prop="termName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="任课教师" prop="teacherName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="备注" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.markContent">{{ scope.row.markContent }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
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
                      <el-button type="primary" link @click.stop="openExamSet(scope.row)"> <i class="iconfont icon-shezhi"></i>实验开设 </el-button>
                    </div>
                    <div class="text-center w-full">
                      <el-button type="primary" link @click.stop="openInputStudent(scope.row)"> <i class="iconfont icon-shujuyulan"></i>导入学生 </el-button>
                    </div>
                  </template>
                </el-popover>
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
    <!-- dialog -->
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" @close="closeDialog">
      <el-form ref="dataFormRef" :model="state.formData" label-position="left" :rules="state.rules" label-width="80px">
        <el-form-item label="开课编号" prop="courseOpenCode">
          <el-input v-model="state.formData.courseOpenCode" placeholder="开课编号" />
        </el-form-item>
        <el-form-item label="所属课程" prop="lessonId">
          <el-select class="w-full" v-model="state.formData.lessonId" placeholder="请选择所属课程" filterable>
            <el-option v-for="item in state.courseSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开课学期" prop="termId">
          <el-select class="w-full" v-model="state.formData.termId" placeholder="请选择开课学期" filterable>
            <el-option v-for="item in state.termSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任课教师" prop="teacherId">
          <el-select class="w-full" v-model="state.formData.teacherId" placeholder="请选择任课教师" filterable>
            <el-option v-for="item in state.teacherSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开课部门" prop="termId">
          <el-select class="w-full" v-model="state.formData.deptId" placeholder="请选择开课部门" filterable>
            <el-option v-for="item in state.deptSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="实验室" prop="labId">
          <el-select class="w-full" v-model="state.formData.labId" placeholder="请选择实验室" filterable>
            <el-option v-for="item in state.labSelectList" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注" prop="markContent">
          <el-input v-model="state.formData.markContent" placeholder="备注" />
        </el-form-item>
        <el-form-item label="实验时长" prop="timeLength">
          <el-input-number v-model="state.formData.timeLength" :step="1" step-strictly controls-position="right" :min="10" :max="120" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
    <ExamSet ref="examSet" />
    <InputStudent ref="inputStudent" />
    <BatchImport type="course" @queryTableData="handleQuery" ref="importExcelRef" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import ExamSet from './components/ExamSet.vue';
import InputStudent from '@/components/InputStudent/index.vue';
import { getGuideData } from '@/components/Guide/guideData';
import { getCourseData, getCourseDetail, addCourse, updateCourse, deleteCourseSets } from '@/api/courseSet';
import { CourseQuery, CourseForm, CourseTable } from '@/api/courseSet/types';
import { getCourseSelect } from '@/api/course';
import { getAllDept } from '@/api/dept';
import { getAllTerm } from '@/api/term';
import { getAllTeacher } from '@/api/user';
import { getAllLab } from '@/api/lab';
import BatchImport from '@/components/BatchImport/index.vue';
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
// 实验开设弹框对象
const examSet = ref();
// 导入学生弹框对象
const inputStudent = ref();
const importExcelRef = ref(BatchImport);
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as CourseQuery,
  // 表格数据
  courseList: [] as CourseTable[],
  // 总数
  total: 0,
  // 表格多选
  ids: [] as number[],
  // 增加/编辑弹框状态
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  // 增加/编辑表单
  formData: {} as CourseForm,
  // 增加/编辑表单校验规则
  rules: {
    courseOpenCode: [{ required: true, message: '请输入开课编号', trigger: 'blur' }],
    lessonId: [{ required: true, message: '请选择所属课程', trigger: 'change' }],
    teacherId: [{ required: true, message: '请选择任课教师', trigger: 'change' }],
    deptId: [{ required: true, message: '请选择开课部门', trigger: 'change' }],
    termId: [{ required: true, message: '请选择开课学期', trigger: 'change' }],
    labId: [{ required: true, message: '请选择实验室', trigger: 'change' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  // 一些选择器相关数据
  courseSelectList: [] as SelectOptionType[],
  termSelectList: [] as SelectOptionType[],
  deptSelectList: [] as SelectOptionType[],
  teacherSelectList: [] as SelectOptionType[],
  labSelectList: [] as SelectOptionType[]
});
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getCourseData(state.queryParams).then(({ data }) => {
    state.courseList = data.courseVoPage;
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
/**
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: CourseTable[]) {
  state.ids = selection.map((item: CourseTable) => item.courseId);
}
/**
 * 新增点击
 */
function handleAdd() {
  state.dialog = {
    title: '添加数据',
    visible: true
  };
}
/**
 * 编辑点击
 */
function handleUpdate(row: CourseTable) {
  state.dialog = {
    title: '编辑数据',
    visible: true
  };
  getCourseDetail(row.courseId).then(({ data }) => {
    state.formData = data.course;
  });
}
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      state.loading = true;
      if (state.formData.courseId) {
        updateCourse(state.formData)
          .then(() => {
            ElMessage.success('修改成功');
            closeDialog();
            handleQuery();
            state.loading = false;
          })
          .catch(() => {
            state.loading = false;
          });
      } else {
        addCourse(state.formData)
          .then(() => {
            ElMessage.success('新增成功');
            closeDialog();
            handleQuery();
            state.loading = false;
          })
          .catch(() => {
            state.loading = false;
          });
      }
    }
  });
}
/**
 * 打开实验开设弹框
 */
function openExamSet(row: CourseTable) {
  examSet.value.openDialog(row);
}
/**
 * 打开导入学生弹框
 */
function openInputStudent(row: CourseTable) {
  inputStudent.value.openDialog(row.courseId, 'courseSet');
}

/**
 * 取消
 */
function closeDialog() {
  state.dialog.visible = false;
  dataFormRef.value.resetFields();
  state.formData = {} as CourseForm;
}

/**
 *  删除/批量删除
 */
function handleDelete(row: CourseTable = {} as CourseTable) {
  const ids = row.courseId ? [row.courseId] : [...state.ids];
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteCourseSets(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

// 获取前置的选择器数据
function getSelectList() {
  getCourseSelect().then(({ data }) => {
    state.courseSelectList = data.lessonOptions;
  });
  getAllTerm().then(({ data }) => {
    state.termSelectList = data.termOption;
  });
  getAllDept().then(({ data }) => {
    state.deptSelectList = data.deptOptions;
  });
  getAllTeacher().then(({ data }) => {
    state.teacherSelectList = data.teacherOptions;
  });
  getAllLab().then(({ data }) => {
    state.labSelectList = data.LabOptions;
  });
}
const openBatchImport = () => {
  importExcelRef.value.openDialog();
};
onMounted(() => {
  handleQuery();
  // 设置引导页相关数据
  state.guideArr = getGuideData('course') as Step[];
  getSelectList();
});
</script>
