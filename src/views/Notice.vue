<template>
  <div class="notice">
    <el-card>
      <div class="card-header">
        <h3>公告管理</h3>
        <el-button type="primary" @click="noticeStore.showNoticeDialog = true">
          <el-icon><Plus /></el-icon>发布公告
        </el-button>
      </div>

      <!-- 公告列表 -->
      <el-table :data="noticeStore.noticeList" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="time" label="发布时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="danger" size="small" @click="noticeStore.deleteNotice(scope.row.id)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 发布公告弹窗 -->
      <el-dialog title="发布公告" v-model="noticeStore.showNoticeDialog" width="600px">
        <el-form :model="noticeStore.noticeForm" label-width="80px">
          <el-form-item label="标题">
            <el-input
              v-model="noticeStore.noticeForm.title"
              placeholder="请输入公告标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              v-model="noticeStore.noticeForm.content"
              type="textarea"
              :rows="6"
              placeholder="请输入公告内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="noticeStore.showNoticeDialog = false">取消</el-button>
          <el-button type="primary" @click="noticeStore.publishNotice()">发布</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useNoticeStore } from "@/stores/notice";
import { Plus, Delete } from "@element-plus/icons-vue";

const noticeStore = useNoticeStore();

onMounted(() => {
  noticeStore.fetchNotices();
});
</script>

<style scoped>
.notice {
  height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
