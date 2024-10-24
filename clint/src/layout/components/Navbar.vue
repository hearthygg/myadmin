<script setup lang="ts">
import { computed ,ref,watch} from 'vue';
import Hamburger from '@/components/Hamburger/index.vue';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import MixNav from './Sidebar/MixNav.vue';
import OperateArea from './OperateArea/index.vue'

import { useAppStore } from '@/store/modules/app';
import { useSettingsStore } from '@/store/modules/settings';
import { useRouter } from 'vue-router';
const appStore = useAppStore();

// 获取路由实例
const router = useRouter();
const dataViewTheme = ref(false);

// 监听路由变化和 appStore.sidebar.opened 的变化
watch(
  () => [router.currentRoute.value.fullPath, appStore.sidebar.opened],
  ([fullPath, sidebarOpened]) => {
    if (fullPath === '/dashboard') {
      dataViewTheme.value = true;
    } else {
      dataViewTheme.value = false;
    }
  },
  { immediate: true }
);

const settingsStore = useSettingsStore();

const device = computed(() => appStore.device);

function toggleSideBar() {
  appStore.toggleSidebar(true);
}

</script>

<template>
  <div class="navbar" :class="dataViewTheme?'blacktheme':''">
    <el-row v-show="dataViewTheme" class="kanbanTop">
      <img class="bgImg" src="@/assets/images/kanban-title_bg.png" alt="" srcset="">
      <text class="title">管理系统数据监控看板</text>
    </el-row>
    <div
      class="flex justify-start"
      v-if="device === 'mobile' || settingsStore.layout === 'left'"
    >
      <hamburger
        :is-active="appStore.sidebar.opened"
        @toggleClick="toggleSideBar"
      />
      <!-- 面包屑导航栏 -->
      <breadcrumb />
    </div>

    <mix-nav v-if="device !== 'mobile' && settingsStore.layout === 'mix'" />
    <OperateArea/>
  </div>
</template>

<style lang="scss" scoped>
// PX 转 rem
@function px2Rem($px) {
  $rem: 16px;
  @return calc($px / $rem) * 1rem;
}
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.2);
  background: white;
}

.blacktheme{
  position: relative;
  background: var(--kanban-bg-color);
.kanbanTop{
  margin-left: px2Rem(220px);
  position: absolute;
  .bgImg{
    margin-top: px2Rem(34px);
    height: px2Rem(80px);
  }
  .title{
    position: absolute;
    color:var(--kanban-text-color);
    font-size: px2Rem(36px);
    top: px2Rem(36px);
    left: px2Rem(670px);
  }
}
}
</style>
