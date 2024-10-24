<!-- eslint-disable vue/no-mutating-props -->
<template>
  <!-- 预览试题 -->
  <div class="content">
    <div class="flex items-baseline">
      <el-tag class="mr-2">{{ getSelectOptionVal(props.questionDetail.questionType, 'questionType') }}</el-tag>
      <div v-html="props.questionDetail.question"></div>
      <span>（{{ props.questionDetail.score }}分）</span>
    </div>
    <!-- 选择题 -->
    <div class="options" v-if="props.questionDetail.questionType == Question.DanX || props.questionDetail.questionType == Question.DuoX">
      <!-- <el-checkbox-group v-if="props.questionDetail.questionType == Question.DuoX" v-model="props.questionDetail.answer">
        <el-checkbox class="flex-base" v-for="(val, key) in props.questionDetail.questionOptions" :key="key" :label="String.fromCharCode(65 + key)">
          <div class="flex-base">
            <div>{{ String.fromCharCode(65 + key) }}.</div>
            <div v-html="val.optionText"></div>
          </div>
        </el-checkbox>
      </el-checkbox-group> -->
      <ul class="danxun-box" :selectVal="props.questionDetail.answer" v-if="props.questionDetail.questionType == Question.DuoX">
        <li @click="changeDuoXVal(String.fromCharCode(65 + key))" v-for="(val, key) in props.questionDetail.questionOptions" :key="key" class="flex-base danxuan-item">
          <div class="danxuan-tag duoxuan-tag" :class="props.questionDetail.answer.includes(String.fromCharCode(65 + key)) ? 'danxuan-active' : ''">{{ String.fromCharCode(65 + key) }}</div>
          <div class="danxuan-content" v-html="val.optionText"></div>
        </li>
      </ul>
      <!-- <el-radio-group v-if="props.questionDetail.questionType == Question.DanX" v-model="props.questionDetail.answer[0]">
        <el-radio v-for="(val, key) in props.questionDetail.questionOptions" :key="key" :label="String.fromCharCode(65 + key)">
          <div class="flex-base">
            <div>{{ String.fromCharCode(65 + key) }}.</div>
            <div v-html="val.optionText"></div>
          </div>
        </el-radio>
      </el-radio-group> -->
      <ul class="danxun-box" :selectVal="props.questionDetail.answer[0]" v-if="props.questionDetail.questionType == Question.DanX">
        <li @click="changeSelectVal(String.fromCharCode(65 + key))" v-for="(val, key) in props.questionDetail.questionOptions" :key="key" class="flex-base danxuan-item">
          <div class="danxuan-tag" :class="String.fromCharCode(65 + key) == props.questionDetail.answer[0] ? 'danxuan-active' : ''">{{ String.fromCharCode(65 + key) }}</div>
          <div class="danxuan-content" v-html="val.optionText"></div>
        </li>
      </ul>
    </div>
    <!-- 判断题 -->
    <div class="options" v-if="props.questionDetail.questionType == Question.PD">
      <el-radio-group v-model="props.questionDetail.answer[0]">
        <el-radio :label="1">对</el-radio>
        <el-radio :label="2">错</el-radio>
      </el-radio-group>
    </div>
    <!-- 填空题 -->
    <div class="my-2" v-if="props.questionDetail.questionType == Question.TK && props.paperType === 'view'">
      <div class="text-[#409EFF]">正确答案:</div>
      <div class="flex-base my-2" v-for="(i, index) in props.questionDetail.answer" :key="index">({{ index + 1 }})：<span v-html="i"></span></div>
    </div>
    <div class="my-2" v-if="props.questionDetail.questionType == Question.TK && props.paperType === 'exam'">
      <div class="text-[#409EFF]">答题区域:</div>
      <div class="my-2 tkAnswerArea" v-for="(item, index) in props.questionDetail.answer" :key="index">
        <el-input class="mb-2" v-model="props.questionDetail.answer[index]" @focus="inputClick(props.questionDetail.answer[index], index)">
          <template #prepend>
            <span>({{ index + 1 }})</span>
          </template>
        </el-input>
      </div>
    </div>
    <!-- 其他主观题目 -->
    <div class="my-2" v-if="props.questionDetail.questionType > Question.PD && props.questionDetail.questionType != Question.DuoX && props.paperType === 'view'">
      <div class="text-[#409EFF]">正确答案:</div>
      <span v-html="props.questionDetail.answer[0]"></span>
    </div>
    <div class="my-2" v-if="props.questionDetail.questionType > Question.PD && props.questionDetail.questionType != Question.DuoX && props.paperType === 'exam'">
      <div class="text-[#409EFF]">答题区域:</div>
      <el-input @focus="inputClick(props.questionDetail.answer[0], 0)" v-model="props.questionDetail.answer[0]" :rows="3" type="textarea" placeholder="答题区域:" />
    </div>
    <!-- 解析 -->
    <div class="my-2" v-if="props.paperType === 'view' && props.questionDetail.questionAnalysis">
      <div class="text-[#409EFF]">解析:</div>
      <div class="ml-5" v-html="props.questionDetail.questionAnalysis"></div>
    </div>
  </div>
  <!-- 题目相关富文本弹窗 -->
  <div class="question-dialog">
    <el-dialog title="答题区域" v-model="state.textEditer.visible" width="60%" destroy-on-close>
      <editor ref="currentEdit" v-model="state.textEditer.content" file-type="questionType" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="editSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="state.textEditer.visible = false"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { PropType, reactive } from 'vue';
