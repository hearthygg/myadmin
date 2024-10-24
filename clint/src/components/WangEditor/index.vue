<template>
  <div style="border: 1px solid #ccc;border-radius: 5px;">
    <!-- 工具栏 -->
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" style="border-bottom: 1px solid #ccc;border-radius: 5px;" :mode="mode" />
    <!-- 编辑器 -->
    <Editor :defaultConfig="editorConfig" v-model="defaultHtml" @onChange="handleChange" :style="`height: ${props.height};`" style="overflow-y: auto;border-radius: 5px;" :mode="mode" @onCreated="handleCreated" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, shallowRef, reactive, toRefs, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IToolbarConfig, IButtonMenu, IDomEditor, Boot } from '@wangeditor/editor';
// API 引用
import { uploadExpFileApi, uploadFileApi, uploadQuestionFileApi,uploadNoticeFileApi } from '@/api/file';

const props = defineProps({
  modelValue: {
    type: [String],
    default: ''
  },
  fileType: {
    type: [String],
    default: 'ordinary'
  },
  expId: {
    type: [Number],
    default: -1
  },
  height: {
    type: [String],
    default: '450px'
  }
});

const emit = defineEmits(['update:modelValue']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const state = reactive({
  toolbarConfig: {
    // 去除插入视频菜单
    excludeKeys: ['group-video'],
    // 插入自定菜单
    insertKeys: {
      //基于当前菜单的位置
      index: 17,
      // 菜单的key与注册菜单中的key保持一致
      keys: ['insertTkOption']
    }
  } as IToolbarConfig,
  editorConfig: {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        // 自定义图片上传
        async customUpload(file: any, insertFn: any) {
          if (props.fileType === 'ordinary') {
            // 普通的图片上传
            uploadFileApi(file).then(response => {
              const url = response.data.fileUrl;
              insertFn(url);
            });
          } else if (props.fileType === 'questionType') {
            // 试题图片上传
            uploadQuestionFileApi(file).then(response => {
              const url = response.data.fileUrl;
              insertFn(url);
            });
          } else if(props.fileType === 'exp') {
            // 实验相关图片上传
            uploadExpFileApi(file,props.expId).then(response => {
              const url = response.data.fileUrl;
              insertFn(url);
            });
          } else if(props.fileType === 'notice') {
            // 公告相关图片上传
            uploadNoticeFileApi(file).then(response => {
              const url = response.data.fileUrl;
              insertFn(url);
            });
          }
         }
      }
    }
  },
  defaultHtml: props.modelValue,
  mode: 'default'
});

const { toolbarConfig, editorConfig, defaultHtml, mode } = toRefs(state);

// 添加自定义菜单
function registerMenuButton() {
  // 自定义按钮菜单
  class MyButtonMenu implements IButtonMenu {
    title: string;
    tag: string;
    constructor() {
      this.title = '插入填空'; // 自定义菜单标题
      // this.iconSvg = '<svg>...</svg>' // 可选
      this.tag = 'button';
    }

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
    getValue(editor: IDomEditor): string | boolean {
      // TS 语法
      const regex = /___\((\d+)\)___/g;
      const matches = editor.getHtml().match(regex);
      const count = matches ? matches.length : 0;
      return ` ___(${count + 1})___ `;
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor: IDomEditor): boolean {
      // TS 语法
      return false;
    }

    // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
    isDisabled(editor: IDomEditor): boolean {
      // TS 语法
      return false;
    }

    // 点击菜单时触发的函数
    exec(editor: IDomEditor, value: string | boolean) {
      // TS 语法
      if (this.isDisabled(editor)) return;
      // editor.insertText(value as string);
      editor.insertNode({text:value as string,color: 'red',bold: true});
    }
  }
  // 注册菜单到editer
  const menu1Conf = {
    key: 'insertTkOption', // 定义 menu key ：要保证唯一、不重复（重要）
    factory() {
      return new MyButtonMenu(); // 把 `YourMenuClass` 替换为你菜单的 class
    }
  };
  Boot.registerMenu(menu1Conf);
}

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  // 添加自定义菜单
  if (!editor.getAllMenuKeys().includes('insertTkOption')) {
    registerMenuButton();
  }
};

function handleChange(editor: any) {
  emit('update:modelValue', editor.getHtml());
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
// 清空富文本内容
function clearEditContent() {
  editorRef.value.clear();
}
defineExpose({
  clearEditContent
});
/**
 * 父组件传递值的变化
 */
watch(
  () => props.modelValue,
  value => {
    state.defaultHtml = value;
  }
);
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
@import '@/styles/mixin.scss';

/* 富文本编辑器全屏之后让层级较高盖住其他层级 */
.w-e-full-screen-container {
  z-index: 999;
}

.w-e-panel-content-emotion {
  height: 300px;
  overflow: auto;
  @include scrollBar;
}
.w-e-scroll {
  @include scrollBar;
}
</style>
