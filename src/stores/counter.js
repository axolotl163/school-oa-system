import { defineStore } from "pinia";

// 定义并导出计数仓库
export const useCounterStore = defineStore("counter", {
  // 仓库的状态（数据）
  state: () => ({
    count: 0,
  }),
  // 修改状态的方法
  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
