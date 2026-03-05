<template>
  <div class="home">
    <el-card>
      <h2>🏫 校园OA工作台</h2>
      <div class="stats">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="stat-item">
              <el-icon class="stat-icon"><User /></el-icon>
              <div class="stat-text">
                <div>{{ studentLabel }}</div>
                <div class="stat-num">{{ studentCount }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-item">
              <el-icon class="stat-icon"><Message /></el-icon>
              <div class="stat-text">
                <div>公告总数</div>
                <div class="stat-num">{{ noticeList.length }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-item">
              <el-icon class="stat-icon"><Calendar /></el-icon>
              <div class="stat-text">
                <div>当前时间</div>
                <div class="stat-num">{{ nowTime }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="notice-section">
        <h3>最新公告</h3>
        <el-table :data="noticeList.slice(0, 3)" style="width: 100%; margin-top: 15px" v-if="noticeList.length > 0">
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="time" label="发布时间" width="150" />
          <el-table-column prop="content" label="内容" show-overflow-tooltip />
        </el-table>
        <el-empty v-else description="暂无公告" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStudentStore } from "@/stores/student";
import { useNoticeStore } from "@/stores/notice";
import { useLoginStore } from "@/stores/login";
import { User, Message, Calendar } from "@element-plus/icons-vue";

const studentStore = useStudentStore();
const noticeStore = useNoticeStore();
const loginStore = useLoginStore();
const nowTime = ref("");

const noticeList = computed(() => noticeStore.noticeList);

const studentLabel = computed(() => {
  const role = loginStore.userInfo.role;
  if (role === "学生") return "本班学生数";
  if (role === "教师") return "本班学生数";
  return "学生总数";
});

const studentCount = computed(() => {
  const role = loginStore.userInfo.role;
  const classId = loginStore.userInfo.class_id;
  
  if (role === "管理员" || !classId) {
    return studentStore.studentList.length;
  }
  
  return studentStore.studentList.filter(s => s.class_id === classId).length;
});

const updateTime = () => {
  nowTime.value = new Date().toLocaleString();
};

onMounted(async () => {
  updateTime();
  setInterval(updateTime, 1000);
  await Promise.all([
    studentStore.fetchStudents(),
    noticeStore.fetchNotices()
  ]);
});
</script>

<style scoped>
.home { height: 100%; }
.stats { margin-top: 20px; }
.stat-item { display: flex; align-items: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
.stat-icon { font-size: 32px; color: #409eff; margin-right: 20px; }
.stat-text { flex: 1; }
.stat-num { font-size: 24px; font-weight: bold; color: #333; margin-top: 5px; }
.notice-section { margin-top: 30px; }
</style>
