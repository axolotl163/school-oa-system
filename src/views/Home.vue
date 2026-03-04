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
                <div>学生总数</div>
                <div class="stat-num">{{ studentList.length }}</div>
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
import { User, Message, Calendar } from "@element-plus/icons-vue";

const studentStore = useStudentStore();
const noticeStore = useNoticeStore();
const nowTime = ref("");

const studentList = computed(() => studentStore.studentList);
const noticeList = computed(() => noticeStore.noticeList);

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
.home {
  height: 100%;
}
.stats {
  margin-top: 20px;
}
.stat-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}
.stat-icon {
  font-size: 32px;
  color: #409eff;
  margin-right: 20px;
}
.stat-text {
  flex: 1;
}
.stat-num {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 5px;
}
.notice-section {
  margin-top: 30px;
}
</style>
