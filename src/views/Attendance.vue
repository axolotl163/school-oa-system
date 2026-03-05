<template>
  <div class="page-container">
    <el-card>
      <div class="card-header">
        <h3>考勤管理</h3>
        <el-button type="primary" @click="store.addAttendance()" v-if="canEdit">
          <el-icon><Plus /></el-icon>添加考勤
        </el-button>
      </div>
      <el-table :data="store.attendanceList" border stripe style="width:100%;margin-top:20px">
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column prop="student_name" label="学生" width="100"/>
        <el-table-column prop="course_name" label="课程" width="120"/>
        <el-table-column prop="date" label="日期" width="120"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status==='正常'?'success':scope.row.status==='迟到'?'warning':'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="store.editAttendance(scope.row)" v-if="canEdit">编辑</el-button>
            <el-button type="danger" size="small" @click="store.deleteAttendance(scope.row.id)" v-if="canEdit">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="考勤信息" v-model="store.showDialog" width="500px">
        <el-form :model="store.editForm" label-width="80px">
          <el-form-item label="学生">
            <el-select v-model="store.editForm.student_id" placeholder="选择学生" style="width:100%">
              <el-option v-for="s in filteredStudents" :key="s.id" :label="s.name" :value="s.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="课程">
            <el-select v-model="store.editForm.course_id" placeholder="选择课程" style="width:100%">
              <el-option v-for="c in courseStore.courseList" :key="c.id" :label="c.name" :value="c.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="store.editForm.date" type="date" value-format="YYYY-MM-DD" style="width:100%"/>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="store.editForm.status" style="width:100%">
              <el-option label="正常" value="正常"/>
              <el-option label="迟到" value="迟到"/>
              <el-option label="早退" value="早退"/>
              <el-option label="请假" value="请假"/>
              <el-option label="缺勤" value="缺勤"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="store.editForm.remark"/>
          </el-form-item>
        </el-form>
        <template #footer><el-button @click="store.showDialog=false">取消</el-button><el-button type="primary" @click="store.saveAttendance()">保存</el-button></template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { useAttendanceStore } from "@/stores/attendance";
import { useStudentStore } from "@/stores/student";
import { useCourseStore } from "@/stores/course";
import { useLoginStore } from "@/stores/login";
import { Plus } from "@element-plus/icons-vue";
const store = useAttendanceStore();
const studentStore = useStudentStore();
const courseStore = useCourseStore();
const loginStore = useLoginStore();

const canEdit = computed(() => {
  return loginStore.userInfo.role !== "学生";
});

const filteredStudents = computed(() => {
  const role = loginStore.userInfo.role;
  const classId = loginStore.userInfo.class_id;
  if (role === "管理员" || !classId) {
    return studentStore.studentList;
  }
  return studentStore.studentList.filter(s => s.class_id === classId);
});

onMounted(() => { store.fetchAttendance(); studentStore.fetchStudents(); courseStore.fetchCourses(); });
</script>
<style scoped>.page-container{height:100%}.card-header{display:flex;justify-content:space-between;align-items:center}</style>
