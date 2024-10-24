<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="问题类型" prop="questionType">
              <el-select class="w-full" v-model="state.queryParams.questionType" placeholder="问题类型" clearable>
                <el-option v-for="item in questionStore.questionTypesOption" :key="item.key" :value="item.key" :label="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题干信息" prop="questionKeyWord">
              <el-input v-model="state.queryParams.questionKeyWord" placeholder="题干信息" />
            </el-form-item>
            <el-form-item label="问题等级" prop="questionLevel">
              <el-select class="w-full" v-model="state.queryParams.questionLevel" placeholder="问题等级" clearable>
                <el-option v-for="item in questionStore.hardStage" :key="item.key" :value="item.key" :label="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属实验" prop="expId">
              <el-cascader clearable class="w-full" placeholder="请选择课程/实验" v-model="state.expList" filterable collapse-tags :options="state.treeData" :props="cascadeProps"></el-cascader>
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
            <div class="table-total">试题列表</div>
            <div class="flex justify-between items-center">
              <el-button class="importbtn" type="warning"><i class="iconfont icon-daoru"></i>批量导入</el-button>
              <!-- 引导页面 -->
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
              <el-button class="addbtn" type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <el-table
            class="tablearea"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.questionList"
            height="calc(100vh - 232px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            @selection-change="handleSelectionChange"
            highlight-current-row
          >
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="试题类型" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag type="info">{{ getSelectOptionVal(scope.row.questionType, 'questionType') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="试题题干" show-overflow-tooltip>
              <template #default="scope">
                <div style="height: 25px; overflow: hidden" v-html="scope.row.question"></div>
              </template>
            </el-table-column>
            <el-table-column label="试题等级" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag type="info">{{ getSelectOptionVal(scope.row.questionLevel, 'questionLevel') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="试题分数" prop="score" show-overflow-tooltip :align="'center'" />
            <el-table-column label="操作" width="220" :align="'center'">
              <template #default="scope">
                <el-button type="primary" link @click.stop="handleUpdate(scope.row)"> <i class="iconfont icon-bianji"></i>编辑 </el-button>
                <el-button type="danger" link @click.stop="handleDelete(scope.row)"> <i class="iconfont icon-shanchu"></i>删除 </el-button>
                <el-button type="primary" link @click.stop="handleViewQuestion(scope.row)"> <i class="iconfont icon-shujuyulan"></i>预览 </el-button>
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
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="60%" @close="closeDialog">
      <ViewQuestion :question-detail="state.currentQuestion"></ViewQuestion>
    </el-dialog>
    <!-- 录入/编辑试题弹窗 -->
    <InputQuestion ref="inputQuestionRef" @refresh="handleQuery" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import ViewQuestion from '@/components/ExamPaper/QuestionDetail.vue';
import InputQuestion from './components/InputQuestion.vue';
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import { getGuideData } from '@/components/Guide/guideData';
import { useQuestionStore } from '@/store/modules/question';
import { getQuestionData, getQuestionDetail} from '@/api/question';
import { QuestionListQuery, QuestionForm, QuestionTable } from '@/api/question/types';
import { getLessonAndExpOptions } from '@/api/course';
import {selectQuestionOperate,getSelectOptionVal} from '@/utils/commonMethods'
// 试题store数据
const questionStore = useQuestionStore();
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 录入/编辑试题弹窗对象
const inputQuestionRef = ref();
// 级联选择器配置
const cascadeProps = { expandTrigger: 'hover' };
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as QuestionListQuery,
  // 表格数据
  questionList: [] as QuestionTable[],
  // 总数
  total: 0,
  // 表格多选
  ids: [] as string[],
  // 增加/编辑弹框状态
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  // 引导页相关数据
  guideArr: [] as Step[],
  // 选中实验列表数据
  expList: null,
  // 课程-实验树形数据
  treeData: [] as TreeDataList[],
  // 当前题目详细信息
  currentQuestion: {} as QuestionForm
});
/**
 * 查询
 */
function handleQuery() {
  if (state.expList !== null) {
    state.queryParams.expId = state.expList[1];
  }
  state.loading = true;
  getQuestionData(state.queryParams).then(({ data }) => {
    state.questionList = data.questionList;
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
  state.expList = null;
  handleQuery();
}
/**
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: QuestionTable[]) {
  state.ids = selection.map((item: QuestionTable) => item.questionId);
}
/**
 * 新增点击
 */
function handleAdd() {
  inputQuestionRef.value.openDialog('add')
}
/**
 * 编辑点击
 */
function handleUpdate(row: QuestionTable) {
  getQuestionDetail(row.questionId).then(({ data }) => {
    inputQuestionRef.value.openDialog('edit',selectQuestionOperate(data.question))
  });
}
/**打开预览弹窗 */
function handleViewQuestion(row: QuestionTable) {
  // 获取题目详细信息
  state.dialog = {
    title: '预览试题',
    visible: true
  };
  getQuestionDetail(row.questionId).then(({ data }) => {
    // 选择题特殊处理
    state.currentQuestion = selectQuestionOperate(data.question);
  });
}

/**
 * 取消
 */
function closeDialog() {
  state.dialog.visible = false;
}

/**
 *  删除/批量删除
 */
function handleDelete(row: QuestionTable = {} as QuestionTable) {
  const ids = [row.questionId || state.ids].join(',');
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // deleteQuestions(ids).then(() => {
      //   ElMessage.success('删除成功');
      //   handleQuery();
      // });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

/**获取课程-实验树形数据 */
function getTreeData() {
  getLessonAndExpOptions().then(({ data }) => {
    state.treeData = data.lessonAndExpOptions;
  });
}
onMounted(() => {
  handleQuery();
  // 设置引导页相关数据
  state.guideArr = getGuideData('course') as Step[];
  getTreeData();
});
</script>
