<template>
  <div class="layout-search-dialog">
    <!-- 页面菜单进行搜素 -->
    <div @click="openSearch" class="mt-5 cursor-pointer">
      <span><i class="iconfont icon-sousuo text-xl"></i></span>
    </div>
    <el-dialog v-model="state.isShowSearch" destroy-on-close :show-close="false">
      <template #footer>
        <el-autocomplete size="large" v-model="state.menuQuery" :fetch-suggestions="menuSearch" placeholder="菜单搜索,支持菜单标题" ref="layoutMenuAutocompleteRef" @select="onHandleSelect" :fit-input-width="true">
          <template #prefix>
            <i class="iconfont icon-sousuo"></i>
          </template>
          <template #default="{ item }">
            <div>
              <svg-icon v-if="item.meta && item.meta.icon" :icon-class="item.meta.icon" />
              {{ item.meta.title }}
            </div>
          </template>
        </el-autocomplete>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '@/components/SvgIcon/index.vue';
const router = useRouter();
const layoutMenuAutocompleteRef = ref();
const state = reactive<SearchState>({
  isShowSearch: false,
  menuQuery: '',
  tagsViewList: []
});
// 搜索弹窗打开
const openSearch = () => {
  state.menuQuery = '';
  state.isShowSearch = true;
  initTageView();
  nextTick(() => {
    setTimeout(() => {
      layoutMenuAutocompleteRef.value.focus();
    });
  });
};
// 菜单搜索数据过滤
// eslint-disable-next-line @typescript-eslint/ban-types
const menuSearch = (queryString: string, cb: Function) => {
  let results = queryString ? state.tagsViewList.filter(createFilter(queryString)) : state.tagsViewList;
  cb(results);
};
// 菜单搜索过滤
const createFilter = (queryString: string) => {
  return (restaurant: RouteItem) => {
    return restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 || restaurant.meta!.title!.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
  };
};
// 初始化路由列表
const initTageView = () => {
  nextTick(() => {
    let routeArr = router.getRoutes();
    state.tagsViewList = routeArr.filter(v => v.meta && v.meta.title && v.children.length === 0);
    // console.log(state.tagsViewList);
  });
};
// 当前菜单选中时
const onHandleSelect = (item: RouteItem) => {
  let { path, redirect } = item;
  if (item.meta?.isLink && !item.meta?.isIframe) window.open(item.meta?.isLink);
  else if (redirect) router.push(redirect);
  else router.push(path);
  state.isShowSearch = false;
};
// 获取路由列表
onMounted(() => {});
</script>
<style scoped lang="scss">
.layout-search-dialog {
  position: relative;
  :deep(.el-dialog) {
    .el-dialog__header,
    .el-dialog__body {
      display: none;
    }
    .el-dialog__footer {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -53vh;
    }
  }
  :deep(.el-autocomplete) {
    width: 560px;
    position: absolute;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
