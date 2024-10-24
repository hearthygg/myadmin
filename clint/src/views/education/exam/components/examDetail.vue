<!-- 实验详细信息具体设置 -->
<template>
  <div class="fullDialog dialogWidth1" id="dialog-nopadding">
    <el-dialog :close-on-click-modal="false" :title="state.dialog.title" v-model="state.dialog.visible" @close="closeDialog" :fullscreen="true">
      <el-row :gutter="20" class="p-5">
        <el-col :span="6">
          <div class="mb-5 text-xl font-bold">
            当前实验: <span class="text-blue-500">{{ currentRow?.expName }}</span>
          </div>
          <div class="mb-5 text-xl font-bold">
            当前选择栏目: <span class="text-blue-500">{{ getCurrentColumn(state.examForm.columnId) }}</span>
          </div>
          <div class="mb-5 text-xl font-bold">
            <span>当前栏目列表:</span>
          </div>
          <div
            @click="siderbarClick(item.expInfoColumnId)"
            v-for="(item, index) in state.currentColumn"
            :key="item.expInfoColumnId"
            class="mb-2 text-lg bg-gray-50 rounded-lg p-2 flex justify-between items-center cursor-pointer"
            :class="item.expInfoColumnId == state.examForm.columnId ? 'isactive' : ''"
          >
            <div>
              <span class="text-blue-500 mr-2">{{ `${index + 1}.${item.expInfoColumnName}` }}</span>
              <el-tag v-if="item.expInfoColumnType === 1" type="warning">预习课件</el-tag>
              <el-tag v-else-if="item.expInfoColumnType === 2" type="info">复习课件</el-tag>
              <el-tag v-else-if="item.expInfoColumnType === 3" type="success">实验课件</el-tag>
            </div>
            <el-button type="danger" link @click.stop="handlerDeleteCol(item.expInfoId, item.expInfoColumnId)"><i class="iconfont icon-shanchu"></i>删除</el-button>
          </div>
          <el-empty v-if="state.currentColumn.length == 0" description="暂无数据" />
        </el-col>
        <el-col :span="18" class="listBorder">
          <el-form ref="dataFormRef" :model="state.examForm" :rules="state.rules" label-width="125px" label-position="top">
            <el-form-item label="栏目选择" prop="columnId">
              <el-select class="w-full" @change="colSelectChange" v-model="state.examForm.columnId" placeholder="--所有--" filterable>
                <el-option v-for="item in state.examColumnList" :value="item.expInfoColumnId" :label="item.expInfoColumnName" :key="item.expInfoColumnId"></el-option>
              </el-select>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12" class="mb-5">
                <el-form-item label="访问方式" prop="expInfoWay">
                  <el-select class="w-full" v-model="state.examForm.expInfoWay" placeholder="--所有--" filterable>
                    <el-option v-for="item in selectEnum.businessEnumTypes.expInfoWayOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="mb-5">
                <el-form-item label="实验箱连接方式" prop="expInfoBoxType">
                  <el-select class="w-full" v-model="state.examForm.expInfoBoxType" placeholder="--所有--" filterable>
                    <el-option v-for="item in selectEnum.businessEnumTypes.boxTypeOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="mb-5" v-if="state.examForm.expInfoBoxType !== 1">
                <el-form-item label="实验箱类型" prop="expInfoKeyFlag">
                  <el-select class="w-full" v-model="state.examForm.expInfoKeyFlag" placeholder="--所有--" filterable>
                    <el-option v-for="item in selectEnum.examEnumTypes.DeviceBoxesOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="mb-5" v-if="state.examForm.expInfoBoxType !== 1">
                <el-form-item label="实验箱分配方式" prop="expInfoSelectDevice">
                  <el-select class="w-full" v-model="state.examForm.expInfoSelectDevice" placeholder="--所有--" filterable>
                    <el-option v-for="item in selectEnum.businessEnumTypes.selectDeviceOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="支持的实验" v-if="state.examForm.expInfoBoxType !== 1" prop="expInfoFunction">
              <el-input v-model="state.examForm.expInfoFunction" placeholder="支持的实验"></el-input>
            </el-form-item>
            <el-form-item label="实验前需下载的文件" v-if="state.examForm.expInfoBoxType !== 1" prop="expInfoFilePath">
              <file-upload api-type="download" :exp-id="state.examForm.expId" :column-id="state.examForm.columnId" v-model="state.examForm.expInfoFilePath"></file-upload>
            </el-form-item>
            <!-- <el-form-item label="引用标志" prop="expInfoFlag">
              <el-input v-model="state.examForm.expInfoFlag" placeholder="引用标志"></el-input>
            </el-form-item> -->
            <el-form-item v-if="state.examForm.expInfoWay !== 1 && state.examForm.expInfoWay !== 5 && state.examForm.expInfoWay !== 6" label="路径(可以是上传文件的路径也可以是自定义路径)" prop="expInfoPath">
              <el-tabs v-model="state.activeName" class="w-full">
                <el-tab-pane label="上传文件" name="first">
                  <file-upload api-type="import" :exp-id="state.examForm.expId" :column-id="state.examForm.columnId" v-model="state.examForm.expInfoPath"></file-upload>
                </el-tab-pane>
                <el-tab-pane label="自定义路径" name="second">
                  <el-input v-model="state.examForm.expInfoPath" placeholder="路径"></el-input>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
            <el-form-item v-if="state.examForm.expInfoWay === 1" label="自定义内容" prop="expInfoContent">
              <editor v-model="state.examForm.expInfoContent" :exp-id="props.currentRow?.expId" file-type="exp" />
            </el-form-item>
            <template v-if="state.examForm.expInfoWay === 5">
              <el-form-item label="实验报告题目">
                <editor v-model="state.examReportData.question" :exp-id="props.currentRow?.expId" file-type="exp" />
              </el-form-item>
              <el-form-item label="实验报告答案和评分标准">
                <editor v-model="state.examReportData.answer" :exp-id="props.currentRow?.expId" file-type="exp" />
              </el-form-item>
            </template>
            <el-form-item v-if="state.examForm.expInfoWay === 6" label="自动化实验报告" prop="expInfoContent">
              <!-- 实验报告设置 -->
              <examReport :expInfoContent="state.examForm.expInfoContent" :currentRow="props.currentRow" ref="examReportRef"></examReport>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, PropType, watch, nextTick } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { ExamTable } from '@/api/exam/types';
