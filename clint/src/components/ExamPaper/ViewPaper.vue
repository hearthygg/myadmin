<template>
  <div v-if="props.paperDetail.questions.length > 0">
    <el-row :gutter="15">
      <el-col :span="4">
        <div id="card-content">
          <div v-if="sideTipVisible" class="tipsArea">
            <el-card class="card-box mini-card">
              <template #header>
                <div class="text-xl font-bold text-gray-600 mb-2 flex items-center justify-between">
                  <span>答题卡</span>
                  <!-- <el-button @click="sideTipVisible = false" type="primary" size="small" plain><i class="iconfont icon-youjiantou"></i></el-button> -->
                </div>
              </template>
              <div class="card-body">
                <div v-for="item in questionStore.questionTypesOption" :key="item.key">
                  <div class="select" v-if="isShow(props.paperDetail.questions, item.key)">
                    <p class="text-xl font-bold text-gray-600 mb-2">{{ item.value }}</p>
                    <span v-for="(val, index) in props.paperDetail.questions" :key="val.questionId">
                      <el-tag v-if="val.questionType === item.key && props.paperType == 'view'" class="mx-2 my-2 cursor-pointer" @click="gotoTop(`question${val.questionId}`)">{{ indexFillZerp(index + 1) }}</el-tag>
                      <el-tag :type="isFinish(val.answer)" v-if="val.questionType === item.key && props.paperType == 'exam'" class="mx-2 my-2 cursor-pointer" @click="gotoTop(`question${val.questionId}`)">{{
                        indexFillZerp(index + 1)
                      }}</el-tag>
                    </span>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div v-else class="hidearea text-2xl">
            <el-button @click="sideTipVisible = true" type="primary" size="small" plain><i class="iconfont icon-shuangxianzuojiantou"></i></el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <el-card>
          <template #header>
            <!-- <div class="text-2xl font-bold text-gray-600 text-center mb-2">{{ props.paperDetail.paperTitle }}</div> -->
            <el-row class="text-xl font-bold text-gray-600" :gutter="20">
              <!-- <el-col class="mb-2" :span="8">
                <span>命题人：</span>
                <span>{{ props.paperDetail.paperStaffName }}</span>
              </el-col>
              <el-col :span="8">
                <span>开始时间：</span>
                <span>{{ props.paperDetail.paperStartTime }}</span>
              </el-col>
              <el-col :span="8">
                <span>结束时间：</span>
                <span>{{ props.paperDetail.paperEndTime }}</span>
              </el-col> -->
              <el-col :span="8">
                <span>考试时长：</span>
                <span>{{ props.paperDetail.paperExamTime }}分钟</span>
              </el-col>
              <el-col :span="8">
                <span>总题数：</span>
                <span>{{ props.paperDetail.paperTotalCount }}道</span>
              </el-col>
              <el-col :span="8">
                <span>总分数：</span>
                <span>{{ props.paperDetail.paperTotalScore }}分</span>
              </el-col>
            </el-row>
          </template>
          <div class="question-body">
            <div v-for="item in questionStore.questionTypesOption" :key="item.key">
              <div class="select" v-if="isShow(props.paperDetail.questions, item.key)">
                <!-- <p class="text-2xl font-bold text-gray-600 mb-2">{{ item.value }}</p> -->
                <div :class="val.questionType === item.key ? 'mt-2' : ''" class="flex align-baseline" v-for="(val, index) in props.paperDetail.questions" :key="val.questionId">
                  <span :id="`question${val.questionId}`" v-if="val.questionType === item.key" class="text-xl font-bold text-gray-600 mr-2">{{ index + 1 }}.</span>
                  <ViewQuestion :paper-type="props.paperType" v-if="val.questionType === item.key" :question-detail="val"></ViewQuestion>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import ViewQuestion from '@/components/ExamPaper/QuestionDetail.vue';
import { PropType, ref } from 'vue';
import { QuestionForm } from '@/api/question/types';
import { useQuestionStore } from '@/store/modules/question';
import { ExamPaperDetail } from '@/api/examPaper/types';
// 试题store数据
const questionStore = useQuestionStore();
const props = defineProps({
  paperDetail: {
    type: Object as PropType<ExamPaperDetail>,
    default: () => {
      return {} as ExamPaperDetail;
    }
  },
  paperType: {
    type: String,
    default: 'view'
  }
});
// 侧边提示栏是否显示
const sideTipVisible = ref(true);
// 控制是否显示题目类型相关标题
function isShow(data: QuestionForm[], type: number) {
  if (data.filter(i => i.questionType == type).length > 0) {
    return true;
  } else {
    return false;
  }
}
// 跳转到对应的题目
function gotoTop(selector: string) {
  //将所选的题目区域跳转到顶部
  if (document.getElementById(selector)) {
    document.getElementById(selector)?.scrollIntoView(true);
  }
}
// 数字补零
function indexFillZerp(index: number) {
  // padStart()接收两个参数 第一个是目标字符串长度,第二个是不足长度填充的字符
  const maxLength = props.paperDetail.questions.length.toString().length;
  return index.toString().padStart(maxLength, '0');
}
// 判断试题是否完成
function isFinish(answer: string[]) {
  if (answer.length === 0 || answer.includes('')) {
    return 'info';
  } else {
    return '';
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
#card-content {
  .tipsArea {
    // width: 350px;
    // position: fixed;
    // top: 56px;
    // right: 6px;
  }
  .hidearea {
    // width: 60px;
    // position: fixed;
    // top: 56px;
    // right: 6px;
  }
  .card-body {
    height: calc(100vh - 265px);
    // overflow-y: scroll;
    // @include scrollBar;
  }
}
.question-body {
  height: calc(100vh - 265px);
  overflow-y: scroll;
  @include scrollBar;
}
</style>
