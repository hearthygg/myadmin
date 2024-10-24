import type { App } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist'
const store = createPinia();

// 让store具有数据持久化功能而不是页面一刷新保存的数据就不在了 
store.use(piniaPluginPersist)
// 全局挂载store
export function setupStore(app: App<Element>) {
  app.use(store);
}

export { store };
export const pinia = store
