<template>
  <!-- 上传组件 -->
  <el-upload class="single-uploader" v-model="imgUrl" :show-file-list="false" list-type="picture-card"
    :before-upload="handleBeforeUpload" :http-request="uploadFile">
    <!-- <img v-if="imgUrl" :src="imgUrl" class="single" /> -->
    <img v-if="imgBase64" :src="imgBase64" class="single" />
    <el-icon v-else class="single-uploader-icon">
      <Plus />
    </el-icon>
  </el-upload>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import {
  ElMessage,
  ElUpload,
  UploadRawFile,
  UploadRequestOptions
} from 'element-plus';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const imgUrl = computed<string | undefined>({
  get() {
    if(props.modelValue !== '') {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      imgBase64.value = props.modelValue
    }
    return props.modelValue;
  },
  set(val) {
    // imgUrl改变时触发修改父组件绑定的v-model的值
    emit('update:modelValue', val);
  }
});

let imgBase64 = ref('')
/**
 * 自定义图片上传
 *
 * @param options
 */
async function uploadFile(options: UploadRequestOptions): Promise<any> {
  imgUrl.value = options.file as any
  // const { data: fileInfo } = await uploadFileApi(options.file);
  // imgUrl.value = fileInfo.url;
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  if(!/\.(png|jpg|jpeg|webp|gif|svg|ico)$/.test(file.name)) {
    ElMessage.warning('只能上传这些格式：png|jpg|jpeg|webp|gif|svg|ico 的图片');
    return false;
  }
  if (file.size > 2 * 1048 * 1048) {
    ElMessage.warning('上传图片不能大于2M');
    return false;
  }
  return true;
}
watch(
  () => imgUrl.value,
  value => {
    // 上传还未保存展示base64图片
    if (value as any instanceof File) {
      let reader = new FileReader();
      reader.readAsDataURL(value as any);
      reader.onload = function () {
        //获取到base64格式图片
        imgBase64.value = reader.result as string
      };
    } else {
      // 编辑展示的图片
      imgBase64.value = value as any
    }
  }
);
</script>

<style scoped>
.single-uploader .single {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.single-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.single-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.single-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
