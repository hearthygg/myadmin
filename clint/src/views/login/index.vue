<template>
  <div class="flex login-container">
    <div class="login-left">
      <div class="login-left-logo">
				<img :src="logoMini" />
				<div class="login-left-logo-text">
					<span>南京润众科技有限公司</span>
				</div>
			</div>
      <!-- <div class="login-left-logo2">
        <img style="width: 195px; height: 60px;" :src="njdxLogo" />
        <div class="login-left-logo-text mt-2">
          <span>电子信息专业国家级实验教学示范中心（南京大学）</span>
        </div>
      </div> -->
      <!-- <div class="bottomText text-gray-600 text-4xl font-bold">
        <span>电子信息专业国家级实验教学示范中心（南京大学）</span>
      </div> -->
      <div class="login-left-img">
        <!-- <img :src="loginMain" /> -->
        <img :src="bgPicture" alt="" />
      </div>
      <img :src="loginBg" class="login-left-waves" />
    </div>
    <div class="flex login-right">
      <div class="login-right-warp flex-margin">
        <span class="login-right-warp-one"></span>
        <span class="login-right-warp-two"></span>
        <div class="login-right-warp-mian">
          <div class="login-right-warp-main-title">实验管理系统欢迎您！</div>
          <div class="login-right-warp-main-form">
            <div v-if="!state.isScan">
              <el-tabs v-model="state.tabsActiveName">
                <el-tab-pane label="用户名登录" name="account">
                  <Account />
                </el-tab-pane>
                <!-- <el-tab-pane label="手机号登录" name="mobile">
									<Mobile />
								</el-tab-pane> -->
              </el-tabs>
            </div>
            <Scan v-if="state.isScan" />
            <!-- <div class="login-content-main-sacn" @click="state.isScan = !state.isScan">
							<i class="iconfont" :class="state.isScan ? 'icon-diannao-tianchong' : 'icon-erweima'"></i>
							<div class="login-content-main-sacn-delta"></div>
						</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="loginIndex">
import { defineAsyncComponent, onMounted, reactive } from 'vue';
import { NextLoading } from '@/utils/loading';
// import logoMini from '@/assets/logo-mini.svg';
import logoMini from '@/assets/companyLogo.png';
import njdxLogo from '@/assets/njdxLogo.png';
// import loginMain from '@/assets/login-main.svg';
import loginBg from '@/assets/login-bg.svg';
import bgPicture from '@/assets/loginBg.svg';
// 引入组件
const Account = defineAsyncComponent(() => import('@/views/login/component/account.vue'));
const Mobile = defineAsyncComponent(() => import('@/views/login/component/mobile.vue'));
const Scan = defineAsyncComponent(() => import('@/views/login/component/scan.vue'));

// 定义变量内容
const state = reactive({
  tabsActiveName: 'account',
  isScan: false
});

