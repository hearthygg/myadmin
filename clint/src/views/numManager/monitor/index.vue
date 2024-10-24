<template>
  <div class="sys-container">
    <el-row>
      <el-col :span="4">
        <div class="search-container">
          <el-form @keyup.enter="handleQuery" ref="queryFormRef" class="searchForm" :model="state.queryParams" :inline="true" label-position="top">
            <div class="mb-2 w-full text-center text-xl font-bold text-gray-600">条件查询</div>
            <el-form-item label="设备类型" prop="deviceType">
              <el-select :disabled="false" class="w-full" v-model="state.deviceType" placeholder="--所有--" filterable>
                <el-option v-for="item in selectEnum.examEnumTypes.DeviceBoxesOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-row :sm="24" :md="12" :lg="12" class="mb20 mr10">
              <el-col
                ><el-button class="searchbtn" type="primary" @click="handleQuery"><i class="iconfont icon-sousuo"></i>搜索</el-button></el-col
              >
            </el-row>
            <el-row :sm="24" :md="12" :lg="12" class="mb20">
              <el-col
                ><el-button class="resetbtn" type="info" @click="resetQuery"><i class="iconfont icon-zhongzhi"></i>重置</el-button></el-col
              >
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="table-container">
          <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <div class="table-total">实验监测</div>
            <div class="flex justify-between items-center">
              <!-- <el-button class="importbtn" type="warning"><i class="iconfont icon-daoru"></i>批量导入</el-button> -->
              <!-- 引导页面 -->
              <guide-btn class="helpbtn" :guideArr="state.guideArr"></guide-btn>
              <!-- <el-button class="addbtn" type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button> -->
            </div>
          </div>
          <el-table
            class="tablearea"
            ref="dataTableRef"
            v-loading="state.loading"
            :data="state.monitorRecord"
            height="calc(100vh - 168px)"
            :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
            :stripe="true"
            :border="true"
            @selection-change="handleSelectionChange"
            highlight-current-row
          >
            <el-table-column type="selection" width="55" :align="'center'" />
            <el-table-column type="index" label="序号" width="55" :align="'center'" />deviceLinkState
            <el-table-column label="设备名称" prop="deviceName" show-overflow-tooltip :align="'center'" />
            <!-- <el-table-column label="用户名称" prop="userInfo" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag v-if="!scope.row.userInfo" type="info">暂无数据</el-tag>
                <span v-else>{{ scope.row.userInfo }}</span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="硬件编号" prop="hardWareNum" show-overflow-tooltip :align="'center'" /> -->
            <el-table-column label="设备类型" prop="deviceType" show-overflow-tooltip :align="'center'" />
            <el-table-column label="在线状态" prop="onLineState" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <el-tag v-if="scope.row.onLineState === 2" type="info">离线</el-tag>
                <el-tag v-else type="success">在线</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="连接状态" prop="deviceLinkState" show-overflow-tooltip :align="'center'" />
            <!-- <el-table-column label="使用人" prop="userInfo" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.userInfo">{{ scope.row.userInfo }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="当前实验" prop="currentExam" show-overflow-tooltip :align="'center'">
              <template #default="scope">
                <span v-if="scope.row.currentExam">{{ scope.row.currentExam }}</span>
                <el-tag v-else type="info">暂无数据</el-tag>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="设备ip" prop="deviceIp" show-overflow-tooltip :align="'center'" /> -->
            <el-table-column label="操作" width="180" :align="'center'">
              <template #default="scope">
                <el-button type="primary" link @click.stop="playBackHandler(scope.row)"> <i class="iconfont icon-shujuyulan"></i>监控 </el-button>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
          </el-table>
          <!-- <div class="paginationarea mt-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
            <el-pagination
              v-model:current-page="state.queryParams.pageNum"
              v-model:page-size="state.queryParams.pageSize"
              :pager-count="5"
              :page-sizes="[10, 20, 30]"
              :total="state.total"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="handleQuery"
              @current-change="handleQuery"
            >
            </el-pagination>
            <el-button class="deletebtn" type="danger" :disabled="state.ids.length === 0" @click="handleDelete()"> <i class="iconfont icon-shanchu"></i>批量删除 </el-button>
          </div> -->
        </div>
      </el-col>
    </el-row>
    <!-- 实验回放 -->
    <div class="fullDialog playBack" id="dialog-nopadding">
      <el-dialog destroy-on-close :title="state.playBackDialog.title" v-model="state.playBackDialog.visible" :fullscreen="true">
        <iframe id="myIframe" :src="state.childPath" class="child-iframe"></iframe>
        <!-- <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.playBackDialog.visible = false"><i class="iconfont icon-quxiao"></i>关闭</el-button>
          </span>
        </template> -->
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { Step } from 'intro.js';
import GuideBtn from '@/components/Guide/index.vue';
import { getGuideData } from '@/components/Guide/guideData';
import { getMonitorApi, deleteCourses, getMonitorUrlApi } from '@/api/numManager';
import { PlayBackRecordQuery, CourseForm, MonitorTable } from '@/api/numManager/types';
import { useSelectEnum } from '@/store/selectEnum';
const selectEnum = useSelectEnum();
// 搜索表格表单对象
const queryFormRef = ref(ElForm);
// 响应式数据
const state = reactive({
  // 表格刷新动画
  loading: true,
  // 查询条件
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as PlayBackRecordQuery,
  // 表格数据
  monitorRecord: [] as MonitorTable[],
  // 总数
  total: 0,
  // 表格多选
  ids: [] as number[],
  // 增加/编辑弹框状态
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  // 状态
  playBackDialog: {
    title: '',
    visible: false
  } as DialogType,
  // 增加/编辑表单
  formData: {} as CourseForm,
  // 增加/编辑表单校验规则
  rules: {
    lessonName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
    lessonNumber: [{ required: true, message: '请输入课程编号', trigger: 'blur' }]
  },
  // 引导页相关数据
  guideArr: [] as Step[],
  playBackData: {
    id: 254,
    path: ''
  },
  childPath: '',
  deviceType: ''
});
/**
 * 查询
 */
