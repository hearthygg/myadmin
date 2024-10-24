<!-- 文件上传组件统一封装 -->
<template>
  <el-upload v-model="fileUrl" :show-file-list="true" action="" multiple :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :before-upload="handleBeforeUpload" :http-request="uploadFile">
    <el-button type="primary"><i class="iconfont icon-daochu"></i>上传文件</el-button>
  </el-upload>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps, UploadRequestOptions } from 'element-plus';
import { uploadExpInfoImportFile, uploadExpInfoDownloadFile } from '@/api/file';
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: String
  },
  width: {
    type: Number,
    default: () => 200
  },
  height: {
    type: Number,
    default: () => 200
  },
  apiType: {
    type: String,
    default: () => 'import'
  },
  expId: {
    type: Number,
    default: () => 1
  },
  columnId: {
    type: Number,
    default: () => 1
  },
});

const fileUrl = computed<any>({
  get() {
    return props.modelValue;
  },
  set(val) {
    // imgUrl改变时触发修改父组件绑定的v-model的值
    emit('update:modelValue', val);
  }
});
/**
 * 删除已上传文件
 */
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  fileUrl.value = '';
};
/**
 * 文件个数限制
 */
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(`限制只能上传${uploadFiles.length}个文件`);
};
/**
 * 删除文件前钩子
 */
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`确定删除 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  );
};
/**
 * 限制用户上传文件的格式和大小
 */
const handleBeforeUpload: UploadProps['beforeUpload'] = file => {
  if (file.size > 50 * 1048 * 1048) {
    ElMessage.warning('上传文件大小不能大于50M！');
    return false;
  }
  return true;
};
/**
 * 自定义上传
 */
async function uploadFile(options: UploadRequestOptions): Promise<any> {
  // imgUrl.value = options.file as any
  const { data } = props.apiType === 'import' ? await uploadExpInfoImportFile(options.file, props.expId, props.columnId) : await uploadExpInfoDownloadFile(options.file, props.expId, props.columnId);
  // console.log(data);
  // imgUrl.value = fileInfo.url;
  fileUrl.value = data;
}
</script>
