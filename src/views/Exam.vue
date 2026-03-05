<template>
  <div class="page-container">
    <el-card>
      <div class="card-header">
        <h3>考试安排</h3>
        <el-button type="primary" @click="store.addExam()">
          <el-icon><Plus /></el-icon>添加考试
        </el-button>
      </div>
      <el-table :data="store.examList" border stripe style="width:100%;margin-top:20px">
        <el-table-column prop="course_name" label="课程" width="150"/>
        <el-table-column prop="exam_date" label="考试日期" width="120"/>
        <el-table-column prop="start_time" label="开始时间" width="100"/>
        <el-table-column prop="end_time" label="结束时间" width="100"/>
        <el-table-column prop="location" label="考试地点"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope"><el-tag :type="scope.row.status==='已发布'?'success':'warning'">{{ scope.row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="store.editExam(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="store.deleteExam(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="考试安排" v-model="store.showDialog" width="500px">
        <el-form :model="store.editForm" label-width="80px">
          <el-form-item label="课程">
            <el-select v-model="store.editForm.course_id" placeholder="选择课程" style="width:100%">
              <el-option v-for="c in courseStore.courseList" :key="c.id" :label="c.name" :value="c.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="考试日期">
            <el-date-picker v-model="store.editForm.exam_date" type="date" value-format="YYYY-MM-DD" style="width:100%"/>
          </el-form-item>
          <el-form-item label="开始时间"><el-input v-model="store.editForm.start_time" placeholder="如：09:00"/></el-form-item>
          <el-form-item label="结束时间"><el-input v-model="store.editForm.end_time" placeholder="如：11:00"/></el-form-item>
          <el-form-item label="考试地点"><el-input v-model="store.editForm.location"/></el-form-item>
          <el-form-item label="状态">
            <el-select v-model="store.editForm.status" style="width:100%">
              <el-option label="待发布" value="待发布"/>
              <el-option label="已发布" value="已发布"/>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer><el-button @click="store.showDialog=false">取消</el-button><el-button type="primary" @click="store.saveExam()">保存</el-button></template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useExamStore } from "@/stores/exam";
import { useCourseStore } from "@/stores/course";
import { Plus } from "@element-plus/icons-vue";
const store = useExamStore();
const courseStore = useCourseStore();
onMounted(() => { store.fetchExams(); courseStore.fetchCourses(); });
</script>
<style scoped>.page-container{height:100%}.card-header{display:flex;justify-content:space-between;align-items:center}</style>
