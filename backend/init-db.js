const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'oa.sys',
  password: 'cptbtptpIlI1',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('连接MySQL失败:', err);
    return;
  }
  console.log('连接MySQL成功!');

  const deleteDbSql = 'DROP DATABASE IF EXISTS school_db';
  connection.query(deleteDbSql, (err) => {
    if (err) {
      console.error('删除数据库失败:', err);
      connection.end();
      return;
    }
    console.log('数据库删除成功!');

    const createDbSql = 'CREATE DATABASE IF NOT EXISTS school_db';
    connection.query(createDbSql, (err) => {
      if (err) {
        console.error('创建数据库失败:', err);
        connection.end();
        return;
      }
      console.log('数据库创建成功!');

      const useDbSql = 'USE school_db';
      connection.query(useDbSql, (err) => {
        if (err) {
          console.error('切换数据库失败:', err);
          connection.end();
          return;
        }

        const tables = [
          `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT '学生',
          class_id INT,
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS classes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          grade VARCHAR(20),
          teacher_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          age INT NOT NULL,
          class_id INT,
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (class_id) REFERENCES classes(id)
        )`,
          `CREATE TABLE IF NOT EXISTS notices (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          time DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS teachers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          gender VARCHAR(10),
          title VARCHAR(50),
          department VARCHAR(50),
          phone VARCHAR(20),
          class_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS courses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          code VARCHAR(50),
          credits INT,
          hours INT,
          teacher_id INT,
          class_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (teacher_id) REFERENCES teachers(id),
          FOREIGN KEY (class_id) REFERENCES classes(id)
        )`,
          `CREATE TABLE IF NOT EXISTS scores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          course_id INT NOT NULL,
          score DECIMAL(5,2),
          semester VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id),
          FOREIGN KEY (course_id) REFERENCES courses(id)
        )`,
          `CREATE TABLE IF NOT EXISTS attendance (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          course_id INT,
          date DATE NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT '正常',
          remark VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id),
          FOREIGN KEY (course_id) REFERENCES courses(id)
        )`,
          `CREATE TABLE IF NOT EXISTS rewards_punishments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          type VARCHAR(20) NOT NULL,
          reason VARCHAR(255),
          amount DECIMAL(10,2),
          date DATE NOT NULL,
          status VARCHAR(20) DEFAULT '待审批',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id)
        )`,
          `CREATE TABLE IF NOT EXISTS course_evaluations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          course_id INT NOT NULL,
          rating INT,
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id),
          FOREIGN KEY (course_id) REFERENCES courses(id)
        )`,
          `CREATE TABLE IF NOT EXISTS exams (
          id INT AUTO_INCREMENT PRIMARY KEY,
          course_id INT NOT NULL,
          exam_date DATE NOT NULL,
          start_time VARCHAR(10),
          end_time VARCHAR(10),
          location VARCHAR(100),
          status VARCHAR(20) DEFAULT '待发布',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses(id)
        )`,
          `CREATE TABLE IF NOT EXISTS meetings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          organizer VARCHAR(50),
          meeting_date DATE NOT NULL,
          start_time VARCHAR(10),
          end_time VARCHAR(10),
          location VARCHAR(100),
          participants TEXT,
          status VARCHAR(20) DEFAULT '待开始',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS documents (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          type VARCHAR(50),
          status VARCHAR(20) DEFAULT '待审批',
          author VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          leader VARCHAR(50),
          budget DECIMAL(15,2),
          start_date DATE,
          end_date DATE,
          status VARCHAR(20) DEFAULT '待审批',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS achievements (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50),
          description TEXT,
          publish_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id)
        )`,
          `CREATE TABLE IF NOT EXISTS labs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          location VARCHAR(100),
          capacity INT,
          equipment_count INT DEFAULT 0,
          status VARCHAR(20) DEFAULT '正常',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          status VARCHAR(20) DEFAULT '待处理',
          priority VARCHAR(20) DEFAULT '普通',
          assignee VARCHAR(50),
          due_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS operation_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50),
          operation VARCHAR(100),
          details TEXT,
          ip VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS funding_projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(20) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          quota INT NOT NULL,
          application_start_date DATE NOT NULL,
          application_end_date DATE NOT NULL,
          requirements TEXT,
          status VARCHAR(20) DEFAULT '开放',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
          `CREATE TABLE IF NOT EXISTS applications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          project_id INT NOT NULL,
          apply_reason TEXT,
          materials TEXT,
          status VARCHAR(20) DEFAULT '待审核',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id),
          FOREIGN KEY (project_id) REFERENCES funding_projects(id)
        )`,
          `CREATE TABLE IF NOT EXISTS approvals (
          id INT AUTO_INCREMENT PRIMARY KEY,
          application_id INT NOT NULL,
          approver VARCHAR(50) NOT NULL,
          approver_role VARCHAR(20) NOT NULL,
          approval_level INT NOT NULL,
          status VARCHAR(20) NOT NULL,
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (application_id) REFERENCES applications(id)
        )`,
          `CREATE TABLE IF NOT EXISTS public_notices (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT NOT NULL,
          content TEXT,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          status VARCHAR(20) DEFAULT '公示中',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES funding_projects(id)
        )`,
          `CREATE TABLE IF NOT EXISTS notice_records (
          id INT AUTO_INCREMENT PRIMARY KEY,
          notice_id INT NOT NULL,
          student_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (notice_id) REFERENCES public_notices(id),
          FOREIGN KEY (student_id) REFERENCES students(id)
        )`,
          `CREATE TABLE IF NOT EXISTS objections (
          id INT AUTO_INCREMENT PRIMARY KEY,
          notice_id INT NOT NULL,
          applicant VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          status VARCHAR(20) DEFAULT '待处理',
          reply TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (notice_id) REFERENCES public_notices(id)
        )`,
          `CREATE TABLE IF NOT EXISTS distributions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          application_id INT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          status VARCHAR(20) DEFAULT '待发放',
          distribution_date DATE,
          failure_reason TEXT,
          confirmed_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (application_id) REFERENCES applications(id)
        )`
        ];

        let tableIndex = 0;
        function createNextTable() {
          if (tableIndex >= tables.length) {
            insertInitialData();
            return;
          }
          connection.query(tables[tableIndex], (err) => {
            if (err) {
              console.error(`创建表${tableIndex + 1}失败:`, err);
            } else {
              console.log(`表${tableIndex + 1}创建成功!`);
            }
            tableIndex++;
            createNextTable();
          });
        }

        function insertInitialData() {
          const insertData = [
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('admin', 'admin', '管理员', NULL)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('王建国', '123456', '教师', 1)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('李明', '123456', '教师', 2)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('张伟', '123456', '教师', 3)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('张三', '123456', '学生', 1)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('李四', '123456', '学生', 1)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('王五', '123456', '学生', 2)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('赵六', '123456', '学生', 2)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('钱七', '123456', '学生', 3)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('孙八', '123456', '学生', 1)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('周九', '123456', '学生', 2)",
            "INSERT IGNORE INTO users (username, password, role, class_id) VALUES ('吴十', '123456', '学生', 3)",
            "INSERT IGNORE INTO classes (name, grade, teacher_id) VALUES ('计算机1班', '2026', 1)",
            "INSERT IGNORE INTO classes (name, grade, teacher_id) VALUES ('计算机2班', '2026', 2)",
            "INSERT IGNORE INTO classes (name, grade, teacher_id) VALUES ('软件工程1班', '2026', 3)",
            "INSERT IGNORE INTO teachers (name, gender, title, department, phone, class_id) VALUES ('王建国', '男', '教授', '计算机系', '13800000001', 1)",
            "INSERT IGNORE INTO teachers (name, gender, title, department, phone, class_id) VALUES ('李明', '女', '副教授', '数学系', '13800000002', 2)",
            "INSERT IGNORE INTO teachers (name, gender, title, department, phone, class_id) VALUES ('张伟', '男', '讲师', '计算机系', '13800000003', 3)",
            "INSERT IGNORE INTO students (name, age, class_id, phone) VALUES ('张三', 20, 1, '13800138000')",
            "INSERT IGNORE INTO students (name, age, class_id, phone) VALUES ('李四', 19, 1, '13900139000')",
            "INSERT IGNORE INTO students (name, age, class_id, phone) VALUES ('孙八', 20, 1, '13900139001')",
            "INSERT IGNORE INTO students (name, age, class_id, phone) VALUES ('王五', 21, 2, '13700137000')",
            "INSERT IGNORE INTO students (name, age, class_id, phone) VALUES ('赵六', 20, 2, '13600136000')",
            "INSERT IGNORE INTO students (name, age, class_id, phone) VALUES ('周九', 19, 2, '13600136001')",
            "INSERT IGNORE INTO students (name, age, class_id, phone) VALUES ('钱七', 19, 3, '13500135000')",
            "INSERT IGNORE INTO students (name, age, class_id, phone) VALUES ('吴十', 20, 3, '13500135001')",
            "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id, class_id) VALUES ('数据结构', 'CS101', 4, 64, 1, 1)",
            "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id, class_id) VALUES ('高等数学', 'MA101', 4, 72, 2, 1)",
            "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id, class_id) VALUES ('计算机网络', 'CS201', 3, 48, 3, 2)",
            "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id, class_id) VALUES ('大学英语', 'EN101', 3, 48, 2, 1)",
            "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id, class_id) VALUES ('操作系统', 'CS202', 3, 48, 1, 2)",
            "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id, class_id) VALUES ('软件工程', 'SE101', 3, 48, 3, 3)",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (1, 1, 85, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (1, 2, 90, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (1, 4, 88, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (2, 1, 88, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (2, 2, 92, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (3, 1, 78, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (3, 2, 85, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (4, 3, 76, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (4, 5, 82, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (5, 3, 91, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (5, 5, 87, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (6, 6, 79, '2026春季')",
            "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (7, 6, 85, '2026春季')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (1, 1, '2026-03-01', '正常', '')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (1, 1, '2026-03-02', '正常', '')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (1, 2, '2026-03-01', '正常', '')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (2, 1, '2026-03-01', '迟到', '迟到10分钟')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (2, 1, '2026-03-02', '正常', '')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (3, 3, '2026-03-01', '正常', '')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (4, 3, '2026-03-01', '请假', '事假')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (5, 3, '2026-03-01', '正常', '')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (6, 6, '2026-03-01', '正常', '')",
            "INSERT IGNORE INTO attendance (student_id, course_id, date, status, remark) VALUES (7, 6, '2026-03-01', '缺勤', '')",
            "INSERT IGNORE INTO rewards_punishments (student_id, type, reason, amount, date, status) VALUES (1, '奖励', '三好学生', 0, '2026-01-01', '已通过')",
            "INSERT IGNORE INTO rewards_punishments (student_id, type, reason, amount, date, status) VALUES (2, '处分', '迟到3次', 0, '2026-02-15', '已通过')",
            "INSERT IGNORE INTO course_evaluations (student_id, course_id, rating, comment) VALUES (1, 1, 5, '老师讲得很好')",
            "INSERT IGNORE INTO course_evaluations (student_id, course_id, rating, comment) VALUES (2, 1, 4, '课程内容充实')",
            "INSERT IGNORE INTO exams (course_id, exam_date, start_time, end_time, location, status) VALUES (1, '2026-04-15', '09:00', '11:00', 'A101', '已发布')",
            "INSERT IGNORE INTO exams (course_id, exam_date, start_time, end_time, location, status) VALUES (2, '2026-04-16', '14:00', '16:00', 'B202', '已发布')",
            "INSERT IGNORE INTO meetings (title, content, organizer, meeting_date, start_time, end_time, location, participants, status) VALUES ('教学研讨会', '讨论本学期教学计划', '王建国', '2026-03-10', '14:00', '16:00', '会议室A', '全体教师', '已完成')",
            "INSERT IGNORE INTO meetings (title, content, organizer, meeting_date, start_time, end_time, location, participants, status) VALUES ('班主任会议', '班级管理工作会议', '李明', '2026-03-15', '10:00', '11:30', '会议室B', '班主任', '待开始')",
            "INSERT IGNORE INTO documents (title, content, type, status, author) VALUES ('关于加强学风建设的通知', '请各班级加强学风建设...', '通知', '已发布', 'admin')",
            "INSERT IGNORE INTO documents (title, content, type, status, author) VALUES ('年度工作计划', '本年度工作计划...', '计划', '已发布', 'admin')",
            "INSERT IGNORE INTO projects (name, description, leader, budget, start_date, end_date, status) VALUES ('智能校园系统', '开发智慧校园平台', '王建国', 500000, '2026-01-01', '2026-12-31', '进行中')",
            "INSERT IGNORE INTO projects (name, description, leader, budget, start_date, end_date, status) VALUES ('在线考试系统', '开发在线考试平台', '李明', 300000, '2026-03-01', '2026-08-31', '待审批')",
            "INSERT IGNORE INTO achievements (project_id, name, type, description, publish_date) VALUES (1, '智慧校园平台V1.0', '软件著作权', '已上线运行', '2026-02-01')",
            "INSERT IGNORE INTO labs (name, location, capacity, equipment_count, status) VALUES ('计算机实验室1', '教学楼A101', 60, 30, '正常')",
            "INSERT IGNORE INTO labs (name, location, capacity, equipment_count, status) VALUES ('软件工程实验室', '教学楼B202', 40, 25, '正常')",
            "INSERT IGNORE INTO labs (name, location, capacity, equipment_count, status) VALUES ('网络实验室', '教学楼C303', 30, 20, '维护中')",
            "INSERT IGNORE INTO tasks (title, content, status, priority, assignee, due_date) VALUES ('完成学期报告', '撰写本学期工作总结', '待处理', '高', 'admin', '2026-03-15')",
            "INSERT IGNORE INTO tasks (title, content, status, priority, assignee, due_date) VALUES ('整理档案', '归档上学期学生档案', '进行中', '普通', 'teacher1', '2026-03-20')",
            "INSERT IGNORE INTO notices (title, content, time) VALUES ('开学通知', '9月1日正式开学，请各位同学按时返校', '2026-03-01')",
            "INSERT IGNORE INTO notices (title, content, time) VALUES ('奖学金申请', '3月10日前完成奖学金申请，逾期不候', '2026-03-02')",
            "INSERT IGNORE INTO funding_projects (name, type, amount, quota, application_start_date, application_end_date, requirements, status) VALUES ('国家奖学金', '奖学金', 8000.00, 5, '2026-03-01', '2026-03-31', '品学兼优，综合素质突出', '开放')",
            "INSERT IGNORE INTO funding_projects (name, type, amount, quota, application_start_date, application_end_date, requirements, status) VALUES ('国家助学金', '助学金', 3000.00, 20, '2026-03-01', '2026-03-31', '家庭经济困难学生', '开放')",
            "INSERT IGNORE INTO funding_projects (name, type, amount, quota, application_start_date, application_end_date, requirements, status) VALUES ('校级一等奖学金', '奖学金', 5000.00, 10, '2026-03-01', '2026-03-31', '专业成绩排名前5%', '开放')",
            "INSERT IGNORE INTO funding_projects (name, type, amount, quota, application_start_date, application_end_date, requirements, status) VALUES ('校级助学金', '助学金', 2000.00, 30, '2026-03-01', '2026-03-31', '家庭经济困难，学习努力', '开放')",
            "INSERT IGNORE INTO applications (student_id, project_id, apply_reason, materials, status) VALUES (1, 1, '本人学习成绩优异，综合素质突出，符合国家奖学金申请条件。', '成绩单.pdf,获奖证书.pdf', '已通过')",
            "INSERT IGNORE INTO applications (student_id, project_id, apply_reason, materials, status) VALUES (2, 1, '本人品学兼优，积极参加各类竞赛活动，获得多项奖项。', '成绩单.pdf,竞赛证书.pdf', '待审核')",
            "INSERT IGNORE INTO applications (student_id, project_id, apply_reason, materials, status) VALUES (4, 2, '家庭经济困难，父母务农，收入微薄，希望获得助学金支持。', '贫困证明.pdf,家庭情况说明.pdf', '已通过')",
            "INSERT IGNORE INTO applications (student_id, project_id, apply_reason, materials, status) VALUES (5, 2, '单亲家庭，母亲下岗，家庭负担较重。', '贫困证明.pdf,低保证明.pdf', '已驳回')",
            "INSERT IGNORE INTO applications (student_id, project_id, apply_reason, materials, status) VALUES (7, 3, '专业成绩排名第一，符合一等奖学金条件。', '成绩单.pdf', '待审核')",
            "INSERT IGNORE INTO applications (student_id, project_id, apply_reason, materials, status) VALUES (3, 4, '家庭经济困难，学习刻苦努力，成绩良好。', '贫困证明.pdf', '已通过')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (1, '王建国', '教师', 1, '通过', '同意推荐')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (1, '李明', '学院管理员', 2, '通过', '审核通过')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (1, 'admin', '管理员', 3, '通过', '同意发放')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (3, '李明', '教师', 1, '通过', '情况属实')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (3, '张伟', '学院管理员', 2, '通过', '审核通过')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (3, 'admin', '管理员', 3, '通过', '同意发放')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (4, '李明', '教师', 1, '驳回', '材料不全')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (6, '王建国', '教师', 1, '通过', '同意推荐')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (6, '李明', '学院管理员', 2, '通过', '审核通过')",
            "INSERT IGNORE INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (6, 'admin', '管理员', 3, '通过', '同意发放')",
            "INSERT IGNORE INTO public_notices (project_id, content, start_date, end_date, status) VALUES (1, '根据评审结果，以下同学获得国家奖学金：\\n1. 张三（计算机1班）\\n2. 李四（计算机1班）', '2026-04-01', '2026-04-07', '公示中')",
            "INSERT IGNORE INTO public_notices (project_id, content, start_date, end_date, status) VALUES (2, '根据评审结果，以下同学获得国家助学金：\\n1. 王五（计算机2班）\\n2. 赵六（计算机2班）\\n3. 钱七（软件工程1班）', '2026-04-01', '2026-04-07', '公示中')",
            "INSERT IGNORE INTO objections (notice_id, applicant, content, status, reply) VALUES (1, '赵六', '张三同学的成绩排名有疑问，希望核实。', '已处理', '经核实，张三同学成绩排名真实有效。')",
            "INSERT IGNORE INTO objections (notice_id, applicant, content, status, reply) VALUES (2, '孙八', '申请条件中是否包含单亲家庭？', '待处理', NULL)",
            "INSERT IGNORE INTO distributions (application_id, amount, status, distribution_date, confirmed_at) VALUES (1, 8000.00, '已发放', '2026-04-15', '2026-04-16 10:30:00')",
            "INSERT IGNORE INTO distributions (application_id, amount, status, distribution_date) VALUES (3, 3000.00, '已发放', '2026-04-15')",
            "INSERT IGNORE INTO distributions (application_id, amount, status) VALUES (6, 2000.00, '待发放')",
            "INSERT IGNORE INTO distributions (application_id, amount, status, failure_reason) VALUES (2, 8000.00, '发放失败', '银行卡信息有误')"
          ];

          let dataIndex = 0;
          function insertNextData() {
            if (dataIndex >= insertData.length) {
              console.log('初始数据插入成功!');
              console.log('数据库初始化完成!');
              connection.end();
              return;
            }
            connection.query(insertData[dataIndex], (err) => {
              if (err) console.error(`插入数据${dataIndex + 1}失败:`, err);
              dataIndex++;
              insertNextData();
            });
          }
          insertNextData();
        }

        createNextTable();
      });
    });
  });
});