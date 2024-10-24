<!-- 滚动目录-表格 -->
<!-- @name:scrollTab -->
<template>
  <el-row ref="scrollContainer" class="scrollTable home-card">
    <img class="bgImg" src="../../../assets/images/dash-left-top.png" alt="" srcset="">
    <el-col class="scroll-title"> {{ tableData.title }} </el-col>
    <el-table ref="tableElement" :data="tableData.data" class="tableHeight" :row-class-name="tableRowClassName">
      <template v-for="(item, index) in tableData.header" :key="index">
        <el-table-column  :prop="item.prop" :label="item.label" :width="item.width" align="center" :show-overflow-tooltip="true"></el-table-column>
      </template>
    </el-table>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, PropType,nextTick } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';

// 定义数据结构
interface TableData {
  data: any[];
  title: string;
  header: any[];
}


const props = defineProps({
  tableData: {
    type: Object as () => TableData,
    required: true,
  },
  speed: {
    type: Number,
    default: 100,
  },
  rowHeight: {
    type: Number,
    default: 40,
  },
});

const scrollContainer = ref<HTMLDivElement | null>(null);
let intervalId: any = null;
let tableBodyHeight = 0;
let tableElement = ref<HTMLElement | null>(null);
let scrollTop = 0;
let scrollCount = [] as number[];
const marquee = () => {
  if (!tableElement.value || !scrollContainer.value) return;
  const elementDom = document.querySelector(".tableHeight .el-scrollbar__wrap") as HTMLElement;
  scrollTop = (elementDom as HTMLElement).scrollTop + 1;

  scrollCount.push(scrollTop);

  if (scrollCount.length > 2) {
    scrollCount.shift();
  }

  if (scrollCount.length === 2 && scrollCount[0] === scrollCount[1]) {
      (elementDom as HTMLElement).scrollTop = 0;
      scrollCount = [];
      scrollTop = 0;
  }
  (elementDom as HTMLElement).scrollTop = scrollTop;
};

const startMarquee = async () => {
  intervalId = setInterval(marquee, props.speed);
};

const tableRowClassName = function({row, rowIndex}) {
  if (rowIndex%2 === 1) {
    return 'warning-row';
  } else if (rowIndex%2 === 0) {
    return 'success-row';
  }
  return '';
}

const stopMarquee = () => {
  clearInterval(intervalId);
};

onMounted(() => {
  nextTick(() => {
    const elementDom = document.querySelector(".tableHeight .el-scrollbar__wrap") as HTMLElement;
    tableBodyHeight = elementDom.scrollHeight -100;
    startMarquee();
    document.querySelector(".tableHeight .el-scrollbar__wrap")?.addEventListener("mouseover",stopMarquee);
    document.querySelector(".tableHeight .el-scrollbar__wrap")?.addEventListener("mouseout",startMarquee);
  });
});

onUnmounted(() => {
  stopMarquee();
});
</script>

<style scoped lang="scss">
// PX 转 rem
@function px2Rem($px) {
  $rem: 16px;
  @return calc($px / $rem) * 1rem;
}
.scrollTable {
  overflow: hidden;
  // text-align: center;
  position: relative;
}

.tableHeight{
  position: absolute;
  width: 96%;
  height: 88%;
  margin-top: px2Rem(60px);
  margin-left: 2%;
  :deep(.el-table__cell){
    border: none;
  }
}

.scroll-title{
  position: absolute;
  margin-top: px2Rem(8px);
  margin-left: px2Rem(100px);
  font-size: px2Rem(18px);
  color: #fff;
}

.el-card ::v-deep .el-card__header{
  background-color: red;
}

.bgImg{
  width: 100%;
  height: 100%;
}
</style>
