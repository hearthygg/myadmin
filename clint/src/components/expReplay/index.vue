<template>
  <!-- 实验回放 -->
  <div class="replayContainer" :style="`bottom: ${state.isShow ? '0' : '-300px'};`">
    <div class="topButton bg-blue-300 font-bold" @click="state.isShow = !state.isShow">
      <i class="iconfont" :class="state.isShow ? 'icon-zhankai1' : 'icon-zhankai2'" style="font-size: 20px !important"></i>
    </div>
    <div class="m-4 bg-white rounded-lg p-3 flex justify-between items-center">
      <div class="headerBarTitle">实验回放</div>
      <el-button-group>
        <el-button type="primary" @click="preHandler">
          <i class="iconfont icon-shuangxianzuojiantou font-bold"></i>
        </el-button>
        <el-button @click="autoPlayHandler" :type="state.isAutoPlay ? 'danger' : 'success'">
          <i class="iconfont" :class="state.isAutoPlay ? 'icon-weibiaoti--' : 'icon-bofang'" style="font-size: 20px !important"></i>
        </el-button>
        <el-button type="primary" @click="nextHandler">
          <i class="iconfont icon-youjiantou"></i>
        </el-button>
      </el-button-group>
      <div class="rightPannel flex justify-between items-center bg-sky-100">
        <div class="pannel-item">
          当前：<span class="font-bold text-red-400">{{ state.currentIndex + 1 }}</span>
        </div>
        <div class="pannel-item">起始：<span class="font-bold text-blue-400">1</span></div>
        <div class="pannel-item" style="border: none">
          结束：<span class="font-bold text-green-400">{{ state.operateRecord.length }}</span>
        </div>
      </div>
    </div>
    <div class="operateArea mx-4 flex items-center">
      <div class="headerItem bg-blue-200" :style="`width: ${65 * state.operateRecord.length - 15}px;`"></div>
      <div class="operateItem2" :style="`left: ${state.currentIndex * 65}px;`">
        <div class="topIndexTitle bg-blue-600"></div>
        <div class="bottomLine bg-blue-600"></div>
      </div>
      <div @click="setCurrentRecord(index)" class="operateItem" v-for="(item, index) in state.operateRecord" :key="index">
        <div class="topIndexTitle">{{ index + 1 }}</div>
        <div class="bottomLine bg-blue-200"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, reactive } from 'vue';
import { operateRecord } from '@/utils/staticData';
const state = reactive({
  // 是否显示回放区域
  isShow: false,
  // 是否自动播放
  isAutoPlay: false,
  // 操作记录长度
  operateRecord: 36 as any,
  // 当前记录所处位置
  currentIndex: -1,
  // 自动播放定时器
  autoPlayTimer: null as any,
  // 获取子页面对象
  iframeChild: null as any
});

// 设置当前操作记录
const setCurrentRecord = async (record: number) => {
  if (record > state.currentIndex) {
    // 往右走
    for (let i = state.currentIndex + 1; i <= record; i++) {
      state.currentIndex = i;
      // 调用子页面的方法
      await state.iframeChild.loadCurrentOperate(i,'right')
    }
  } else {
    // 往左走
    for (let i = state.currentIndex; i > record; i--) {
      state.currentIndex = i;
      // 调用子页面的方法
      await state.iframeChild.loadCurrentOperate(i,'left')
    }
  }
  state.currentIndex = record;
};
// 下一步
const nextHandler = () => {
  if (state.currentIndex < state.operateRecord.length - 1) setCurrentRecord(state.currentIndex + 1);
};
// 上一步
const preHandler = () => {
  if (state.currentIndex >= 0) setCurrentRecord(state.currentIndex - 1);
};

// 自动播放
const autoPlayHandler = () => {
  state.isAutoPlay = !state.isAutoPlay;
  if (state.isAutoPlay) {
    state.autoPlayTimer = setInterval(() => {
      if (state.currentIndex < state.operateRecord.length - 1) {
        setCurrentRecord(state.currentIndex + 1);
      } else {
        state.isAutoPlay = false;
        clearInterval(state.autoPlayTimer);
      }
    }, 500);
  } else {
    clearInterval(state.autoPlayTimer);
  }
};

onMounted(() => {
  state.operateRecord = operateRecord;
  window.iframeLoadComplete = () => {
    // 获取子页面iframe对象
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    state.iframeChild = iframe.contentWindow;
    state.iframeChild.setAllOperateArr(state.operateRecord)
  };
});
onUnmounted(() => {
  clearInterval(state.autoPlayTimer);
});
</script>
<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.replayContainer {
  position: absolute;
  width: 100%;
  height: 300px;
  background: #f3f4f6;
  border-radius: 10px 10px 0 0;
  transition: bottom 0.6s ease;
  .topButton {
    position: absolute; /* 设置按钮为绝对定位 */
    top: -30px; /* 负值让按钮出现在容器顶部之外 */
    left: 50%; /* 定位到容器水平中心 */
    transform: translateX(-50%); /* 使用transform居中，考虑自身宽度的一半 */
    width: 80px;
    height: 30px;
    border-radius: 5px 5px 0 0;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    color: #fff;
  }
  .headerBarTitle {
    font-size: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
  }
  .rightPannel {
    // background-color: #FF8A48;
    font-size: 15px;
    border-radius: 5px;
    .pannel-item {
      width: 90px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      color: var(--el-text-color-regular);
      border-right: 1px solid #ccc;
    }
  }
  .operateArea {
    height: 210px;
    border-radius: 5px;
    background-color: #fff;
    position: relative;
    overflow-x: auto;
    @include scrollBar;
    width: 100%;
    .operateItem {
      width: 50px;
      min-width: 50px;
      height: 100%;
      position: relative;
      margin-right: 15px;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      .topIndexTitle {
        width: 100%;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-radius: 5px;
      }
      .bottomLine {
        height: calc(100% - 30px);
        width: 3px;
        margin: 0 auto;
      }
    }
    .operateItem2 {
      transition: left 0.5s linear;
      width: 50px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      .topIndexTitle {
        width: 100%;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-radius: 5px;
      }
      .bottomLine {
        height: calc(100% - 30px);
        width: 3px;
        position: relative;
        z-index: 2;
        margin: 0 auto;
      }
    }
    .headerItem {
      // overflow-x: auto;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 30px;
      border-radius: 5px;
    }
  }
}
</style>
