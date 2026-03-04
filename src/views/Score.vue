<template>
  <div class="score">
    <el-card>
      <div class="card-header">
        <h3>成绩管理</h3>
        <el-button type="primary" @click="scoreStore.addScore()">
          <el-icon><Plus /></el-icon>录入成绩
        </el-button>
      </div>

      <el-table :data="scoreStore.scoreList" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="student_name" label="学生" width="100" />
        <el-table-column prop="course_name" label="课程" width="150" />
        <el-table-column prop="score" label="分数" width="80">
          <template #default="scope">
            <el-tag :type="getScoreType(scope.row.score)">{{ scope.row.score }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="semester" label="学期" width="120" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="scoreStore.editScore(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" size="small" @click="scoreStore.deleteScore(scope.row.id)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="成绩信息" v-model="scoreStore.showDialog" width="500px">
        <el-form :model="scoreStore.editForm" label-width="80px">
          <el-form-item label="学生">
            <el-select v-model="scoreStore.editForm.student_id" placeholder="请选择学生">
              <el-option v-for="s in studentStore.studentList" :key="s.id" :label="s.name" :value="s.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="课程">
            <el-select v-model="scoreStore.editForm.course_id" placeholder="请选择课程">
              <el-option v-for="c in courseStore.courseList" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="分数">
            <el-input v-model.number="scoreStore.editForm.score" placeholder="请输入分数"></el-input>
          </el-form-item>
          <el-form-item label="学期">
            <el-input v-model="scoreStore.editForm.semester" placeholder="如：2026春季"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="scoreStore.showDialog = false">取消</el-button>
          <el-button type="primary" @click="scoreStore.saveScore()">保存</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useScoreStore } from "@/stores/score";
import { useStudentStore } from "@/stores/student";
import { useCourseStore } from "@/stores/course";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

const scoreStore = useScoreStore();
const studentStore = useStudentStore();
const courseStore = useCourseStore();

onMounted(() => {
  scoreStore.fetchScores();
  studentStore.fetchStudents();
  courseStore.fetchCourses();
});

function getScoreType(score) {
  if (score >= 90) return 'success';
  if (score >= 60) return 'warning';
  return 'danger';
}
</script>

<style scoped>
.score { height: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
