<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">校园OA系统登录</h2>
      <el-form :model="loginForm" label-width="80px" @submit.prevent="handleLogin">
        <el-form-item label="账号">
          <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" class="login-btn" :loading="loading">登录</el-button>
        </el-form-item>
        <el-form-item>
          <div class="footer-links">
            <span>没有账号？</span>
            <el-link type="primary" @click="goToRegister">立即注册</el-link>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "@/stores/login";
import { ElMessage } from "element-plus";

const router = useRouter();
const loginStore = useLoginStore();
const loading = ref(false);

const loginForm = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning("请输入账号和密码");
    return;
  }
  
  loading.value = true;
  
  const res = await loginStore.login(loginForm.value.username, loginForm.value.password);
  
  loading.value = false;
  
  if (res) {
    ElMessage.success("登录成功！");
    router.push("/");
  } else {
    ElMessage.error("账号或密码错误");
  }
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 400px;
  padding: 20px;
}
.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #409eff;
}
.login-btn {
  width: 100%;
}
.footer-links {
  display: flex;
  justify-content: center;
  gap: 8px;
  width: 100%;
}
</style>