function handleQuery() {
  state.loading = true;
  getMonitorApi(state.deviceType).then(({ data }) => {
    state.monitorRecord = data;
    state.total = state.monitorRecord.length;
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
function handleSelectionChange(selection: MonitorTable[]) {
  // state.ids = selection.map((item: MonitorTable) => item.lessonId);
}

/**
 * 实验回放
 */
function playBackHandler(row: MonitorTable) {
  // 判断设备在线状态
  // if (row.onLineState !== 2) {
  //   // 在线
  // } else {
  //   // 不在线
  //   ElMessage.error('设备不在线，无法监控！');
  // }
  getMonitorUrlApi(row.hardWareNum, state.deviceType).then(({ data }) => {
    state.playBackDialog = {
      title: '实验监控',
      visible: true
    };
    nextTick(() => {
      var iframe = document.getElementById('myIframe');
      // 重载 iframe 内容窗口的当前页面
      iframe.contentDocument.location.reload();
      state.playBackData.path = '111';
      state.childPath = 'plc/index.html#/ex02' + `?id=${state.playBackData.id}&path=${state.playBackData.path}`;
    });
  });
}

/**
 *  删除/批量删除
 */
function handleDelete(row: MonitorTable = {} as MonitorTable) {
  const ids = row.lessonId ? [row.lessonId] : [...state.ids];
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteCourses(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
onMounted(() => {
  state.deviceType = 'material_sorting';
  handleQuery();
  // 设置引导页相关数据
  state.guideArr = getGuideData('course') as Step[];
});
</script>
<style scoped lang="scss">
.child-iframe {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
.playBack {
  .el-dialog {
    .el-dialog__header {
      padding: 10px;
    }
    .el-dialog__body {
      height: calc(100vh - 46px) !important;
      max-height: none !important;
    }
  }
}
</style>
