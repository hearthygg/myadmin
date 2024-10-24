<!-- 实验报告设置 -->
<template>
  <div class="w-full" id="examReport">
    <div class="text-right">
      <el-switch v-model="state.isShowView" active-text="预览" inactive-text="编辑"> </el-switch>
    </div>
    <div class="report-container">
      <!-- 编辑实验报告 -->
      <template v-if="!state.isShowView">
        <el-form v-for="(item, index) in state.examReportData" :key="index" ref="dataFormRef" :model="item" label-width="80px" label-position="left">
          <el-card class="examReportCard mb-5">
            <template #header>
              <div class="flex items-center justify-between">
                <span class="text-2xl">题目{{ index + 1 }}</span>
                <div>
                  <el-button v-if="index === state.examReportData.length - 1" @click="addReportItem" type="primary" link> <i class="iconfont icon-bianji"></i>新增 </el-button>
                  <el-button @click="deleteReportItem(index)" type="danger" link> <i class="iconfont icon-shanchu"></i>删除 </el-button>
                </div>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="题干">
                  <el-input @focus="inputClick(item.stem, 'stem', '题干', index)" v-model="item.stem" placeholder="请输入题干" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="border-bottom: 1px solid #e4e7ed" :gutter="20" v-for="(item1, index1) in item.answerOptions" :key="index1">
              <el-col :span="12">
                <el-form-item :label="`(${index1 + 1}). 答题类型`" class="mt-5" label-width="120px">
                  <el-select class="w-full" v-model="item1.answerType" placeholder="请选择答题类型" filterable>
                    <el-option v-for="val in state.answerTypeOptions" :value="val.value" :label="val.label" :key="val.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="mt-5">
                <el-form-item label="填空增减">
                  <el-button v-if="index1 === item.answerOptions.length - 1" @click="addAnswerItem(index)" type="primary" link> <i class="iconfont icon-zhankai"></i>新增 </el-button>
                  <el-button @click="deleteAnswerItem(index, index1)" type="danger" link> <i class="iconfont icon-shouqi"></i>删除 </el-button>
                  <el-button @click="pasteAnswerItem(index, index1)" type="success" link> <i class="iconfont icon-zhankai"></i>复制粘贴 </el-button>
                </el-form-item>
              </el-col>
              <!-- 数据采集的填空特殊标记 -->
              <template v-if="item1.answerType === '1'">
                <el-col :span="12" class="mt-5">
                  <el-form-item label="采集类型">
                    <el-select class="w-full" v-model="item1.collectionType" placeholder="请选择数据采集类型" filterable>
                      <el-option v-for="val in state.collectionTypeOptions" :value="val.value" :label="val.label" :key="val.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="mt-5">
                  <el-form-item label="数据类型">
                    <el-select class="w-full" v-model="item1.dataType" placeholder="请选择提交数据类型" filterable>
                      <el-option v-for="val in state.dataTypeOptions" :value="val.value" :label="val.label" :key="val.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </template>
              <el-col :span="12" class="my-5">
                <el-form-item label="正确答案">
                  <el-input @focus="inputClick(item1.trueResult, 'trueResult', '正确答案', index, index1)" v-model="item1.trueResult" placeholder="请输入正确答案" />
                </el-form-item>
              </el-col>
              <el-col :span="12" class="my-5">
                <el-form-item label="分数">
                  <el-input-number v-model="item1.core" :step="1" step-strictly controls-position="right" :min="0" :max="100" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
      </template>
      <!-- 预览实验报告 -->
      <template v-else>
        <examReportDetail v-if="state.examReportData.length > 0" :exam-report-data="state.examReportData"></examReportDetail>
      </template>
    </div>
    <!-- 富文本与输入框相互映射 -->
    <el-dialog destroy-on-close :title="state.editerDialog.title" v-model="state.editerDialog.visible" width="60%" @close="closeEditorDialog">
      <editor ref="currentEdit" v-model="state.textEditer.content" :exp-id="props.currentRow?.expId" file-type="exp" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="editSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeEditorDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, PropType } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { ExamTable } from '@/api/exam/types';
import { ExamReport, AnswerOptions, ExamReportForm } from '@/api/examReport/types';
import Editor from '@/components/WangEditor/index.vue';
import examReportDetail from './examReportDetail.vue';
const currentEdit = ref();

