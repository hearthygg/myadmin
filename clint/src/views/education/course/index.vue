<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="课程名称" prop="lessonName">
              <el-input v-model="state.queryParams.lessonName" placeholder="课程名称" />
            </el-form-item>
            <el-form-item label="课程编号" prop="lessonNumber">
              <el-input v-model="state.queryParams.lessonNumber" placeholder="课程编号" />
            </el-form-item>
            <el-form-item label="课程学分" prop="lessonCredit">
              <el-input v-model="state.queryParams.lessonCredit" placeholder="课程学分" />
            </el-form-item>
            <el-form-item label="课程学时" prop="lessonPeriod">
              <el-input v-model="state.queryParams.lessonPeriod" placeholder="课程学时" />
            </el-form-item>
            <el-form-item label="课程标志" prop="lessonFlag">
              <el-input v-model="state.queryParams.lessonFlag" placeholder="课程标志" />
            </el-form-item>
            <el-form-item label="课程类型" prop="lessonClassification">
              <el-select class="w-full" v-model="state.queryParams.lessonClassification" placeholder="--所有--" filterable>
                <el-option v-for="item in state.lessonClassificationOption" :value="item.value" :label="item.label" :key="item.value"></el-option>
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
            <div class="table-total">课程管理</div>
            <div class="flex justify-between items-center">
              <el-button class="importbtn" type="warning" @click="openMergeDialog"><i class="iconfont icon-daoru"></i>合并课程</el-button>
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
            row-key="lessonId"
          >
            <!-- reserve-selection分页刷新数据之后是否保留勾选数据 -->
            <el-table-column type="selection" width="55" :align="'center'" :reserve-selection="true" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="课程名称" prop="lessonName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="课程编号" prop="lessonNumber" show-overflow-tooltip :align="'center'" />
            <el-table-column label="课程学分" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.lessonCredit">{{ scope.row.lessonCredit }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="课程学时" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.lessonPeriod">{{ scope.row.lessonPeriod }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="课程类型" prop="lessonClassification" show-overflow-tooltip :align="'center'" />
            <el-table-column label="操作" width="180" :align="'center'">
              <template #default="scope">
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

    <!-- dialog -->
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="800px" @close="closeDialog">
      <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="80px">
        <el-form-item label="课程名称" prop="lessonName">
          <el-input v-model="state.formData.lessonName" placeholder="课程名称" />
        </el-form-item>
        <el-form-item label="课程编号" prop="lessonNumber">
          <el-input v-model="state.formData.lessonNumber" placeholder="课程编号" />
        </el-form-item>
        <el-form-item label="课程学分" prop="lessonCredit">
          <el-input v-model="state.formData.lessonCredit" placeholder="课程学分" />
        </el-form-item>
        <el-form-item label="课程学时" prop="lessonPeriod">
          <el-input v-model="state.formData.lessonPeriod" placeholder="课程学时" />
        </el-form-item>
        <el-form-item label="课程标志" prop="lessonFlag">
          <el-input v-model="state.formData.lessonFlag" placeholder="课程标志" />
        </el-form-item>
        <el-form-item label="课程类型" prop="lessonClassification">
          <el-select class="w-full" v-model="state.formData.lessonClassification" placeholder="请选择课程类型" filterable>
            <el-option v-for="item in state.lessonClassificationOption" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程封面" prop="lessonBackImage">
          <single-upload v-model="state.formData.lessonBackImage"></single-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 合并课程弹窗 -->
    <el-dialog :title="state.mergeDialog.title" v-model="state.mergeDialog.visible" width="800px" @close="closeMergeDialog">
      <el-form ref="mergeFormRef" :model="state.mergeFormData" :rules="state.mergeRules" label-position="left" label-width="100px">
        <el-form-item label="新课程名称" prop="newLessonName">
          <el-input v-model="state.mergeFormData.newLessonName" placeholder="新课程名称" />
        </el-form-item>
        <el-form-item label="新课程编号" prop="newLessonNum">
          <el-input v-model="state.mergeFormData.newLessonNum" placeholder="新课程编号" />
        </el-form-item>
        <el-form-item label="课程类型" prop="lessonClassification">
          <el-select class="w-full" v-model="state.mergeFormData.lessonClassification" placeholder="请选择课程类型" filterable>
            <el-option v-for="item in state.lessonClassificationOption" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="mt-2 text-gray-600 text-xl font-bold">功能说明：</div>
      <div class="mt-2 indent-4 text-blue-500 text-lg">将表格勾选的课程数据创建到一个新的课程中，原来的课程数据会被保留不会被删除，并且实验数据会被迁移到新的课程中</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitMergeData"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeMergeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox, ElTable } from 'element-plus';
import SingleUpload from '@/components/Upload/SingleUpload.vue';
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import { getGuideData } from '@/components/Guide/guideData';
import { getCourseData, getCourseDetail, addCourse, updateCourse, deleteCourses, getLessonClassificationOption, mergeCourseApi } from '@/api/course';
import { CourseQuery, CourseForm, CourseTable, MergeCourseData } from '@/api/course/types';
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
const mergeFormRef = ref(ElForm);
const dataTableRef = ref(ElTable);
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
  // 合并课程弹窗
  mergeDialog: {
    title: '合并表格勾选的课程',
    visible: false
  } as DialogType,
  // 增加/编辑表单
  formData: {} as CourseForm,
  // 合并课程表单
  mergeFormData: {} as MergeCourseData,
  // 增加/编辑表单校验规则
  rules: {
    lessonName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
    lessonNumber: [{ required: true, message: '请输入课程编号', trigger: 'blur' }],
    lessonClassification: [{ required: true, message: '课程类型不能为空', trigger: 'change' }],
  },
  // 合并课程表单校验规则
  mergeRules: {
    newLessonName: [{ required: true, message: '新课程名称不能为空', trigger: 'blur' }],
    newLessonNum: [{ required: true, message: '新课程编号不能为空', trigger: 'blur' }],
    lessonClassification: [{ required: true, message: '课程类型不能为空', trigger: 'change' }],
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  // 课程分类选择器数据
  lessonClassificationOption: [] as SelectOptionType[]
});
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getCourseData(state.queryParams).then(({ data }) => {
    state.courseList = data.lessonList;
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
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: CourseTable[]) {
  state.ids = selection.map((item: CourseTable) => item.lessonId);
}
/**
 * 新增点击
 */
function handleAdd() {
  state.dialog = {
    title: '添加课程',
    visible: true
  };
}
/**
 * 编辑点击
 */
function handleUpdate(row: CourseTable) {
  state.dialog = {
    title: '修改课程',
    visible: true
  };
  getCourseDetail(row.lessonId).then(({ data }) => {
    state.formData = data.lesson;
  });
}
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  // state.loading = true;
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.lessonId) {
        updateCourse(state.formData).then(() => {
          ElMessage.success('修改成功');
          closeDialog();
          handleQuery();
          // state.loading = false;
        });
        // .catch(() => { state.loading = false });
      } else {
        console.log(state.formData);
        addCourse(state.formData).then(() => {
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
 * 提交合并课程数据
 */
function submitMergeData() {
  mergeFormRef.value.validate((valid: any) => {
    if (valid) {
      state.mergeFormData.selectedLessonIds = {ids: state.ids};
      mergeCourseApi(state.mergeFormData).then(() => {
        ElMessage.success('合并课程成功！');
        closeMergeDialog();
        handleQuery();
        clearSelection();
      });
    }
  });
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
 * 关闭合并课程弹窗
 */
function closeMergeDialog() {
  state.mergeDialog.visible = false;
  mergeFormRef.value.resetFields();
  state.mergeFormData = {} as MergeCourseData;
}
/**
 *  删除/批量删除
 */
function handleDelete(row: CourseTable = {} as CourseTable) {
  const ids = row.lessonId ? [row.lessonId] : [...state.ids];
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteCourses(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
        clearSelection();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
// 清除表格勾选数据
const clearSelection = () => {
  state.ids = [];
  dataTableRef.value.clearSelection();
};
/**打开合并课程弹窗 */
function openMergeDialog() {
  if(state.ids.length > 0) {
    state.mergeDialog.visible = true;
  } else {
    ElMessage.warning('请勾选表格中需要合并的课程');
  }
}
onMounted(() => {
  handleQuery();
  // 设置引导页相关数据
  state.guideArr = getGuideData('course') as Step[];
  // 获取课程类型选择器数据
  getLessonClassificationOption().then(({ data }) => {
    state.lessonClassificationOption = data;
  });
});
</script>
