<template>
  <el-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
    :limit="props.limit"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import {
  ElMessage,
  ElUpload,
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile,
  UploadFile,
  UploadProps
} from 'element-plus';
import { uploadFileApi, deleteFileApi } from '@/api/file';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  /**
   * 文件路径集合
   */
  modelValue: {
    type: Array<string>,
    default: [] as Array<string>
  },
  /**
   * 文件上传数量限制
   */
  limit: {
    type: Number,
    default: 5
  }
});

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

const fileList = ref([] as UploadUserFile[]);
watch(
  () => props.modelValue,
  (newVal: string[]) => {
    const filePaths = fileList.value.map(file => file.url);
    // 监听modelValue文件集合值未变化时，跳过赋值
    if (
      filePaths.length > 0 &&
      filePaths.length === newVal.length &&
      filePaths.every(x => newVal.some(y => y === x)) &&
      newVal.every(y => filePaths.some(x => x === y))
    ) {
      return;
    }

    fileList.value = newVal.map(filePath => {
      return { url: filePath } as UploadUserFile;
    });
  },
  { immediate: true }
);

/**
 * 自定义图片上传
 *
 * @param params
 */
async function handleUpload(options: UploadRequestOptions): Promise<any> {
  // 上传API调用
  const { data: fileInfo } = await uploadFileApi(options.file);

  // 上传成功需手动替换文件路径为远程URL，否则图片地址为预览地址 blob:http://
  const fileIndex = fileList.value.findIndex(
    file => file.uid == (options.file as any).uid
  );

  fileList.value.splice(fileIndex, 1, {
    name: fileInfo.name,
    url: fileInfo.url
  } as UploadUserFile);

  emit(
    'update:modelValue',
    fileList.value.map(file => file.url)
  );
}

/**
 * 删除图片
 */
function handleRemove(removeFile: UploadFile) {
  const filePath = removeFile.url;

  if (filePath) {
    deleteFileApi(filePath).then(() => {
      // 删除成功回调
      emit(
        'update:modelValue',
        fileList.value.map(file => file.url)
      );
    });
  }
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  if (file.size > 2 * 1048 * 1048) {
    ElMessage.warning('上传图片不能大于2M');
    return false;
  }
  return true;
}

/**
 * 图片预览
 */
const handlePreview: UploadProps['onPreview'] = uploadFile => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
</script>
