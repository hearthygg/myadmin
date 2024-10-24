<template>
  <div>
    <div class="course-desc mb-4" style="width: 100%;">
      <span class="text-xl"><i class="iconfont icon-denglu-yonghuming"></i> 个人信息</span>
      <span>5 / 5</span>
    </div>
    <!-- 个人信息表单 -->
    <el-form :model="state.personalForm" label-position="left" ref="userFormRef" :rules="state.userFormRules" size="large" label-width="95px">
      <el-row class="mb-6">
        <el-col :span="12">
          <el-form-item label="用户头像：" prop="avatar">
            <single-upload v-model="state.personalForm.avatar"></single-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户生日：" prop="birthday">
            <el-date-picker v-model="state.personalForm.birthday" type="date" value-format="x" placeholder="出生日期" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="用户昵称：" prop="nickName">
        <el-input v-model="state.personalForm.nickName" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="tel">
        <el-input v-model="state.personalForm.tel" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="用户性别：" prop="sex">
        <el-select v-model="state.personalForm.sex" placeholder="请选择性别" class="w-full">
          <el-option v-for="(item, key) in state.sexOptions" :key="key" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>

      <div class="mt-6 text-center">
        <el-button round size="large" type="primary" @click="updateUserInfo">
          <i class="iconfont icon-bianji"></i>
          修改信息
        </el-button>
        <el-button round size="large" type="warning" @click="state.dialog.visable = true">
          <i class="iconfont icon-mima"></i>
          修改密码
        </el-button>
      </div>
    </el-form>
    <el-dialog v-model="state.dialog.visable" :title="state.dialog.title" width="800px">
      <el-form :model="state.dialogForm" label-position="left" :rules="state.dialogRules" ref="dialogFormRef" label-width="100px">
        <el-form-item label="原密码" prop="pwd">
          <el-input v-model="state.dialogForm.pwd" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="state.dialogForm.newPassword" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPassword">
          <el-input v-model="state.dialogForm.confirmNewPassword" type="password" show-password></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getUserForm, getUserOptions, updateUser, updateUserPassword } from '@/api/user';
import { UserForm, UserPwd } from '@/api/user/types';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import SingleUpload from '@/components/Upload/SingleUpload.vue';
const userFormRef = ref();
const dialogFormRef = ref();
const userStore = useUserStore();
const state = reactive({
  personalForm: {} as UserForm,
  sexOptions: [] as SelectOptionType[],
  userFormRules: {
    nickName: [{ required: true, message: '昵称不能为空！', trigger: 'blur' }]
  },
  dialog: {
    visable: false,
    title: '修改密码'
  },
  dialogForm: {} as UserPwd,
  dialogRules: {
    pwd: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
    confirmNewPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }]
  }
});
// 校验确认密码
function validatePassword(rule: any, value: any, callback: any) {
  if (value !== state.dialogForm.newPassword) {
    callback(new Error('两次输入密码不一致！'));
  } else {
    callback();
  }
}
// 编辑用户基本信息
const updateUserInfo = () => {
  userFormRef.value.validate((valid: any) => {
    if (valid && state.personalForm.userId) {
      updateUser(state.personalForm).then(() => {
        ElMessage.success('更新个人信息成功！');
      });
    }
  });
};
// 根据用户id获取用户信息
const getUserBaseInfo = () => {
  getUserForm(userStore.userId as number).then(res => {
    state.personalForm = res.data.user;
  });
};
const onCancel = () => {
  state.dialog.visable = false;
};
const onSubmit = () => {
  dialogFormRef.value.validate((valid: any) => {
    if (valid) {
      state.dialogForm.userId = userStore.userId as number
      updateUserPassword(state.dialogForm).then(() => {
        ElMessage.success('修改密码成功！');
        onCancel();
      });
    }
  });
};
onMounted(() => {
  // 获取选择器数据
  getUserOptions().then(res => {
    state.sexOptions = res.data.sexOptions;
  });
});
defineExpose({
  getUserBaseInfo
});
</script>

