<script setup lang="ts">
import { computed,onMounted } from 'vue';
import { useRoute } from 'vue-router';

import SidebarItem from './SidebarItem.vue';
import Logo from './Logo.vue';
import variables from '@/styles/variables.module.scss';

import { useSettingsStore } from '@/store/modules/settings';
import { usePermissionStore } from '@/store/modules/permission';
import { useAppStore } from '@/store/modules/app';
import { storeToRefs } from 'pinia';

const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const appStore = useAppStore();

const { sidebarLogo } = storeToRefs(settingsStore);
const route = useRoute();

const isCollapse = computed(() => !appStore.sidebar.opened);

const activeMenu = computed<string>(() => {
  const { meta, path } = route;
  if (meta?.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});
onMounted(() => {
  // console.log(permissionStore.routes)
})
</script>

<template>
  <div id="container" :class="{ 'has-logo': sidebarLogo }">
    <el-aside :width="isCollapse ? '56px' : '210px'">
      <logo v-if="sidebarLogo" :collapse="isCollapse" />
      <el-scrollbar>
        <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
          :text-color="variables.menuText" :active-text-color="variables.menuActiveText" :unique-opened="false"
          :collapse-transition="false" mode="vertical">
          <sidebar-item v-for="route in permissionStore.routes" :item="route" :key="route.path" :base-path="route.path"
            :is-collapse="isCollapse" />
        </el-menu>
      </el-scrollbar>
    </el-aside>
  </div>
</template>
<style lang="scss" scoped>
// #container {
//   background: var(--sys-color-gray-gradient);
// }
:deep(.el-menu-item.is-active) {
  // border-left: 5px solid var(--el-color-primary);
  // border-right: 5px solid var(--el-color-primary);
  // border-radius: 0 5px 5px 0;
  background: #111827 !important;
  .svg-icon {
    box-shadow: 0px 5px 5px 0px rgba(0, 129, 255, 0.53);
  }
}
.el-aside {
  transition: width 0.15s;
  height: 100%;
  overflow: auto;
}
</style>
