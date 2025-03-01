<script setup lang="ts">
import {
  getCurrentInstance,
  nextTick,
  ref,
  watch,
  onMounted,
  ComponentInternalInstance
} from 'vue';

import path from 'path-browserify';

import { useRoute, useRouter } from 'vue-router';

import ScrollPane from './ScrollPane.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

import { usePermissionStore } from '@/store/modules/permission';
import { useTagsViewStore, TagView } from '@/store/modules/tagsView';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();

const permissionStore = usePermissionStore();
const tagsViewStore = useTagsViewStore();

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const router = useRouter();
const route = useRoute();

const visible = ref(false);
const selectedTag = ref({});
const scrollPaneRef = ref();
const left = ref(0);
const top = ref(0);
const affixTags = ref<TagView[]>([]);

watch(
  route,
  () => {
    addTags();
    moveToCurrentTag();
  },
  {
    //初始化立即执行
    immediate: true
  }
);

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

watch(visible, value => {
  if (value) {
    document.body.addEventListener('click', closeMenu);
  } else {
    document.body.removeEventListener('click', closeMenu);
  }
});

function filterAffixTags(routes: any[], basePath = '/') {
  let tags: TagView[] = [];

  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      });
    }

    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path);
      if (childTags.length >= 1) {
        tags = tags.concat(childTags);
      }
    }
  });
  return tags;
}

function initTags() {
  const tags = filterAffixTags(permissionStore.routes);
  affixTags.value = tags;
  for (const tag of tags) {
    // Must have tag name
    if ((tag as TagView).name) {
      tagsViewStore.addVisitedView(tag);
    }
  }
}

function addTags() {
  if (route.meta.title) {
    tagsViewStore.addView(route);
  }
}

function moveToCurrentTag() {
  nextTick(() => {
    for (const r of tagsViewStore.visitedViews) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r);
        // when query is different then update
        if (r.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView(route);
        }
      }
    }
  });
}

function isActive(tag: TagView) {
  return tag.path === route.path;
}

function isAffix(tag: TagView) {
  return tag.meta && tag.meta.affix;
}

function isFirstView() {
  try {
    return (
      (selectedTag.value as TagView).fullPath ===
      tagsViewStore.visitedViews[1].fullPath ||
      (selectedTag.value as TagView).fullPath === '/index'
    );
  } catch (err) {
    return false;
  }
}

function isLastView() {
  try {
    return (
      (selectedTag.value as TagView).fullPath ===
      tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1].fullPath
    );
  } catch (err) {
    return false;
  }
}

function refreshSelectedTag(view: TagView) {
  tagsViewStore.delCachedView(view);
  const { fullPath } = view;
  nextTick(() => {
    router.replace({ path: '/redirect' + fullPath }).catch(err => {
      console.warn(err);
    });
  });
}

function toLastView(visitedViews: TagView[], view?: any) {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath);
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath });
    } else {
      router.push('/');
    }
  }
}

function closeSelectedTag(view: TagView) {
  tagsViewStore.delView(view).then((res: any) => {
    if (isActive(view)) {
      toLastView(res.visitedViews, view);
    }
  });
}

function closeLeftTags() {
  tagsViewStore.delLeftViews(selectedTag.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastView(res.visitedViews);
    }
  });
}
function closeRightTags() {
  tagsViewStore.delRightViews(selectedTag.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastView(res.visitedViews);
    }
  });
}

function closeOtherTags() {
  router.push(selectedTag.value);
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
}

function closeAllTags(view: TagView) {
  tagsViewStore.delAllViews().then((res: any) => {
    toLastView(res.visitedViews, view);
  });
}

function openMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 105;
  const offsetLeft = proxy?.$el.getBoundingClientRect().left; // container margin left
  const offsetWidth = proxy?.$el.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const l = e.clientX - offsetLeft + 15; // 15: margin right

  if (l > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = l;
  }

  top.value = e.clientY;
  visible.value = true;
  selectedTag.value = tag;
}

function closeMenu() {
  visible.value = false;
}

function handleScroll() {
  closeMenu();
}

onMounted(() => {
  initTags();
});
</script>

<template>
  <div :class="dataViewTheme?'blacktheme':''" class="h-[34px] w-full border-b-[1px] border-gray-200 shadow-lg shadow-[rgba(0, 21, 41, 0.08)]">
    <scroll-pane ref="scrollPaneRef" class="tags-container" @scroll="handleScroll">
      <router-link v-for="tag in tagsViewStore.visitedViews" :key="tag.path" :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''" :to="{ path: tag.path, query: tag.query }" class="tags-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''" @contextmenu.prevent="openMenu(tag, $event)">
        <div class="h-full w-full flex items-center">
          <svg-icon :icon-class="tag.meta?.icon as any" />
          <span class="ml-1">{{ tag.title }}</span>
          <span v-if="!isAffix(tag)" class="tags-item-remove ml-1" @click.prevent.stop="closeSelectedTag(tag)">
            <i class="iconfont icon-quxiao"></i>
          </span>
        </div>
      </router-link>
    </scroll-pane>

    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="tags-item-menu">
      <li @click="refreshSelectedTag(selectedTag)">
        <svg-icon icon-class="refresh" />
        刷新页面
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <svg-icon icon-class="close" />
        关闭页面
      </li>
      <li @click="closeOtherTags">
        <svg-icon icon-class="close_other" />
        关闭其它
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <svg-icon icon-class="close_left" />
        关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <svg-icon icon-class="close_right" />
        关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <svg-icon icon-class="close_all" />
        关闭所有
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-container {
  font-family: Arial, Helvetica, sans-serif;
  .tags-item {
    display: inline-block;
    cursor: pointer;
    border: 1px solid #d8dce5;
    border-radius: 5px;
    padding: 3px 8px;
    font-size: 12.5px;
    margin: 4px 0 0 5px;
    color:#606266;
    &:first-of-type {
      margin-left: 15px;
    }

    &:last-of-type {
      margin-right: 15px;
    }

    &:hover {
      color: var(--el-color-primary);
    }

    &.active {
      background-color: #EBF5FF;
      color: var(--el-color-primary);
      // border-color: var(--el-color-primary);
      // &::before {
      //   content: '';
      //   background: #fff;
      //   display: inline-block;
      //   width: 8px;
      //   height: 8px;
      //   border-radius: 50%;
      //   position: relative;
      //   margin-right: 5px;
      // }
    }

    &-remove {
      width: 18px;
      height: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        color: #EF4444;
      }
    }
  }
}

.tags-item-menu {
  background: #fff;
  z-index: 99;
  position: absolute;
  border-radius: 4px;
  font-size: 13px;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    padding: 8px 16px;
    color:#606266;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      background: #EBF5FF;
      color: #409EFF;
    }
  }
}

.blacktheme{
  background: var(--kanban-bg-color);
}
</style>
