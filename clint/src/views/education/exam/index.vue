<!-- 实验管理 -->
<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" class="searchForm" ref="queryFormRef" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="实验名称" prop="expName">
              <el-input v-model="state.queryParams.expName" placeholder="实验名称" />
            </el-form-item>
            <el-form-item label="所属课程" prop="lessonId">
              <el-select class="w-full" v-model="state.queryParams.lessonId" placeholder="--所有--" filterable>
                <el-option v-for="item in state.courseSelectOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实验开设方式" prop="expAutoOpen">
              <template #label>
                实验开设方式
                <el-tooltip effect="dark" content="自动开设(开课之后自动绑定课程下的所有实验)手动开设(开课之后需要手动绑定实验)" placement="right">
                  <i class="iconfont icon-icon_help ml-1"></i>
                </el-tooltip>
              </template>
              <el-radio-group v-model="state.queryParams.expAutoOpen">
                <el-radio v-for="item in selectEnum.businessEnumTypes.lessonAutoOpenOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-row :sm="24" :md="12" :lg="12" class="mb20 mr10">
              <el-col>
                <el-button class="searchbtn" type="primary" @click="handleQuery"><i class="iconfont icon-sousuo"></i>搜索</el-button>
              </el-col>
            </el-row>
            <el-row :sm="24" :md="12" :lg="12" class="mb20">
              <el-col>
                <el-button class="resetbtn" type="info" @click="resetQuery"><i class="iconfont icon-zhongzhi"></i>重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="table-container">
          <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <div class="table-total">实验管理</div>
            <div class="flex justify-between items-center">
              <el-button class="columnsetbtn" type="primary" @click="examColumnSet"><i class="iconfont icon-shezhi"></i>栏目设置</el-button>
              <!-- <el-button class="importbtn" type="warning" @click="inputExamData"><i class="iconfont icon-daoru"></i>批量导入</el-button> -->
              <!-- <el-button type="primary"><i class="iconfont icon-icon_help"></i>帮助</el-button> -->
              <!-- 引导页面 -->
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
              <el-button class="addbtn" type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <el-table
            class="tablearea"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.examList"
            height="calc(100vh - 232px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            @selection-change="handleSelectionChange"
            highlight-current-row
          >
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="实验名称" prop="expName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="所属课程" prop="lessonName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="实验顺序" prop="expOrderNum" show-overflow-tooltip :align="'center'" />
            <el-table-column label="实验时长(分)" prop="expTimeLength" show-overflow-tooltip :align="'center'" />
            <el-table-column label="实验开设方式" :align="'center'">
              <template #default="scope">
                <el-tag v-if="scope.row.expAutoOpen === 0" type="success">自动开设</el-tag>
                <el-tag v-else-if="scope.row.expAutoOpen === 1" type="warning">手动开设</el-tag>
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
                      <el-button type="warning" link @click.stop="examSetHandle(scope.row)"> <i class="iconfont icon-shezhi"></i>实验设置 </el-button>
                    </div>
                    <!-- <div class="text-center w-full">
                      <el-button type="primary" link @click.stop="openExamReportDialog(scope.row)"> <i class="iconfont icon-bianji"></i>实验报告 </el-button>
                    </div> -->
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

    <!-- 实验项目弹框 -->
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="800px" @close="closeDialog">
      <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="90px">
        <el-form-item label="实验名称" prop="expName">
          <el-input v-model="state.formData.expName" placeholder="实验名称" />
        </el-form-item>
        <el-form-item label="所属课程" prop="lessonId">
          <el-select class="w-full" v-model="state.formData.lessonId" placeholder="--所有--" filterable>
            <el-option v-for="item in state.courseSelectOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验顺序" prop="expOrderNum">
          <el-input-number v-model="state.formData.expOrderNum" :step="1" step-strictly controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="实验时长" prop="expTimeLength">
          <el-input-number v-model="state.formData.expTimeLength" :step="1" step-strictly controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="开设方式" prop="expAutoOpen">
          <template #label>
            开设方式
            <el-tooltip effect="dark" content="自动开设(开课之后自动绑定课程下的所有实验)手动开设(开课之后需要手动绑定实验)" placement="right">
              <i class="iconfont icon-icon_help ml-1"></i>
            </el-tooltip>
          </template>
          <el-radio-group v-model="state.formData.expAutoOpen">
            <el-radio v-for="item in selectEnum.businessEnumTypes.lessonAutoOpenOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 实验栏目 -->
    <exam-column ref="examColumnRef"></exam-column>
    <!-- 实验详情 -->
    <exam-detail ref="examDetailRef" :currentRow="state.currentRow"></exam-detail>
    <!-- 实验报告设置 -->
    <!-- <examReport v-if="state.currentRow.expId" :currentRow="state.currentRow" ref="examReportRef"></examReport> -->
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import { getGuideData } from '@/components/Guide/guideData';
import ExamDetail from './components/examDetail.vue';
import ExamColumn from './components/examColumn.vue';
import examReport from '@/components/ExamReport/ReportTemplate.vue';
import { getExamData, getExamDetail, addExam, updateExam, deleteExams, addCurrentExamCol } from '@/api/exam';
import { getCourseSelect } from '@/api/course';
import { ExamQuery, ExamForm, ExamTable } from '@/api/exam/types';
import { useSelectEnum } from '@/store/selectEnum';
import { inputLessonInfoList } from '@/utils/commonMethods';
const selectEnum = useSelectEnum();
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
// 实验详细信息对象
const examDetailRef = ref();
// 实验报告对象
const examReportRef = ref();
// 实验栏目弹框对象
const examColumnRef = ref();
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as ExamQuery,
  // 课程选择器数据
  courseSelectOptions: [] as SelectOptionType[],
  // 表格数据
  examList: [] as ExamTable[],
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
  formData: {} as ExamForm,
  // 增加/编辑表单校验规则
  rules: {
    expName: [{ required: true, message: '请输入实验名称', trigger: 'blur' }],
    expOrderNum: [{ required: true, message: '请输入实验顺序', trigger: 'blur' }],
    lessonId: [{ required: true, message: '请选择所属课程', trigger: 'change' }]
  },
  currentRow: {} as ExamTable,
  // 引导页相关数据
  guideArr: [] as Step[]
});
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getExamData(state.queryParams).then(({ data }) => {
    state.examList = data.expList;
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
function handleSelectionChange(selection: ExamTable[]) {
  state.ids = selection.map((item: ExamTable) => item.expId);
}
/**
 * 新增点击
 */
function handleAdd() {
  state.dialog = {
    title: '添加实验',
    visible: true
  };
}
/**
 * 编辑点击
 */
function handleUpdate(row: ExamTable) {
  state.dialog = {
    title: '修改实验',
    visible: true
  };
  getExamDetail(row.expId).then(({ data }) => {
    state.formData = data.exp;
  });
}
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  // state.loading = true;
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.expId) {
        updateExam(state.formData).then(() => {
          ElMessage.success('编辑成功');
          closeDialog();
          handleQuery();
          // state.loading = false;
        });
        // .catch(() => {
        //   state.loading = false;
        // });
      } else {
        addExam(state.formData).then(() => {
          ElMessage.success('新增成功');
          closeDialog();
          handleQuery();
          // state.loading = false;
        });
        // .catch(() => {
        //   state.loading = false;
        // });
      }
    }
  });
}

