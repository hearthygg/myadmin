<template>
  <div class="reportItem">
    <div class="tipsContainer" :class="{ imgWidth: currentData.answerType === '1' && currentData.collectionType === '1' }">
      <template v-if="currentData.answerType === '1'">
        <!-- 采集图片 -->
        <div class="showImg" @mouseover="isHover = true" @mouseout="isHover = false" v-if="currentData.collectionType === '1'">
          <i v-show="isHover" @click="deleteResult" v-if="currentData.submitResult && currentState === 'edit'" class="deleteBtn iconfont icon-guanbi"></i>
          <button v-if="!currentData.submitResult && currentState === 'edit'" @click="handleCollect" class="el-button el-button--primary el-button--default" aria-disabled="false" type="button">
            <span class="">采集图片</span>
          </button>
          <img @click="viewImg(currentData.submitResult)" v-previewImage="currentData.submitResult" v-if="currentData.submitResult" :src="currentData.submitResult" />
          <span v-if="!currentData.submitResult && currentState === 'view'" class="el-tag el-tag--info el-tag--default el-tag--light"><span class="el-tag__content text-center">暂无数据</span></span>
        </div>
        <!-- 采集数据 -->
        <div class="showData p-2" @mouseover="isHover = true" @mouseout="isHover = false" v-if="currentData.collectionType === '2'">
          <button v-if="!currentData.submitResult && currentState === 'edit'" @click="handleCollect" class="el-button el-button--primary el-button--default" aria-disabled="false" type="button">
            <span class="">采集数据</span>
          </button>
          <div class="text-xl font-bold text-center" style="color: #909399" v-if="currentData.submitResult">{{ currentData.submitResult }}</div>
          <i v-show="isHover" @click="deleteResult" style="font-size: 12px; top: 0" v-if="currentData.submitResult && currentState === 'edit'" class="deleteBtn iconfont icon-guanbi"></i>
          <span v-if="!currentData.submitResult && currentState === 'view'" class="el-tag el-tag--info el-tag--default el-tag--light"><span class="el-tag__content text-center">暂无数据</span></span>
        </div>
      </template>
      <template v-if="currentData.answerType === '2'">
        <!-- 文本填写（长） -->
        <textarea v-if="currentState === 'edit'" v-model="currentData.submitResult" class="myArea el-textarea__inner" rows="3" tabindex="0" autocomplete="off" placeholder="请填写正确答案" style="min-height: 31px"></textarea>
        <span v-if="!currentData.submitResult && currentState === 'view'" class="el-tag el-tag--info el-tag--default el-tag--light"><span class="el-tag__content text-center">暂无数据</span></span>
        <div class="myArea p-3" v-if="currentData.submitResult && currentState === 'view'">{{ currentData.submitResult }}</div>
      </template>
      <template v-if="currentData.answerType === '3'">
        <!-- 文本填写（短） -->
        <input v-if="currentState === 'edit'" v-model="currentData.submitResult" class="myInput el-input__inner" type="text" autocomplete="off" tabindex="0" placeholder="填写答案" />
        <span v-if="!currentData.submitResult && currentState === 'view'" class="el-tag el-tag--info el-tag--default el-tag--light"><span class="el-tag__content text-center">暂无数据</span></span>
        <div class="myInput p-3" v-if="currentData.submitResult && currentState === 'view'">{{ currentData.submitResult }}</div>
      </template>
      <div v-if="isShowComment" class="tipsContent" @click.stop="openCorrectDialog">
        <template v-if="currentCorrectRes.score !== null">
          <span class="myTag mr-2" :class="currentStyle.activeClass">{{ currentCorrectRes.score }}</span>
          <span class="mr-2">[ <i :style="`color: ${currentStyle.color};`" class="iconfont myIcon" :class="currentStyle.icon"></i> ]</span>
          <span v-if="currentCorrectRes.tips" class="ellipsis">{{ currentCorrectRes.tips }}</span>
        </template>
        <span v-else class="myTag myTag-warning">暂未批改</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AnswerOptions, CorrectionDetail } from '@/api/examReport/types';
import { uploadExpReportFileApi } from '@/api/file';
import { computed, onMounted, PropType, reactive, ref, watch } from 'vue';
import eventBus from '@/utils/eventBus';
import { getParameterByName } from '@/utils/commonMethods';
import { ElMessage } from 'element-plus';
// const route = useRoute();
// 定义父组件传过来的值
const props = defineProps({
  // 当前控件数据
  showData: {
    required: true,
    // 充分的类型提示
    type: Object as PropType<AnswerOptions>
  },
  parentIndex: {
    type: Number,
    default: 0
  },
  childIndex: {
    type: Number,
    default: 0
  },
  // 预览视图不显示控件
  currentState: {
    type: String,
    default: 'view'
  }
});
// 当前填空项相关数据
const currentData = ref<AnswerOptions>(props.showData);
const isHover = ref(false);
// 批注显示状态
const isShowComment = ref(true);
const currentCorrectRes = reactive({
  tips: '',
  score: 0 as number | null
});
// 大图预览
const viewImg = (url: string) => {
  eventBus.emit('viewImg', url);
};
// 开启批改当前题目弹窗
const openCorrectDialog = () => {
  eventBus.emit('openCorrectDialog', {
    parentIndex: props.parentIndex,
    childIndex: props.childIndex
  });
};
// 根据当前得分控制样式
const currentStyle = computed(() => {
  let icon = '';
  let activeClass = '';
  let color = '';
  if(currentCorrectRes.score === 0) {
    // 0分情况
    icon = 'icon-cuo'
    activeClass = 'myTag-danger'
    color = '#f56c6c'
  } else if(currentCorrectRes.score === props.showData.core) {
    // 满分情况
    icon = 'icon-dui'
    activeClass = 'myTag-success'
    color = '#67c23a'
  } else {
    // 半对情况
    icon = 'icon-bandui'
    activeClass = 'myTag-warning'
    color = '#e6a23c'
  }
  return {
    icon,
    activeClass,
    color,
  };
});
// 采集图片或者采集数据处理
const handleCollect = () => {
  try {
    // 调用子页面的事件
    const iframe = document.getElementById('myIframe');
    const iframeWindow = iframe?.contentWindow;
    // 从子页面中采集数据
    iframeWindow.handleCollect(currentData.value).then((res: any) => {
      if (currentData.value.collectionType === '1') {
        // 采集图片
        const courseExpId = getParameterByName('courseExpId', window.location.href) as string;
        uploadExpReportFileApi(res, courseExpId).then(response => {
          const url = response.data.fileUrl;
          currentData.value.submitResult = url;
        });
      } else {
        // 采集数据
        currentData.value.submitResult = res;
      }
    });
  } catch (error) {
    console.log(error);
    ElMessage.error('请先进入实验或者当前实验不支持数据采集！');
  }
};

