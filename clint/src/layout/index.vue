<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { AppMain, Navbar, Settings, TagsView } from './components/index';
import Sidebar from './components/Sidebar/index.vue';
import RightPanel from '@/components/RightPanel/index.vue';
import TopNav from './components/TopNav/index.vue'
import { useAppStore } from '@/store/modules/app';
import { useSettingsStore } from '@/store/modules/settings';

const { width } = useWindowSize();

/**
 * 响应式布局容器固定宽度
 *
 * 大屏（>=1200px）
 * 中屏（>=992px）
 * 小屏（>=768px）
 */
const WIDTH = 992;

const appStore = useAppStore();
const settingsStore = useSettingsStore();

const fixedHeader = computed(() => settingsStore.fixedHeader);
const showTagsView = computed(() => settingsStore.tagsView);
const showSettings = computed(() => settingsStore.showSettings);
const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  withoutAnimation: appStore.sidebar.withoutAnimation,
  mobile: appStore.device === 'mobile'
}));

watchEffect(() => {
  if (width.value < WIDTH) {
    appStore.toggleDevice('mobile');
    appStore.closeSideBar(true);
  } else {
    appStore.toggleDevice('desktop');

    if (width.value >= 1200) {
      //大屏
      appStore.openSideBar(true);
    } else {
      appStore.closeSideBar(true);
    }
  }
});

function handleOutsideClick() {
  appStore.closeSideBar(false);
}
</script>

<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 手机设备 && 侧边栏 → 显示遮罩层 -->
    <div
      v-if="classObj.mobile && classObj.openSidebar"
      @click="handleOutsideClick"
    ></div>
    <Sidebar v-if="settingsStore.layout === 'left'" class="sidebar-container" />
    <div :style="settingsStore.layout === 'top' ? 'margin-left: 0;' : ''"  :class="{ hasTagsView: showTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar v-if="settingsStore.layout === 'left'" />
        <TopNav v-if="settingsStore.layout === 'top'" />
        <tags-view v-if="showTagsView" />
      </div>

      <!--主页面-->
      <app-main />

      <!-- 设置面板 -->
      <RightPanel v-if="showSettings">
        <settings />
      </RightPanel>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.module.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
.mobile .fixed-header {
  width: 100%;
}
</style>
