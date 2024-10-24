<!-- 文件上传组件统一封装 -->
<template>
  <el-upload
    :show-file-list="true"
    action=""
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="1"
    :on-exceed="handleExceed"
    :before-upload="handleBeforeUpload"
    :http-request="uploadFile"
  >
    <el-button type="primary"><i class="iconfont icon-daochu"></i>上传文件</el-button>
  </el-upload>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps, UploadRequestOptions } from 'element-plus';
import {mimeTypeMap} from '@/utils/fileType';
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
  // 文件大小限制单位MB
  fileMaxSize: {
    type: Number,
    default: () => 200
  },
  // 文件类型限制
  fileType: {
    type: Array,
    default: () => ['.jpg', '.png', '.pdf'],
  }
});
const fileMimeType = computed(() => {
  return props.fileType.map((item: any) => mimeTypeMap[item]);
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
  return true
  // return ElMessageBox.confirm(`确定删除 ${uploadFile.name} 吗?`).then(
  //   () => true,
  //   () => false
  // );
};
/**
 * 限制用户上传文件的格式和大小
 */
const handleBeforeUpload: UploadProps['beforeUpload'] = file => {

  // 文件类型限制
  if(!fileMimeType.value.includes(file.type)) {
    ElMessage.warning(`上传文件格式不正确，请上传正确的格式文件！`);
    return false;
  }
  // 文件大小限制
  if (file.size > props.fileMaxSize * 1024 * 1024) {
    ElMessage.warning(`上传文件大小不能大于${props.fileMaxSize}M！`);
    return false;
  }
  return true;
};
/**
 * 自定义上传
 */
async function uploadFile(options: UploadRequestOptions): Promise<any> {
  fileUrl.value = options.file
}
</script>
