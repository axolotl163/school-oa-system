# 校园OA管理系统

一款面向教育机构的综合办公自动化系统，提供学生管理、教师管理、教学管理、行政管理、科研管理等核心功能。

## 技术架构

### 前端技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vite 7** - 新一代前端构建工具
- **Element Plus** - Vue 3 UI组件库
- **Pinia** - 状态管理库
- **Vue Router 5** - 前端路由管理器
- **Axios** - HTTP请求库

### 后端技术栈

- **Node.js** - JavaScript运行时
- **Express 5** - Web应用框架
- **MySQL** - 关系型数据库
- **body-parser** - 请求体解析中间件
- **cors** - 跨域资源共享

## 项目结构

```txt
school-oa-system/
├── backend/                    # 后端服务
│   ├── config/
│   │   └── db.js              # 数据库配置
│   ├── middleware/
│   │   └── auth.js            # 认证与权限中间件
│   ├── routes/                # 路由模块
│   │   ├── achievements.js    # 科研成果管理
│   │   ├── attendance.js      # 考勤管理
│   │   ├── auth.js            # 认证接口
│   │   ├── classes.js         # 班级管理
│   │   ├── courses.js         # 课程管理
│   │   ├── documents.js       # 公文管理
│   │   ├── evaluations.js     # 评价管理
│   │   ├── exams.js           # 考试管理
│   │   ├── funding.js         # 奖助贷管理
│   │   ├── labs.js            # 实验室管理
│   │   ├── logs.js            # 日志管理
│   │   ├── meetings.js        # 会议管理
│   │   ├── notices.js         # 公告管理
│   │   ├── profile.js         # 个人中心
│   │   ├── projects.js        # 项目管理
│   │   ├── rewards.js         # 奖惩管理
│   │   ├── scores.js          # 成绩管理
│   │   ├── students.js        # 学生管理
│   │   ├── tasks.js           # 任务管理
│   │   ├── teachers.js        # 教师管理
│   │   └── users.js           # 用户管理
│   ├── index.js               # 后端入口文件
│   ├── init-db.js             # 数据库初始化脚本
│   └── package.json
├── src/                       # 前端源码
│   ├── api/
│   │   └── index.js           # Axios API封装
│   ├── router/
│   │   └── index.js           # 路由配置
│   ├── stores/                # Pinia状态管理
│   │   ├── achievement.js
│   │   ├── attendance.js
│   │   ├── class.js
│   │   ├── course.js
│   │   ├── document.js
│   │   ├── evaluation.js
│   │   ├── exam.js
│   │   ├── funding.js
│   │   ├── lab.js
│   │   ├── login.js
│   │   ├── meeting.js
│   │   ├── notice.js
│   │   ├── project.js
│   │   ├── reward.js
│   │   ├── score.js
│   │   ├── student.js
│   │   ├── task.js
│   │   ├── teacher.js
│   │   └── userManage.js
│   ├── views/                 # 页面组件
│   │   ├── Achievement.vue    # 成果管理
│   │   ├── Attendance.vue     # 考勤管理
│   │   ├── Course.vue         # 课程管理
│   │   ├── Document.vue       # 公文管理
│   │   ├── Exam.vue           # 考试管理
│   │   ├── Funding.vue        # 奖助贷管理
│   │   ├── Home.vue           # 首页
│   │   ├── Lab.vue            # 实验室管理
│   │   ├── Layout.vue         # 布局组件
│   │   ├── Login.vue          # 登录页面
│   │   ├── Meeting.vue        # 会议管理
│   │   ├── Notice.vue         # 公告管理
│   │   ├── Profile.vue        # 个人中心
│   │   ├── Project.vue        # 项目管理
│   │   ├── Register.vue       # 注册页面
│   │   ├── Reward.vue         # 奖惩管理
│   │   ├── Score.vue          # 成绩管理
│   │   ├── Student.vue        # 学生信息管理
│   │   ├── Task.vue           # 任务管理
│   │   ├── Teacher.vue        # 教师信息管理
│   │   └── UserManage.vue     # 用户管理
│   ├── App.vue                # 根组件
│   └── main.js                # 前端入口文件
├── public/
│   └── favicon.ico
├── index.html
├── package.json               # 前端依赖配置
├── vite.config.js             # Vite配置
└── eslint.config.js           # ESLint配置
```

