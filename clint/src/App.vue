<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import { useAppStore } from '@/store/modules/app';
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useWatermark } from '@pureadmin/utils';
import { version } from '@/utils/version';
import { setFontSize } from '@/utils/FontSize';
const appStore = useAppStore();
const local = ref();
const { setWatermark: setLocalWatermark, clear } = useWatermark(local);
onMounted(() => {
  nextTick(() => {
    setLocalWatermark(`v${version}`, {
      width: 140,
      // height: 56.5,
      rotate: 0,
      gradient: [{ value: 0, color: '#C0C4CC' }]
    });
  });
});

onBeforeUnmount(() => {
  // 在离开该页面时清除整页水印
  clear();
});
</script>

<template>
  <el-config-provider :size="appStore.size">
    <router-view />
  </el-config-provider>
  <div ref="local" class="w-[60px] h-[60px]" style="position: fixed; bottom: 5px; right: 0"></div>
</template>
<style lang="scss">
// 统一修改dialog样式
@import '@/styles/mixin.scss';
.el-dialog {
  border-radius: 10px !important;
  padding: 0 !important;
  .el-dialog__header {
    position: relative;
    padding: var(--el-dialog-padding-primary);
    padding-bottom: 14px;
    margin-right: 16px;
    .el-dialog__title {
      font-size: 20px;
    }
    .el-dialog__headerbtn {
      position: absolute;
      top: 10px;
      right: -2px;
      width: 30px;
      height: 30px;
      background-color: #ecf5ff;
      font-size: 22px;
      border-radius: 5px;
      border: 2px solid #ff3d57;
      display: flex;
      justify-content: center;
      align-items: center;
      // &:hover {
      // 	border: 1px solid var(--el-color-primary);
      // }
      .el-dialog__close {
        font-size: 32px;
        color: #ff3d57;
        font-weight: bold;
      }
    }
  }
  .el-dialog__body {
    @include scrollBar;
  }
  .el-dialog__footer {
    background-color: #edf3f6;
    border-radius: 0 0 10px 10px;
    padding: var(--el-dialog-padding-primary);
    padding-top: 14px;
  }
  .el-input__wrapper {
    background-color: #fafcfe;
  }
}
// 全屏弹窗相关css设置
.dialogWidth1 {
  .el-dialog.is-fullscreen {
    --el-dialog-width: calc(100vw - 210px);
  }
  .el-overlay .el-overlay-dialog .el-dialog {
    margin-left: 210px !important;
  }
}
.dialogWidth2 {
  .el-dialog.is-fullscreen {
    --el-dialog-width: calc(100vw - 56px);
  }
  .el-overlay .el-overlay-dialog .el-dialog {
    margin-left: 210px !important;
  }
}
</style>
