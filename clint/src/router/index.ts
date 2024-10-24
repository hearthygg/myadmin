import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissionStoreHook } from '@/store/modules/permission';

export const Layout = () => import('@/layout/index.vue');

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  // 具体实验界面
  {
    path: '/examDetail',
    component: () => import('@/views/exam/detailExam/index.vue'),
    meta: { hidden: true}
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: '', icon: 'homepage', affix: true },
    children: [
      {
        path: 'personal',
        component: () => import('@/views/personal/index.vue'),
        name: 'personal',
        meta: { hidden: true, title: '个人中心', icon: 'uv', affix: true }
      },
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'homepage', affix: true }
      },
      // {
      //   path: 'expReplay',
      //   component: () => import('@/components/expReplay/index.vue'),
      //   name: 'expReplay',
      //   meta: { hidden: true, title: 'expReplay', icon: 'homepage', affix: true }
      // }
      // {
      //   path: 'examDetail',
      //   component: () => import('@/views/exam/detailExam/index.vue'),
      //   name: 'examDetail',
      //   meta: { hidden: true, title: '在线实验', icon: 'homepage', affix: true }
      // }
    ]
  },
  // 外部链接
  /*{
        path: '/external-link',
        component: Layout,
        children: [
            {
                path: 'https://www.cnblogs.com/haoxianrui/',
                meta: { title: '外部链接', icon: 'link' }
            }
        ]
    }*/
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// 重置路由
export function resetRouter() {
  const permissionStore = usePermissionStoreHook();
  permissionStore.routes.forEach(route => {
    const name = route.name;
    if (name && router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
}

export default router;
