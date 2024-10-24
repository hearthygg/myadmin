<script lang="ts" setup>
import { ref } from 'vue';
import { useSettingsStore } from '@/store/modules/settings';

const settingsStore = useSettingsStore();

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
});

const logo = ref<string>(
  new URL(`../../../assets/mylogo.png`, import.meta.url).href
);
</script>

<template>
  <transition class="bg-gray-700">
    <router-link
      v-if="collapse"
      key="collapse"
      class="h-[50px] flex items-center justify-center"
      to="/"
    >
      <img v-if="settingsStore.sidebarLogo" :src="logo" class="w-10 h-5" />
      <!-- <h1 v-else>南京润众科技有限公司</h1> -->
    </router-link>

    <router-link
      v-else
      key="expand"
      class="h-[50px] flex items-center justify-center"
      to="/"
    >
      <img v-if="settingsStore.sidebarLogo" :src="logo" class="h-14" />
      <!-- <span class="ml-3 text-sm font-bold text-white">南京润众科技有限公司</span> -->
    </router-link>
  </transition>
</template>
