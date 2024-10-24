import { createApp, Directive } from 'vue';
import App from './App.vue';
import router from '@/router';
import { setupStore } from '@/store';
import ElementPlus from 'element-plus';
// element plus默认是英文的所以要使用中文包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Pagination from '@/components/Pagination/index.vue';
import '@/permission';
// 引入svg注册脚本
import 'virtual:svg-icons-register';
// 引入iconfont图标
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.css'
import '@/styles/index.scss';
import 'element-plus/theme-chalk/index.css';
// import '@/styles/variables.module';
//import 'element-plus/theme-chalk/dark/css-vars.css';

const app = createApp(App);
// 自定义指令
import * as directive from '@/directive';
Object.keys(directive).forEach(key => {
  app.directive(key, (directive as { [key: string]: Directive })[key]);
});


// 全局方法
import { getDictionaries } from '@/api/dict';
app.config.globalProperties.$getDictionaries = getDictionaries;
// other.elSvg(app);
// 全局挂载
setupStore(app);
app
  .component('Pagination', Pagination)
  .use(router)
  .use(ElementPlus,{locale: zhCn})
  .mount('#app');
