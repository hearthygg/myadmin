<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { addClass, removeClass } from '@/utils/index';

// import { useSettingsStore } from '@/store/modules/settings';

// 图标依赖
import { Close, Setting } from '@element-plus/icons-vue';
import { ElColorPicker } from 'element-plus';

// const settingsStore = useSettingsStore();

const show = ref(false);

defineProps({
  buttonTop: {
    default: 250,
    type: Number
  }
});

watch(show, value => {
  if (value) {
    addEventClick();
  }
  if (value) {
    addClass(document.body, 'showRightPanel');
  } else {
    removeClass(document.body, 'showRightPanel');
  }
});

function addEventClick() {
  window.addEventListener('click', closeSidebar, { passive: true });
}

function closeSidebar(evt: any) {
  // 主题选择点击不关闭
  let parent = evt.target.closest('.theme-picker-dropdown');
  if (parent) {
    return;
  }

  parent = evt.target.closest('.right-panel');
  if (!parent) {
    show.value = false;
    window.removeEventListener('click', closeSidebar);
  }
}

const rightPanel = ref(ElColorPicker);

function insertToBody() {
  const elx = rightPanel.value as any;
  const body = document.querySelector('body') as any;
  body.insertBefore(elx, body.firstChild);
}

onMounted(() => {
  insertToBody();
});

onBeforeUnmount(() => {
  const elx = rightPanel.value as any;
  elx.remove();
});
</script>

<template>
  <div ref="rightPanel" :class="{ show: show }">
    <div class="right-panel-background" />
    <div class="right-panel">
      <div
        class="right-panel__button"
        :style="{
          top: buttonTop + 'px'
        }"
        @click="show = !show"
      >
        <Close class="icon" v-show="show" />
        <Setting class="icon" v-show="!show" />
      </div>
      <div class="right-panel__items">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.right-panel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.right-panel {
  width: 100%;
  max-width: 300px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgb(0 0 0 / 5%);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 199;

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: middle;
    color: var(--el-color-white);
    margin-top: 8px;
  }
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .right-panel-background {
    z-index: 99;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .right-panel {
    transform: translate(0);
  }
}

.right-panel__button {
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
  width: 36px;
  height: 36px;
  left: -36px;
  position: absolute;
  text-align: center;
  border-radius: 6px 0 0 6px;
  cursor: pointer;

  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
