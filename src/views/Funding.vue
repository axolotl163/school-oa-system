<template>
  <div class="page-container">
    <el-card>
      <div class="card-header">
        <h3>奖助贷管理</h3>
      </div>
      
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="资助项目" name="projects" v-if="canAccess(['管理员'])">
          <div class="tab-header">
            <el-button type="primary" @click="store.addProject()">
              <el-icon><Plus /></el-icon>添加项目
            </el-button>
          </div>
          <el-table :data="store.projects" border stripe style="width:100%;margin-top:20px">
            <el-table-column prop="id" label="ID" width="60"/>
            <el-table-column prop="name" label="项目名称"/>
            <el-table-column prop="type" label="类型" width="100">
              <template #default="scope"><el-tag :type="scope.row.type==='奖学金'?'success':'primary'">{{ scope.row.type }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="100"/>
            <el-table-column prop="quota" label="名额" width="80"/>
            <el-table-column prop="application_start_date" label="申请开始" width="120"/>
            <el-table-column prop="application_end_date" label="申请结束" width="120"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope"><el-tag :type="scope.row.status==='开放'?'success':'warning'">{{ scope.row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="primary" size="small" @click="store.editProject(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="store.deleteProject(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="资助项目" name="projects-student" v-if="canAccess(['学生'])">
          <el-table :data="store.projects" border stripe style="width:100%;margin-top:20px">
            <el-table-column prop="id" label="ID" width="60"/>
            <el-table-column prop="name" label="项目名称"/>
            <el-table-column prop="type" label="类型" width="100">
              <template #default="scope"><el-tag :type="scope.row.type==='奖学金'?'success':'primary'">{{ scope.row.type }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="100"/>
            <el-table-column prop="quota" label="名额" width="80"/>
            <el-table-column prop="application_start_date" label="申请开始" width="120"/>
            <el-table-column prop="application_end_date" label="申请结束" width="120"/>
            <el-table-column prop="requirements" label="申请条件"/>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button type="primary" size="small" @click="applyProject(scope.row)">申请</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我的申请" name="applications" v-if="canAccess(['学生'])">
          <div class="tab-header">
            <el-button type="primary" @click="store.addApplication()">
              <el-icon><Plus /></el-icon>提交申请
            </el-button>
          </div>
          <el-table :data="store.applications" border stripe style="width:100%;margin-top:20px">
            <el-table-column prop="id" label="ID" width="60"/>
            <el-table-column prop="project_name" label="项目名称"/>
            <el-table-column prop="project_type" label="项目类型" width="100"/>
            <el-table-column prop="apply_reason" label="申请理由"/>
            <el-table-column prop="materials" label="材料" width="150"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="申请时间" width="150"/>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button type="primary" size="small" @click="store.editApplication(scope.row)" v-if="scope.row.status === '待审核'">修改</el-button>
                <el-button type="danger" size="small" @click="store.deleteApplication(scope.row.id)" v-if="scope.row.status === '待审核'">撤回</el-button>
                <el-button type="info" size="small" @click="viewApprovals(scope.row.id)">查看审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="申请审核" name="approvals" v-if="canAccess(['管理员', '教师'])">
          <el-table :data="store.applications" border stripe style="width:100%;margin-top:20px">
            <el-table-column prop="id" label="ID" width="60"/>
            <el-table-column prop="student_name" label="学生姓名"/>
            <el-table-column prop="class_id" label="班级" width="100"/>
            <el-table-column prop="project_name" label="项目名称"/>
            <el-table-column prop="project_type" label="项目类型" width="100"/>
            <el-table-column prop="apply_reason" label="申请理由"/>
            <el-table-column prop="materials" label="材料" width="150"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="申请时间" width="150"/>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="primary" size="small" @click="showApprovalDialog(scope.row)">审核</el-button>
                <el-button type="info" size="small" @click="viewApprovals(scope.row.id)">查看进度</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="公示管理" name="notices">
          <div class="tab-header" v-if="canAccess(['管理员', '教师'])">
            <el-button type="primary" @click="store.addNotice()">
              <el-icon><Plus /></el-icon>发布公示
            </el-button>
          </div>
          <el-table :data="store.notices" border stripe style="width:100%;margin-top:20px">
            <el-table-column prop="id" label="ID" width="60"/>
            <el-table-column prop="project_name" label="项目名称"/>
            <el-table-column prop="project_type" label="项目类型" width="100"/>
            <el-table-column prop="content" label="公示内容"/>
            <el-table-column prop="start_date" label="公示开始" width="120"/>
            <el-table-column prop="end_date" label="公示结束" width="120"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope"><el-tag :type="scope.row.status==='公示中'?'success':'info'">{{ scope.row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="primary" size="small" @click="submitObjection(scope.row)" v-if="scope.row.status === '公示中'">提交异议</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="异议处理" name="objections" v-if="canAccess(['管理员'])">
          <el-table :data="store.objections" border stripe style="width:100%;margin-top:20px">
            <el-table-column prop="id" label="ID" width="60"/>
            <el-table-column prop="project_name" label="项目名称"/>
            <el-table-column prop="applicant" label="异议人" width="100"/>
            <el-table-column prop="content" label="异议内容"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope"><el-tag :type="scope.row.status==='待处理'?'warning':'success'">{{ scope.row.status }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="reply" label="处理结果"/>
            <el-table-column prop="created_at" label="提交时间" width="150"/>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleObjectionDialog(scope.row)" v-if="scope.row.status === '待处理'">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="发放管理" name="distributions">
          <div class="tab-header" v-if="canAccess(['管理员'])">
            <el-button type="primary" @click="store.addDistribution()">
              <el-icon><Plus /></el-icon>生成发放记录
            </el-button>
          </div>
          <el-table :data="store.distributions" border stripe style="width:100%;margin-top:20px">
            <el-table-column prop="id" label="ID" width="60"/>
            <el-table-column prop="student_name" label="学生姓名"/>
            <el-table-column prop="class_id" label="班级" width="100"/>
            <el-table-column prop="project_name" label="项目名称"/>
            <el-table-column prop="project_type" label="项目类型" width="100"/>
            <el-table-column prop="amount" label="发放金额" width="100"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getDistributionStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="distribution_date" label="发放日期" width="120"/>
            <el-table-column prop="failure_reason" label="失败原因"/>
            <el-table-column prop="confirmed_at" label="确认时间" width="150"/>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button type="primary" size="small" @click="updateDistributionStatus(scope.row)" v-if="canAccess(['管理员']) && scope.row.status !== '已发放'">更新状态</el-button>
                <el-button type="success" size="small" @click="store.confirmDistribution(scope.row.id)" v-if="canAccess(['学生']) && scope.row.status === '已发放' && !scope.row.confirmed_at">确认到账</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog title="项目信息" v-model="store.showProjectDialog" width="600px">
      <el-form :model="store.editProjectForm" label-width="120px">
        <el-form-item label="项目名称"><el-input v-model="store.editProjectForm.name"/></el-form-item>
        <el-form-item label="项目类型">
          <el-select v-model="store.editProjectForm.type" style="width:100%">
            <el-option label="奖学金" value="奖学金"/>
            <el-option label="助学金" value="助学金"/>
          </el-select>
        </el-form-item>
        <el-form-item label="金额"><el-input v-model.number="store.editProjectForm.amount" type="number"/></el-form-item>
        <el-form-item label="名额"><el-input v-model.number="store.editProjectForm.quota" type="number"/></el-form-item>
        <el-form-item label="申请开始日期">
          <el-date-picker v-model="store.editProjectForm.application_start_date" type="date" value-format="YYYY-MM-DD" style="width:100%"/>
        </el-form-item>
        <el-form-item label="申请结束日期">
          <el-date-picker v-model="store.editProjectForm.application_end_date" type="date" value-format="YYYY-MM-DD" style="width:100%"/>
        </el-form-item>
        <el-form-item label="申请条件"><el-input type="textarea" v-model="store.editProjectForm.requirements"/></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="store.editProjectForm.status" style="width:100%">
            <el-option label="开放" value="开放"/>
            <el-option label="关闭" value="关闭"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer><el-button @click="store.showProjectDialog=false">取消</el-button><el-button type="primary" @click="store.saveProject()">保存</el-button></template>
    </el-dialog>

    <el-dialog title="申请信息" v-model="store.showApplicationDialog" width="600px">
      <el-form :model="store.editApplicationForm" label-width="100px">
        <el-form-item label="资助项目">
          <el-select v-model="store.editApplicationForm.project_id" placeholder="选择项目" style="width:100%">
            <el-option v-for="p in store.projects" :key="p.id" :label="p.name" :value="p.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="申请理由"><el-input type="textarea" v-model="store.editApplicationForm.apply_reason"/></el-form-item>
        <el-form-item label="证明材料"><el-input v-model="store.editApplicationForm.materials" placeholder="上传材料路径或说明"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="store.showApplicationDialog=false">取消</el-button><el-button type="primary" @click="store.saveApplication()">提交</el-button></template>
    </el-dialog>

    <el-dialog title="审核" v-model="store.showApprovalDialog" width="500px">
      <el-form :model="store.editApprovalForm" label-width="80px">
        <el-form-item label="审核结果">
          <el-select v-model="store.editApprovalForm.status" style="width:100%">
            <el-option label="通过" value="通过"/>
            <el-option label="驳回" value="驳回"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" v-model="store.editApprovalForm.comment"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="store.showApprovalDialog=false">取消</el-button><el-button type="primary" @click="store.saveApproval()">确认审核</el-button></template>
    </el-dialog>

    <el-dialog title="发布公示" v-model="store.showNoticeDialog" width="600px">
      <el-form :model="store.editNoticeForm" label-width="100px">
        <el-form-item label="资助项目">
          <el-select v-model="store.editNoticeForm.project_id" placeholder="选择项目" style="width:100%">
            <el-option v-for="p in store.projects" :key="p.id" :label="p.name" :value="p.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="公示内容"><el-input type="textarea" v-model="store.editNoticeForm.content"/></el-form-item>
        <el-form-item label="公示开始日期">
          <el-date-picker v-model="store.editNoticeForm.start_date" type="date" value-format="YYYY-MM-DD" style="width:100%"/>
        </el-form-item>
        <el-form-item label="公示结束日期">
          <el-date-picker v-model="store.editNoticeForm.end_date" type="date" value-format="YYYY-MM-DD" style="width:100%"/>
        </el-form-item>
      </el-form>
      <template #footer><el-button @click="store.showNoticeDialog=false">取消</el-button><el-button type="primary" @click="store.saveNotice()">发布</el-button></template>
    </el-dialog>

    <el-dialog title="提交异议" v-model="store.showObjectionDialog" width="500px">
      <el-form :model="store.editObjectionForm" label-width="80px">
        <el-form-item label="异议内容"><el-input type="textarea" v-model="store.editObjectionForm.content"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="store.showObjectionDialog=false">取消</el-button><el-button type="primary" @click="store.saveObjection()">提交</el-button></template>
    </el-dialog>

    <el-dialog title="处理异议" v-model="showHandleObjectionDialog" width="500px">
      <el-form :model="handleObjectionForm" label-width="80px">
        <el-form-item label="处理状态">
          <el-select v-model="handleObjectionForm.status" style="width:100%">
            <el-option label="已处理" value="已处理"/>
            <el-option label="无效异议" value="无效异议"/>
          </el-select>
        </el-form-item>
        <el-form-item label="处理回复"><el-input type="textarea" v-model="handleObjectionForm.reply"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="showHandleObjectionDialog=false">取消</el-button><el-button type="primary" @click="confirmHandleObjection()">确认处理</el-button></template>
    </el-dialog>

    <el-dialog title="生成发放记录" v-model="store.showDistributionDialog" width="500px">
      <el-form :model="store.editDistributionForm" label-width="100px">
        <el-form-item label="申请记录">
          <el-select v-model="store.editDistributionForm.application_id" placeholder="选择申请" style="width:100%">
            <el-option v-for="a in approvedApplications" :key="a.id" :label="`${a.student_name} - ${a.project_name}`" :value="a.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发放金额"><el-input v-model.number="store.editDistributionForm.amount" type="number"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="store.showDistributionDialog=false">取消</el-button><el-button type="primary" @click="store.saveDistribution()">生成</el-button></template>
    </el-dialog>

    <el-dialog title="更新发放状态" v-model="showUpdateStatusDialog" width="500px">
      <el-form :model="updateStatusForm" label-width="100px">
        <el-form-item label="发放状态">
          <el-select v-model="updateStatusForm.status" style="width:100%">
            <el-option label="已发放" value="已发放"/>
            <el-option label="发放失败" value="发放失败"/>
          </el-select>
        </el-form-item>
        <el-form-item label="发放日期" v-if="updateStatusForm.status === '已发放'">
          <el-date-picker v-model="updateStatusForm.distribution_date" type="date" value-format="YYYY-MM-DD" style="width:100%"/>
        </el-form-item>
        <el-form-item label="失败原因" v-if="updateStatusForm.status === '发放失败'"><el-input v-model="updateStatusForm.failure_reason"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="showUpdateStatusDialog=false">取消</el-button><el-button type="primary" @click="confirmUpdateStatus()">确认更新</el-button></template>
    </el-dialog>

    <el-dialog title="审核进度" v-model="showApprovalsDialog" width="600px">
      <el-table :data="store.approvals" border style="width:100%">
        <el-table-column prop="approval_level" label="审核级别" width="100">
          <template #default="scope">{{ getApprovalLevelName(scope.row.approval_level) }}</template>
        </el-table-column>
        <el-table-column prop="approver" label="审核人" width="100"/>
        <el-table-column prop="approver_role" label="审核角色" width="120"/>
        <el-table-column prop="status" label="审核结果" width="100">
          <template #default="scope"><el-tag :type="scope.row.status==='通过'?'success':'danger'">{{ scope.row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="comment" label="审核意见"/>
        <el-table-column prop="created_at" label="审核时间" width="150"/>
      </el-table>
      <template #footer><el-button @click="showApprovalsDialog=false">关闭</el-button></template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useFundingStore } from "@/stores/funding";
import { useLoginStore } from "@/stores/login";
import { Plus } from "@element-plus/icons-vue";

const store = useFundingStore();
const loginStore = useLoginStore();
const activeTab = ref("projects");
const showHandleObjectionDialog = ref(false);
const showUpdateStatusDialog = ref(false);
const showApprovalsDialog = ref(false);
const handleObjectionForm = ref({ id: "", status: "", reply: "" });
const updateStatusForm = ref({ id: "", status: "", distribution_date: "", failure_reason: "" });

function canAccess(roles) {
  return roles.includes(loginStore.userInfo.role);
}

function getStatusType(status) {
  switch (status) {
    case "待审核": return "warning";
    case "已通过": return "success";
    case "已驳回": return "danger";
    default: return "info";
  }
}

function getDistributionStatusType(status) {
  switch (status) {
    case "待发放": return "warning";
    case "已发放": return "success";
    case "发放失败": return "danger";
    default: return "info";
  }
}

function getApprovalLevelName(level) {
  switch (level) {
    case 1: return "辅导员初审";
    case 2: return "学院复审";
    case 3: return "学校终审";
    default: return `第${level}级审核`;
  }
}

const approvedApplications = computed(() => {
  return store.applications.filter(a => a.status === "已通过");
});

function applyProject(project) {
  store.addApplication();
  store.editApplicationForm.project_id = project.id;
}

function showApprovalDialog(row) {
  store.editApprovalForm.application_id = row.id;
  store.editApprovalForm.status = "";
  store.editApprovalForm.comment = "";
  store.showApprovalDialog = true;
}

function submitObjection(notice) {
  store.editObjectionForm.notice_id = notice.id;
  store.editObjectionForm.content = "";
  store.showObjectionDialog = true;
}

function handleObjectionDialog(row) {
  handleObjectionForm.value = { id: row.id, status: "", reply: "" };
  showHandleObjectionDialog.value = true;
}

function confirmHandleObjection() {
  store.handleObjection(handleObjectionForm.value.id, handleObjectionForm.value.status, handleObjectionForm.value.reply);
  showHandleObjectionDialog.value = false;
}

function updateDistributionStatus(row) {
  updateStatusForm.value = { id: row.id, status: "", distribution_date: "", failure_reason: "" };
  showUpdateStatusDialog.value = true;
}

function confirmUpdateStatus() {
  store.updateDistributionStatus(updateStatusForm.value.id, updateStatusForm.value.status, updateStatusForm.value.distribution_date, updateStatusForm.value.failure_reason);
  showUpdateStatusDialog.value = false;
}

function viewApprovals(applicationId) {
  store.fetchApprovals(applicationId);
  showApprovalsDialog.value = true;
}

watch(() => loginStore.userInfo.role, () => {
  if (loginStore.userInfo.role === "学生") {
    activeTab.value = "projects-student";
  } else {
    activeTab.value = "projects";
  }
});

onMounted(() => {
  store.fetchProjects();
  store.fetchApplications();
  store.fetchNotices();
  store.fetchObjections();
  store.fetchDistributions();
  
  if (loginStore.userInfo.role === "学生") {
    activeTab.value = "projects-student";
  }
});
</script>
<style scoped>
.page-container{height:100%}
.card-header{display:flex;justify-content:space-between;align-items:center}
.tab-header{display:flex;justify-content:flex-end;margin-bottom:10px}
</style>