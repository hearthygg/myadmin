<template>
  <div class="fullDialog">
    <el-dialog :title="state.paperDialog.title" v-model="state.paperDialog.visible" :fullscreen="true">
      <div class="sys-container">
        <el-row class="w-full">
          <el-col :span="4">
            <div class="search-container">
              <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
                <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
                <el-form-item label="学生姓名：" prop="userName">
                  <el-input v-model="state.queryParams.userName" placeholder="学生姓名"></el-input>
                </el-form-item>
                <el-form-item label="所属班级：" prop="claId">
                  <el-select class="w-full" v-model="state.queryParams.claId" placeholder="所属班级" filterable>
                    <el-option v-for="item in state.classList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="提交状态：" prop="studentSubmitState">
                  <el-select class="w-full" v-model="state.queryParams.studentSubmitState" placeholder="提交状态">
                    <el-option :value="1" label="未提交"></el-option>
                    <el-option :value="2" label="已提交"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="批改状态：" prop="auditState">
                  <el-select class="w-full" v-model="state.queryParams.auditState" placeholder="批改状态">
                    <el-option :value="0" label="未批改"></el-option>
                    <el-option :value="1" label="已批改"></el-option>
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
                <div class="table-total">试卷列表</div>
                <div class="flex justify-between items-center">
                  <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
                </div>
              </div>
              <el-table
                class="tablearea"
                ref="dataTableRef"
                v-loading="state.loading"
                :data="state.paperResList"
                height="calc(100vh - 240px)"
                :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
                :stripe="true"
                :border="true"
                highlight-current-row
              >
                <el-table-column type="selection" width="55" :align="'center'" />
                <el-table-column type="index" label="序号" width="55" :align="'center'" />
                <el-table-column label="学生名称" prop="studentName" show-overflow-tooltip :align="'center'" />
                <el-table-column label="所属班级" prop="claName" show-overflow-tooltip :align="'center'" />
                <el-table-column label="提交状态" show-overflow-tooltip :align="'center'">
                  <template #default="scope">
                    <el-tag :type="scope.row.studentSubmitState === 2 ? 'success' : 'warning'">{{ scope.row.studentSubmitState === 2 ? '已提交' : '未提交' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="批改状态" show-overflow-tooltip :align="'center'">
                  <template #default="scope">
                    <el-tag :type="scope.row.auditState === 1 ? 'success' : 'warning'">{{ scope.row.auditState === 1 ? '已批改' : '未批改' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="220" :align="'center'">
                  <template #default="scope">
                    <el-button type="primary" link @click.stop="handleViewPaper(scope.row)"> <i class="iconfont icon-shujuyulan"></i>预览 </el-button>
                    <el-button type="primary" link @click.stop="handleCorrect(scope.row)"> <i class="iconfont icon-bianji"></i>批改 </el-button>
                  </template>
                </el-table-column>
                <template #empty>
                  <el-empty description="暂无数据" />
                </template>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <div class="paginationarea rounded-lg px-2 flex justify-between items-center">
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
      </template>
    </el-dialog>
    <el-dialog :title="state.examPaperDetail.paperTitle" v-model="state.viewPaperDialog" :fullscreen="true">
      <ViewPaper :paper-detail="state.examPaperDetail"></ViewPaper>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="state.viewPaperDialog = false"><i class="iconfont icon-quxiao"></i>取消</el-button>
          <!-- <el-button type="primary" @click="confirmAddPaper"><i class="iconfont icon-queding"></i>确定</el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import GuideBtn from '@/components/Guide/index.vue';
import ViewPaper from '@/components/ExamPaper/ViewPaper.vue';

import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { Step } from 'intro.js';
import { getGuideData } from '@/components/Guide/guideData';
import { useQuestionStore } from '@/store/modules/question';
import { AddExamPaperItem } from '@/utils/staticData';
import { useUserStore } from '@/store/modules/user';
import { formatUsuallyTime } from '@/utils/formatTime';
import { sortQuestionList } from '@/utils/sort';
import { getLessonAndExpOptions } from '@/api/course';
import { ExamPaperDetail, ExamPaperForm, PaperResDetail, PaperResListQuery } from '@/api/examPaper/types';
import { addExamPaperApi, confirmAddPaperApi, getPaperResListApi } from '@/api/examPaper';
import { selectQuestionOperate } from '@/utils/commonMethods';
import { getAllClass } from '@/api/class';
// 试题基本信息表单对象
const queryFormRef = ref(ElForm);
// 试题store数据
const questionStore = useQuestionStore();
// 用户store数据
const userStore = useUserStore();
// 级联选择器配置
const cascadeProps = { expandTrigger: 'hover' };
// 响应式数据
const state = reactive({
  // 引导页相关数据
  guideArr: [] as Step[],
  // 表格刷新动画
  loading: true,
  total: 0,
  // 条件查询
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    paperId: ''
  } as PaperResListQuery,
  // 批改列表数据
  paperResList: [] as PaperResDetail[],
  // 外层弹窗控制组件
  paperDialog: {
    type: 'add',
    title: '批改试卷',
    visible: false
  },
  // 试题配置项表单对象
  FormRefList: [] as any,
  viewPaperDialog: false,
  // 试题详细信息
  examPaperDetail: {} as ExamPaperDetail,
  // 班级列表
  classList: [] as SelectOptionType[]
});

/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getPaperResListApi(state.queryParams).then(({ data }) => {
    state.paperResList = data.studentInfos;
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
/**预览考试结果 */
function handleViewPaper(row: PaperResDetail) {}
/**批改考试结果 */
function handleCorrect(row: PaperResDetail) {}
// 开启弹窗
function openDialog(paperId: string) {
  state.queryParams.paperId = paperId;
  state.paperDialog.visible = true;
  handleQuery();
}
const emit = defineEmits(['refresh']);
onMounted(() => {
  getAllClass().then(({ data }) => {
    state.classList = data.claOptions;
  });
  // 设置引导页相关数据
  state.guideArr = getGuideData('course') as Step[];
});
defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.fullDialog {
  .sys-container,
  .search-container,
  .table-container {
    height: calc(100vh - 156px) !important;
  }
  .table-container {
    @include scrollBar;
  }
}
</style>
