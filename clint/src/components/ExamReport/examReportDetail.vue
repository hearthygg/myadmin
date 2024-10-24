<template>
  <div ref="containerRef">
    <div class="pb-4 btLine" v-for="(item, index) in reportData" :key="index">
      <div class="flex align-baseline mt-2">
        <span class="text-xl font-bold text-gray-600 mr-2">{{ index + 1 }}.</span>
        <div class="stemContainer" v-renderHtml="{ index, data: item, currentState }"></div>
      </div>
    </div>
    <div v-if="props.currentState === 'edit'" class="pt-2 text-right">
      <el-button @click="submitExamReporte" type="primary"><i class="iconfont icon-queding" />提交报告</el-button>
    </div>
    <!-- 图片预览 -->
    <el-image-viewer v-if="showImagePreview" :zoom-rate="1.2" @close="closePreview" :url-list="imgPreviewList" />
  </div>
</template>
<script lang="ts" setup>
import { PropType, onMounted, ref } from 'vue';
import { ExamReport } from '@/api/examReport/types';
import { uploadFileByFormApi } from '@/api/file';
import eventBus from '@/utils/eventBus';
// 定义父组件传过来的值
const props = defineProps({
  // 实验报告数据
  examReportData: {
    require: true,
    // 充分的类型提示
    type: Object as PropType<ExamReport[]>
  },
  currentState: {
    type: String,
    default: 'view'
  },
  isShowBtn: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['submitExamReporte']);
const containerRef = ref<HTMLDivElement | null>(null);
const reportData = ref<ExamReport[]>([]);
const imgPreviewList = ref<any>([]);
const showImagePreview = ref(false);

// 图片预览
const handlePreview = (url: string) => {
  imgPreviewList.value = [url];
  showImagePreview.value = true;
};

const submitExamReporte = () => {
  // 提交实验报告
  emit('submitExamReporte', reportData.value);
};
// 关闭图片预览
const closePreview = () => {
  imgPreviewList.value = [];
  showImagePreview.value = false;
};
const handleCollect = (index: number, index1: number) => {
  // 调用子页面的事件
  const iframe = document.getElementById('myIframe');
  const iframeWindow = iframe.contentWindow;
  // 从子页面中采集数据
  // reportData.value[index].answerOptions[index1].submitResult = iframeWindow.handleCollect(reportData.value[index].answerOptions[index1]);
  iframeWindow.handleCollect(reportData.value[index].answerOptions[index1]).then((res: any) => {
    if (reportData.value[index].answerOptions[index1].collectionType === '1') {
      // 采集图片
      uploadFileByFormApi(res).then(response => {
        const url = response.data.fileUrl;
        reportData.value[index].answerOptions[index1].submitResult = url;
      });
    } else {
      // 采集数据
      reportData.value[index].answerOptions[index1].submitResult = res;
    }
  });
};

// 纠正一些富文本样式
const setEditorStyle = () => {
  // 获取表格元素
  const tableDoms = document.querySelectorAll('.stemContainer table');
  tableDoms.forEach(element => {
    // 添加边框样式
    element.style.border = '1px solid #606266'; // 这将给整个表格添加边框
    element.style.borderCollapse = 'collapse'; // 使单元格之间的边框合并
    element.style.margin = '0 auto'; //让表格居中
    // 如果需要给每个单元格也添加边框
    var cells = element.getElementsByTagName('td');
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.border = '1px solid #606266';
      cells[i].style.textAlign = 'center';
    }
  });

  // 调整图片居中
  const imgDoms = document.querySelectorAll('.stemContainer img');
  imgDoms.forEach(element => {
    element.style.margin = '0 auto';
  });
};
onMounted(() => {
  reportData.value = props.examReportData as ExamReport[];

  // 事件总线更新用户答案
  eventBus.on('changeSubmitRes', (receivedData: any) => {
    reportData.value[receivedData.parentIndex].answerOptions[receivedData.childIndex].submitResult = receivedData.value;
  });
  // 大图预览
  eventBus.on('viewImg', (url: string) => {
    handlePreview(url)
  });
  setTimeout(() => {
    setEditorStyle();
  }, 0);
});
</script>
<style lang="scss" scoped>
.imgRes {
  width: 120px;
  height: 120px;
  border-radius: 5px;
  :deep(.el-empty__image) {
    width: 80px;
  }
}
.imgWidth {
  width: 120px;
  height: 68px;
}
.btLine {
  border-bottom: 1px solid #e4e7ed;
}
.stemContainer {
  color: #606266;
  font-family: Microsoft YaHei;
  font-size: 16px;
  // font-weight: bold;
}
</style>
