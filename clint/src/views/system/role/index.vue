
<template>
  <div class="sys-container">
    <div class="table-container w-full">
      <div class="table-search mb-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
        <div class="table-total">角色管理</div>
        <div class="flex justify-between items-center">
          <el-input class="mr-5" v-model="queryParams.keywords" placeholder="角色名称" @keyup.enter="handleQuery">
            <template #append>
              <el-button type="primary" @click="handleQuery"><i class="iconfont icon-sousuo"></i></el-button>
            </template>
          </el-input>
          <el-button type="success" @click="handleAdd"><i class="iconfont icon-xinzeng"></i>新增</el-button>
        </div>
      </div>
      <el-table ref="dataTableRef" v-loading="loading" :data="roleList" height="calc(100vh - 232px)"
        :header-cell-style="{ background: '#EBF5FF', color: '#606266' }" :stripe="true" :border="true"
        @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column label="角色名称" prop="roleName" show-overflow-tooltip />
        <el-table-column label="角色编码" prop="remark" show-overflow-tooltip />
        <el-table-column label="描述信息" prop="description" show-overflow-tooltip />
        <el-table-column label="操作" width="190" :align="'center'">
          <template #default="scope">
            <el-button type="primary" link @click.stop="handleUpdate(scope.row)">
              <i class="iconfont icon-bianji"></i>编辑
            </el-button>
            <el-button type="danger" link @click.stop="handleDelete(scope.row)">
              <i class="iconfont icon-shanchu"></i>删除
            </el-button>
            <el-popover placement="bottom" trigger="hover" :width="100">
              <template #reference>
                <el-button type="primary" link>
                  <i class="iconfont icon-shenglvehao"></i>
                </el-button>
              </template>
              <template #default>
                <div class="text-center w-full">
                  <el-button type="success" link @click.stop="showAllocationDialog(scope.row)">
                    <i class="iconfont icon-ziyuanfenpei"></i>资源分配
                  </el-button>
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
      <div class="mt-2 bg-white rounded-lg p-3.5 flex justify-between items-center">
        <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
      </div>
    </div>
    <!-- dialog -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" @close="closeDialog">
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="formData.description" placeholder="请输入描述信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- assign permission dialog -->
    <el-dialog :title="'【' + checkedRole.roleName + '】资源分配'" v-model="allocationDialogVisible" width="800px">
      <el-scrollbar max-height="600px" v-loading="loading">
        <el-tree ref="resourceRef" node-key="value" show-checkbox :data="resourceOptions" :default-expand-all="true">
          <template #default="{ data }">
            {{ data.label }}
          </template>
        </el-tree>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleAllocationSubmit"><i class="iconfont icon-queding"></i>确定</el-button>
          <el-button @click="closeAllocationDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
export default {
  name: 'role'
};
</script>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue';
import {
  listRolePages,
  updateRole,
  getRoleDetail,
  addRole,
  deleteRoles,
  getRoleMenuIds,
  updateRoleMenus
} from '@/api/role';
import { listMenuOptions, listResources } from '@/api/menu';

import { ElForm, ElMessage, ElMessageBox, ElTree } from 'element-plus';
import { Role, RoleForm, RoleQuery } from '@/api/role/types';

const dataFormRef = ref(ElForm);
const resourceRef = ref(ElTree);

const state = reactive({
  loading: true,
  // 选中ID
  ids: [] as number[],
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as RoleQuery,
  roleList: [] as Role[],
  total: 0,
  dialog: {
    title: '',
    visible: false
  } as DialogType,
  formData: {} as RoleForm,
  rules: {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
  },
  allocationDialogVisible: false,
  resourceOptions: [] as OptionType[],
  // 勾选的菜单ID
  checkedMenuIds: new Set([]),
  // 选中的角色
  checkedRole: {
    roleId: '',
    roleName: ''
  }
});

const {
  ids,
  loading,
  queryParams,
  roleList,
  total,
  dialog,
  formData,
  rules,
  allocationDialogVisible,
  checkedRole,
  resourceOptions
} = toRefs(state);

const specialRoles = [1,2,3,4]
/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  listRolePages(state.queryParams).then(({ data }) => {
    roleList.value = data.list;
    total.value = data.total;
    loading.value = false;
  });
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.roleId);
}


function handleAdd() {
  dialog.value = {
    title: '添加角色',
    visible: true
  };
  formData.value = {} as RoleForm
}

function handleUpdate(row: any) {
  dialog.value = {
    title: '修改角色',
    visible: true
  };
  const roleId = row.roleId;
  // getRoleDetail(roleId).then(({ data }) => {
  //   formData.value = data.role;
  // });
  formData.value = Object.assign({}, row);
}

function handleSubmit() {
  loading.value = true;
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.roleId) {
        updateRole(state.formData)
          .then(() => {
            ElMessage.success('修改角色成功');
            closeDialog();
            handleQuery();
            loading.value = false;
          })
          .catch(err => (loading.value = false));
      } else {
        addRole(state.formData)
          .then(() => {
            ElMessage.success('新增角色成功');
            closeDialog();
            handleQuery();
            loading.value = false;
          })
          .catch(err => (loading.value = false));
      }
    }
  });
}

/**
 * 取消
 */
function closeDialog() {
  dialog.value.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
}

/**
 *  删除
 */
function handleDelete(row: any) {
  const ids = [row.roleId || state.ids].join(',');
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteRoles(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

/**
 * 资源分配弹窗
 */
function showAllocationDialog(row: Role) {
  allocationDialogVisible.value = true;
  loading.value = true;

  const roleId: any = row.roleId;
  checkedRole.value = {
    roleId: roleId,
    roleName: row.roleName
  };

  // 获取所有的资源
  listMenuOptions().then(({data}) => {
    resourceOptions.value = data;
    // 角色拥有的资源
    getRoleMenuIds(roleId).then(({ data }) => {
      // 勾选回显
      const checkedMenuIds = data;
      checkedMenuIds.forEach(menuId =>
        resourceRef.value.setChecked(menuId, true)
      );

      loading.value = false;
    });
  });
}
/**
 * 资源分配提交
 */
function handleAllocationSubmit() {
  const checkedMenuIds: number[] = resourceRef.value
    .getCheckedNodes(false, true)
    .map((node: any) => node.value);

  updateRoleMenus(checkedRole.value.roleId, checkedMenuIds).then(res => {
    ElMessage.success('分配权限成功');
    allocationDialogVisible.value = false;
    handleQuery();
  });
}

/**
 * 关闭资源弹窗
 */
function closeAllocationDialog() {
  allocationDialogVisible.value = false;
}

onMounted(() => {
  handleQuery();
});
</script>

