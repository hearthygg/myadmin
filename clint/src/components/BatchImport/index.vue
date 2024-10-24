<template>
  <el-dialog v-model="importExcelData.importFileDialog" width="800px" title="批量导入">
    <div class="mb-4 text-lg">1.没有模板？点击下载excel模板</div>
    <el-button type="primary" @click="getExcelTemplate"><i class="iconfont icon-daoru"></i>下载模板</el-button>
    <div class="my-4 text-lg">2.上传excel文件</div>
    <ImportExcel :file-type="['.xlsx']" v-model="importExcelData.importFile"></ImportExcel>
    <div class="my-4 text-lg">3.点击确定批量导入excel数据</div>
    <div v-if="importExcelData.isShowError" class="my-4 text-lg text-red-500">4.错误信息显示：修改模板文件之后重新上传即可</div>
    <el-table v-if="importExcelData.isShowError" :data="importExcelData.errorRows" height="350px" :border="true" :header-cell-style="{ background: '#F2F6FC' }" stripe>
      <el-table-column type="index" :align="'center'" label="序号" width="60" />
      <el-table-column show-overflow-tooltip label="错误行号" prop="rowNum" :align="'center'" />
      <el-table-column show-overflow-tooltip label="错误信息" prop="message" :align="'center'" />
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="importExcelHandler"><i class="iconfont icon-queding"></i>确定</el-button>
        <el-button @click="importExcelData.importFileDialog = false"><i class="iconfont icon-quxiao"></i>取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import ImportExcel from '@/components/Upload/ImportExcel.vue';
import { getExcelTemplateApi, batchImportApi } from '@/api/auth';
import { ImportError } from '@/api/auth/types';
import { ElMessage } from 'element-plus';
import { NextLoading } from '@/utils/loading';
// 区分是那个数据导入
const props = defineProps({
  type: {
    type: String,
    default: () => 'user'
  }
});
const emit = defineEmits(['queryTableData']);
// 批量导入文件对象
const importExcelData = reactive({
  // 上传文件对象
  importFile: null as any,
  // 上传文件弹窗
  importFileDialog: false,
  // 模板名称
  templateName: '批量导入模板',
  // 报错信息是否显示
  isShowError: false,
  // 错误信息
  errorRows: [] as ImportError[]
});
const importExcelHandler = () => {
  importExcelData.isShowError = false;
  NextLoading.start();
  try {
    batchImportApi(importExcelData.importFile, props.type).then(({ data }) => {
      if (data && data.errorRows) {
        ElMessage.warning('导入的数据中有部分有问题请查看报错信息！');
        importExcelData.isShowError = true;
        importExcelData.errorRows = data.errorRows;
      } else {
        ElMessage.success('导入成功！');
        importExcelData.importFileDialog = false;
        emit('queryTableData');
      }
      NextLoading.done();
    });
  } catch (error) {
    console.log(error);
    NextLoading.done();
  }
};
const openDialog = () => {
  importExcelData.importFileDialog = true;
};
const getExcelTemplate = () => {
  getExcelTemplateApi().then(({ data }) => {
    if (data) {
      downloadFile(data, importExcelData.templateName);
    }
  });
};
const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName; // 设置下载文件名
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
defineExpose({
  openDialog
});
</script>