// 定义父组件传过来的值
const props = defineProps({
  // 父组件表格选中的数据
  currentRow: {
    require: true,
    // 充分的类型提示
    type: Object as PropType<ExamTable>
  },
});
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
// 实验详情设置信息
const state = reactive({
  // 实验报告数据
  examReportData: [
    {
      // 题干
      stem: '',
      answerOptions: [
        {
          // 答题类型
          answerType: '',
          // 数据采集类型
          collectionType: '',
          // 数据类型
          dataType: '',
          // // 填空标记
          // answerTag: '',
          // 正确答案
          trueResult: '',
          // 题目分数
          core: 0,
          // 提交结果
          submitResult: ''
        }
      ] as AnswerOptions[]
    }
  ] as ExamReport[],
  // 数据采集类型选择器数据
  collectionTypeOptions: [
    { value: '1', label: '采集图片' },
    { value: '2', label: '采集数据' }
  ],
  // 数据类型选择器数据
  dataTypeOptions: [
    { value: '1', label: '电路截图' },
    { value: '2', label: '信号源与示波器截图' },
    { value: '3', label: '示波器通道1电压值' },
    { value: '4', label: '示波器和电路截图' },
    { value: '5', label: '信号源DDSA幅度mV' },
    { value: '6', label: '发光二极管L1数据' },
    { value: '7', label: '发光二极管L2数据' },
    { value: '8', label: '发光二极管L3数据' },
    { value: '9', label: '扫频仪截图' },
  ],
  // 答题类型选择器数据
  answerTypeOptions: [
    { value: '1', label: '数据采集' },
    { value: '2', label: '文本填写（长）' },
    { value: '3', label: '文本填写（短）' }
  ],
  // 当前数据显示状态
  isShowView: false,
  // 富文本
  textEditer: {
    // 内容
    content: '',
    // 映射表单键
    pathName: '',
    index: 0,
    index1: 0
  },
  // 富文本弹窗
  editerDialog: {
    title: '',
    visible: false
  } as DialogType,
  // 实验报告表单数据
  examReportForm: {} as ExamReportForm
});
// 将当前表单内容映射到富文本中
function inputClick(content: string, pathName: string, title: string, index: number, index1 = -1) {
  state.editerDialog.visible = true;
  state.editerDialog.title = title;
  state.textEditer.content = content;
  state.textEditer.pathName = pathName;
  state.textEditer.index = index;
  state.textEditer.index1 = index1;
}
// 富文本内容回显
function editSubmit() {
  if (state.textEditer.index1 !== -1) {
    state.examReportData[state.textEditer.index].answerOptions[state.textEditer.index1][state.textEditer.pathName] = state.textEditer.content;
  } else {
    state.examReportData[state.textEditer.index][state.textEditer.pathName] = state.textEditer.content;
  }
  state.editerDialog.visible = false;
}

/**
 * 新增/编辑实验报告
 */
function handleSubmit() {
  state.examReportForm.expReportInfo = JSON.stringify(state.examReportData);
  // updateExamReportApi(state.examReportForm).then(() => {
  //   ElMessage.success('实验报告保存成功！');
  // });
  return state.examReportForm.expReportInfo;
}
function closeEditorDialog() {
  currentEdit.value.clearEditContent();
  state.editerDialog.visible = false;
}
/**
 * 初始化获取实验报告相关数据
 */
function initReportData(expInfoContent: string) {
  if (expInfoContent) {
    // 从自定义内容中获取实验报告信息
    let tempData = JSON.parse(expInfoContent);
    if(Array.isArray(tempData) && tempData.length > 0) {
      state.isShowView = true;
      state.examReportData = tempData;
    }
  }
  // // 获取实验报告详情
  // getExamReportApi(props.currentRow?.expId as number).then(({ data }) => {
  //   // 有实验报告的获取数据
  //   if (data !== '') {
  //     state.isShowView = true;
  //     state.examReportData = JSON.parse(data);
  //   }
  // });
  // // 获取实验报告关联信息
  // getExamDetail(props.currentRow?.expId as number).then(({ data }) => {
  //   state.examReportForm = {
  //     ...props.currentRow,
  //     expReportInfo: ''
  //   } as ExamReportForm;
  //   state.examReportForm.lessonId = data.exp.lessonId;
  // });
}
/**
 * 新增实验报告题目项
 */
function addReportItem() {
  state.examReportData.push({
    // 题干
    stem: '',
    answerOptions: [
      {
        // 答题类型
        answerType: '',
        // 数据采集类型
        collectionType: '',
        // 数据类型
        dataType: '',
        // // 填空标记
        // answerTag: '',
        // 正确答案
        trueResult: '',
        // 题目分数
        core: 0,
        // 提交结果
        submitResult: ''
      }
    ]
  });
}
/**
 * 删除实验报告题目项
 */
function deleteReportItem(index: number) {
  if (state.examReportData.length <= 1) {
    ElMessage.error('至少保留一个题目！');
    return;
  }
  state.examReportData.splice(index, 1);
}
/**
 * 新增答案项
 */
function addAnswerItem(index: number) {
  state.examReportData[index].answerOptions.push({
    // 答题类型
    answerType: '',
    // 数据采集类型
    collectionType: '',
    // 数据类型
    dataType: '',
    // // 填空标记
    // answerTag: '',
    // 正确答案
    trueResult: '',
    // 题目分数
    core: 0,
    // 提交结果
    submitResult: ''
  });
}
/**
 * 删除答案项
 */
function deleteAnswerItem(index: number, index1: number) {
  if (state.examReportData[index].answerOptions.length <= 1) {
    ElMessage.error('至少保留一个答案项！');
    return;
  }
  state.examReportData[index].answerOptions.splice(index, 1);
}
/**复制粘贴答案项 */
function pasteAnswerItem(index: number, index1: number) {
  state.examReportData[index].answerOptions.splice(state.examReportData[index].answerOptions.length, 0, JSON.parse(JSON.stringify(state.examReportData[index].answerOptions[index1])));
}
// onMounted(() => {
//   initReportData();
// });
// 暴露变量
defineExpose({
  handleSubmit,
  initReportData
});
</script>
<style lang="scss" scoped>
.examReportCard {
  :deep(.el-card__header) {
    padding: 10px 15px;
  }
}
.report-container {
  height: calc(100vh - 116px);
  padding: 20px;
}
.imgRes {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}
</style>
<style lang="scss">
#examReport {
  .el-dialog {
    border-radius: 10px !important;
  }
  .el-dialog__body {
    height: 100% !important;
    padding: 10px !important;
  }
}
</style>
