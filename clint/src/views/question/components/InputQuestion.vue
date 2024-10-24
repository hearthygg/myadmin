<template>
  <div class="fullDialog">
    <el-dialog :title="state.questionDialog.title" v-model="state.questionDialog.visible" :fullscreen="true">
      <div class="sys-container">
        <el-row class="w-full">
          <el-col :span="4">
            <div class="search-container">
              <el-form ref="queryFormRef" class="searchForm" :model="state.questionForm" :rules="state.rules" :inline="true" label-position="top">
                <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">基本信息</div>
                <el-form-item label="题目类型：" prop="questionType">
                  <el-select :disabled="state.questionDialog.type === 'edit'" @change="selectOptionChange(state.questionForm.questionType)" class="w-full" v-model="state.questionForm.questionType" placeholder="题目类型" clearable>
                    <el-option v-for="item in questionStore.questionTypesOption" :key="item.key" :value="item.key" :label="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="难易程度：" prop="questionLevel">
                  <el-select class="w-full" v-model="state.questionForm.questionLevel" placeholder="难易程度" clearable>
                    <el-option v-for="item in questionStore.hardStage" :key="item.key" :value="item.key" :label="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="课程/实验" prop="expIds">
                  <el-cascader class="w-full" placeholder="请选择课程/实验" v-model="state.questionForm.expIds" filterable collapse-tags :options="state.treeData" :props="cascadeProps"></el-cascader>
                </el-form-item>
                <el-form-item label="题目分数：" prop="score">
                  <el-input-number class="w-full" v-model="state.questionForm.score" :step="1" step-strictly controls-position="right" :min="1" />
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="table-container" style="overflow: auto">
              <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
                <div class="table-total">题目详情</div>
                <div class="flex justify-between items-center">
                  <!-- 引导页面 -->
                  <el-button @click="state.viewDialogVisible = true" type="primary"> <i class="iconfont icon-shujuyulan"></i>预览</el-button>
                  <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
                </div>
              </div>
              <!-- 题干答案等信息 -->
              <el-form ref="questionFormRef" class="searchForm" :model="state.questionForm" :rules="state.rules" :inline="true" label-position="top">
                <el-form-item label="题干：" prop="question">
                  <el-input @focus="inputClick(state.questionForm.question, 'question', '题干：')" v-model="state.questionForm.question" placeholder="题干" />
                </el-form-item>
                <!-- 选项 -->
                <el-form-item class="options" label="选项：" prop="questionOptions" v-if="state.questionForm.questionType == Question.DanX || state.questionForm.questionType == Question.DuoX">
                  <el-input
                    @focus="inputClick(state.questionForm.questionOptions[index].optionText, 'questionOptions', `选择题选项${item}：`, index as any)"
                    class="mb-3"
                    v-for="(item, index) in state.selectOptions"
                    :key="index"
                    :class="(index + 1) % 2 == 0 ? 'changecolor' : ''"
                    v-model="state.questionForm.questionOptions[index].optionText"
                  >
                    <template #prepend>
                      <span>({{ item }})</span>
                    </template>
                  </el-input>
                  <div class="btn-box">
                    <el-button @click="addOptions" link type="primary"> <i class="iconfont icon-xinzeng"></i>增加选项 </el-button>
                    <el-button @click="deleteOptions" link type="danger"> <i class="iconfont icon-shanchu"></i>删除选项 </el-button>
                  </div>
                </el-form-item>
                <el-form-item label="解析：" prop="questionAnalysis">
                  <el-input @focus="inputClick(state.questionForm.questionAnalysis, 'questionAnalysis', '解析：')" v-model="state.questionForm.questionAnalysis" placeholder="解析" />
                </el-form-item>
                <!-- 正确答案 -->
                <!-- 单选 -->
                <el-form-item v-if="state.questionForm.questionType == Question.DanX" label="正确答案：" prop="answer">
                  <el-radio-group v-model="state.questionForm.answer[0]">
                    <el-radio v-for="(item, index) in state.selectOptions" :key="index" :label="item">{{ item }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- 多选 -->
                <el-form-item v-if="state.questionForm.questionType == Question.DuoX" label="正确答案：" prop="answer">
                  <el-checkbox-group v-model="state.questionForm.answer">
                    <el-checkbox v-for="(item, index) in state.selectOptions" :key="index" :label="item">{{ item }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <!-- 填空 -->
                <el-form-item v-if="state.questionForm.questionType == Question.TK" label="正确答案：" prop="answer">
                  <el-input
                    @focus="inputClick(state.questionForm.answer[index], 'answer', `填空正确答案(${index + 1})：`, index as any, 'subjectivity')"
                    class="mb-3"
                    :class="(index + 1) % 2 == 0 ? 'changecolor' : ''"
                    v-for="(item, index) in tkAnswerLength"
                    :key="index"
                    v-model="state.questionForm.answer[index]"
                  >
                    <template #prepend>
                      <span>({{ index + 1 }})</span>
                    </template>
                  </el-input>
                </el-form-item>
                <!-- 判断 -->
                <el-form-item v-if="state.questionForm.questionType == Question.PD" label="正确答案：" prop="answer">
                  <el-radio-group v-model="state.questionForm.answer[0]">
                    <el-radio :label="1">对</el-radio>
                    <el-radio :label="2">错</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- 其他主观题 -->
                <el-form-item v-if="state.questionForm.questionType > 3 && state.questionForm.questionType !== Question.DuoX" label="正确答案：" prop="answer">
                  <el-input v-model="state.questionForm.answer[0]" @focus="inputClick(state.questionForm.answer[0], 'answer', '正确答案：', 0 as any, 'subjectivity')"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.questionDialog.visible = false"><i class="iconfont icon-quxiao"></i>取消</el-button>
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- 题目相关富文本弹窗 -->
  <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="60%" @close="closeDialog">
    <editor ref="currentEdit" v-model="state.textEditer.content" file-type="questionType" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="editSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
        <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 预览试题弹窗 -->
  <el-dialog title="预览试题" v-model="state.viewDialogVisible">
    <ViewQuestion :question-detail="state.questionForm"></ViewQuestion>
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import ViewQuestion from '@/components/ExamPaper/QuestionDetail.vue';
import { getGuideData } from '@/components/Guide/guideData';
import { getLessonAndExpOptions } from '@/api/course';
import { inputQuestionApi, updateQuestion } from '@/api/question';
import { Question, QuestionForm, SelectQuestionEnum } from '@/api/question/types';
import { useQuestionStore } from '@/store/modules/question';
import Editor from '@/components/WangEditor/index.vue';
// 试题基本信息表单对象
const queryFormRef = ref(ElForm);
// 试题详细信息表单对象
const questionFormRef = ref(ElForm);
// 试题store数据
const questionStore = useQuestionStore();
// 富文本组件对象
const currentEdit = ref();
// 级联选择器配置
const cascadeProps = { expandTrigger: 'hover', multiple: true };
// 响应式数据
const state = reactive({
  // 增加/编辑弹框状态
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  // 增加/编辑表单校验规则
  rules: {
    questionType: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
    questionLevel: [{ required: true, message: '请选择难易程度', trigger: 'change' }],
    expIds: [{ required: true, message: '请选择课程/实验', trigger: 'change' }],
    // cascaderData: [{ required: true, validator: validateCourse, trigger: 'blur' }],
    score: [{ required: true, message: '请输入题目分数', trigger: 'blur' }],
    question: [{ required: true, message: '请输入题干', trigger: 'change' }],
    answer: [{ required: true, validator: validateAnswer, trigger: 'change' }],
    questionOptions: [{ required: true, validator: validateOptions, trigger: 'change' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  questionForm: {
    answer: [],
    questionLevel: null,
    questionType: null,
    score: 1,
    question: '',
    questionAnalysis: '',
    questionOptions: [],
    expIds: []
  } as unknown as QuestionForm,
  // 富文本
  textEditer: {
    // 内容
    content: '',
    // 映射表单键
    pathName: '',
    // 选择题选项特殊处理
    selectOptions: '',
    // 类型
    type: ''
  },
  // 选择题选项数据
  selectOptions: ['A', 'B', 'C', 'D'],
  // 课程-实验树形数据
  treeData: [] as TreeDataList[],
  // 外层弹窗控制组件
  questionDialog: {
    type: 'add',
    title: '新增试题',
    visible: false
  },
  // 预览试题弹窗状态
  viewDialogVisible: false
});

// 校验相关数据
// 校验正确答案
function validateAnswer(rule: any, value: any, callback: any) {
  if (state.questionForm.answer.includes('') || state.questionForm.answer.length == 0) {
    callback(new Error(`答案不能为空！`));
  } else {
    callback();
  }
}
// 校验选择题选项
function validateOptions(rule: any, value: any, callback: any) {
  let tempIndex = state.questionForm.questionOptions.findIndex(v => v.optionText === '');
  if (tempIndex !== -1) {
    callback(new Error(`选项不能为空！`));
  } else {
    callback();
  }
}

// 动态获取填空几个空的长度
// 动态修改正确答案数组长度
const tkAnswerLength = computed(() => {
  const regex = /___\((\d+)\)___/g;
  const matches = state.questionForm.question.match(regex);
  const count = matches ? matches.length : 0;
  return count;
});


/**获取课程-实验树形数据 */
function getTreeData() {
  getLessonAndExpOptions().then(({ data }) => {
    state.treeData = data.lessonAndExpOptions;
  });
}
/**
 * 提交添加试题请求
 */
function handleSubmit() {
  // 基本信息表单校验
  queryFormRef.value.validate((valid: any) => {
    if (valid) {
      // 详细信息表单校验
      questionFormRef.value.validate((questionValid: any) => {
        if (questionValid) {
          // 请求前前置数据处理
          preSubmitOperate();
          if (state.questionDialog.type === 'add') {
            inputQuestionApi(state.questionForm).then(() => {
              ElMessage.success('新增试题成功!');
              // state.questionDialog.visible = false;
              // emit('refresh');
            });
          } else if (state.questionDialog.type === 'edit') {
            updateQuestion(state.questionForm).then(() => {
              ElMessage.success('编辑试题成功!');
              // state.questionDialog.visible = false;
              // emit('refresh');
            });
          }
        }
      });
    }
  });
}

/**
 * 取消
 */
function closeDialog() {
  state.dialog.visible = false;
}

// 选择题增选项 最6个
function addOptions() {
  let length = state.selectOptions.length;
  if (length >= 6) {
    ElMessage.error('选择题最多6个选项');
  } else {
    // 利用ASCII来实现数字和旋钮的映射
    // str.charCodeAt(0)获取str(0)的ASCII编码
    // A 65 B 66 ...
    let addCode = state.selectOptions[length - 1].charCodeAt(0) + 1;
    // fromCharCode() 是一个全局方法，它接受一个或多个 Unicode 值，并将它们转换为相应的字符。
    state.selectOptions.splice(length, 0, String.fromCharCode(addCode));
    state.questionForm.questionOptions.push({
      optionText: '',
      optionCorrect: 2
    });
  }
}
// 选择题删除选项 最少2个
function deleteOptions() {
  let length = state.selectOptions.length;
  if (length <= 2) {
    ElMessage.error('选择题最少需要2个选项');
  } else {
    state.selectOptions.splice(length - 1, 1);
    // 去除选项数据
    state.questionForm.questionOptions.splice(length - 1, 1);
  }
}
// 题目类型发生改变
function selectOptionChange(type: number) {
  resetQuestionForm();
  state.questionForm.questionType = type;
  if (type == Question.DanX || type == Question.DuoX) {
    state.selectOptions = ['A', 'B', 'C', 'D'];
    state.selectOptions.forEach(() => {
      state.questionForm.questionOptions.push({
        optionText: '',
        optionCorrect: 2
      });
    });
  }
  // else if (type == Question.PD) {
  //   state.questionForm.questionOptions.push(
  //     {
  //       optionText: '对',
  //       optionCorrect: 2
  //     },
  //     {
  //       optionText: '错',
  //       optionCorrect: 2
  //     }
  //   );
  // }
}
// 重置问题表单数据
function resetQuestionForm() {
  state.questionForm = {
    answer: [],
    questionLevel: null,
    questionType: null,
    score: 1,
    question: '',
    questionAnalysis: '',
    questionOptions: [],
    expIds: []
  } as unknown as QuestionForm;
}
// 将当前表单内容映射到富文本中
function inputClick(content: string, pathName: string, title: string, selectOptions = '', type = 'objective') {
  state.dialog.visible = true;
  state.dialog.title = title;
  state.textEditer.content = content;
  state.textEditer.pathName = pathName;
  state.textEditer.selectOptions = selectOptions;
  state.textEditer.type = type;
}
// 将富文本内容映射到表单中
function editSubmit() {
  if (state.textEditer.selectOptions !== '') {
    if (state.textEditer.type === 'objective') {
      // 选择题选项
      state.questionForm[state.textEditer.pathName][state.textEditer.selectOptions].optionText = state.textEditer.content;
    } else if (state.textEditer.type === 'subjectivity') {
      // 主观题答案
      state.questionForm[state.textEditer.pathName][state.textEditer.selectOptions] = state.textEditer.content;
    }
  } else {
    state.questionForm[state.textEditer.pathName] = state.textEditer.content;
  }
  closeDialog();
}
// 提交数据前的处理
function preSubmitOperate() {
  // 选择题选项数据映射
  if (state.questionForm.questionType === Question.DanX || state.questionForm.questionType === Question.DuoX) {
    state.questionForm.answer.forEach(v => {
      state.questionForm.questionOptions[SelectQuestionEnum[v] - 1].optionCorrect = 1;
    });
  }
  // 填空题答案和填空映射
  if (state.questionForm.questionType === Question.TK) {
    if (state.questionForm.answer.length > tkAnswerLength.value) {
      // 去除冗余答案
      state.questionForm.answer.splice(tkAnswerLength.value, state.questionForm.answer.length - tkAnswerLength.value);
    }
  }
  // 判断题数据映射
  // if (state.questionForm.questionType === Question.PD) {
  //   // 1 对 2 错
  //   state.questionForm.answer[0] == '1' ? (state.questionForm.questionOptions[0].optionCorrect = 1) : (state.questionForm.questionOptions[1].optionCorrect = 1);
  // }
}
// 开启弹窗
function openDialog(type: string, data?: QuestionForm) {
  if (type === 'edit') {
    // 编辑试题
    if (data) state.questionForm = data;
    state.questionDialog.title = '编辑试题';
    if (state.questionForm.questionType === Question.DanX || state.questionForm.questionType === Question.DuoX) {
      // 选择题选项数据动态变化
      state.selectOptions = [];
      state.questionForm.questionOptions.forEach((v, i) => {
        state.selectOptions.push(String.fromCharCode(65 + i));
      });
    }
    // 映射课程实验数据
    state.questionForm.expIds = [];
    state.questionForm.expForms?.forEach(v => {
      state.questionForm.expIds.push([v.lessonId, v.expId] as any);
    });
  } else if (type === 'add') {
    resetQuestionForm();
    state.questionDialog.title = '新增试题';
  }
  state.questionDialog.type = type;
  state.questionDialog.visible = true;
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
  .sys-container,.search-container,.table-container {
    height: calc(100vh - 156px) !important;
  }
  .table-container {
    @include scrollBar
  }
}
</style>