// 页面加载时
onMounted(() => {
  NextLoading.done();
});
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  overflow: hidden;
  background: var(--el-color-white);
  .login-left {
    flex: 1;
    position: relative;
    background-color: rgba(211, 239, 255, 1);
    margin-right: 100px;
    .login-left-logo {
      display: flex;
      align-items: center;
      position: absolute;
      top: 50px;
      left: 80px;
      z-index: 1;
      animation: logoAnimation 0.3s ease;
      img {
        width: 104px;
        height: 52px;
      }
      .login-left-logo-text {
        display: flex;
        flex-direction: column;
        span {
          margin-left: 10px;
          font-size: 28px;
          color: #26a59a;
        }
        .login-left-logo-text-msg {
          font-size: 12px;
          color: #32a99e;
        }
      }
    }
    // 测试demo
    .login-left-logo2 {
      position: absolute;
      top: 50px;
      left: 80px;
      z-index: 1;
      animation: logoAnimation 0.3s ease;
      .login-left-logo-text {
        display: flex;
        flex-direction: column;
        span {
          margin-left: 10px;
          font-size: 28px;
          color: var(--el-text-color-primary);
        }
        .login-left-logo-text-msg {
          font-size: 12px;
          color: #32a99e;
        }
      }
    }
    .bottomText {
      position: absolute;
      bottom: 100px;
      left: 300px;
      // font-size: 28px;
      // color: #32a99e;
    }
    .login-left-img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 52%;
      img {
        width: 100%;
        height: 100%;
        animation: error-num 3s ease;
      }
    }
    .login-left-waves {
      position: absolute;
      top: 0;
      right: -100px;
    }
  }
  .login-right {
    width: 700px;
    .login-right-warp {
      border: 1px solid var(--el-color-primary-light-3);
      border-radius: 3px;
      width: 500px;
      height: 500px;
      position: relative;
      overflow: hidden;
      background-color: var(--el-color-white);
      .login-right-warp-one,
      .login-right-warp-two {
        position: absolute;
        display: block;
        width: inherit;
        height: inherit;
        &::before,
        &::after {
          content: '';
          position: absolute;
          z-index: 1;
        }
      }
      .login-right-warp-one {
        &::before {
          filter: hue-rotate(0deg);
          top: 0px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--el-color-primary));
          animation: loginLeft 3s linear infinite;
        }
        &::after {
          filter: hue-rotate(60deg);
          top: -100%;
          right: 2px;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg, transparent, var(--el-color-primary));
          animation: loginTop 3s linear infinite;
          animation-delay: 0.7s;
        }
      }
      .login-right-warp-two {
        &::before {
          filter: hue-rotate(120deg);
          bottom: 2px;
          right: -100%;
          width: 100%;
          height: 3px;
          background: linear-gradient(270deg, transparent, var(--el-color-primary));
          animation: loginRight 3s linear infinite;
          animation-delay: 1.4s;
        }
        &::after {
          filter: hue-rotate(300deg);
          bottom: -100%;
          left: 0px;
          width: 3px;
          height: 100%;
          background: linear-gradient(360deg, transparent, var(--el-color-primary));
          animation: loginBottom 3s linear infinite;
          animation-delay: 2.1s;
        }
      }
      .login-right-warp-mian {
        display: flex;
        flex-direction: column;
        height: 100%;
        .login-right-warp-main-title {
          height: 130px;
          line-height: 130px;
          font-size: 27px;
          text-align: center;
          letter-spacing: 3px;
          animation: logoAnimation 0.3s ease;
          animation-delay: 0.3s;
          color: var(--el-text-color-primary);
        }
        .login-right-warp-main-form {
          flex: 1;
          padding: 0 50px 50px;
          .login-content-main-sacn {
            position: absolute;
            top: 0;
            right: 0;
            width: 50px;
            height: 50px;
            overflow: hidden;
            cursor: pointer;
            transition: all ease 0.3s;
            color: var(--el-color-primary);
            &-delta {
              position: absolute;
              width: 35px;
              height: 70px;
              z-index: 2;
              top: 2px;
              right: 21px;
              background: var(--el-color-white);
              transform: rotate(-45deg);
            }
            &:hover {
              opacity: 1;
              transition: all ease 0.3s;
              color: var(--el-color-primary) !important;
            }
            i {
              width: 47px;
              height: 50px;
              display: inline-block;
              font-size: 48px;
              position: absolute;
              right: 1px;
              top: 0px;
            }
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="scss">
@media screen and (max-width: 1300px) {
  .login-left-logo {
    top: 6vh !important;
    left: 0 !important;
    width: 20vh;
    text-align: center;
    .login-left-logo-text {
      width: 100vw;
      position: absolute;
      z-index: 1000;
      text-align: center;
    }
  }
}

/* 当屏幕宽度小于等于 768 像素时应用样式 */
@media screen and (max-width: 768px) {
  .login-container {
    flex-direction: column;

    .login-left {
      width: 100%;
      height: 30vh;

      .login-left-logo {
        width: 100%;
        text-align: center;
        position: static;
      }
    }

    .login-right {
      width: 100%;
    }
  }
}
</style>
