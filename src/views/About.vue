<template>
  <div style="text-align: center; padding: 50px">
    <h1>ℹ️ 关于页</h1>
    <p style="font-size: 20px">首页的计数在这里也能看到：{{ count }}</p>
    <p style="margin-top: 20px">
      <router-link to="/">👈 回到首页</router-link>
    </p>
  </div>
</template>

<script setup>
import { useCounterStore } from "@/stores/counter";

const counterStore = useCounterStore();
const count = counterStore.count;
</script>
