<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" :width="width">
			<el-form ref="dialogFormRef" :model="state.form" size="default" label-width="100px" class="table-form">
				<el-row>
					<template v-for="(val, key) in dialog" :key="key">
						<!-- 表单项太多了分两排 -->
						<el-col :span="dialog.length > 7 ? 12 : 24" class="mt-5">
							<el-form-item v-if="isShow(val.state)" :label="val.label" :prop="val.prop" :rules="[
								{
									required: val.required,
									message: `${val.label}不能为空`,
									trigger: val.type === 'input' ? 'blur' : 'change'
								}
							]">
								<!-- 输入框 -->
								<el-input v-model="state.form[val.prop]" :placeholder="val.placeholder" clearable
									v-if="val.type === 'input'" style="width: 100%">
									<template #append v-if="val.prop === 'cardID'">
										<el-button @click="searchCardRecord(state.form[val.prop])">查询刷卡记录</el-button>
									</template>
								</el-input>
								<!-- 输入框 -->
								<el-input v-model="state.form[val.prop]" :placeholder="val.placeholder" type="password" show-password
									clearable v-else-if="val.type === 'password'" style="width: 100%" />
								<!-- 日期选择器 -->
								<el-date-picker v-model="state.form[val.prop]" type="date" value-format="x" :placeholder="val.placeholder"
									v-else-if="val.type === 'date'" style="width: 100%" />
								<!-- 选择器 -->
								<el-select v-model="state.form[val.prop]" :placeholder="val.placeholder" v-else-if="val.type === 'select'"
									style="width: 100%" filterable>
									<el-option v-for="item in val.options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
								<!-- 多选框 -->
								<el-checkbox-group v-model="state.form[val.prop]" :placeholder="val.placeholder"
									v-else-if="val.type === 'selectAll'">
									<el-checkbox v-for="item in val.options" :key="item.value" :label="item.value">{{ item.label
									}}</el-checkbox>
								</el-checkbox-group>
								<!-- 单选框 -->
								<el-radio-group v-model="state.form[val.prop]" :placeholder="val.placeholder"
									v-else-if="val.type === 'radio'">
									<el-radio v-for="item in val.options" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
								</el-radio-group>
								<!-- 头像 -->
								<single-upload v-else-if="val.type === 'img'" v-model="state.form[val.prop]"></single-upload>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="onSubmit"><i class="iconfont icon-queding"></i>{{ state.dialog.submitTxt
					}}</el-button>
					<el-button @click="onCancel"><i class="iconfont icon-quxiao"></i>取消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="makeTableDemoSearch">
import { reactive, ref, onMounted} from 'vue';
import type { FormInstance } from 'element-plus';
import SingleUpload from "@/components/Upload/SingleUpload.vue"
// 定义父组件传过来的值
const props = defineProps({
	// 弹出框表单
	dialog: {
		type: Array<TableSearchType>,
		default: () => []
	},
	width: {
		type: String,
		defarlt: () => "769px"
	}
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh', 'searchCardRecord']);

// 定义变量内容
const dialogFormRef = ref<FormInstance>();
const state = reactive({
	form: {},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});
// 打开弹窗
const openDialog = (type: string, row: any) => {
	state.dialog.type = type
	// 清空表单，此项需加表单验证才能使用
	dialogFormRef.value?.resetFields();
	if (type === 'edit') {
		state.form = row;
		state.dialog.title = '修改数据';
		state.dialog.submitTxt = '修 改';
	} else {
		initFormField()
		state.dialog.title = '新增数据';
		state.dialog.submitTxt = '新 增';
	}
	state.dialog.isShowDialog = true;
};
const isShow = (type: 'edit' | 'add' | undefined) => {
	if (!type) return true
	if (type === state.dialog.type) {
		return true;
	} else {
		return false;
	}
}
const searchCardRecord = (data: string) => {
	emit('searchCardRecord', data);
}
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
	dialogFormRef.value?.validate((valid: any) => {
		if (valid) {
			emit('refresh', state.dialog.type, state.form);
		}
	})
};
// 初始化 form 字段，取自父组件 dialog.prop
const initFormField = () => {
	if (props.dialog.length <= 0) return false;
	state.form = {}
	props.dialog.forEach(v => {
		if (v.type === 'selectAll') {
			state.form[v.prop] = []
		} else {
			state.form[v.prop] = ''
		}
	})
};
// 页面加载时
onMounted(() => {
	initFormField();
});

// 暴露变量
defineExpose({
	openDialog,
	closeDialog,
});
</script>

<style scoped lang="scss">
:deep(.el-form-item__label) {
	margin-right: 10px;
	border-radius: 5px;
}

.odd {
	// :deep(.el-form-item__label) {
	// 	background-image: linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%);
	// 	color: #fff;
	// }
	width: 100%;
	height: 1px;
	margin-bottom: 5px;
	background-image: linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%);
}

.even {
	// :deep(.el-form-item__label) {
	// 	background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
	// 	color: #fff;
	// }
	width: 100%;
	height: 1px;
	margin-bottom: 5px;
	background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
}
</style>
