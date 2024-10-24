/**
 * 测试pinia数据持久化 即是将vuex数据存储到localStorage或者sessionStorage中
 * npm i pinia-plugin-persist --save
 * 数据持久化了要注意什么时候清空数据什么时候修改数据
 * 使用storeToRefs维持pinia数据的响应性
 */
import { defineStore } from 'pinia';
import { getAllSelectEnmuTypes, getBussinerEnmuTypes, getExamEnmuTypes } from '@/api/auth';
import { SelectEnumType, businessEnumType, examEnumType } from '@/api/auth/types';

export const useSelectEnum = defineStore('selectEnum', {
  state: () => {
    return {
      /**所有枚举类型 */
      selectEnumTypes: {} as SelectEnumType,
      /**实验相关枚举类型 */
      examEnumTypes: {} as examEnumType,
      /**业务相关枚举类型 */
      businessEnumTypes: {} as businessEnumType,
    };
  },
  actions: {
    async getAllSelectEnum() {
      return new Promise<any>((resolve, reject) => {
        getAllSelectEnmuTypes()
          .then(({ data }) => {
            this.selectEnumTypes = data;
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取枚举类型
    getAllEnumTypes() {
      getExamEnmuTypes().then(({ data }) => {
        this.examEnumTypes = data;
      });
      getBussinerEnmuTypes().then(({ data }) => {
        this.businessEnumTypes = data;
      });
    }
  },
  // 开启数据缓存 默认存储是存储到sessionStorage里面
  persist: {
    enabled: true
  }

  // 也可以对数据持久化进行配置
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       key: 'userInfo',//设置存储的key
  //       storage: localStorage,//表示存储在localStorage
  //       // 默认所有state里面的数据都会被缓存,如果不想所有数据都持久化存储可以指定要持久化的字段
  //       paths: ["userId"]
  //     }
  //   ]
  // }
});
