<template>
  <div>
    <el-table
      height="calc(100vh - 232px)"
      :data="data"
      :border="setBorder"
      :header-cell-style="{ background: '#EBF5FF', color: '#606266' }"
      v-bind="$attrs"
      :row-key="config.rowId"
      stripe
      v-loading="config.loading"
      ref="dataTableRef"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" :align="'center'" :reserve-selection="true" width="60" v-if="config.isSelection" />
      <el-table-column type="index" :align="'center'" label="序号" width="60" v-if="config.isSerialNo" />
      <el-table-column v-for="(item, index) in setHeader" :key="index" show-overflow-tooltip :prop="item.key" :width="item.colWidth" :label="item.title" :align="'center'">
        <template v-slot="scope">
          <!-- <template v-if="item.type === 'image'">
						<img :src="scope.row[item.key]" :width="item.width" :height="item.height" />
					</template> -->
          <template v-if="item.type === 'tag'">
            <el-tag :type="scope.row[item.key] == 1 ? item.tagData.state[1] : item.tagData.state[0]">{{ scope.row[item.key] == 1 ? item.tagData.text[1] : item.tagData.text[0] }}</el-tag>
          </template>
          <template v-else-if="item.type === 'text'">
            <span v-if="scope.row[item.key]">{{ scope.row[item.key] }}</span>
            <el-tag v-else type="info">暂无数据</el-tag>
          </template>
          <template v-else-if="item.type === 'selectMap'">
            {{ selectMap(scope.row[item.key], item.options) }}
          </template>
          <template v-else-if="item.type === 'date'">
            {{ formartCurrentTime(scope.row[item.key]) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="config.operateWidth" v-if="config.isOperate" :align="'center'">
        <template v-slot="scope">
          <template v-if="props.currentPath === 'user'">
            <el-button v-has-role="['admin']" v-if="config.operateBtn.includes('edit')" text type="primary" @click="handlerEdit(scope.row)"><i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button v-has-role="['admin']" v-if="config.operateBtn.includes('delete')" text type="danger" @click="onDelRow(scope.row)"><i class="iconfont icon-shanchu"></i>删除</el-button>
            <el-button v-has-role="['admin']" v-if="config.operateBtn.includes('reset')" @click="tableBtnClick('reset', scope.row)" text type="warning"><i class="iconfont icon-icon-refresh"></i>重置</el-button>
            <el-button v-if="config.operateBtn.includes('view')" @click="tableBtnClick('view', scope.row)" text type="info"><i class="iconfont icon-shujuyulan"></i>预览</el-button>
          </template>
          <template v-else>
            <el-button v-if="config.operateBtn.includes('edit')" text type="primary" @click="handlerEdit(scope.row)"><i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button v-if="config.operateBtn.includes('delete')" text type="danger" @click="onDelRow(scope.row)"><i class="iconfont icon-shanchu"></i>删除</el-button>
            <el-button v-if="config.operateBtn.includes('reset')" @click="tableBtnClick('reset', scope.row)" text type="warning"><i class="iconfont icon-icon-refresh"></i>重置</el-button>
            <el-button v-if="config.operateBtn.includes('view')" @click="tableBtnClick('view', scope.row)" text type="info"><i class="iconfont icon-shujuyulan"></i>预览</el-button>
          </template>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <div class="paginationarea mt-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
      <el-pagination
        v-model:current-page="state.page.pageNum"
        v-model:page-size="state.page.pageSize"
        :pager-count="5"
        :page-sizes="[10, 20, 30]"
        :total="config.total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
      >
      </el-pagination>
      <el-button v-if="props.currentPath === 'user'" v-has-role="['admin']" type="danger" @click="onDeleteAll"><i class="iconfont icon-shanchu mr5"></i>批量删除</el-button>
      <el-button v-else type="danger" @click="onDeleteAll"><i class="iconfont icon-shanchu mr5"></i>批量删除</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="netxTable">
import { reactive, computed, nextTick, ref, defineExpose } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
// import table2excel from 'js-table2excel';
import Sortable from 'sortablejs';
import { formatDate } from '@/utils/formatTime';
import '@/styles/tableTool.scss';

// 定义父组件传过来的值
const props = defineProps({
  // 列表内容
  data: {
    type: Array<EmptyObjectType>,
    default: () => []
  },
  // 表头内容
  header: {
    type: Array<EmptyObjectType>,
    default: () => []
  },
  // 配置项
  config: {
    type: Object,
    default: () => {}
  },
  currentPath: {
    type: String,
    default: ''
  }
});
const dataTableRef = ref();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['delRow', 'pageChange', 'sortHeader', 'handlerEdit', 'deleteAll', 'tableBtnClick']);

// 定义变量内容
const toolSetRef = ref();
const state = reactive({
  page: {
    pageNum: 1,
    pageSize: 10
  },
  selectlist: [] as EmptyObjectType[],
  checkListAll: true,
  checkListIndeterminate: false
});

// 设置边框显示/隐藏
const setBorder = computed(() => {
  return props.config.isBorder ? true : false;
});
// 获取父组件 配置项（必传）
const getConfig = computed(() => {
  return props.config;
});
// 设置 tool header 数据
const setHeader = computed(() => {
  return props.header.filter(v => v.isCheck);
});
// tool 列显示全选改变时
const onCheckAllChange = <T>(val: T) => {
  if (val) props.header.forEach(v => (v.isCheck = true));
  else props.header.forEach(v => (v.isCheck = false));
  state.checkListIndeterminate = false;
};
// tool 列显示当前项改变时
const onCheckChange = () => {
  const headers = props.header.filter(v => v.isCheck).length;
  state.checkListAll = headers === props.header.length;
  state.checkListIndeterminate = headers > 0 && headers < props.header.length;
};
// 表格多选改变时，用于导出
const onSelectionChange = (val: EmptyObjectType[]) => {
  state.selectlist = val;
  // console.log('表格勾选发生改变!',state.selectlist)
};
// 删除当前项
const onDelRow = (row: EmptyObjectType) => {
  ElMessageBox.confirm('是否确认删除当前选择的数据?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(function () {
      emit('delRow', row);
    })
    .catch(() => ElMessage.info('已取消删除'));
};
// 编辑当前项
const handlerEdit = (row: EmptyObjectType) => {
  emit('handlerEdit', row);
};
// 外加按钮功能 重置密码 预览数据等
const tableBtnClick = (type: string, row: EmptyObjectType) => {
  // 重置密码
  if (type == 'reset') {
    ElMessageBox.confirm('是否确认重置当前用户密码，即：密码 = 账号+@Abc123', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(function () {
        emit('tableBtnClick', type, row);
      })
      .catch(() => ElMessage.info('已取消删除'));
  }
};
// 分页改变
const onHandleSizeChange = (val: number) => {
  state.page.pageSize = val;
  emit('pageChange', state.page);
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  state.page.pageNum = val;
  emit('pageChange', state.page);
};
// 搜索时，分页还原成默认
const pageReset = () => {
  state.page.pageNum = 1;
  state.page.pageSize = 10;
  emit('pageChange', state.page);
};
// 导出
// const onImportTable = () => {
// 	if (state.selectlist.length <= 0) return ElMessage.warning('请先勾选要导出的数据');
// 	table2excel(props.header, state.selectlist, ` ${new Date().toLocaleString()}`);
// };
// 批量删除
const onDeleteAll = () => {
  if (state.selectlist.length <= 0) return ElMessage.warning('请先勾选要删除的数据');
  ElMessageBox.confirm('是否确认删除这些勾选的数据?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(function () {
      emit('deleteAll', state.selectlist);
    })
    .catch(() => ElMessage.info('已取消删除'));
};
// 清除表格勾选数据
const clearSelection = () => {
  state.selectlist = [];
  // 清空表格多选
  dataTableRef.value.clearSelection();
  // console.log('清空表格勾选',state.selectlist)
};
// 刷新
// const onRefreshTable = () => {
// 	emit('pageChange', state.page);
// };
// 设置
const onSetTable = () => {
  nextTick(() => {
    const sortable = Sortable.create(toolSetRef.value, {
      handle: '.handle',
      dataIdAttr: 'data-key',
      animation: 150,
      onEnd: () => {
        const headerList: EmptyObjectType[] = [];
        sortable.toArray().forEach((val: EmptyArrayType) => {
          props.header.forEach(v => {
            if (v.key === val) headerList.push({ ...v });
          });
        });
        emit('sortHeader', headerList);
      }
    });
  });
};
// 设置选择器数据 label与value之间的映射
const selectMap = (value: string | number, options: Array<SelectOptionType>) => {
  options.map((i: SelectOptionType) => {
    if (i.value === value) return i.label;
  });
};
// 格式化时间戳
const formartCurrentTime = (date: number, type = 'YYYY-mm-dd HH:MM:SS') => {
  return formatDate(new Date(date), type);
};
// 暴露变量
defineExpose({
  pageReset,
  clearSelection
});
</script>

<style scoped lang="scss">
.table-container {
  display: flex;
  flex-direction: column;

  .el-table {
    flex: 1;
  }

  .table-footer {
    display: flex;

    .table-footer-tool {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      i {
        margin-right: 10px;
        cursor: pointer;

        // color: var(--el-text-color-regular);
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
:deep(.el-pagination) {
  .el-pagination__total {
    font-weight: bold;
  }

  .btn-prev,
  .btn-next {
    border-radius: 7px;
    font-weight: bold;
  }

  .el-pager {
    .number {
      border-radius: 7px;
      font-weight: bold;
    }
  }
}
</style>
