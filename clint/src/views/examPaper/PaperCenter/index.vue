<template>
  <div class="list-adapt-container layout-pd">
    <el-card class="container-card">
      <template #header>
        <div class="header-search">
          <span class="header-title">试卷列表</span>
          <el-input v-model="state.queryParams.paperKeyWord" size="small" placeholder="请输入试卷标题">
            <template #append>
              <el-button @click="handleQuery"><i class="iconfont icon-sousuo"></i></el-button>
            </template>
          </el-input>
        </div>
      </template>
      <div class="flex-warp">
        <el-row :gutter="15" class="w-full">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mb-5" v-for="(v, k) in state.paperList" :key="k">
            <el-card class="paper-card">
              <template #header>
                <div class="flex justify-between items-center">
                  <span>{{ v.paperTitle }}</span>
                  <el-button type="primary" link @click="handleViewPaper(v.paperId)">开始考试<i class="iconfont icon-fabu1 ml-2"></i></el-button>
                </div>
              </template>
              <el-descriptions :column="1" :border="true">
                <el-descriptions-item>
                  <template #label>
                    <span>试卷总分</span>
                  </template>
                  <span>{{ v.paperTotalScore }}分</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <span>试卷总题</span>
                  </template>
                  <span>{{ v.paperTotalCount }}道</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <span>考试时长</span>
                  </template>
                  <span>{{ v.paperExamTime }}分钟</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <span>开始时间</span>
                  </template>
                  <span>{{ v.paperStartTime }}</span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <span>结束时间</span>
                  </template>
                  <span>{{ v.paperEndTime }}</span>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>
        <el-empty class="mx-auto" v-if="state.paperList.length === 0" description="暂无数据"></el-empty>
      </div>
      <div class="paginationarea bg-[#F9F9F9] rounded-lg p-3.5 flex justify-between items-center">
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
    </el-card>
    <!-- 开始考试弹窗 -->
    <div class="fullDialog">
      <el-dialog :title="state.examPaperDetail.paperTitle" v-model="state.viewPaperDialog" @close="dialogClose" :fullscreen="true">
        <div class="text-2xl text-red-500 showTimer">{{ formatSeconds(state.remainTime) }}</div>
        <ViewPaper :paper-detail="state.examPaperDetail" paper-type="exam"></ViewPaper>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="submitPaperResult"><i class="iconfont icon-queding"></i>提交</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts" name="pagesListAdapt">
