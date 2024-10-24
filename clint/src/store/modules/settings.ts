import { defineStore } from 'pinia';
import defaultSettings from '../../settings';
import { useStorage } from '@vueuse/core';
/**
 * 主题类型
 */
export enum ThemeType {
  light,
  dark
}

/**
 * 布局类型
 */
export enum LayoutType {
  left,
  top,
  mix
}

export const useSettingsStore = defineStore('setting', {
  state: () => {
    return {
      showSettings: defaultSettings.showSettings,
      tagsView: useStorage<boolean>('tagsView', defaultSettings.tagsView),
      fixedHeader: defaultSettings.fixedHeader,
      sidebarLogo: defaultSettings.sidebarLogo,
      layout: useStorage<string>('layout', defaultSettings.layout)
    };
  },
  actions: {
    changeSetting(param: { key: string; value: any }) {
      const { key, value } = param;
      switch (key) {
        case 'showSettings':
          this.showSettings = value;
          break;
        case 'fixedHeader':
          this.fixedHeader = value;
          break;
        case 'tagsView':
          this.tagsView = value;
          break;
        case 'sidevarLogo':
          this.sidebarLogo = value;
          break;
        case 'layout':
          this.layout = value;
          break;
        default:
          break;
      }
    }
  }
});
