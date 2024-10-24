<!-- 以iframe的形式预览pdf -->
<template>
  <div class="pdf-container" :style="`height: ${height};`">
    <!-- 使用pdf.js -->
    <iframe id="pdf-container" :style="`height: ${height};`" class="pdf-container" :src="encodePdfUrl"></iframe>
    <!-- 直接使用浏览器的pdf -->
    <!-- <iframe :style="`height: ${height};`" class="pdf-container" :src="encodePdfUrl"></iframe> -->
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, watch, ref } from 'vue';

const props = defineProps({
  pdfUrl: {
    require: true,
    type: String,
    default: () => import.meta.env.VITE_APP_PUBLIC_PATH + 'testPdf.pdf'
  },
  height: {
    type: String,
    default: () => 'calc(100vh - 50px)'
  },
  // 需要跳转对应大纲位置才会传递当前属性
  currentDocumentTitle: {
    type: String,
    default: () => '实验五  基于线上的DA芯片DAC5311输出与控制'
  }
});
const currentPdfInstance = ref<any>();
const documentTitles = ref<string[]>([]);
// const pdfjsUrl = 'http://10.10.10.124:8989/commonSource/js/pdfjs/web/viewer.html'
const pdfjsUrl = `${import.meta.env.VITE_APP_PUBLIC_PATH}static/pdf/web/viewer.html`
// 使用计算属性监听父组件传递值的变化 从而动态修改页面属性
const encodePdfUrl = computed(() => {
  return `${pdfjsUrl}?file=${props.pdfUrl[0] == '/' ? encodeURIComponent(props.pdfUrl) : '/' + encodeURIComponent(props.pdfUrl)}`;
});
// 获取pdf.js实例
const getViewerInstance = () => {
  return new Promise((resolve, reject) => {
    try {
      const pdfIframe = document.querySelector('#pdf-container') as HTMLIFrameElement;
      // if (pdfIframe.contentWindow?.document.readyState !== 'complete') {
      //   throw new Error('页面尚未加载完成');
      // }

      // PDFViewerApplication：重点，这个就是 pdfjs 封装好的、完整的 pdf 实例，我们后续所有的操作基本都是在和它打交道。
      // PDFViewerApplicationOptions：当前 pdfjs 实例正在使用的一些配置项，可以了解一下，一般来说用不到。
      pdfIframe.onload = () => {
        const { PDFViewerApplication, PDFViewerApplicationOptions } = pdfIframe.contentWindow as any;
        resolve({ PDFViewerApplication, PDFViewerApplicationOptions, pdfIframe });
      };
    } catch (error) {
      reject(error);
    }
  });
};
/** 监听加载状态 */
const actionListenInit = (app: any, pdfIframe: any) => {
  app.initializedPromise.then(() => {
    currentPdfInstance.value = app;
    // console.log('实例加载完成');
    app.pdfOutlineViewer.eventBus.on('outlineloaded', function (data: any) {
      // 获取大纲标题
      documentTitles.value = [];
      data.source._outline.map((item: any) => {
        documentTitles.value.push(item.title);
      });
      if(!documentTitles.value.includes(props.currentDocumentTitle)) return;
      // 打开大纲视图
      const viewerBtn = pdfIframe.contentDocument.querySelector('#sidebarToggle');
      if (!viewerBtn.getAttribute('class').includes('toggled')) {
        console.log('打开大纲视图');
        triggerClick(viewerBtn);
      }
      // 显示大纲列表
      const viewerListBtn = pdfIframe.contentDocument.querySelector('#viewOutline');
      if (!viewerListBtn.getAttribute('class').includes('toggled')) {
        console.log('打开大纲列表视图');
        triggerClick(viewerListBtn);
      }
      // 设置大纲背景颜色
      const outlineView = pdfIframe.contentDocument.querySelector('#outlineView');
      outlineView.style.backgroundColor = '#f5f7fa';
      // 跳转对应的页面
      setTimeout(() => {
        const titleList = pdfIframe.contentDocument.querySelectorAll('#outlineView .treeItem');
        titleList.forEach((li: any) => {
          const aTag = li.querySelector('a');
          if (aTag) {
            const textContent = aTag.textContent.trim();
            if (textContent === props.currentDocumentTitle && !li.getAttribute('class').includes('selected')) {
              console.log('找到标题，开始跳转', textContent);
              triggerClick(aTag);
            }
          }
        });
      }, 200);
    });
  });
};
// dom元素触发点击事件
const triggerClick = (element: HTMLElement) => {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });

  element.dispatchEvent(event);
};

watch(
  encodePdfUrl,
  () => {
    nextTick(async () => {
      if (props.currentDocumentTitle) {
        const { PDFViewerApplication, pdfIframe } = await getViewerInstance();
        actionListenInit(PDFViewerApplication, pdfIframe);
      }
    });
  },
  {
    immediate: true
  }
);
</script>
<style lang="scss" scoped>
.pdf-container {
  width: 100%;
  height: calc(100vh - 50px);
}
</style>
