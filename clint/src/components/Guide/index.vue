<template>
  <el-button type="primary" @click="guide"><i class="iconfont icon-icon_help"></i>帮助</el-button>
</template>
<script setup lang="ts">
import intro from "intro.js";
import "intro.js/minified/introjs.min.css";
import { PropType } from "vue";
// 定义父组件传过来的值
const props = defineProps({
  // 父组件表格选中的数据
  guideArr: {
    require: true,
    // 充分的类型提示
    type: Array as PropType<intro.Step[]>,
  }
});
const guide = () => {
  intro().setOptions({
    steps: props.guideArr,
    prevLabel: "上一步",
    nextLabel: "下一步",
    doneLabel: "结束",
    tooltipClass: "my-guidetooltip",
  }).start();
};
</script>
<style lang="scss">
// 设置引导页相关样式
.my-guidetooltip {
  .introjs-tooltip-title {
    color: #606266;
  }

  .introjs-tooltiptext {
    text-indent: 2em;
    color: #606266;
    font-size: 16px;
  }

  .introjs-tooltipbuttons {
    background-color: #EDF3F6;
    border-radius: 0 0 4px 4px;

    .introjs-button {
      color: var(--el-color-white);
      font-weight: bold;
      background-color: #60A5FA;
      border-radius: 5px;
      border: none;
      text-shadow: none;
    }

    .introjs-button:focus {
      box-shadow: 0 0 2px 2px #D1D5DB;
    }
  }

  .introjs-skipbutton {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 30px;
    height: 30px;
    font-size: 22px;
    background-color: #ECF5FF;
    border-radius: 5px;
    border: 2px solid #FF3D57;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>