import { Question, QuestionForm } from '@/api/question/types';
import { getSelectOptionVal } from '@/utils/commonMethods';
import Editor from '@/components/WangEditor/index.vue';
const props = defineProps({
  questionDetail: {
    type: Object as PropType<QuestionForm>,
    default: () => {
      return {} as QuestionForm;
    }
  },
  paperType: {
    type: String,
    default: 'view'
  }
});
const state = reactive({
  // 富文本
  textEditer: {
    // 内容
    content: '',
    visible: false,
    index: 0
  }
});
// 将当前表单内容映射到富文本中
function inputClick(content: string, index: number) {
  state.textEditer.visible = true;
  state.textEditer.content = content;
  state.textEditer.index = index;
}
// 将富文本内容映射到表单中
function editSubmit() {
  // eslint-disable-next-line vue/no-mutating-props
  props.questionDetail.answer[state.textEditer.index] = state.textEditer.content;
  state.textEditer.visible = false;
}
// 单选题change
function changeSelectVal(val: string) {
  // eslint-disable-next-line vue/no-mutating-props
  props.questionDetail.answer[0] = val;
}
// 多选题change
function changeDuoXVal(val: string) {
  if(props.questionDetail.answer.includes(val)) {
    // eslint-disable-next-line vue/no-mutating-props
    props.questionDetail.answer = props.questionDetail.answer.filter(v => v !== val)
  } else {
    // eslint-disable-next-line vue/no-mutating-props
    props.questionDetail.answer.push(val)
  }
}
</script>
<style lang="scss" scoped>
.content {
  color: #4c596b;
  font-size: 16px;
  border-bottom: 1px solid var(--el-card-border-color);
  width: 100%;
  #question {
    margin: 10px;
  }
  .options {
    margin: 10px 20px;
  }
}
.flex-base {
  display: flex;
  align-items: baseline;
}
.danxun-box {
  .danxuan-item {
    margin: 5px 0;
    padding: 5px 0;
    cursor: pointer;
    &:hover {
      background-color: #f5f7fa;
      border-radius: 5px;
    }
    .danxuan-tag {
      display: flex;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 14px;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      color: #636e92;
      margin-right: 10px;
      border: 1px solid #9ea5bb;
    }
    .duoxuan-tag {
      border-radius: 5px;
    }
    .danxuan-active {
      background-color: #3c7cfc;
      border: 1px solid #3c7cfc;
      color: #fff;
    }
    .danxuan-content {
    }
  }
}
</style>
<style lang="scss">
.tkAnswerArea {
  .el-input {
    width: 500px;
  }
}
</style>
<style lang="scss">
.question-dialog {
  .el-dialog {
    .el-dialog__body {
      height: 100% !important;
    }
  }
}
</style>
