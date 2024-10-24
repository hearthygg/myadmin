<template>
  <div class="mask" @click="hideMenu" v-if="showMenu">
    <div :style="{ left: x + 'px', top: y + 'px' }" class="context-menu" @click="hideMenu">
      <ul>
        <li @click.stop="handleMenuItem('min')">窗口最小化</li>
        <li @click.stop="handleMenuItem('max')">窗口最大化</li>
        <li @click.stop="handleMenuItem('reset')">窗口重置</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const emit = defineEmits(['rightKeyClick']);
const showMenu = ref(false);
const x = ref(0);
const y = ref(0);

const showMenuAt = (xPos: number, yPos: number) => {
  x.value = xPos + 5;
  y.value = yPos + 5;
  showMenu.value = true;
};

const hideMenu = () => {
  showMenu.value = false;
};

const handleMenuItem = (option: string) => {
  hideMenu();
  emit('rightKeyClick', option);
};
defineExpose({
  showMenuAt
});
</script>

<style scoped>
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5000;
}
.context-menu {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
  color: #303133;
  /* font-weight: bold; */
  font-size: 15px;
}

.context-menu ul {
  margin: 0;
  padding: 0;
}

.context-menu li {
  padding: 8px 16px;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #f0f0f0;
}
</style>
