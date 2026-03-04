<template>
  <div class="profile">
    <el-card>
      <h3>个人中心</h3>
      <el-form :model="userInfo" label-width="80px" style="margin-top: 20px">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="userInfo.role" disabled />
        </el-form-item>
        <el-form-item label="登录时间">
          <el-input v-model="loginTime" disabled />
        </el-form-item>
        <el-form-item label="修改密码">
          <el-button type="primary" @click="showPwdDialog = true">
            <el-icon><Lock /></el-icon>修改密码
          </el-button>
        </el-form-item>
        <el-form-item label="注销账号">
          <el-button type="danger" @click="showDeactivateDialog = true" :disabled="isAdmin">
            <el-icon><Delete /></el-icon>注销账号
          </el-button>
          <span v-if="isAdmin" style="margin-left: 10px; color: #999; font-size: 12px">管理员不能注销自己的账号</span>
        </el-form-item>
      </el-form>

      <el-dialog title="修改密码" v-model="showPwdDialog" width="400px">
        <el-form :model="pwdForm" label-width="80px">
          <el-form-item label="原密码">
            <el-input v-model="pwdForm.oldPwd" type="password" placeholder="请输入原密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="pwdForm.newPwd" type="password" placeholder="请输入新密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="pwdForm.confirmPwd" type="password" placeholder="请确认新密码" show-password></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showPwdDialog = false">取消</el-button>
          <el-button type="primary" @click="changePwd">确认修改</el-button>
        </template>
      </el-dialog>

      <el-dialog title="注销账号" v-model="showDeactivateDialog" width="400px">
        <div style="color: #f56c6c; margin-bottom: 20px">
          <el-icon><Warning /></el-icon>
          警告：注销账号后，所有数据将被永久删除，无法恢复！
        </div>
        <el-form :model="deactivateForm" label-width="80px">
          <el-form-item label="密码">
            <el-input v-model="deactivateForm.password" type="password" placeholder="请输入密码确认注销" show-password></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showDeactivateDialog = false">取消</el-button>
          <el-button type="danger" @click="handleDeactivate">确认注销</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "@/stores/login";
import { ElMessage, ElMessageBox } from "element-plus";
import { Lock, Delete, Warning } from "@element-plus/icons-vue";
import api from "@/api";

const router = useRouter();
const loginStore = useLoginStore();

const userInfo = ref({ ...loginStore.userInfo });
const loginTime = ref(new Date().toLocaleString());
const showPwdDialog = ref(false);
const showDeactivateDialog = ref(false);

const isAdmin = computed(() => userInfo.value.role === "管理员");

const pwdForm = ref({
  oldPwd: "",
  newPwd: "",
  confirmPwd: "",
});

const deactivateForm = ref({
  password: "",
});

const changePwd = async () => {
  if (pwdForm.value.oldPwd !== "admin" && pwdForm.value.oldPwd !== "teacher" && pwdForm.value.oldPwd !== "student") {
    ElMessage.error("原密码错误！");
    return;
  }
  if (pwdForm.value.newPwd !== pwdForm.value.confirmPwd) {
    ElMessage.error("两次密码不一致！");
    return;
  }
  if (!pwdForm.value.newPwd) {
    ElMessage.error("新密码不能为空！");
    return;
  }
  ElMessage.success("密码修改成功（模拟）！新密码：" + pwdForm.value.newPwd);
  showPwdDialog.value = false;
  pwdForm.value = { oldPwd: "", newPwd: "", confirmPwd: "" };
};

const handleDeactivate = async () => {
  if (!deactivateForm.value.password) {
    ElMessage.warning("请输入密码确认注销");
    return;
  }
  
  try {
    await ElMessageBox.confirm("此操作将永久删除您的账号，是否继续？", "警告", {
      confirmButtonText: "确定注销",
      cancelButtonText: "取消",
      type: "warning",
    });
    
    const res = await api.post("/users/deactivate", { password: deactivateForm.value.password });
    
    if (res.data.success) {
      ElMessage.success("账号已注销");
      loginStore.logout();
      router.push("/login");
    } else {
      ElMessage.error(res.data.message || "注销失败");
    }
  } catch (e) {
    if (e !== "cancel") {
      ElMessage.error("注销失败，请检查密码是否正确");
    }
  }
  
  showDeactivateDialog.value = false;
  deactivateForm.value.password = "";
};
</script>

<style scoped>
.profile { height: 100%; }
</style>