## 功能模块

### 用户角色

系统支持三种用户角色，不同角色拥有不同的功能权限：

| 角色   | 权限范围                     |
| ------ | ---------------------------- |
| 管理员 | 全部功能                     |
| 教师   | 学生管理、教学相关、行政相关 |
| 学生   | 个人成绩、考勤、奖助贷申请   |

### 功能列表

#### 1. 学生管理模块

- 学生信息增删改查
- 成绩录入与管理
- 考勤记录管理
- 奖惩信息管理
- 奖助学金申请

#### 2. 教学管理模块

- 课程信息管理
- 教师信息管理
- 考试安排管理

#### 3. 行政管理模块

- 任务发布与管理
- 公告发布与管理
- 会议管理
- 公文流转管理

#### 4. 科研管理模块

- 科研项目管理
- 科研成果管理
- 实验室管理

#### 5. 系统管理模块

- 用户账号管理
- 个人中心
- 操作日志查询

## 安装部署

### 环境要求

- Node.js >= 20.19.0
- MySQL >= 5.7

### 1. 克隆项目

```bash
git clone <repository-url>
cd school-oa-system
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 配置数据库

编辑 `backend/config/db.js` 或创建 `backend/.env` 文件：

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=school_db
DB_PORT=3306
PORT=3000
```

### 4. 初始化数据库

```bash
cd backend
npm run init-db
```

### 5. 安装前端依赖

```bash
cd ..
npm install
```

### 6. 启动开发服务器

**同时启动前后端（开发模式）：**

终端1 - 启动后端：

```bash
cd backend
npm run dev
```

终端2 - 启动前端：

```bash
npm run dev
```

前端访问地址：<http://localhost:5173>
后端接口地址：<http://localhost:3000>

**生产环境构建：**

```bash
# 构建前端
npm run build

# 在后端目录启动生产服务器
cd backend
npm start
```

## 默认账号

初始化数据库后会创建默认管理员账号：

| 用户名 | 密码  | 角色   |
| ------ | ----- | ------ |
| admin  | admin | 管理员 |

## API接口

后端提供RESTful API接口，前端通过 `/api` 路径访问：

| 模块     | 路径              | 说明       |
| -------- | ----------------- | ---------- |
| 认证     | /api/auth         | 登录、注册 |
| 用户     | /api/users        | 用户管理   |
| 学生     | /api/students     | 学生信息   |
| 教师     | /api/teachers     | 教师信息   |
| 课程     | /api/courses      | 课程管理   |
| 成绩     | /api/scores       | 成绩管理   |
| 考勤     | /api/attendance   | 考勤管理   |
| 奖惩     | /api/rewards      | 奖惩管理   |
| 奖助贷   | /api/funding      | 奖助贷管理 |
| 考试     | /api/exams        | 考试安排   |
| 班级     | /api/classes      | 班级管理   |
| 任务     | /api/tasks        | 任务管理   |
| 公告     | /api/notices      | 公告管理   |
| 会议     | /api/meetings     | 会议管理   |
| 公文     | /api/documents    | 公文管理   |
| 项目     | /api/projects     | 项目管理   |
| 成果     | /api/achievements | 成果管理   |
| 实验室   | /api/labs         | 实验室管理 |
| 日志     | /api/logs         | 日志查询   |
| 个人中心 | /api/profile      | 个人信息   |

## 开发规范

### 代码检查

```bash
npm run lint
```

### ESLint规则

- Vue组件使用 `eslint-plugin-vue`
- JavaScript使用 `@eslint/js`
- 集成 `oxlint` 代码质量检查

## 技术亮点

1. **角色权限控制** - 基于请求头的权限验证，支持管理员、教师、学生三种角色
2. **响应式设计** - 适配桌面和移动设备，支持移动端侧边栏折叠
3. **操作日志** - 记录用户关键操作，便于审计追踪
4. **统一错误处理** - API拦截器统一处理401、403等异常
5. **路由守卫** - 前端路由登录验证，保护未授权访问
6. **按需加载** - Vite配置路由懒加载，优化首屏加载速度
