<!-- 实验栏目设置 -->
<template>
  <!-- 实验栏目弹框 -->
  <div class="my-full-dialog">
    <el-dialog :title="state.examColumnDialog.title" v-model="state.examColumnDialog.visible">
      <div class="mb-2 bg-gray-50 rounded-lg p-3.5 flex justify-between items-center">
        <div class="text-2xl font-bold">栏目总数({{ state.examColumnList.length }})</div>
        <div class="flex justify-between items-center">
          <el-button type="danger" @click="handleDelete()"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
          <el-button type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
        </div>
      </div>
      <el-table v-loading="state.loading" :data="state.examColumnList"
        :header-cell-style="{ background: '#EBF5FF', color: '#606266' }" :border="true"
        @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection" width="55" :align="'center'" />
        <el-table-column type="index" label="序号" width="55" :align="'center'" />
        <el-table-column label="栏目名称" prop="expInfoColumnName" show-overflow-tooltip :align="'center'" />
        <el-table-column label="栏目类型" prop="expInfoColumnType" show-overflow-tooltip :align="'center'">
          <template #default="scope">
            <el-tag v-if="scope.row.expInfoColumnType === 1" type="warning">预习课件</el-tag>
            <el-tag v-else-if="scope.row.expInfoColumnType === 2" type="info">复习课件</el-tag>
            <el-tag v-else-if="scope.row.expInfoColumnType === 3" type="success">实验课件</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" :align="'center'">
          <template #default="scope">
            <el-button type="primary" link @click.stop="handleUpdate(scope.row)">
              <i class="iconfont icon-bianji"></i>编辑
            </el-button>
            <el-button type="danger" link @click.stop="handleDelete(scope.row)">
              <i class="iconfont icon-shanchu"></i>删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
      <!-- 新增/编辑栏目弹框 -->
      <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" width="500px" @close="closeDialog"
        :append-to-body="true">
        <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="100px">
          <el-form-item label="栏目名称" prop="expInfoColumnName">
            <el-input v-model="state.formData.expInfoColumnName" placeholder="栏目名称" />
          </el-form-item>
          <el-form-item label="栏目类型" prop="expInfoColumnType">
            <el-select v-model="state.formData.expInfoColumnType" placeholder="--所有--" filterable>
              <el-option v-for="item in state.examColumnOption" :value="item.value" :label="item.label"
                :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="栏目排序" prop="expInfoColumnOrderNum">
            <el-input-number v-model="state.formData.expInfoColumnOrderNum" :step="1" step-strictly
              controls-position="right" :min="0" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import {
  addExamColumn,
  getExamColumnDetail,
  updateExamColumn,
  deleteExamColumns,
  getAllExamColumn,
} from '@/api/exam'
import {
  ExamColumnTable,
  ExamColumnForm,
} from '@/api/exam/types'
import { useSelectEnum } from '@/store/selectEnum'
const selectEnum = useSelectEnum()
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
// 响应式数据
const state = reactive({
  loading: false,
  // 实验栏目弹框状态
  examColumnDialog: {
    title: '栏目设置',
    visible: false
  } as DialogType,
  // 实验栏目列表数据
  examColumnList: [] as ExamColumnTable[],
  // 实验栏目添加/编辑弹框
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  // 实验栏目表单数据
  formData: {} as ExamColumnForm,
  // 增加/编辑栏目校验规则
  rules: {
    expInfoColumnName: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
    expInfoColumnOrderNum: [{ required: true, message: '请输入栏目排序', trigger: 'blur' }],
    expInfoColumnType: [{ required: true, message: '请输入栏目排序', trigger: 'change' }]
  },
  // 栏目类型选择器数据
  examColumnOption: selectEnum.businessEnumTypes.expInfoTypeColumnOptions,
  // 实验栏目多选
  ids: [] as number[],
});
/**
 * 打开栏目设置弹框
 */
function openDialog() {
  state.examColumnDialog.visible = true;
  handleQuery()
}
/**
 * 查询栏目数据
 */
function handleQuery() {
  state.loading = true;
  getAllExamColumn().then(({ data }) => {
    state.examColumnList = data.expInfoTypeList
    state.loading = false;
  }).catch(() => { state.loading = false; })
}
/**
 * 关闭添加/编辑栏目弹框
 */
function closeDialog() {
  state.dialog.visible = false;
  dataFormRef.value.resetFields();
  state.formData = {} as ExamColumnForm
}
/**
 * 新增实验栏目点击
 */
function handleAdd() {
  state.dialog.title = '新增栏目'
  state.dialog.visible = true
}
/**
 * 编辑实验栏目点击
 */
function handleUpdate(row: ExamColumnTable) {
  state.dialog.title = '编辑栏目'
  state.dialog.visible = true
  getExamColumnDetail(row.expInfoColumnId).then(({ data }) => {
    state.formData = data.expInfoType
  })
}
/**
 * 提交编辑或者新增实验栏目
 */
function handleSubmit() {
  // state.loading = true;
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.expInfoColumnId) {
        updateExamColumn(state.formData)
          .then(() => {
            ElMessage.success('编辑成功');
            closeDialog();
            handleQuery();
            // state.loading = false;
          })
          // .catch(() => { state.loading = false });
      } else {
        addExamColumn(state.formData)
          .then(() => {
            ElMessage.success('新增成功');
            closeDialog();
            handleQuery();
            // state.loading = false;
          })
          // .catch(() => { state.loading = false });
      }
    }
  });
}
/**
 *  删除/批量删除
 */
function handleDelete(row: ExamColumnTable = {} as ExamColumnTable) {
  const ids = row.expInfoColumnId ? [row.expInfoColumnId] : [...state.ids]
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteExamColumns(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
/**
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: ExamColumnTable[]) {
  state.ids = selection.map((item: ExamColumnTable) => item.expInfoColumnId);
}
defineExpose({
  openDialog,
})
</script>
<!-- <style lang="scss">
.my-full-dialog {
  .el-overlay {
    position: fixed;
    top: 85px;
    right: 0;
    bottom: 0;
    left: 210px;
    z-index: 2000;
    height: 100%;
    background-color: var(--el-overlay-color-lighter);
    overflow: auto;
    width: calc(100vw - 210px);
    height: calc(100vh - 85px);
  }
}
</style> -->