import Editor from '@/components/WangEditor/index.vue';
import FileUpload from '@/components/Upload/fileUpload.vue';
import examReport from '@/components/ExamReport/ReportTemplate.vue';
import { getAllExamColumn, getColumnByExamId, getCurrentExamDetail, addCurrentExamCol, updateCurrentExamCol, deleteOnlineExamCol } from '@/api/exam';
import { ExamColumnTable, ExamDetailForm } from '@/api/exam/types';
import { useSelectEnum } from '@/store/selectEnum';
const selectEnum = useSelectEnum();
// 定义父组件传过来的值
const props = defineProps({
  // 父组件表格选中的数据
  currentRow: {
    require: true,
    // 充分的类型提示
    type: Object as PropType<ExamTable>
  }
});
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
// 实验报告对象
const examReportRef = ref();
// 实验详情设置信息
const state = reactive({
  // 当前弹框状态
  dialog: {
    title: '实验设置',
    visible: false
  } as DialogType,
  // 实验栏目列表数据
  examColumnList: [] as ExamColumnTable[],
  // 当前实验拥有的栏目数据
  currentColumn: [] as ExamColumnTable[],
  // 实验栏目表单数据
  examColumnForm: {},
  // 实验箱类型选择器数据
  exBoxTypeOptions: [] as SelectOptionType[],
  // 表单路径是 上传文件还是自定义路径
  activeName: 'second',
  // 实验详细设置表单
  examForm: {} as ExamDetailForm,
  // 增加/编辑表单校验规则
  rules: {
    columnId: [{ required: true, message: '请选择栏目', trigger: 'change' }],
    expInfoWay: [{ required: true, message: '请选择访问方式', trigger: 'change' }],
    expInfoBoxType: [{ required: true, message: '请选择实验箱连接方式', trigger: 'change' }],
    expInfoKeyFlag: [{ required: true, message: '请选择实验箱类型', trigger: 'change' }],
    expInfoSelectDevice: [{ required: true, message: '请选择实验箱分配方式', trigger: 'change' }]
  },
  // 普通实验报告数据
  examReportData: {
    // 题目
    question: '',
    // 答案和评分标准
    answer: ''
  }
});
/**
 * 取消
 */
function closeDialog() {
  state.dialog.visible = false;
  dataFormRef.value.resetFields();
  state.examForm = {} as ExamDetailForm;
}
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.examForm.expInfoWay === 6) {
        // 获取自动化实验报告信息
        state.examForm.expInfoContent = examReportRef.value.handleSubmit();
      } else if (state.examForm.expInfoWay === 5) {
        // 获取普通实验报告信息
        state.examForm.expInfoContent = JSON.stringify(state.examReportData);
      }
      if (state.examForm.expInfoId) {
        // 更新
        updateCurrentExamCol(state.examForm).then(() => {
          ElMessage.success('编辑成功');
          resetForm();
        });
      } else {
        // 新增
        state.examForm.expId = props.currentRow?.expId as number;
        addCurrentExamCol(state.examForm).then(() => {
          getCurrentExCol();
          ElMessage.success('新增成功！');
          resetForm();
        });
      }
    }
  });
}
/**清空表单数据 */
function resetForm() {
  state.examForm = {} as ExamDetailForm;
  dataFormRef.value.resetFields();
}
/**
 * 开启栏目设置弹框
 */
