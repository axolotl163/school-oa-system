const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const noticeRoutes = require('./routes/notices');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const courseRoutes = require('./routes/courses');
const scoreRoutes = require('./routes/scores');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const logRoutes = require('./routes/logs');
const classRoutes = require('./routes/classes');
const attendanceRoutes = require('./routes/attendance');
const rewardRoutes = require('./routes/rewards');
const evaluationRoutes = require('./routes/evaluations');
const examRoutes = require('./routes/exams');
const meetingRoutes = require('./routes/meetings');
const documentRoutes = require('./routes/documents');
const projectRoutes = require('./routes/projects');
const achievementRoutes = require('./routes/achievements');
const labRoutes = require('./routes/labs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 提供静态文件服务，指向前端的dist目录
app.use(express.static(path.join(__dirname, '../dist')));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/labs', labRoutes);

// 处理所有其他路由，返回index.html，支持前端路由
app.get(/^.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
});
