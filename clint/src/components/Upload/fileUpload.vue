<!-- 文件上传组件(头像上传)统一封装 -->
<template>
  <div>
    <el-upload
      v-model:file-list="fileList"
      :show-file-list="true"
      list-type="picture-card"
      action=""
      multiple
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :before-remove="beforeRemove"
      :limit="1"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
      :http-request="uploadFile"
    >
      <!-- <el-button type="primary"><i class="iconfont icon-daochu"></i>上传文件</el-button> -->
      <el-icon><Plus /></el-icon>
    </el-upload>
    <!-- 图片预览 -->
    <el-image-viewer v-if="showImagePreview" :zoom-rate="1.2" @close="closePreview" :url-list="imgPreviewList" />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps, UploadRequestOptions } from 'element-plus';
import { uploadFileApi } from '@/api/file';
import { Plus } from '@element-plus/icons-vue';
import { mimeTypeMap } from '@/utils/fileType';
const emit = defineEmits(['update:modelValue']);
const imgPreviewList = ref<string[]>([]);
const showImagePreview = ref(false);
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
  // 文件类型限制
  fileType: {
    type: Array,
    default: () => ['.jpg', '.png', '.gif']
  },
  fileMaxSize: {
    type: Number,
    default: () => 5
  }
});
const fileMimeType = computed(() => {
  return props.fileType.map((item: any) => mimeTypeMap[item]);
});
const fileUrl = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    // imgUrl改变时触发修改父组件绑定的v-model的值
    // console.log(fileUrl.value);
    emit('update:modelValue', val);
  }
});

const fileList = computed(() => {
  if (fileUrl.value) {
    return [
      {
        name: fileUrl.value,
        url: fileUrl.value
      }
    ];
  } else {
    return [];
  }
});

// 便于双向绑定数据回显
// watch(
//   () => props.modelValue,
//   newVal => {
//     fileUrl.value = newVal;
//   }
// );
// 关闭图片预览
const closePreview = () => {
  imgPreviewList.value = [];
  showImagePreview.value = false;
};
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
  // return ElMessageBox.confirm(`确定删除 ${uploadFile.name} 吗?`).then(
  //   () => true,
  //   () => false
  // );
  return true;
};
/**
 * 限制用户上传文件的格式和大小
 */
const handleBeforeUpload: UploadProps['beforeUpload'] = file => {
  // 文件类型限制
  if (!fileMimeType.value.includes(file.type)) {
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
/**预览图片 */
const handlePictureCardPreview: UploadProps['onPreview'] = uploadFile => {
  // dialogImageUrl.value = uploadFile.url!;
  // dialogVisible.value = true;
  imgPreviewList.value = [uploadFile.url as string];
  showImagePreview.value = true;
};
/**
 * 自定义上传
 */
async function uploadFile(options: UploadRequestOptions): Promise<any> {
  // const { data } = props.apiType === 'import' ? await uploadExpInfoImportFile(options.file, props.expId, props.columnId) : await uploadExpInfoDownloadFile(options.file, props.expId, props.columnId);
  const { data } = await uploadFileApi(options.file);
  fileUrl.value = data.fileUrl;
}
</script>
