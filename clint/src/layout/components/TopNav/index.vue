<template>
  <div class="menu-container">
    <div class="horizontal-header">
      <div class="flex w-full">
        <div class="mr-4 menu-logo">
          <img :src="logoSrc" />
        </div>
        <el-menu class="horizontal-header-menu" :default-active="activeMenu" :background-color="variables.menuBg" :text-color="variables.menuText" :active-text-color="variables.menuActiveText" mode="horizontal">
          <sidebar-item v-for="route in permissionStore.routes" :item="route" :key="route.path" :base-path="route.path" />
        </el-menu>
      </div>
      <div class="horizontal-header-right">
        <OperateArea />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMenu } from 'element-plus';
import OperateArea from '../OperateArea/index.vue';
import SidebarItem from '../Sidebar/SidebarItem.vue';
import variables from '@/styles/variables.module.scss';
import { usePermissionStore } from '@/store/modules/permission';
import logoSrc from '@/assets/mylogo.png';
// import logoSrc from '@/assets/njdxLogo.png';
const permissionStore = usePermissionStore();

const route = useRoute();
const routes = [] as any[];

// const logoSrc = ref(new URL(`@/assets/companyLogo.png`, import.meta.url).href)
onMounted(() => {
  // console.log('origin routes', permissionStore.routes);
  // permissionStore.routes.forEach(item => {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   if (!item.meta.hidden) {
  //     let tempRoute = item;
  //     // tempRoute.meta.hidden = false
  //     console.log(tempRoute);
  //     routes.push(tempRoute);
  //   }
  // });
  // console.log('routes', routes);
});

const activeMenu = computed<string>(() => {
  const { meta, path } = route;
  if (meta?.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});
</script>
<style lang="scss" scoped>
.menu-container {
  background: #374151;
  // background-color: #fff;
  .horizontal-header {
    display: flex;
    margin: 0 auto;
    width: 80%;
    align-items: center;
    justify-content: space-around;
    height: 50px !important;
    .menu-logo {
      width: 146px;
      height: 45px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-menu {
      height: 100%;
      width: 100%;
      border: none;
      background-color: transparent;
    }

    &-right {
      display: flex;
      min-width: 340px;
      align-items: center;
      justify-content: flex-end;
      color: #fff;
    }
  }
}

:deep(.el-menu-item.is-active) {
  // border-left: 5px solid var(--el-color-primary);
  border-bottom: 4px solid var(--el-color-primary);
  background: #111827 !important;
  color: var(--el-menu-active-color) !important;
  .svg-icon {
    box-shadow: 0px 5px 5px 0px rgba(0, 129, 255, 0.53);
  }
}
</style>
