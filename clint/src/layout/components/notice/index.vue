<!-- 消息通知页面 -->
<script setup lang="ts">
import { ref } from "vue";
import { noticesData } from "./data";
import NoticeList from "./noticeList.vue";
import { useSettingsStore } from '@/store/modules/settings';
const settingsStore = useSettingsStore();
const noticesNum = ref(0);
const notices = ref(noticesData);
const activeKey = ref(noticesData[0].key);

notices.value.map(v => (noticesNum.value += v.list.length));
// #fff
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span class="dropdown-badge navbar-bg-hover select-none mt-2">
      <el-badge :value="noticesNum" :max="99">
        <span class="header-notice-icon">
          <i :style="settingsStore.layout === 'top' ? 'color: #fff;' : 'color: #000;'" class="iconfont icon-tongzhi text-2xl"></i>
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs :stretch="true" v-model="activeKey" class="dropdown-tabs">
          <template v-for="item in notices" :key="item.key">
            <el-tab-pane
              :label="`${item.name}(${item.list.length})`"
              :name="`${item.key}`"
            >
              <el-scrollbar max-height="330px">
                <div class="noticeList-container">
                  <NoticeList :list="item.list" />
                </div>
              </el-scrollbar>
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 60px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  width: 330px;

  .noticeList-container {
    padding: 15px 24px 0 24px;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px 0 36px;
  }
}
</style>