import { onMounted, reactive } from 'vue';
import ViewPaper from '@/components/ExamPaper/ViewPaper.vue';
import { ExamPaperDetail, PaperList, PaperListQuery, UserPaperRes, UserPaperSubmit } from '@/api/examPaper/types';
import { getPaperDetailApi, getUserPaperListApi, submitPaperResApi } from '@/api/examPaper';
import { sortQuestionList } from '@/utils/sort';
import { selectQuestionOperate } from '@/utils/commonMethods';
import { Question, SelectQuestionEnum } from '@/api/question/types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatSeconds } from '@/utils/formatTime';
// 定义变量内容
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    paperPublish: 2
  } as PaperListQuery,
  // 表格数据
  paperList: [] as PaperList[],
  // 总数
  total: 0,
  // 进入考试弹窗
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  viewPaperDialog: false,
  // 试题详细信息
  examPaperDetail: {} as ExamPaperDetail,
  // 倒计时计时器
  timer: null as any,
  // 倒计时秒数
  remainTime: 0
});
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getUserPaperListApi(state.queryParams).then(({ data }) => {
    state.paperList = data.papers;
    state.total = data.total;
    state.loading = false;
  });
}
/**打开答题弹窗 */
function handleViewPaper(paperId: string) {
  // 获取试卷详细信息
  getPaperDetailApi(paperId).then(({ data }) => {
    // 排序
    data.paper.questions = sortQuestionList(data.paper.questions);
    // 选择题特殊处理
    data.paper.questions = data.paper.questions.map(v => selectQuestionOperate(v));
    // 填空题动态生成填空个数
    data.paper.questions.forEach(v => {
      if (v.questionType === Question.TK) {
        v.answer = [];
        // 通过正则读取题干有几个特殊标志动态读取填空题的填空数
        const regex = /___\((\d+)\)___/g;
        const matches = v.question.match(regex);
        const count = matches ? matches.length : 0;
        for (let i = 0; i < count; i++) {
          v.answer.push('');
        }
      }
    });
    // 获取倒计时 单位秒
    state.remainTime = parseInt(data.paper.paperExamTime) * 60;
    state.examPaperDetail = data.paper;
    state.viewPaperDialog = true;
    timeReduce();
  });
}
// 关闭弹窗并且清楚定时器
function dialogClose() {
  state.dialog.visible = false;
  // 记得清楚定时器
  clearInterval(state.timer);
}
// 提交试卷
function submitPaperResult() {
  clearInterval(state.timer);
  const tipsArray = state.examPaperDetail.questions.filter(item => item.answer.includes('') || item.answer.length === 0);
  if (tipsArray.length == 0 || state.remainTime <= 0) {
    // 题目都做完了或者考试时间到了
    ElMessage.success('考试结束,考试结果已经自动提交！');
    operatePaperResult();
  } else {
    // 还有一些题目没有完成做一些适当的提醒
    ElMessageBox.confirm(`还有${tipsArray.length}道题目没有做完,确定提交吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      ElMessage.success('考试结束,考试结果已经自动提交！');
      operatePaperResult();
    });
  }
}
// 提交考试结果
function operatePaperResult() {
  // 数据处理
  const result = {
    studentSubmitInfos: [] as UserPaperSubmit[]
  } as UserPaperRes;
  result.paperId = state.examPaperDetail.paperId;
  state.examPaperDetail.questions.map(v => {
    let temObj = {
      answer: v.answer,
      questionId: v.questionId,
      score: v.score
    } as UserPaperSubmit;
    if (v.questionType === Question.DanX || v.questionType === Question.DuoX) {
      //选择题 保存的是选项id
      temObj.optionIds = [];
      v.answer.map(item => {
        temObj.optionIds?.push(v.questionOptions[SelectQuestionEnum[item] - 1].optionId as string);
      });
    }
    result.studentSubmitInfos?.push(temObj);
  });
  submitPaperResApi(result).then(() => {
    ElMessage.success('试卷提交成功！');
  });
}
// 实现倒计时效果
function timeReduce() {
  state.timer = setInterval(function () {
    state.examPaperDetail.timeRemind.split(';').map(item => {
      if (!isNaN(parseInt(item))) {
        if (parseInt(item) * 60 == state.remainTime) {
          ElMessage.warning(`距离考试结束还有${item}分钟！`);
        }
      }
    });
    // 时间结束自动提交考试结果
    if (state.remainTime == 0) {
      submitPaperResult();
    } else {
      // 倒计时
      --state.remainTime;
    }
  }, 1000);
}
onMounted(() => {
  handleQuery();
});
</script>

<style scoped lang="scss">
@import '@/styles/mixin.scss';
.showTimer {
  position: fixed;
  top: 93px;
  z-index: 99999;
  right: 40px;
}
.paper-detail {
  .tag-title {
    font-size: 15px;
    // font-weight: bold;
    color: #303133;
  }
  .tag-content {
    font-size: 15px;
    color: #606266;
  }
}
.header-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title {
    font-size: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
  }
  :deep(.el-input) {
    width: 250px;
  }
}

.flex-warp {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  height: calc(100vh - 225px);
  overflow-y: auto;
  overflow-x: hidden;
  @include scrollBar;
  margin: 0 -5px;
  padding: 15px;
}
</style>
<style lang="scss">
.container-card {
  border-radius: 10px;
  height: calc(100vh - 105px);
  border: 1px solid #f9f9f9;

  .el-card__header {
    background-color: #f9f9f9;
    font-size: 18px;
    font-weight: bold;
    color: #909399;
    padding: 15px 20px;
  }
  .el-card__body {
    // background: #EFF6FF;
    padding: 0;
  }
}
.paper-card {
  border-radius: 10px;
  height: 248px;
  // min-width: 280px;
  // max-width: 400px;
  .el-card__header {
    background-color: #eff6ff;
    font-size: 16px;
    font-weight: bold;
    color: #6b7280;
    padding: 10px 15px;
  }
  .el-card__body {
    // padding: 10px 15px;
    padding: 0;
  }
  .el-descriptions__label {
    width: 80px;
  }
}
</style>
