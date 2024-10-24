<template>
  <div class="fullDialog" id="dialog-nopadding">
    <el-dialog :title="state.paperDialog.title" v-model="state.paperDialog.visible" :fullscreen="true">
      <div class="sys-container">
        <el-row class="w-full">
          <el-col :span="4">
            <div class="search-container">
              <el-form ref="queryFormRef" class="searchForm" :model="state.paperForm" :rules="state.rules" :inline="true" label-position="top">
                <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">基础信息</div>
                <el-form-item label="试卷标题：" prop="paperTitle">
                  <el-input v-model="state.paperForm.paperTitle" placeholder="试卷标题"></el-input>
                </el-form-item>
                <el-form-item label="时间提示：" prop="timeRemind">
                  <el-input @keydown="handleKeyDown" @input="handleInput" v-model="state.paperForm.timeRemind" placeholder="时间提示例如30;20;10"></el-input>
                </el-form-item>
                <el-form-item label="有效日期：" prop="paperStartTime">
                  <el-date-picker v-model="state.paperForm.paperStartTime" value-format="x" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
                <el-form-item label="考试时长(分)" prop="paperExamTime">
                  <el-input-number placeholder="90" class="w-full" v-model="state.paperForm.paperExamTime" :step="1" step-strictly controls-position="right" :min="1" />
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="table-container" style="overflow: auto">
              <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
                <div class="table-total">配置参数</div>
                <div class="flex justify-between items-center">
                  <el-button @click="addPaperOption" type="success"> <i class="iconfont icon-xinzeng"></i>添加配置</el-button>
                  <el-button @click="resetPaperOption" type="info"> <i class="iconfont icon-zhongzhi"></i>重置配置</el-button>
                  <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
                </div>
              </div>
              <!-- 题干答案等信息 -->
              <el-row :gutter="20">
                <el-col :span="8" v-for="(item, index) in state.paperForm.paperStipulate" :key="index">
                  <el-card class="box-card my-2">
                    <template #header>
                      <div class="flex justify-between items-center">
                        <span class="text-xl font-bold text-gray-600">试题配置项{{ index + 1 }}</span>
                        <el-button @click="removePaperOption(index)" link type="danger"> <i class="iconfont icon-shanchu" style="font-size: 18px !important"></i></el-button>
                      </div>
                    </template>
                    <el-form :ref="setFormRefList(index)" class="searchForm" :model="item" :rules="state.optionRules" :inline="true" label-position="top">
                      <el-form-item label="题目类型：" prop="questionType">
                        <el-select class="w-full" v-model="item.questionType" placeholder="题目类型">
                          <el-option v-for="item1 in questionStore.questionTypesOption" :key="item1.key" :value="item1.key" :label="item1.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="expId" label="课程/实验">
                        <el-cascader class="w-full" placeholder="课程/实验" v-model="item.expId" :options="state.treeData" :props="cascadeProps" filterable></el-cascader>
                      </el-form-item>
                      <el-form-item label="难易程度：" prop="questionLevel">
                        <el-select class="w-full" v-model="item.questionLevel" placeholder="难易程度">
                          <el-option v-for="item1 in questionStore.hardStage" :key="item1.key" :value="item1.key" :label="item1.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="题目分数：" prop="questionScore" class="star">
                        <el-input-number class="w-full" v-model="item.questionScore" :step="1" step-strictly controls-position="right" :min="1" />
                      </el-form-item>
                      <el-form-item label="题目数量：" prop="questionNumber" class="star">
                        <el-input-number class="w-full" v-model="item.questionNumber" :step="1" step-strictly controls-position="right" :min="1" />
                      </el-form-item>
                    </el-form>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.paperDialog.visible = false"><i class="iconfont icon-quxiao"></i>取消</el-button>
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="state.examPaperDetail.paperTitle" v-model="state.viewPaperDialog" :fullscreen="true">
      <ViewPaper :paper-detail="state.examPaperDetail"></ViewPaper>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="state.viewPaperDialog = false"><i class="iconfont icon-quxiao"></i>取消</el-button>
          <el-button type="primary" @click="confirmAddPaper"><i class="iconfont icon-queding"></i>确定</el-button>
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
import { ExamPaperDetail, ExamPaperForm } from '@/api/examPaper/types';
import { addExamPaperApi, confirmAddPaperApi } from '@/api/examPaper';
import { selectQuestionOperate } from '@/utils/commonMethods';
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
  //单校验规则
  rules: {
    paperTitle: [{ required: true, message: '请输入试卷标题', trigger: 'blur' }],
    paperExamTime: [{ required: true, message: '请输入考试时长', trigger: 'blur' }],
    timeRemind: [{ required: true, message: '请输入时间提示', trigger: 'blur' }],
    paperStartTime: [{ required: true, message: '请输入有效日期', trigger: 'change' }]
  },
  optionRules: {
    questionType: [{ required: true, message: '请选择试题类型', trigger: 'change' }],
    expId: [{ required: true, message: '请选择课程/实验', trigger: 'change' }],
    questionLevel: [{ required: true, message: '请选择试题难易程度', trigger: 'change' }],
    questionScore: [{ required: true, message: '请输入题目分数', trigger: 'blur' }],
    questionNumber: [{ required: true, message: '请输入题目数量', trigger: 'blur' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  // 新增试卷表单
  paperForm: {
    paperStipulate: [JSON.parse(JSON.stringify(AddExamPaperItem)), JSON.parse(JSON.stringify(AddExamPaperItem)), JSON.parse(JSON.stringify(AddExamPaperItem))]
  } as unknown as ExamPaperForm,
  // 课程-实验树形数据
  treeData: [] as TreeDataList[],
  // 外层弹窗控制组件
  paperDialog: {
    type: 'add',
    title: '新增试卷',
    visible: false
  },
  // 试题配置项表单对象
  FormRefList: [] as any,
  viewPaperDialog: false,
  // 试题详细信息
  examPaperDetail: {} as ExamPaperDetail
});

// 动态获取试卷配置项设置
function setFormRefList(index: number) {
  return function (el: any) {
    state.FormRefList[index] = el;
  };
}

/**时间提示限制输入 */
function handleKeyDown(event: any) {
  if (event.key === 'Enter') {
    event.preventDefault(); // 阻止默认的 Enter 键行为
    // 避免两个分号连接在一起的情况的
    if (state.paperForm.timeRemind.split(';').includes('')) return;
    state.paperForm.timeRemind += ';'; // 追加分号表示区间结束
  }
}
function handleInput() {
  // 移除非数字字符
  state.paperForm.timeRemind = state.paperForm.timeRemind.replace(/[^\d;]/g, '');
}
/**获取课程-实验树形数据 */
function getTreeData() {
  getLessonAndExpOptions().then(({ data }) => {
    state.treeData = data.lessonAndExpOptions;
  });
}
/**
 * 提交新增试卷请求
 */
async function handleSubmit() {
  let count = 0;
  // 基本信息表单校验
  await new Promise<void>(resolve => {
    queryFormRef.value.validate((valid: any) => {
      if (valid) {
        resolve();
      }
    });
  });
  // 详细信息表单校验
  // 等所有的表单子项都校验成功
  await Promise.all(
    state.paperForm.paperStipulate.map(async (i, index) => {
      await new Promise<void>(resolve => {
        state.FormRefList[index].validate((valid: any) => {
          if (valid) {
            count++;
          }
          resolve();
        });
      });
    })
  );
  if (count === state.paperForm.paperStipulate.length) {
    // 新增试卷请求
    const tempData = preSubmitOperate();
    state.examPaperDetail = { ...tempData, paperStaffName: userStore.nickname, questions: [] };
    addExamPaperApi(tempData).then(({ data }) => {
      state.examPaperDetail.questions = sortQuestionList(data.questions);
      // 选择题特殊处理
      state.examPaperDetail.questions = state.examPaperDetail.questions.map(v => selectQuestionOperate(v));
      ElMessage.success('操作成功！点击确定生成当前试卷,点击取消取消生成当前试卷');
      state.viewPaperDialog = true;
    });
  }
}

// 添加试题配置参数
function addPaperOption() {
  state.paperForm.paperStipulate.splice(state.paperForm.paperStipulate.length, 0, JSON.parse(JSON.stringify(AddExamPaperItem)));
}
// 重置试题配置参数
function resetPaperOption() {
  state.paperForm.paperStipulate.splice(0, state.paperForm.paperStipulate.length, JSON.parse(JSON.stringify(AddExamPaperItem)));
}
// 删除试题配置参数
function removePaperOption(index: number) {
  if (state.paperForm.paperStipulate.length > 1) {
    state.paperForm.paperStipulate.splice(index, 1);
    // state.FormRefList.splice(state.paperForm.paperStipulate.length - 1, 1);
  } else {
    ElMessage.error('至少保留一个配置项');
  }
}
// 提交数据前的处理
function preSubmitOperate() {
  let tempObj = JSON.parse(JSON.stringify(state.paperForm)) as ExamPaperForm;
  tempObj.paperEndTime = formatUsuallyTime(tempObj.paperStartTime[1] as any);
  tempObj.paperStartTime = formatUsuallyTime(tempObj.paperStartTime[0] as any);
  tempObj.paperTotalScore = 0;
  tempObj.paperTotalCount = 0;
  tempObj.paperStipulate.forEach(v => {
    v.lessonId = v.expId[0];
    v.expId = v.expId[1];
    tempObj.paperTotalScore += (v.questionScore as number) * v.questionNumber;
    tempObj.paperTotalCount += v.questionNumber;
  });
  tempObj.paperStaffId = userStore.userId as number;
  return tempObj;
}
// 确定生成试卷
function confirmAddPaper() {
  const tempData = preSubmitOperate();
  tempData.questionPaperInfos = [];
  state.examPaperDetail.questions.forEach(v => {
    tempData.questionPaperInfos?.push({
      questionId: v.questionId as string,
      questionScore: v.score,
      expId: v.lessonInfo?.expId as number
    });
  });
  confirmAddPaperApi(tempData).then(() => {
    ElMessage.success('生成试卷成功');
    state.viewPaperDialog = false;
    state.paperDialog.visible = false;
    emit('refresh');
  });
}
// 开启弹窗
function openDialog() {
  state.paperDialog.visible = true;
}
const emit = defineEmits(['refresh']);
onMounted(() => {
  getTreeData();
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
    height: calc(100vh - 116px) !important;
  }
  .table-container {
    @include scrollBar;
  }
}
</style>
