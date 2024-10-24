<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView';
const tagsViewStore = useTagsViewStore();
</script>

<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="router-fade" mode="out-in">
        <!-- <keep-alive :include="['/exam/onlineExam']">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive> -->
        <!-- keep-alive 只会保持组件的渲染状态（例如，滚动位置、输入框内容等）不会保持组件的数据 -->
        <keep-alive :include="tagsViewStore.cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  // background-color: rgb(165 166 166 / 60%);
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>
