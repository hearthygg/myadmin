<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="试卷信息" prop="paperKeyWord">
              <el-input v-model="state.queryParams.paperKeyWord" placeholder="试卷信息"></el-input>
            </el-form-item>
            <el-form-item label="命题人" prop="staffId">
              <el-select class="w-full" v-model="state.queryParams.staffId" placeholder="命题人" filterable>
                <el-option v-for="item in state.teacherList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="paperStartTime">
              <!-- 设置时间选择器时间格式 -->
              <el-date-picker v-model="state.queryParams.paperStartTime" format="YYYY-MM-DD HH:MM:ss" value-format="YYYY-MM-DD HH:MM:ss" type="datetime" />
            </el-form-item>
            <el-form-item label="结束时间" prop="paperEndTime">
              <el-date-picker v-model="state.queryParams.paperEndTime" format="YYYY-MM-DD HH:MM:ss" value-format="YYYY-MM-DD HH:MM:ss" type="datetime" />
            </el-form-item>
            <el-form-item label="试卷发布" prop="paperPublish">
              <el-select class="w-full" v-model="state.queryParams.paperPublish" placeholder="试卷发布">
                <el-option v-for="item in questionStore.paPerPublishOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成绩公布" prop="scorePublish">
              <el-select class="w-full" v-model="state.queryParams.scorePublish" placeholder="成绩公布">
                <el-option v-for="item in questionStore.scorePublishOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="答案公布" prop="answerPublish">
              <el-select class="w-full" v-model="state.queryParams.answerPublish" placeholder="答案公布">
                <el-option v-for="item in questionStore.answerPublishOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
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
            <div class="table-total">试卷列表</div>
            <div class="flex justify-between items-center">
              <!-- <el-button class="importbtn" type="warning"><i class="iconfont icon-daoru"></i>批量导入</el-button> -->
              <!-- 引导页面 -->
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
              <el-button class="addbtn" type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>创建试卷</el-button>
            </div>
          </div>
          <el-table
            class="tablearea"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.paperList"
            height="calc(100vh - 232px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            @selection-change="handleSelectionChange"
            highlight-current-row
          >
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="试卷标题" prop="paperTitle" show-overflow-tooltip :align="'center'" />
            <el-table-column label="命题人" prop="paperStaffName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="总题数" prop="paperTotalCount" show-overflow-tooltip :align="'center'" />
            <el-table-column label="总分数" prop="paperTotalScore" show-overflow-tooltip :align="'center'" />
            <el-table-column label="考试时长" prop="paperExamTime" show-overflow-tooltip :align="'center'" />
            <el-table-column label="开始时间" prop="paperStartTime" show-overflow-tooltip :align="'center'" />
            <el-table-column label="结束时间" prop="paperEndTime" show-overflow-tooltip :align="'center'" />
            <el-table-column label="试卷发布" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag :type="scope.row.paperPublish === PaPerPublish.YFB ? 'success' : 'warning'">{{ scope.row.paperPublish === PaPerPublish.YFB ? '已发布' : '未发布' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="成绩公布" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag :type="scope.row.scorePublish === ScorePublish.YGB ? 'success' : 'warning'">{{ scope.row.scorePublish === ScorePublish.YGB ? '已公布' : '未公布' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="答案公布" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag :type="scope.row.answerPublish === AnswerPublish.YGB ? 'success' : 'warning'">{{ scope.row.answerPublish === AnswerPublish.YGB ? '已公布' : '未公布' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="190" :align="'center'">
              <template #default="scope">
                <el-button type="primary" link @click.stop="handleUpdate(scope.row)"> <i class="iconfont icon-bianji"></i>编辑 </el-button>
                <!-- <el-button type="danger" link @click.stop="handleDelete(scope.row)"> <i class="iconfont icon-shanchu"></i>删除 </el-button> -->
                <el-button type="primary" link @click.stop="handleViewPaper(scope.row)"> <i class="iconfont icon-shujuyulan"></i>预览 </el-button>
                <el-dropdown trigger="hover">
                  <div class="ml-2 mt-1">
                    <el-button type="primary" link>
                      <i class="iconfont icon-shenglvehao"></i>
                    </el-button>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <el-button type="primary" @click="openInputStudent(scope.row)" link><i class="iconfont icon-fabu"></i>发布试卷</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item divided>
                        <el-button type="success" @click="openCorrectPaper(scope.row)" link><i class="iconfont icon-fabu1"></i>批改试卷</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item divided>
                        <el-button type="primary" link><i class="iconfont icon-fabu2"></i>公布成绩</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item divided>
                        <el-button type="success" link><i class="iconfont icon-fabu2"></i>公布答案</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" @close="closeDialog"> </el-dialog>
    <!-- 新增试卷弹窗 -->
    <AddExamPaper ref="inputQuestionRef" @refresh="handleQuery" />
    <!-- 批改试卷弹窗 -->
    <CorrectPaper ref="correctPaperRef" @refresh="handleQuery" />
    <!-- 预览试卷弹窗 -->
    <div class="fullDialog">
      <el-dialog :title="state.examPaperDetail.paperTitle" v-model="state.viewPaperDialog" :fullscreen="true">
        <ViewPaper :paper-detail="state.examPaperDetail"></ViewPaper>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.viewPaperDialog = false" type="primary"><i class="iconfont icon-quxiao"></i>关闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 发布试卷导入学生弹窗 -->
    <InputStudent @refresh="handleQuery" ref="inputStudent" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import AddExamPaper from '../components/AddExamPaper.vue';
import ViewPaper from '@/components/ExamPaper/ViewPaper.vue';
import CorrectPaper from '../components/correctPaperList.vue'
import InputStudent from '@/components/InputStudent/index.vue'
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import { getGuideData } from '@/components/Guide/guideData';
import { useQuestionStore } from '@/store/modules/question';
import { getPaperListApi, getPaperDetailApi } from '@/api/examPaper';
import { PaperListQuery, PaperList, ExamPaperDetail,PaPerPublish,ScorePublish,AnswerPublish } from '@/api/examPaper/types';
import { QuestionForm } from '@/api/question/types';
import { getLessonAndExpOptions } from '@/api/course';
import { selectQuestionOperate, getSelectOptionVal } from '@/utils/commonMethods';
import { getAllTeacher } from '@/api/user';
import { sortQuestionList } from '@/utils/sort';
// 试题store数据
const questionStore = useQuestionStore();
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 录入/编辑试题弹窗对象
const inputQuestionRef = ref();
// 批改试卷弹窗对象
const correctPaperRef = ref()
// 导入学生弹框对象
const inputStudent = ref()
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as PaperListQuery,
  // 表格数据
  paperList: [] as PaperList[],
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
  currentQuestion: {} as QuestionForm,
  // 教师列表
  teacherList: [] as SelectOptionType[],
  viewPaperDialog: false,
  // 试题详细信息
  examPaperDetail: {} as ExamPaperDetail
});
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getPaperListApi(state.queryParams).then(({ data }) => {
    state.paperList = data.questionList;
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
function handleSelectionChange(selection: PaperList[]) {
  state.ids = selection.map((item: PaperList) => item.paperId);
}
/**
 * 新增点击
 */
function handleAdd() {
  inputQuestionRef.value.openDialog();
}
/**
 * 打开导入学生弹框
 */
 function openInputStudent(row: PaperList) {
  inputStudent.value.openDialog(row.paperId,"publishPaper",row.paperPublish)
}
function openCorrectPaper(row: PaperList) {
  correctPaperRef.value.openDialog(row.paperId)
}
/**
 * 编辑点击
 */
function handleUpdate(row: PaperList) {
  // getQuestionDetail(row.questionId).then(({ data }) => {
  //   inputQuestionRef.value.openDialog('edit',selectQuestionOperate(data.question))
  // });
}
/**打开预览弹窗 */
function handleViewPaper(row: PaperList) {
  // 获取试卷详细信息
  getPaperDetailApi(row.paperId).then(({ data }) => {
    // 排序
    data.paper.questions = sortQuestionList(data.paper.questions);
    // 选择题特殊处理
    data.paper.questions = data.paper.questions.map(v => selectQuestionOperate(v));
    state.examPaperDetail = data.paper;
    state.viewPaperDialog = true;
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
function handleDelete(row: PaperList = {} as PaperList) {
  const ids = [row.paperId || state.ids].join(',');
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
  // 获取教师选择器数据
  getAllTeacher().then(({ data }) => {
    state.teacherList = data.teacherOptions;
  });
  getTreeData();
});
</script>
