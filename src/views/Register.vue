<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <h2>校园OA系统 - 注册</h2>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" @change="handleRoleChange" style="width:100%">
            <el-option label="学生" value="学生" />
            <el-option label="教师" value="教师" />
          </el-select>
        </el-form-item>
        
        <el-form-item v-if="showClassSelect" label="所属班级" prop="class_id">
          <el-select v-model="form.class_id" placeholder="请选择班级" style="width:100%">
            <el-option v-for="c in classList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleRegister" :loading="loading">注册</el-button>
        </el-form-item>
        
        <el-form-item>
          <div class="footer-links">
            <span>已有账号？</span>
            <el-link type="primary" @click="goToLogin">立即登录</el-link>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import api from "@/api";

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);
const classList = ref([]);

const form = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  role: "学生",
  class_id: "",
});

const showClassSelect = computed(() => {
  return form.role === "学生" || form.role === "教师";
});

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error("两次输入密码不一致"));
  } else {
    callback();
  }
};

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 3, message: "密码长度至少3位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};

const handleRoleChange = () => {
  form.class_id = "";
};

const fetchClasses = async () => {
  try {
    const res = await api.get("/classes");
    if (res.data.success) {
      classList.value = res.data.data;
    }
  } catch (error) {
    console.error("获取班级列表失败:", error);
  }
};

const handleRegister = async () => {
  try {
    await formRef.value.validate();
  } catch (e) {
    return;
  }
  
  loading.value = true;
  
  try {
    const res = await api.post("/auth/register", {
      username: form.username,
      password: form.password,
      role: form.role,
      class_id: form.class_id || null,
    });
    
    if (res.data.success) {
      ElMessage.success("注册成功！请登录");
      router.push("/login");
    } else {
      ElMessage.error(res.data.message || "注册失败");
    }
  } catch (error) {
    ElMessage.error("注册失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/login");
};

onMounted(() => {
  fetchClasses();
});
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  width: 400px;
}

.card-header h2 {
  text-align: center;
  margin: 0;
  color: #333;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 8px;
  width: 100%;
}
</style>
