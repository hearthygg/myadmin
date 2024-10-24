<template>
  <!-- v-if="device === 'mobile' || settingsStore.layout === 'left'" -->
  <div class="flex justify-start">
    <div class="helpOperate mt-4 mr-5 cursor-pointer" @click="openHelpNewLink">
      <el-tooltip content="如何使用" effect="dark" placement="bottom">
        <i class="iconfont icon-icon_help text-2xl"></i>
      </el-tooltip>
    </div>
    <Search />
    <Notice />
    <div v-if="device !== 'mobile'" class="flex items-center justify-center mr-4">
      <!--全屏 -->
      <screenfull id="screenfull" class="mr-2" />

      <!-- 布局大小 -->
      <el-tooltip content="布局大小" effect="dark" placement="bottom">
        <size-select />
      </el-tooltip>
    </div>

    <el-dropdown trigger="click">
      <div class="flex justify-center items-center pr-[20px]">
        <img :src="userStore.avatar + '?imageView2/1/w/80/h/80'" class="w-[30px] h-[30px] rounded-lg" />
        <CaretBottom class="w-3 h-3" />
      </div>

      <template #dropdown>
        <el-dropdown-menu>
          <router-link to="/dashboard">
            <el-dropdown-item>
              <el-button type="info" link><i class="iconfont icon-fanhuishouye"></i>返回首页</el-button>
            </el-dropdown-item>
          </router-link>
          <router-link to="/personal">
            <el-dropdown-item divided>
              <el-button type="primary" link><i class="iconfont icon-denglu-yonghuming"></i>个人中心</el-button>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click="logout">
            <el-button type="danger" link><i class="iconfont icon-tuichu"></i>退出登录</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts" setup>
import Screenfull from '@/components/Screenfull/index.vue';
import SizeSelect from '@/components/SizeSelect/index.vue';
import Notice from '../notice/index.vue';
import Search from '../search/index.vue';
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useSettingsStore } from '@/store/modules/settings';
import { useUserStore } from '@/store/modules/user';
import { ElMessageBox } from 'element-plus';
import { CaretBottom } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { useTagsViewStore } from '@/store/modules/tagsView';

const settingsStore = useSettingsStore();
const appStore = useAppStore();
const userStore = useUserStore();
const device = computed(() => appStore.device);
const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
        setTimeout(() => {
          // 清除在线实验缓存数据
          localStorage.removeItem('onlineExamState');
        }, 200);
      });
  });
}
// 在新窗口中打开链接
const openHelpNewLink = () => {
  window.open('http://www.vsimlab.com:5559/managerSys/');
};
</script>
<style lang="scss" scoped>
.el-dropdown {
  font-size: 18px;
}
.helpOperate {
  position: relative;
  z-index: 999;
}
</style>
