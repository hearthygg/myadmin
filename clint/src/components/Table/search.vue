<template>
  <el-form ref="tableSearchRef" :model="state.form" size="default" label-position="top" label-width="70px" class="table-form">
    <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
    <div class="my-4" v-for="(val, key) in search" :key="key">
      <template v-if="val.type !== ''">
        <el-form-item :label="val.label" :prop="val.prop" :rules="[{ required: val.required, message: `${val.label}不能为空`, trigger: val.type === 'input' ? 'blur' : 'change' }]">
          <el-input v-model="state.form[val.prop]" :placeholder="val.placeholder" clearable v-if="val.type === 'input'" class="w-full" />
          <el-date-picker v-model="state.form[val.prop]" type="date" :placeholder="val.placeholder" v-else-if="val.type === 'date'" value-format="x" class="w-full" />
          <el-select v-model="state.form[val.prop]" :placeholder="val.placeholder" v-else-if="val.type === 'select'" class="w-full" filterable>
            <el-option v-for="item in val.options" :key="item.value" :label="item.label" :value="item.value" filterable> </el-option>
          </el-select>
        </el-form-item>
      </template>
    </div>
    <el-row :sm="24" :md="12" :lg="12" class="mb20 mr10">
      <el-col
        ><el-button class="searchbtn" type="primary" @click="onSearch(tableSearchRef)"><i class="iconfont icon-sousuo"></i>搜索</el-button></el-col
      >
    </el-row>
    <el-row :sm="24" :md="12" :lg="12" class="mb20">
      <el-col
        ><el-button class="resetbtn" type="info" @click="onReset(tableSearchRef)"><i class="iconfont icon-zhongzhi"></i>重置</el-button></el-col
      >
    </el-row>
  </el-form>
</template>

<script setup lang="ts" name="makeTableDemoSearch">
import { reactive, ref, onMounted } from 'vue';
import type { FormInstance } from 'element-plus';
// 定义父组件传过来的值
const props = defineProps({
  // 搜索表单
  search: {
    type: Array<TableSearchType>,
    default: () => []
  }
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['search', 'handlerAdd']);

// 定义变量内容
const tableSearchRef = ref<FormInstance>();
const state = reactive({
  form: {},
  isToggle: false
});

// 查询
const onSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      emit('search', state.form);
    } else {
      return false;
    }
  });
};
// 重置
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  emit('search', state.form);
};
// 新增
const handlerAdd = () => {
  emit('handlerAdd');
};
// 初始化 form 字段，取自父组件 search.prop
const initFormField = () => {
  if (props.search.length <= 0) return false;
  props.search.forEach(v => (state.form[v.prop] = ''));
};
// 页面加载时
onMounted(() => {
  initFormField();
});
</script>

