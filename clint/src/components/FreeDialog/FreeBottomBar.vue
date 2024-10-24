<template>
  <!-- 底部窗口弹窗控制 -->
  <div class="bottomWindowBar">
    <el-tooltip v-for="(item, index) in props.listData" :key="index" :content="item.expInfoColumnName" placement="left" effect="dark">
      <div @contextmenu.prevent="handleRightClick($event, item.columnId)" @click="changeState(item.columnId)" :key="item.columnId" class="windowBarItem">
        <!-- <i class="myIcon iconfont icon-baogao"></i> -->
        <svg class="myIcon" aria-hidden="true" :style="`font-size: ${item.iconSize};`">
          <use :xlink:href="item.icon"></use>
        </svg>
        <span class="myText text-gray-600">{{ item.expInfoColumnName }}</span>
      </div>
    </el-tooltip>
    <!-- 自定义右键菜单 -->
    <ContextMenu @rightKeyClick="rightKeyClick" ref="contextMenu" />
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref } from 'vue';
import eventBus from '@/utils/eventBus';
import { SiderExamColumn } from '@/api/exam/types';
import ContextMenu from './ContextMenu.vue';

const contextMenu = ref();
const props = defineProps({
  listData: {
    required: true,
    // 充分的类型提示
    type: Object as PropType<SiderExamColumn[]>
  }
});
const currentId = ref(0);
const changeState = (id: number) => {
  // 发送窗口显示切换事件
  eventBus.emit('changeWindowState', id);
};
// 弹出右键菜单
const handleRightClick = (event: MouseEvent, id: number) => {
  if (!contextMenu.value) return;
  contextMenu.value.showMenuAt(event.clientX, event.clientY);
  currentId.value = id;
};
// 执行右键操作
const rightKeyClick = (options: string) => {
  eventBus.emit('windowRightKeyHandler', { id: currentId.value, options });
};
</script>
<style lang="scss" scoped>
.bottomWindowBar {
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // padding: 2px;
  // background-color: #f5f7fa;
  // z-index: 1002;
  // width: 100%;
  // display: flex;
  // align-items: center;
  .windowBarItem {
    width: 59px;
    height: 59px;
    margin: 10px auto;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .myText {
      width: 59px;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    // .myIcon {
    //   color: #606266;
    //   font-weight: bold;
    //   font-size: 30px;
    // }
    &:hover {
      background-color: #edf2fa;
      border: 1px solid #93c5fd;
    }
  }
}
</style>
