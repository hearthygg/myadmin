<template>
  <div>
    <div class="fullDialog" id="dialog-nopadding">
      <el-dialog destroy-on-close :title="state.detailDialog.title" v-model="state.detailDialog.visible" :fullscreen="true" :modal="state.isShowModal">
        <div class="table-container">
          <el-row :gutter="15">
            <el-col :span="17">
              <el-card class="card-box mini-card" id="reportParent">
                <template #header>
                  <div class="flex justify-between items-center">
                    <span></span>
                    <span class="text-3xl font-bold text-gray-600">电子实验报告</span>
                    <el-popover placement="bottom" trigger="hover">
                      <template #reference>
                        <el-button type="primary" link>
                          <i class="iconfont icon-24gf-ellipsisVertical text-lg"></i>
                        </el-button>
                      </template>
                      <template #default>
                        <div class="text-center w-full mb-2">
                          <el-button type="primary" link @click="changeCorrectStatus"> <i class="iconfont icon-shezhi"></i>隐藏/显示批注 </el-button>
                        </div>
                        <div class="text-center w-full">
                          <el-button @click="exportToPdf" type="primary" link> <i class="iconfont icon-daochu"></i>导出为PDF </el-button>
                        </div>
                      </template>
                    </el-popover>
                  </div>
                </template>
                <div class="question-body">
                  <el-descriptions class="p-2 reportDesc" :column="2" :border="true">
                    <el-descriptions-item>
                      <template #label>
                        <span class="text-xl text-gray-700">学生姓名</span>
                      </template>
                      <span class="text-xl text-gray-700">{{ state.examReportRecordDetail.studentName }}</span>
                      <!-- <el-tag v-else type="info">暂无数据</el-tag> -->
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <span class="text-xl text-gray-700">学生学号</span>
                      </template>
                      <span class="text-xl text-gray-700">{{ state.examReportRecordDetail.studentUid }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <span class="text-xl text-gray-700">实验项目</span>
                      </template>
                      <span class="text-xl text-gray-700">{{ state.examReportRecordDetail.expName }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <span class="text-xl text-gray-700">所属班级</span>
                      </template>
                      <span class="text-xl text-gray-700">{{ state.claName }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <span class="text-xl text-gray-700">指导老师</span>
                      </template>
                      <span class="text-xl text-gray-700">{{ state.examReportRecordDetail.teacherName }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <span class="text-xl text-gray-700">完成时间</span>
                      </template>
                      <span class="text-xl text-gray-700" v-if="state.uploadTime">{{ state.uploadTime }}</span>
                      <el-tag v-else type="info">暂无数据</el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                  <div class="text-3xl font-bold text-gray-600 p-2 my-2">实验内容</div>
                  <el-card shadow="never" class="p-2" v-if="state.reportType === 6">
                    <examReportDetail v-if="state.examReportData.length > 0" :isShowBtn="false" :exam-report-data="state.examReportData" current-state="view"></examReportDetail>
                  </el-card>
                  <el-card shadow="never" class="p-2" v-if="state.reportType === 5">
                    <div class="text-xl font-bold text-gray-600 my-2">1.实验报告详情</div>
                    <div class="text-lg text-gray-600 p-2" v-html="state.commonReportData.question"></div>
                    <div class="text-xl font-bold text-gray-600 my-2">2.实验报告答案和评分标准</div>
                    <div class="text-lg text-gray-600 p-2" v-html="state.commonReportData.answer"></div>
                  </el-card>
                </div>
              </el-card>
            </el-col>
            <el-col :span="7">
              <div id="card-content">
                <el-card class="card-box mini-card">
                  <template #header>
                    <div class="text-3xl font-bold text-center text-gray-600">批改结果</div>
                  </template>
                  <div class="card-body">
                    <template v-if="state.reportStatus === 'correct' || state.correctionStatus === 2">
                      <div class="correctContent bottomLine" :style="`height: ${state.reportStatus === 'correct' ? 'calc(100% - 50px)' : '100%'}`">
                        <el-collapse v-model="activeNames">
                          <el-collapse-item name="0" v-if="state.reportStatus !== 'correct'">
                            <template #title>
                              <div class="text-xl font-bold text-gray-600">报告得分</div>
                            </template>
                            <div class="text-3xl font-bold text-red-500 text-center">{{ state.correctResult.score }}分</div>
                          </el-collapse-item>
                          <el-collapse-item name="1">
                            <template #title>
                              <div class="text-xl font-bold text-gray-600">评分点</div>
                            </template>
                            <template v-if="state.reportType === 6 && state.correctResult.scoreDetaile.length > 0">
                              <div class="correct-item mb-2" v-for="(item, index) in state.examReportData" :key="index">
                                <div class="text-lg text-gray-600 font-bold">第{{ index + 1 }}题</div>
                                <div v-for="(answer, answerIndex) in item.answerOptions" :key="answerIndex">
                                  <div class="flex justify-between items-center mb-2">
                                    <span
                                      ><el-tag>{{ answerIndex + 1 }}</el-tag> ({{ answer.core }} 分)</span
                                    >
                                    <el-input-number
                                      v-if="state.reportStatus === 'correct'"
                                      @change="resChangeHandler"
                                      v-model="state.correctResult.scoreDetaile[index].answerGroups[answerIndex].score"
                                      :step="1"
                                      :precision="0"
                                      step-strictly
                                      :controls="false"
                                      controls-position="right"
                                      :min="0"
                                      :max="answer.core"
                                    />
                                    <span class="text-lg text-blue-600 mr-2" v-else>{{ state.correctResult.scoreDetaile[index].answerGroups[answerIndex].score }}</span>
                                  </div>
                                  <el-input
                                    @change="resChangeHandler"
                                    v-if="state.correctResult.scoreDetaile[index].answerGroups[answerIndex].tips"
                                    :disabled="state.reportStatus !== 'correct'"
                                    v-model="state.correctResult.scoreDetaile[index].answerGroups[answerIndex].tips"
                                    :autosize="{ minRows: 3, maxRows: 5 }"
                                    type="textarea"
                                    placeholder="批注信息"
                                  />
                                  <!-- <div class="text-lg text-blue-500">参考答案：</div> -->
                                  <div v-html="answer.trueResult"></div>
                                  <div class="bottomLine my-2"></div>
                                </div>
                                <!-- <div class="text-lg text-gray-600 font-bold">点评：</div>
                                <el-input :disabled="state.reportStatus !== 'correct'" v-model="state.correctResult.scoreDetaile[index].remark" :autosize="{ minRows: 3, maxRows: 5 }" type="textarea" placeholder="可以输入当题目的评价" /> -->
                              </div>
                            </template>
                            <template v-if="state.reportType === 5">
                              <div class="text-lg text-gray-600" v-html="state.commonReportData.answer"></div>
                            </template>
                          </el-collapse-item>
                          <el-collapse-item title="教师评价" name="2">
                            <template #title>
                              <div class="text-xl font-bold text-gray-600">教师评价</div>
                            </template>
                            <el-input :disabled="state.reportStatus !== 'correct'" v-model="state.correctResult.comment" :autosize="{ minRows: 5, maxRows: 8 }" type="textarea" placeholder="可以输入对学生的评价或者评分细则" />
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                      <div v-if="state.reportStatus === 'correct'" class="correntFooter flex justify-between items-center">
                        <div class="text-xl font-bold text-gray-600">
                          最终得分：
                          <span class="text-red-600">
                            <!-- <span v-if="state.reportType === 6">{{ state.correctResult.score }}</span> -->
                            <span v-if="state.reportType === 6">{{ totalScore }}</span>
                            <el-input-number :controls="false" class="text-red-500" v-else v-model="state.correctResult.score" :step="1" step-strictly controls-position="right" :min="0" :max="100" />
                          </span>
                          分
                        </div>
                        <el-button type="primary" @click="submitCorrectReport"><i class="iconfont icon-queding"></i>提交批改结果</el-button>
                      </div>
                    </template>
                    <template v-else>
                      <el-empty description="暂未批改" />
                    </template>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <!-- <el-button @click="exportToPdf" type="primary"><i class="iconfont icon-daochu"></i>导出为PDF</el-button> -->
            <el-button @click="state.detailDialog.visible = false"><i class="iconfont icon-quxiao"></i>关闭</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <!-- 批改弹窗 -->
    <el-dialog destroy-on-close v-model="state.correctDialog.visible" :title="state.correctDialog.title" width="800px" @close="closeCorrectDialog">
      <el-form ref="correctFormRef" label-position="left">
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <div class="text-gray-600 font-bold">最大分数：</div>
              </template>
              <span class="text-lg text-blue-600">{{ state.examReportData[state.correctDialog.parentIndex].answerOptions[state.correctDialog.childIndex].core }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <div class="text-gray-600 font-bold">当前分数：</div>
              </template>
              <el-input-number
                :disabled="state.reportStatus !== 'correct'"
                :controls="false"
                v-model="state.correctDialog.core"
                :step="1"
                step-strictly
                :min="0"
                :max="state.examReportData[state.correctDialog.parentIndex].answerOptions[state.correctDialog.childIndex].core"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-position="top">
          <template #label>
            <div class="text-gray-600 font-bold">批注：</div>
          </template>
          <el-input :disabled="state.reportStatus !== 'correct'" v-model="state.correctDialog.tips" :autosize="{ minRows: 5, maxRows: 8 }" type="textarea" placeholder="批注信息" />
        </el-form-item>
        <!-- <el-form-item label="学生答案：" >
          <img
            class="showImg"
            v-if="
              state.examReportData[state.correctDialog.parentIndex].answerOptions[state.correctDialog.childIndex].answerType === '1' &&
              state.examReportData[state.correctDialog.parentIndex].answerOptions[state.correctDialog.childIndex].collectionType === '1'
            "
            :src="state.examReportData[state.correctDialog.parentIndex].answerOptions[state.correctDialog.childIndex].submitResult"
          />
          <div v-else>{{ state.examReportData[state.correctDialog.parentIndex].answerOptions[state.correctDialog.childIndex].submitResult }}</div>
        </el-form-item> -->
        <el-form-item label-position="top">
          <template #label>
            <div class="text-blue-600 font-bold">正确答案：</div>
          </template>
          <div v-html="state.examReportData[state.correctDialog.parentIndex].answerOptions[state.correctDialog.childIndex].trueResult"></div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="state.reportStatus === 'correct'" type="primary" @click="submitCuurrentCorrectRes"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeCorrectDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { ExamReport, ExamReportRecord, ExamReportRecordDetail, SubmitAnswer, CorrectionDetail } from '@/api/examReport/types';
import { getReportDetailApi, correctionReportApi, getCorrectionResultApi } from '@/api/examReport';
import examReportDetail from '@/components/ExamReport/examReportDetail.vue';
import { downloadHandler } from '@/utils/html2pdf';
import { getCurrentExamDetail } from '@/api/exam';
import { ElMessage, ElMessageBox } from 'element-plus';
import { NextLoading } from '@/utils/loading';
import eventBus from '@/utils/eventBus';
const activeNames = ref(['0', '1', '2']);
const state = reactive({
  // 实验报告详情弹窗
  detailDialog: {
    title: '',
    visible: false
  },
  // 批改弹窗
  correctDialog: {
    title: '批改',
    visible: false,
    parentIndex: 0,
    childIndex: 0,
    core: null as number | null,
    tips: ''
  },
  // 实验报告详情数据
  examReportData: [] as ExamReport[],
  // 实验报告记录详情数据
  examReportRecordDetail: {} as ExamReportRecordDetail,
  // 普通实验报告
  commonReportData: {
    // 题目
    question: '',
    // 答案和评分标准
    answer: ''
  },
  claName: '',
  uploadTime: '',
  // 当前实验报告状态 'view' | 'correct'
  reportStatus: 'view',
  // 控制是否显示弹窗遮罩层
  isShowModal: true,
  // 当前实验报告类型
  reportType: 5,
  // 实验报告批改结果
  correctResult: {
    scoreDetaile: [] as CorrectionDetail[],
    score: 100,
    comment: ''
  },
  // 批改状态 2：已批改，1：未批改
  correctionStatus: 1,
  // 批注显示状态
  isShowComment: true,
});
const emit = defineEmits(['finishCorrect']);
// 总分
const totalScore = computed(() => {
  let num = 0;
  state.correctResult.scoreDetaile.map(v => {
    v.answerGroups.map(v2 => {
      if (v2.score) num += v2.score;
    });
  });
  return num;
});
// 关闭批改弹窗
const closeCorrectDialog = () => {
  state.correctDialog.visible = false;
  state.correctDialog.parentIndex = 0;
  state.correctDialog.childIndex = 0;
  state.correctDialog.core = null;
  state.correctDialog.tips = '';
};
// 修改批注显示状态
const changeCorrectStatus = () => {
  state.isShowComment = !state.isShowComment
  eventBus.emit('changeCorrectStatus', state.isShowComment);
};
// 提交当前题目批改结果
const submitCuurrentCorrectRes = () => {
  state.correctResult.scoreDetaile.map((v, i) => {
    v.answerGroups.map((v2, i2) => {
      if (i === state.correctDialog.parentIndex && i2 === state.correctDialog.childIndex) {
        v2.score = state.correctDialog.core;
        v2.tips = state.correctDialog.tips;
      }
    });
  });
  eventBus.emit('sendCorrectRes', state.correctResult.scoreDetaile);
  closeCorrectDialog();
};
// 每题批注和分数发生变化通知report组件
const resChangeHandler = () => {
  eventBus.emit('changeCorrectRes', state.correctResult.scoreDetaile);
};
function openDialog(row: ExamReportRecord, reportStatus: string) {
  NextLoading.start();
  state.examReportData = {} as ExamReport[];
  state.correctionStatus = row.correctionStatus;
  try {
    // 获取实验报告模板信息
    getCurrentExamDetail(row.expId, row.reportType === 6 ? 33 : 32).then(res => {
      // 获取实验报告提交答案信息
      getReportDetailApi(row.reportId).then(async ({ data }) => {
        if (data.content !== '') {
          state.reportType = row.reportType;
          if (row.reportType === 6) {
            // 自动化实验报告
            state.examReportRecordDetail = data;
            state.examReportData = JSON.parse(res.data.expInfo.expInfoContent);

            // 获取学生提交的答案结果
            let tempRes = [] as SubmitAnswer[];
            tempRes = JSON.parse(data.content as string);
            tempRes.map((v1, i1) => {
              v1.answerGroups.map((v2, i2) => {
                state.examReportData[i1].answerOptions[i2].submitResult = v2;
              });
            });
          } else if (row.reportType === 5) {
            // 普通实验报告
            try {
              state.examReportRecordDetail = data;
              let reportRes = JSON.parse(data.content as string);
              if (typeof reportRes === 'object' && reportRes !== null) {
                if (!(Object.keys(reportRes).length === 0 && reportRes.constructor === Object)) {
                  state.commonReportData = reportRes;
                }
              } else {
                // console.log('不是对象');
              }
              // console.log('reportRes:', reportRes);
            } catch (error) {
              console.error('Failed to parse JSON:', error);
            }
            state.examReportRecordDetail = data;
          }
          // 获取/设置批改结果
          await getCorrectResult();
          state.detailDialog.visible = true;
          state.detailDialog.title = data.studentName + '的实验报告';
          state.claName = row.claName;
          state.uploadTime = row.uploadTime;
          state.reportStatus = reportStatus;
          NextLoading.done();
          setTimeout(() => {
            // 自动化实验报告发送批改数据给子页面
            if (state.reportType === 6) eventBus.emit('sendCorrectRes', state.correctResult.scoreDetaile);
          }, 200);
        } else {
          ElMessage.error('实验报告记录为空');
        }
      });
    });
  } catch (error) {
    NextLoading.done();
  }
}
// 导出实验报告
const exportToPdf = () => {
  downloadHandler('reportParent').then((pdf: any) => {
    pdf.save(`${state.examReportRecordDetail.studentName}的实验报告.pdf`); // 保存PDF文件
  });
};
// 批改实验报告
const submitCorrectReport = () => {
  ElMessageBox.confirm('确认提交批改结果并且确认各个题目的分数了吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      if (state.reportType === 6) state.correctResult.score = totalScore.value;
      correctionReportApi({
        reportId: state.examReportRecordDetail.reportId,
        score: state.correctResult.score,
        comment: state.correctResult.comment,
        content: JSON.stringify(state.correctResult)
      }).then(() => {
        ElMessage.success('批改成功');
        state.detailDialog.visible = false;
        emit('finishCorrect');
      });
    })
    .catch(() => ElMessage.info('已取消'));
};
// 获取批改结果
const getCorrectResult = () => {
  return new Promise((resolve, reject) => {
    try {
      getCorrectionResultApi(state.examReportRecordDetail.reportId).then(({ data }) => {
        if (data.teacherContent) {
          state.correctResult = JSON.parse(data.teacherContent);
        } else {
          state.correctResult.comment = '';
          state.correctResult.score = 0;
          if (state.reportType === 6) {
            // 处理评分点数据
            state.correctResult.scoreDetaile = [] as CorrectionDetail[];
            state.examReportData.map((v1, i1) => {
              let tempAnswer = {} as CorrectionDetail;
              tempAnswer.questionIndex = i1;
              tempAnswer.remark = '';
              tempAnswer.answerGroups = [];
              v1.answerOptions.map(() => {
                tempAnswer.answerGroups.push({ tips: '', score: null });
              });
              state.correctResult.scoreDetaile.push(tempAnswer);
            });
          }
        }
        resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
};
onMounted(() => {
  // 监听子组件发起打开弹窗请求
  eventBus.on('openCorrectDialog', (res: any) => {
    state.correctResult.scoreDetaile.map((v, i) => {
      v.answerGroups.map((v2, i2) => {
        if (i === res.parentIndex && i2 === res.childIndex) {
          state.correctDialog.core = v2.score;
          state.correctDialog.tips = v2.tips;
          state.correctDialog.parentIndex = res.parentIndex;
          state.correctDialog.childIndex = res.childIndex;
          state.correctDialog.visible = true;
        }
      });
    });
  });
});
// 暴露变量
defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.reportContent {
  position: relative;
}
.showImg {
  width: 300px;
  height: 170px;
  border: 1px solid #e4e7ed;
  border-radius: 5px;
}
.correctContent {
  height: calc(100% - 50px);
  box-sizing: border-box;
  overflow-y: auto;
  @include scrollBar;
}
.bottomLine {
  border-bottom: 1px solid var(--el-card-border-color);
}
.correntFooter {
  height: 50px;
}
.fullDialog {
  .table-container {
    height: calc(100vh - 116px) !important;
    background-color: #fff;
  }
  .table-container {
    @include scrollBar;
  }
}
.reportDesc {
  :deep(.el-descriptions__label) {
    width: 150px;
  }
  // :deep(.el-descriptions__cell) {
  //   text-align: center;
  // }
}
#card-content {
  .card-body {
    height: calc(100vh - 222px);
    // overflow-y: scroll;
    // @include scrollBar;
  }
  :deep(.el-card__body) {
    padding: 8px 12px;
  }
}
.question-body {
  height: calc(100vh - 245px);
  overflow-y: auto;
  @include scrollBar;
}
</style>
