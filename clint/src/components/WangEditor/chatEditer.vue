<template>
  <div style="background-color: #EDF4FB;">
    <!-- 工具栏 -->
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <!-- 编辑器 -->
    <Editor :defaultConfig="editorConfig" v-model="defaultHtml" @onChange="handleChange" @customPaste="customPaste"
      style="height: 120px; overflow-y: auto" :mode="mode" @onCreated="handleCreated" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, shallowRef, reactive, toRefs } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IToolbarConfig, IDomEditor } from '@wangeditor/editor'
import { uploadFileApi } from '@/api/file';
import { compressImgBySize } from '@/utils/compressImg'
const props = defineProps({
  modelValue: {
    type: [String],
    default: ''
  },
});

const emit = defineEmits(['update:modelValue']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const state = reactive({
  toolbarConfig: {
    toolbarKeys: ['emotion', "uploadImage"],
  } as IToolbarConfig,
  editorConfig: {
    placeholder: '输入内容，(Enter换行,Ctrl+Enter发送)',
    MENU_CONF: {
      uploadImage: {
        // 自定义图片上传
        async customUpload(file: any, insertFn: any) {
          uploadFileApi(file).then(({data}) => {
            insertFn(data.fileUrl)
          })
          // let reader = new FileReader();
          // reader.readAsDataURL(file);
          // reader.onload = function () {
          //   //展示base64格式图片
          //   compressImgBySize(reader.result, 50).then(baseImg => {
          //     // 输出图片base64
          //     // console.log(baseImg)
          //     insertFn(baseImg);
          //   })
          // };
        }
      }
    }
  },
  defaultHtml: props.modelValue,
  mode: 'default'
});

const { toolbarConfig, editorConfig, defaultHtml, mode } = toRefs(state);

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

function handleChange(editor: any) {
  emit('update:modelValue', editor.getHtml());
}
// 实现粘贴图片上传
const customPaste = (editor: IDomEditor, event: ClipboardEvent, callback: any) => {
  // const html = event.clipboardData?.getData('text/html') // 获取粘贴的 html
  // const text = event.clipboardData?.getData('text/plain') // 获取粘贴的纯文本
  // const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）

  // 获取粘贴的图片
  let blob = event.clipboardData?.items[0].getAsFile()
  if (!blob) {
    callback(true)
  }
  if (!/\.(png|jpg|jpeg|webp|gif)$/.test(blob?.name as string)) {
    // 粘贴不是图片,继续默认的粘贴行为
    callback(true)
  } else {
    // 粘贴是图片
    // let reader = new FileReader();
    // reader.readAsDataURL(blob as File);
    // reader.onload = function () {
    //   //展示base64格式图片
    //   // editor.insertText(reader.result as string);
    //   let imgObj = document.createElement("img")
    //   imgObj.src = reader.result as string
    //   // editor.insertNode(imgObj);
    //   editor.dangerouslyInsertHtml(`<img :src="${reader.result}"></img>`);
    // };
  }
}
function clearEditContent() {
  editorRef.value.clear()
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
defineExpose({
  clearEditContent,
})
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
@import '@/styles/mixin.scss';

/* 富文本编辑器全屏之后让层级较高盖住其他层级 */
.w-e-full-screen-container {
  z-index: 999;
}

.w-e-panel-content-emotion {
  height: 100px;
  overflow: auto;
  @include scrollBar;
}

.w-e-scroll {
  @include scrollBar;
}
</style>