function openDialog() {
  state.dialog.visible = true;
  getAllExamColumn().then(({ data }) => {
    state.examColumnList = data.expInfoTypeList;
  });
}
/**
 * 获取当前选中的栏目
 */
function getCurrentColumn(id: any) {
  let currentColumn = '还未选择';
  state.examColumnList.map(item => {
    if (item.expInfoColumnId == id) currentColumn = item.expInfoColumnName;
  });
  return currentColumn;
}
/**
 * 获取当前实验已有的栏目信息
 */
function getCurrentExCol() {
  getColumnByExamId(props.currentRow?.expId as number).then(({ data }) => {
    state.currentColumn = data.columnList;
  });
}
/**
 * 删除当前实验已有的栏目
 */
function handlerDeleteCol(colId: number, expInfoColumnId: number) {
  deleteOnlineExamCol(colId as any).then(() => {
    // 如果删除的栏目是当前选中的栏目，则重置表单
    if (expInfoColumnId === state.examForm.columnId) {
      resetForm();
    }
    ElMessage.success('删除成功');
    // 重新获取栏目
    getCurrentExCol();
  });
}
/**
 * 获取当前栏目信息
 */
function getCurrentColInfo(val: number) {
  let index = state.currentColumn.findIndex(i => i.expInfoColumnId === val);
  if (index !== -1) {
    // 当前栏目有数据
    getCurrentExamDetail(props.currentRow?.expId as number, val).then(({ data }) => {
      state.examForm = data.expInfo;
      if (state.examForm.expInfoWay === 6) {
        nextTick(() => {
          examReportRef.value.initReportData(state.examForm.expInfoContent);
        });
      } else if (state.examForm.expInfoWay === 5) {
        // 获取普通实验报告信息
        try {
          let reportRes = JSON.parse(state.examForm.expInfoContent);

          if (typeof reportRes === 'object' && reportRes !== null) {
            // console.log('是一个对象');
            if (Object.keys(reportRes).length === 0 && reportRes.constructor === Object) {
              // console.log('是一个空对象');
            } else {
              // console.log('不是一个空对象');
              state.examReportData = reportRes;
            }
          } else {
            // console.log('不是对象');
          }
          console.log('reportRes:', reportRes);
        } catch (error) {
          console.error('Failed to parse JSON:', error);
        }
      }
    });
  } else {
    // 当前栏目无数据
    state.examForm = {} as ExamDetailForm;
    dataFormRef.value.resetFields();
    state.examForm.columnId = val;
  }
}
/**
 * 监听栏目选择的变化
 */
function colSelectChange(val: number) {
  getCurrentColInfo(val);
}
/**
 * 监听侧边栏的点击
 */
function siderbarClick(val: number) {
  state.examForm.columnId = val;
  getCurrentColInfo(val);
}
/**
 * 监听当前实验的变化获取当前栏目数据
 */
watch(
  () => props.currentRow,
  value => {
    if (value?.expId) {
      getColumnByExamId(props.currentRow?.expId as number).then(({ data }) => {
        state.currentColumn = data.columnList;
        // 开启弹框默认选中第一项
        if (state.currentColumn.length > 0) {
          state.examForm.columnId = state.currentColumn[0].expInfoColumnId;
          getCurrentColInfo(state.examForm.columnId);
        }
      });
    }
  }
);
/**
 * 监听访问方式的变化
 */
// watch(
//   () => state.examForm.expInfoWay,
//   value => {
//     if (value === 1) {
//       // 访问方式为自定义内容 实验路径置空
//       state.examForm.expInfoPath = '';
//     } else {
//       // 其他自定义内容置空
//       state.examForm.expInfoContent = '';
//     }
//   }
// );
/**
 * 监听实验箱连接方式的变化
 */
watch(
  () => state.examForm.expInfoBoxType,
  value => {
    if (value === 1) {
      // 不使用远程实验箱 将实验箱类型 实验箱分配方式 支持的实验 实验前需下载的文件置空
      state.examForm.expInfoKeyFlag = 'not_use_box';
      state.examForm.expInfoSelectDevice = 2;
      state.examForm.expInfoFunction = '';
      state.examForm.expInfoFilePath = '';
    }
  }
);
// 暴露变量
defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
.listBorder {
  border-left: 1px solid #dbeafe;
}

:deep(.el-form) {
  .el-form-item__label {
    font-weight: bold;
  }
}
.isactive {
  box-shadow: 0 0 2px 2px #dbeafe;
  border-left: 5px solid #60a5fa;
  border-right: 5px solid #60a5fa;
}
</style>