/**
 * 取消
 */
function closeDialog() {
  state.dialog.visible = false;
  dataFormRef.value.resetFields();
  state.formData = {} as ExamForm;
}

/**
 *  删除/批量删除
 */
function handleDelete(row: ExamTable = {} as ExamTable) {
  const ids = row.expId ? [row.expId] : [...state.ids];
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteExams(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
/**
 *  实验设置点击 弹出实验详情设置弹框
 */
function examSetHandle(row: ExamTable) {
  state.currentRow = row;
  examDetailRef.value.openDialog();
}
// 打开实验报告弹窗
function openExamReportDialog(row: ExamTable) {
  state.currentRow = row;
  nextTick(() => {
    examReportRef.value.openDialog();
  });
}
/**
 * 栏目设置点击 弹出栏目设置弹框
 */
function examColumnSet() {
  examColumnRef.value.openDialog();
}
/**
 * 批量导入数据
 */
function inputExamData() {
  // ElMessageBox.confirm('确认批量导入在线实验和开课数据吗?', '警告', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // })
  //   .then(() => {
  //     inputLessonInfoList(
  //       addExam,
  //       addCurrentExamCol,
  //       {
  //         expAutoOpen: 0,
  //         expName: '电子技术综合测试实验',
  //         expOrderNum: 1,
  //         expTimeLength: 120,
  //         lessonId: 91
  //       },
  //       {
  //         columnId: 5,
  //         // 实验id
  //         expId: 1000,
  //         expInfoBoxType: 3,
  //         expInfoKeyFlag: 'analog_circuit_gfkd',
  //         expInfoPath: '../md_gfkd/#/?id=2',
  //         expInfoSelectDevice: 1,
  //         expInfoWay: 2
  //       },
  //       {
  //         columnId: 12,
  //         expId: 1002,
  //         expInfoBoxType: 1,
  //         expInfoKeyFlag: 'not_use_box',
  //         expInfoPath: '111',
  //         expInfoSelectDevice: 2,
  //         expInfoWay: 4
  //       }
  //     );
  //   })
  //   .catch(() => ElMessage.info('已取消'));
}
onMounted(() => {
  handleQuery();
  // 获取课程选择器数据
  getCourseSelect().then(({ data }) => {
    state.courseSelectOptions = data.lessonOptions;
  });
  // 设置引导页相关数据
  state.guideArr = getGuideData('exam') as Step[];
});
</script>
