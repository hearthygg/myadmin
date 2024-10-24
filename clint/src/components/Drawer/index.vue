<template>
  <div>
    <div class="drawer-container">
      <!-- 抽屉按钮 -->
      <button @click="toggleDrawer" :style="state.isOpen ? `left: ${state.drawerWidth}px` : 'left: 0'" class="drawer-toggle">
        {{ state.isOpen ? '隐藏菜单' : '显示菜单' }}
      </button>

      <!-- 抽屉容器 -->
      <transition name="drawer-transition">
        <div v-show="state.isOpen" class="drawer" :style="{ width: state.drawerWidth + 'px' }">
          <!-- 抽屉内容 -->
          <div class="drawer-content">
            <!-- 内容区域 -->
            <slot></slot>
          </div>
          <!-- 抽屉拉伸控制条 -->
          <div class="drawer-resize" :style="`left: ${state.drawerWidth - 6}px`" @mousedown.stop="startResize"></div>
        </div>
      </transition>
    </div>
    <div class="protectMask" v-if="state.resizing"></div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
  // 最小宽度
  minWidth: 400,
  // 最大宽度
  maxWidth: 1400,
  isOpen: false,
  drawerWidth: 1000,
  resizeStartX: 0,
  resizing: false
});

// 切换抽屉状态
const toggleDrawer = () => {
  state.isOpen = !state.isOpen;
};

// 开始拉伸抽屉宽度
const startResize = event => {
  state.resizeStartX = event.clientX;
  state.resizing = true;
  window.addEventListener('mousemove', resizeDrawer);
  window.addEventListener('mouseup', stopResize);
  event.preventDefault();
  // console.log('按下');
};

// 停止拉伸抽屉宽度
const stopResize = () => {
  state.resizing = false;
  window.removeEventListener('mousemove', resizeDrawer);
  window.removeEventListener('mouseup', stopResize);
  // console.log('松开');
};

// 拉伸抽屉宽度
const resizeDrawer = event => {
  // 拉伸最小宽度限制
  if (state.resizing) {
    // console.log(event.clientX, state.resizeStartX);
    const deltaX = event.clientX - state.resizeStartX;
    state.drawerWidth += deltaX;
    // 限制最大最小宽度
    state.drawerWidth = Math.max(state.minWidth, Math.min(state.drawerWidth, state.maxWidth));
    state.resizeStartX = event.clientX;
  }
};
defineExpose({
  toggleDrawer
});
</script>

<style lang="scss" scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.drawer-container {
  position: absolute;
  height: 100%;
}

.drawer-toggle {
  position: absolute;
  z-index: 999;
  top: calc(50vh - 60px);
  width: 30px;
  height: 120px;
  padding: 5px;
  border-radius: 0 5px 5px 0;
  box-shadow: 0 0 1px 1px #d1d5db;
  overflow: hidden;
  color: #fff;
  cursor: pointer;
  background-color: #93c5fd;
  font-size: 18px;
  text-align: center;
  transition: all 0.3s;
  &:hover {
    background-color: #60a5fa;
    box-shadow: 0 0 1px 1px #93c5fd;
  }
}

.drawer {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 999;
  background-color: #fff;
  overflow-x: hidden;
  border-right: 1px solid #f2f6fc;
  // transition: width 0.3s;
}

.drawer-content {
  // width: 80%;
  padding: 0;
}

.drawer-transition-enter-active,
.drawer-transition-leave-active {
  transition: opacity 0.3s;
}

.drawer-transition-enter-from,
.drawer-transition-leave-to {
  opacity: 0;
}

.drawer-resize {
  position: absolute;
  z-index: 99999;
  height: 100%;
  top: 0;
  width: 6px;
  cursor: ew-resize;
  background-color: transparent;
  &:hover {
    background-color: #409eff;
  }
}
.protectMask {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background: transparent;
  z-index: 99997;
}
</style>
