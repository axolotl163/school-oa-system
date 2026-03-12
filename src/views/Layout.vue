<template>
  <div class="layout" :class="{ 'is-mobile': isMobile }">
    <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">校园OA管理系统</div>
      <el-menu :default-active="activePath" :router="true" mode="vertical" background-color="#2f4050" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/"><el-icon><House /></el-icon><template v-slot:title><span>首页</span></template></el-menu-item>
        
        <el-sub-menu v-if="canAccess(['管理员', '教师'])" index="student-mgmt">
          <template #title><el-icon><User /></el-icon><span>学生管理</span></template>
          <el-menu-item v-if="canAccess(['管理员', '教师'])" index="/student">学生信息</el-menu-item>
          <el-menu-item v-if="canAccess(['管理员', '教师'])" index="/score">成绩管理</el-menu-item>
          <el-menu-item v-if="canAccess(['管理员', '教师'])" index="/attendance">考勤管理</el-menu-item>
          <el-menu-item v-if="canAccess(['管理员', '教师'])" index="/reward">奖惩管理</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item v-if="canAccess(['学生'])" index="/score">
          <el-icon><TrendCharts /></el-icon><template v-slot:title><span>我的成绩</span></template>
        </el-menu-item>
        <el-menu-item v-if="canAccess(['学生'])" index="/attendance">
          <el-icon><Clock /></el-icon><template v-slot:title><span>我的考勤</span></template>
        </el-menu-item>
        
        <el-sub-menu v-if="canAccess(['管理员'])" index="teaching-mgmt">
          <template #title><el-icon><Reading /></el-icon><span>教学管理</span></template>
          <el-menu-item index="/course">课程管理</el-menu-item>
          <el-menu-item index="/teacher">教师信息</el-menu-item>
          <el-menu-item index="/exam">考试安排</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu v-if="canAccess(['管理员', '教师'])" index="admin-mgmt">
          <template #title><el-icon><Setting /></el-icon><span>行政管理</span></template>
          <el-menu-item index="/task">任务管理</el-menu-item>
          <el-menu-item v-if="canAccess(['管理员'])" index="/notice">公告管理</el-menu-item>
          <el-menu-item index="/meeting">会议管理</el-menu-item>
          <el-menu-item v-if="canAccess(['管理员'])" index="/document">公文管理</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu v-if="canAccess(['管理员'])" index="research-mgmt">
          <template #title><el-icon><Files /></el-icon><span>科研管理</span></template>
          <el-menu-item index="/project">项目管理</el-menu-item>
          <el-menu-item index="/achievement">成果管理</el-menu-item>
          <el-menu-item index="/lab">实验室管理</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu v-if="canAccess(['管理员'])" index="system-mgmt">
          <template #title><el-icon><Tools /></el-icon><span>系统管理</span></template>
          <el-menu-item index="/userManage">用户管理</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/profile"><el-icon><UserFilled /></el-icon><template v-slot:title><span>个人中心</span></template></el-menu-item>
        <el-menu-item index="logout" @click="handleLogout"><el-icon><SwitchButton /></el-icon><template v-slot:title><span>退出登录</span></template></el-menu-item>
      </el-menu>
    </aside>

    <div class="main-content">
      <header class="header">
        <div class="header-left"><el-button v-if="isMobile" text @click="sidebarOpen = !sidebarOpen"><el-icon><Fold /></el-icon></el-button></div>
        <div class="user-info">欢迎您：{{ userInfo.username }}（{{ userInfo.role }}）</div>
      </header>
      <div class="content"><router-view /></div>
    </div>
    <div v-if="isMobile && sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "@/stores/login";
import { ElMessage } from "element-plus";
import { House, User, UserFilled, SwitchButton, Reading, Setting, Tools, Fold, Files, TrendCharts, Clock } from "@element-plus/icons-vue";

const router = useRouter();
const loginStore = useLoginStore();
const activePath = ref("/");
const userInfo = computed(() => loginStore.userInfo);
const isMobile = ref(false);
const sidebarOpen = ref(false);

function checkMobile() { isMobile.value = window.innerWidth < 768; if (!isMobile.value) sidebarOpen.value = false; }
function canAccess(roles) { return roles.includes(userInfo.value.role); }
const handleLogout = () => { loginStore.logout(); ElMessage.success("退出成功！"); router.push("/login"); };

onMounted(() => {
  if (!localStorage.getItem("isLogin")) { router.push("/login"); return; }
  activePath.value = router.currentRoute.fullPath;
  router.afterEach((to) => { activePath.value = to.fullPath; });
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
onUnmounted(() => { window.removeEventListener('resize', checkMobile); });
</script>

<style scoped>
.layout { display: flex; height: 100vh; }
.sidebar { width: 220px; background: #2f4050; color: #fff; display: flex; flex-direction: column; }
.sidebar-header { padding: 20px; font-size: 16px; text-align: center; background: #1f2d3d; border-bottom: 1px solid #333; flex-shrink: 0; }
.sidebar .el-menu { border-right: none; flex: 1; overflow-y: auto; }
.main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.header { height: 60px; line-height: 60px; padding: 0 20px; background: #fff; border-bottom: 1px solid #e6e6e6; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.header-left { display: flex; align-items: center; }
.user-info { color: #666; }
.content { flex: 1; padding: 20px; background: #f3f3f4; overflow-y: auto; }
.is-mobile .sidebar { position: fixed; z-index: 1000; height: 100%; transform: translateX(-100%); }
.is-mobile .sidebar.sidebar-open { transform: translateX(0); }
.sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999; }
@media (max-width: 768px) { .content { padding: 10px; } }
</style>
