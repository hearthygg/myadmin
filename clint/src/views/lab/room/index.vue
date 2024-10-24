<!-- 实验室管理 -->
<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="实验室名称" prop="labName">
              <el-input v-model="state.queryParams.labName" placeholder="实验室名称" />
            </el-form-item>
            <el-form-item label="所属部门" prop="deptId">
              <el-select class="w-full" v-model="state.queryParams.deptId" filterable placeholder="所属部门">
                <el-option v-for="item in state.deptSelect" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-row :sm="24" :md="12" :lg="12" class="mb20 mr10">
              <el-col><el-button class="searchbtn" type="primary" @click="handleQuery"><i
                    class="iconfont icon-sousuo"></i>搜索</el-button></el-col>
            </el-row>
            <el-row :sm="24" :md="12" :lg="12" class="mb20">
              <el-col><el-button class="resetbtn" type="info" @click="resetQuery"><i
                    class="iconfont icon-zhongzhi"></i>重置</el-button></el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="table-container">
          <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <div class="table-total">实验室管理</div>
            <div class="flex justify-between items-center">
              <!-- <el-button class="importbtn" type="warning"><i class="iconfont icon-daoru"></i>批量导入</el-button> -->
              <!-- 引导页面 -->
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
              <el-button class="addbtn" type="success" @click="handleAdd"><i
                  class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <el-table class="tablearea" ref="dataTableRef" v-loading="state.loading" :data="state.LabList"
            height="calc(100vh - 232px)" :header-cell-style="{ background: '#EBF5FF', color: '#606266' }" :stripe="true"
            :border="true" @selection-change="handleSelectionChange" highlight-current-row>
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="实验室名称" prop="labName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="实验室地址" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.labAddress">{{ scope.row.labAddress }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="实验室电话" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.labTel">{{ scope.row.labTel }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="电源关闭时间" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.powerOffTime">{{ scope.row.powerOffTime }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" :align="'center'">
              <template #default="scope">
                <el-button type="primary" link @click.stop="handleUpdate(scope.row)">
                  <i class="iconfont icon-bianji"></i>编辑
                </el-button>
                <el-button type="danger" link @click.stop="handleDelete(scope.row)">
                  <i class="iconfont icon-shanchu"></i>删除
                </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
          </el-table>
          <div class="paginationarea mt-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <el-pagination v-model:current-page="state.queryParams.pageNum" v-model:page-size="state.queryParams.pageSize"
              :pager-count="5" :page-sizes="[10, 20, 30]" :total="state.total"
              layout="total, sizes, prev, pager, next, jumper" background @size-change="handleQuery"
              @current-change="handleQuery">
            </el-pagination>
            <el-button class="deletebtn" type="danger" :disabled="state.ids.length === 0" @click="handleDelete()">
              <i class="iconfont icon-shanchu"></i>批量删除
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- dialog -->
    <el-dialog :title="state.dialog.title" v-model="state.dialog.visible" @close="closeDialog">
      <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="180px">
        <el-form-item label="实验室名称" prop="labName">
          <el-input v-model="state.formData.labName" placeholder="实验室名称" />
        </el-form-item>
        <el-form-item label="实验室电话" prop="labTel">
          <el-input v-model="state.formData.labTel" placeholder="实验室电话" />
        </el-form-item>
        <el-form-item label="实验室地址" prop="labAddress">
          <el-input v-model="state.formData.labAddress" placeholder="实验室地址" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="state.formData.deptId" filterable placeholder="所属部门">
            <el-option v-for="item in state.deptSelect" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电源关闭时间" prop="powerOffTime">
          <el-time-picker format="HH:mm" value-format="HH:mm" v-model="state.formData.powerOffTime"
            placeholder="电源关闭时间" />
        </el-form-item>
        <el-form-item label="断电时是否关闭教师电源" prop="closeTeacher">
          <el-radio-group v-model="state.formData.closeTeacher">
            <el-radio v-for="item in selectEnum.businessEnumTypes.labCloseTeacherPowerOptions" :key="item.value"
              :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import SingleUpload from '@/components/Upload/SingleUpload.vue'
import { Step } from "intro.js";
import GuideBtn from '@/components/Guide/index.vue'
import { getGuideData } from '@/components/Guide/guideData'
import {
  getLabData,
  getLabDetail,
  addLab,
  updateLab,
  deleteLabs
} from '@/api/lab'
import {
  LabQuery,
  LabForm,
  LabTable
} from '@/api/lab/types';
import { getAllDept } from '@/api/dept'
import { useSelectEnum } from '@/store/selectEnum'
const selectEnum = useSelectEnum()
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 添加/编辑表单对象
const dataFormRef = ref(ElForm);
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as LabQuery,
  // 表格数据
  LabList: [] as LabTable[],
  // 总数
  total: 0,
  // 表格多选
  ids: [] as number[],
  // 增加/编辑弹框状态
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  // 增加/编辑表单
  formData: {} as LabForm,
  // 增加/编辑表单校验规则
  rules: {
    deptId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
    closeTeacher: [{ required: true, message: '断电时是否关闭教师电源', trigger: 'change' }],
    labName: [{ required: true, message: '实验室名称不能为空', trigger: 'blur' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  deptSelect: [] as SelectOptionType[]
});
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getLabData(state.queryParams).then(({ data }) => {
    state.LabList = data.labList;
    state.total = data.total;
    state.loading = false;
  });
}
/**
 * 重置查询
 */
function resetQuery() {
  // 恢复查询表单默认值
  queryFormRef.value.resetFields();
  handleQuery();
}
/**
 * 表格勾选帅选数据
 */
function handleSelectionChange(selection: LabTable[]) {
  state.ids = selection.map((item: LabTable) => item.labId);
}
/**
 * 新增点击
 */
function handleAdd() {
  state.dialog = {
    title: '添加实验室',
    visible: true,
  };
}
/**
 * 编辑点击
 */
function handleUpdate(row: LabTable) {
  getLabDetail(row.labId).then(({ data }) => {
    state.dialog = {
      title: `修改实验室：${row.labName}`,
      visible: true
    };
    state.formData = data.lab
  });
}
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  // state.loading = true;
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.labId) {
        updateLab(state.formData)
          .then(() => {
            ElMessage.success('修改成功');
            closeDialog();
            handleQuery();
            // state.loading = false;
          })
          // .catch(() => { state.loading = false });
      } else {
        addLab(state.formData)
          .then(() => {
            ElMessage.success('新增成功');
            closeDialog();
            handleQuery();
            // state.loading = false;
          })
          // .catch(() => { state.loading = false });
      }
    }
  });
}

/**
 * 取消
 */
function closeDialog() {
  state.dialog.visible = false;
  dataFormRef.value.resetFields();
  state.formData = {} as LabForm
}

/**
 *  删除/批量删除
 */
function handleDelete(row: LabTable = {} as LabTable) {
  const ids = row.labId ? [row.labId] : [...state.ids]
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteLabs(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}


onMounted(() => {
  handleQuery();
  // 获取部门选择器数据
  getAllDept().then(({ data }) => {
    state.deptSelect = data.deptOptions
  })
  // 设置引导页相关数据
  state.guideArr = getGuideData("course") as Step[]
});
</script>
