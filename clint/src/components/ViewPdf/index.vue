<!-- 预览pdf文件 -->
<template>
  <div class="usinghelp-container">
    <div class="pdf-view">
      <canvas :id="`pdfCanvas${page}`" v-for="page in state.pdfPages" :key="page"></canvas>
    </div>
    <div class="pdf-bottom">我是操作区域</div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, reactive } from "vue"
import * as pdfjs from "pdfjs-dist"
import pdfFile from "@/assets/testPdf.pdf"
const state = reactive({
  // pdfDoc: '' as any,
  pdfPages: 0,
  pdfScale: 1,
})
let pdfDoc: any = ''
// 加载pdf文件
async function loadPdfFile(url: string) {
  pdfjs.GlobalWorkerOptions.workerSrc = await import('pdfjs-dist/build/pdf.worker.entry')
  const loadingTask = pdfjs.getDocument(url)
  loadingTask.promise.then((pdf) => {
    pdfDoc = pdf // 保存加载的pdf文件流
    state.pdfPages = pdfDoc.numPages // 获取pdf文件的总页数
    nextTick(() => {
      renderPage(1) // 将pdf文件内容渲染到canvas，
    })
  })
}
// num 表示渲染第几页
function renderPage(num: number) {
  pdfDoc.getPage(num).then((page: any) => {
    const canvas: any = document.getElementById(`pdfCanvas${num}`) // 获取页面中的canvas元素
    // 以下canvas的使用过程
    const ctx: any = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const bsr = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1
    const ratio = dpr / bsr
    const viewport = page.getViewport({ scale: state.pdfScale }) // 设置pdf文件显示比例
    canvas.width = viewport.width * ratio
    canvas.height = viewport.height * ratio
    canvas.style.width = viewport.width + 'px'
    canvas.style.height = viewport.height + 'px'
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0) // 设置当pdf文件处于缩小或放大状态时，可以拖动
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    }
    // 将pdf文件的内容渲染到canvas中
    page.render(renderContext)
    // if (state.pdfPages > num) {
    //   renderPage(num + 1);
    // }
  })
}
onMounted(() => {
  loadPdfFile(pdfFile)
})
</script>
<style lang="scss" scoped>
.usinghelp-container {
  .pdf-view {
    width: 80vw;
    height: 80vh;
    margin: 0 auto;
    border: 1px solid #f90;
    overflow: auto;
  }
}
</style>