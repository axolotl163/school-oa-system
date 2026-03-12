import { createRouter, createWebHistory } from "vue-router";

const requireAuth = (to, from) => {
  const isLogin = localStorage.getItem("isLogin");
  if (isLogin) { return true; } else { return "/login"; }
};

const routes = [
  { path: "/login", name: "Login", component: () => import("../views/Login.vue") },
  { path: "/register", name: "Register", component: () => import("../views/Register.vue") },
  {
    path: "/",
    component: () => import("../views/Layout.vue"),
    beforeEnter: requireAuth,
    children: [
      { path: "", name: "Home", component: () => import("../views/Home.vue") },
      { path: "student", name: "Student", component: () => import("../views/Student.vue") },
      { path: "notice", name: "Notice", component: () => import("../views/Notice.vue") },
      { path: "profile", name: "Profile", component: () => import("../views/Profile.vue") },
      { path: "score", name: "Score", component: () => import("../views/Score.vue") },
      { path: "course", name: "Course", component: () => import("../views/Course.vue") },
      { path: "teacher", name: "Teacher", component: () => import("../views/Teacher.vue") },
      { path: "task", name: "Task", component: () => import("../views/Task.vue") },
      { path: "userManage", name: "UserManage", component: () => import("../views/UserManage.vue") },
      { path: "attendance", name: "Attendance", component: () => import("../views/Attendance.vue") },
      { path: "reward", name: "Reward", component: () => import("../views/Reward.vue") },
      { path: "exam", name: "Exam", component: () => import("../views/Exam.vue") },
      { path: "meeting", name: "Meeting", component: () => import("../views/Meeting.vue") },
      { path: "document", name: "Document", component: () => import("../views/Document.vue") },
      { path: "project", name: "Project", component: () => import("../views/Project.vue") },
      { path: "achievement", name: "Achievement", component: () => import("../views/Achievement.vue") },
      { path: "lab", name: "Lab", component: () => import("../views/Lab.vue") },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
