<!-- 实验桌管理 -->
<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="实验桌编号" prop="deskName">
              <el-input v-model="state.queryParams.deskName" placeholder="实验桌编号" />
            </el-form-item>
            <el-form-item label="实验桌的ip地址" prop="deskIp">
              <el-input v-model="state.queryParams.deskIp" placeholder="实验桌的ip地址" />
            </el-form-item>
            <el-form-item label="所属实验室" prop="labId">
              <el-select class="w-full" v-model="state.queryParams.labId" filterable placeholder="所属实验室">
                <el-option v-for="item in state.labSelect" :key="item.value" :label="item.label"
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
            <div class="table-total">实验桌管理</div>
            <div class="flex justify-between items-center">
              <!-- <el-button class="importbtn" type="warning"><i class="iconfont icon-daoru"></i>批量导入</el-button> -->
              <!-- 引导页面 -->
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
              <el-button class="addbtn" type="success" @click="handleAdd"><i
                  class="iconfont icon-xinzeng"></i>新增</el-button>
            </div>
          </div>
          <el-table class="tablearea" ref="dataTableRef" v-loading="state.loading" :data="state.LabDeskList"
            height="calc(100vh - 232px)" :header-cell-style="{ background: '#EBF5FF', color: '#606266' }" :stripe="true"
            :border="true" @selection-change="handleSelectionChange" highlight-current-row>
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />
            <el-table-column label="实验桌编号" prop="deskName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="所属实验室" prop="labName" show-overflow-tooltip :align="'center'" />
            <el-table-column label="实验桌ip地址" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.deskIp">{{ scope.row.deskIp }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="实验桌端口号" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.deskPort">{{ scope.row.deskPort }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="实验桌的状态" :align="'center'">
              <template #default="scope">
                <el-tag v-if="scope.row.deskState === 1" type="success">正常</el-tag>
                <el-tag v-else-if="scope.row.deskState === 0" type="danger">故障</el-tag>
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
      <el-form ref="dataFormRef" :model="state.formData" :rules="state.rules" label-width="110px">
        <el-form-item label="实验桌编号" prop="deskName">
          <el-input v-model="state.formData.deskName" placeholder="实验桌编号" />
        </el-form-item>
        <el-form-item label="实验桌的ip地址" prop="deskIp">
          <el-input v-model="state.formData.deskIp" placeholder="实验桌的ip地址" />
        </el-form-item>
        <el-form-item label="实验桌端口号" prop="deskPort">
          <el-input v-model="state.formData.deskPort" placeholder="实验桌端口号" />
        </el-form-item>
        <el-form-item label="所属实验室" prop="labId">
          <el-select v-model="state.formData.labId" filterable placeholder="所属实验室">
            <el-option v-for="item in state.labSelect" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验桌的状态" prop="deskState">
          <el-radio-group v-model="state.formData.deskState" placehoolder="实验桌的状态">
            <el-radio v-for="item in selectEnum.businessEnumTypes.deskStateOptions" :key="item.value" :label="item.value">{{
              item.label }}</el-radio>
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
import { Step } from "intro.js";
import GuideBtn from '@/components/Guide/index.vue'
import { getGuideData } from '@/components/Guide/guideData'
import {
  getLabDeskData,
  getLabDeskDetail,
  addLabDesk,
  updateLabDesk,
  deleteLabDesks
} from '@/api/labDesk'
import {
  LabDeskQuery,
  LabDeskForm,
  LabDeskTable
} from '@/api/labDesk/types';
import { getAllLab } from '@/api/lab'
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
  } as LabDeskQuery,
  // 表格数据
  LabDeskList: [] as LabDeskTable[],
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
  formData: {} as LabDeskForm,
  // 增加/编辑表单校验规则
  rules: {
    deskName: [{ required: true, message: '请输入实验桌编号', trigger: 'blur' }],
    labId: [{ required: true, message: '请选择所属实验室', trigger: 'change' }],
    deskState: [{ required: true, message: '请选择实验桌状态', trigger: 'change' }],
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  labSelect: [] as SelectOptionType[]
});
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getLabDeskData(state.queryParams).then(({ data }) => {
    state.LabDeskList = data.deskList;
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
function handleSelectionChange(selection: LabDeskTable[]) {
  state.ids = selection.map((item: LabDeskTable) => item.deskId);
}
/**
 * 新增点击
 */
function handleAdd() {
  state.dialog = {
    title: '添加实验桌',
    visible: true,
  };
}
/**
 * 编辑点击
 */
function handleUpdate(row: LabDeskTable) {
  getLabDeskDetail(row.deskId).then(({ data }) => {
    state.formData = data.desk
    state.dialog = {
      title: `编辑实验桌: ${row.deskName}`,
      visible: true
    };
  });
}
/**
 * 新增/编辑操作
 */
function handleSubmit() {
  // state.loading = true;
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.deskId) {
        updateLabDesk(state.formData)
          .then(() => {
            ElMessage.success('修改成功');
            closeDialog();
            handleQuery();
            // state.loading = false;
          })
          // .catch(() => { state.loading = false });
      } else {
        addLabDesk(state.formData)
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
  state.formData = {} as LabDeskForm
}

/**
 *  删除/批量删除
 */
function handleDelete(row: LabDeskTable = {} as LabDeskTable) {
  const ids = row.deskId ? [row.deskId] : [...state.ids]
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteLabDesks(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}


onMounted(() => {
  handleQuery();
  // 获取部门选择器数据
  getAllLab().then(({ data }) => {
    state.labSelect = data.LabOptions
  })
  // 设置引导页相关数据
  state.guideArr = getGuideData("course") as Step[]
});
</script>