// 删除答案项
const deleteResult = () => {
  currentData.value.submitResult = '';
};
onMounted(() => {
  // 获取当前题目的批改信息
  eventBus.on('sendCorrectRes', (res: any) => {
    const correctRes = res as CorrectionDetail[];
    correctRes.map((v, i) => {
      v.answerGroups.map((v2, i2) => {
        if (i === props.parentIndex && i2 === props.childIndex) {
          currentCorrectRes.score = v2.score;
          currentCorrectRes.tips = v2.tips;
        }
      });
    });
  });
  // 批改和预览实验报告控制批注显示和隐藏
  eventBus.on('changeCorrectStatus', (res: any) => {
    isShowComment.value = res
  });
  if(!window.location.href.includes('/education/examReport')) {
    // 除了批改和预览界面隐藏批注信息
    isShowComment.value = false;
  }
});
watch(
  () => currentData.value.submitResult,
  value => {
    // 事件总线发送学生提交数据
    eventBus.emit('changeSubmitRes', {
      parentIndex: props.parentIndex,
      childIndex: props.childIndex,
      value
    });
  }
);
</script>
<style lang="scss" scoped>
.reportItem {
  text-indent: 0;
}
.showImg {
  width: 300px;
  height: 170px;
  border: 1px solid #e4e7ed;
  border-radius: 5px;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
}
.showData {
  // width: 120px;
  // height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.deleteBtn {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 18px;
  cursor: pointer;
}
.myInput {
  width: 90%;
  margin: 0 auto;
  color: #909399;
}
.myArea {
  margin: 0 auto;
  width: 100%;
  border: 1px solid #e4e7ed;
  color: #909399;
}

// 批注设置
.tipsContainer {
  position: relative;
  // border: 1px solid #3b82f6;
  cursor: pointer;
  .tipsContent {
    position: absolute;
    display: flex;
    align-items: center;
    top: -30px;
    right: -50px;
    border-radius: 5px;
    background-color: #d3e3fd;
    padding: 5px;
    font-size: 15px;
    color: #303133;
    overflow: visible; /* 确保伪元素不会被容器裁剪 */
    &::after {
      content: '';
      position: absolute;
      bottom: -10px; /* 根据需要调整 */
      // left: calc(50% - 5px);
      left: 4px; /* 根据需要调整箭头的位置 */
      width: 0;
      height: 0;
      border-left: 10px solid transparent; /* 左侧透明 */
      border-right: 10px solid transparent; /* 右侧透明 */
      border-top: 10px solid #d3e3fd; /* 顶部颜色与div背景相同 */
    }
    .ellipsis {
      display: inline-block; /* 确保 span 有固定宽度 */
      width: 60px; /* 固定宽度为 50px */
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 隐藏超出部分 */
      text-overflow: ellipsis; /* 显示省略号 */
    }
    &:hover {
      opacity: 0.6;
    }
  }
}
.imgWidth {
  width: 300px;
  margin: 0 auto;
}
.myIcon {
  font-size: 18px;
}
// 类似于el-tag
.myTag {
  --el-tag-font-size: 12px;
  --el-tag-border-radius: 4px;
  --el-tag-border-radius-rounded: 9999px;
  --el-tag-bg-color: var(--el-color-primary-light-9);
  --el-tag-border-color: var(--el-color-primary-light-8);
  --el-tag-hover-color: var(--el-color-primary);
  --el-tag-text-color: var(--el-color-primary);
  background-color: var(--el-tag-bg-color);
  border-color: var(--el-tag-border-color);
  color: var(--el-tag-text-color);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  font-size: var(--el-tag-font-size);
  line-height: 1;
  border-width: 1px;
  border-style: solid;
  border-radius: var(--el-tag-border-radius);
  box-sizing: border-box;
  white-space: nowrap;
  --el-icon-size: 14px;
}
.myTag-success {
  --el-tag-text-color: var(--el-color-success);
  --el-tag-bg-color: var(--el-color-success-light-9);
  --el-tag-border-color: var(--el-color-success-light-8);
  --el-tag-hover-color: var(--el-color-success);
}
.myTag-warning {
  --el-tag-text-color: var(--el-color-warning);
  --el-tag-bg-color: var(--el-color-warning-light-9);
  --el-tag-border-color: var(--el-color-warning-light-8);
  --el-tag-hover-color: var(--el-color-warning);
}
.myTag-danger {
  --el-tag-text-color: var(--el-color-danger);
  --el-tag-bg-color: var(--el-color-danger-light-9);
  --el-tag-border-color: var(--el-color-danger-light-8);
  --el-tag-hover-color: var(--el-color-danger);
}
</style>
