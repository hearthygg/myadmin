<template>
  <el-form
    size="large"
    class="login-content-form"
    ref="loginFormRef"
    :model="loginData"
    :rules="loginRules"
  >
    <el-form-item class="login-animation1" prop="username">
      <el-input
        text
        placeholder="用户名"
        v-model="loginData.username"
        clearable
        autocomplete="off"
      >
        <template #prefix>
          <i class="iconfont icon-denglu-yonghuming"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-tooltip
      :disabled="capslockTooltipDisabled"
      content="Caps lock is On"
      placement="right"
    >
      <el-form-item class="login-animation2" prop="password">
        <el-input
          ref="passwordRef"
          :key="passwordType"
          :type="passwordType"
          placeholder="密码"
          v-model="loginData.password"
          autocomplete="off"
          @keyup="checkCapslock"
          @blur="capslockTooltipDisabled = true"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <i class="iconfont icon-mima"></i>
          </template>
          <template #suffix>
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </template>
        </el-input>
      </el-form-item>
    </el-tooltip>
    <!-- <el-form-item class="login-animation3">
			<el-col :span="15">
				<el-input
					text
					maxlength="4"
					placeholder="请输入验证码"
					v-model="state.ruleForm.code"
					clearable
					autocomplete="off"
				>
					<template #prefix>
						<el-icon class="el-input__icon"><ele-Position /></el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button class="login-content-code" v-waves>1234</el-button>
			</el-col>
		</el-form-item> -->
    <el-form-item class="login-animation4">
      <el-button
        type="primary"
        class="login-content-submit"
        round
        v-waves
        @click="handleLogin"
        :loading="loading"
      >
        <span>登 录</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="loginAccount">
import { NextLoading } from '@/utils/loading';
import SvgIcon from '@/components/SvgIcon/index.vue';
import {
  reactive,
  ref,
  toRefs,
  watch,
  nextTick,
  onMounted,
  computed
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElForm, ElInput, ElMessage } from 'element-plus';
import { formatAxis } from '@/utils/formatTime';
// 状态管理依赖
import { useUserStore } from '@/store/modules/user';
// API依赖
import { LoginData } from '@/api/auth/types';
import { useSelectEnum } from '@/store/selectEnum';
// 定义变量内容
const passwordRef = ref(ElInput);
const loginFormRef = ref(ElForm);
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const selectEnumStore = useSelectEnum()
const state = reactive({
  redirect: '',
  loginData: {
    username: '',
    password: ''
  } as LoginData,
  loginRules: {
    username: [{ required: true, trigger: 'blur', message: '用户名不能为空！' }],
    // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
    password: [{ required: true, trigger: 'blur', message: '密码不能为空！' }]
  },
  loading: false,
  passwordType: 'password',
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
  showCopyright: true,
  showDialog: false
});
// 密码校验
function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 5) {
    callback(new Error('密码不能少于五位！'));
  } else {
    callback();
  }
}
// 时间获取
const currentTime = computed(() => {
  return formatAxis(new Date());
});
const {
  loginData,
  loginRules,
  loading,
  passwordType,
  capslockTooltipDisabled
} = toRefs(state);

// 大写提示禁用
function checkCapslock(e: any) {
  const { key } = e;
  state.capslockTooltipDisabled =
    key && key.length === 1 && key >= 'A' && key <= 'Z';
}

// 密码展示与影藏切换
function showPwd() {
  if (passwordType.value === 'password') {
    passwordType.value = 'text';
  } else {
    passwordType.value = 'password';
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

// 登录
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // state.loading = true;
      NextLoading.start();
      userStore
        .login(state.loginData)
        .then(() => {
          // 初始化登录成功时间问候语
          NextLoading.done();
          let currentTimeInfo = currentTime.value;
          // router.push({ path: state.redirect || '/', query: state.otherQuery });
          router.push('/dashboard')
          // 登录成功提示
          const signInText = '欢迎回来！';
          ElMessage.success(`${currentTimeInfo}，${signInText}`);
          // 添加 loading，防止第一次进入界面时出现短暂空白

          // 获取选择器数据
          // selectEnumStore.getAllEnumTypes()
        })
        .catch(() => {
          NextLoading.done();
        });
    } else {
      return false;
    }
  });
}
// 实现退出登录之后再次登录返回上一次的路由
watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true
  }
);
// 获取重定向路由参数
function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}

onMounted(() => {
  window.onresize = () => {
    if (state.clientHeight > document.documentElement.clientHeight) {
      state.showCopyright = false;
    } else {
      state.showCopyright = true;
    }
  };
});
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;
  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }
  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;
    &:hover {
      color: #909399;
    }
  }
  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }
  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
</style>
