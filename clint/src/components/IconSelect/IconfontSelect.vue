<template>
  <div>
    <div class="icon-selector">
      <input type="text" v-model="searchQuery" placeholder="搜索图标" @input="filterIcons">
      <ul>
        <li v-for="icon in filteredIcons" :key="icon.name" @click="selectIcon(icon)">
          <i :class="icon.name"></i> {{ icon.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';

// 从 JSON 文件中读取图标数据
const loadIcons = async () => {
  try {
    const response = await fetch('/assets/iconfont/iconfont.json');
    const json = await response.json();
    icons.value = json.icons;
  } catch (error) {
    console.error('加载图标数据失败:', error);
  }
};

const icons = ref([]);
const searchQuery = ref('');
const selectedIcon = ref('');

const filteredIcons = computed(() => {
  if (searchQuery.value === '') return icons.value;
  return icons.value.filter(icon =>
    icon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectIcon = (icon) => {
  selectedIcon.value = icon;
  console.log('选中的图标:', icon);
  // 在这里可以添加更多的逻辑
};

const filterIcons = () => {
  // 过滤图标
};

onMounted(() => {
  loadIcons();
});
</script>

<style scoped>
.icon-selector {
  max-width: 400px;
  margin: 0 auto;
}

.icon-selector input {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
}

.icon-selector ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.icon-selector li {
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #ccc;
}

.icon-selector li:hover {
  background-color: #f0f0f0;
}

.icon-selector i {
  margin-right: 8px;
}
</style>
