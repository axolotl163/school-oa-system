const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '121296',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('连接MySQL失败:', err);
    return;
  }
  console.log('连接MySQL成功!');
  
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
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          age INT NOT NULL,
          class VARCHAR(50) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS courses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          code VARCHAR(50),
          credits INT,
          hours INT,
          teacher_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (teacher_id) REFERENCES teachers(id)
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
          "INSERT IGNORE INTO users (username, password, role) VALUES ('admin', 'admin', '管理员')",
          "INSERT IGNORE INTO users (username, password, role) VALUES ('teacher', 'teacher', '教师')",
          "INSERT IGNORE INTO users (username, password, role) VALUES ('student', 'student', '学生')",
          "INSERT IGNORE INTO users (username, password, role) VALUES ('zhangsan', '123456', '学生')",
          "INSERT IGNORE INTO users (username, password, role) VALUES ('lisi', '123456', '学生')",
          "INSERT IGNORE INTO students (name, age, class, phone) VALUES ('张三', 20, '计算机1班', '13800138000')",
          "INSERT IGNORE INTO students (name, age, class, phone) VALUES ('李四', 19, '计算机2班', '13900139000')",
          "INSERT IGNORE INTO students (name, age, class, phone) VALUES ('王五', 21, '计算机1班', '13700137000')",
          "INSERT IGNORE INTO students (name, age, class, phone) VALUES ('赵六', 20, '计算机3班', '13600136000')",
          "INSERT IGNORE INTO students (name, age, class, phone) VALUES ('钱七', 19, '软件工程1班', '13500135000')",
          "INSERT IGNORE INTO students (name, age, class, phone) VALUES ('孙八', 22, '软件工程2班', '13400134000')",
          "INSERT IGNORE INTO notices (title, content, time) VALUES ('开学通知', '9月1日正式开学，请各位同学按时返校', '2026-03-01')",
          "INSERT IGNORE INTO notices (title, content, time) VALUES ('奖学金申请', '3月10日前完成奖学金申请，逾期不候', '2026-03-02')",
          "INSERT IGNORE INTO notices (title, content, time) VALUES ('清明节放假', '清明节放假3天，请同学们注意安全', '2026-03-25')",
          "INSERT IGNORE INTO notices (title, content, time) VALUES ('期中考试安排', '本学期期中考试将于4月15-17日进行', '2026-03-28')",
          "INSERT IGNORE INTO notices (title, content, time) VALUES ('社团活动', '校园文化节将于5月举行，欢迎大家参加', '2026-03-30')",
          "INSERT IGNORE INTO teachers (name, gender, title, department, phone) VALUES ('王建国', '男', '教授', '计算机系', '13800000001')",
          "INSERT IGNORE INTO teachers (name, gender, title, department, phone) VALUES ('李明', '女', '副教授', '数学系', '13800000002')",
          "INSERT IGNORE INTO teachers (name, gender, title, department, phone) VALUES ('张伟', '男', '讲师', '计算机系', '13800000003')",
          "INSERT IGNORE INTO teachers (name, gender, title, department, phone) VALUES ('刘芳', '女', '讲师', '英语系', '13800000004')",
          "INSERT IGNORE INTO teachers (name, gender, title, department, phone) VALUES ('陈强', '男', '教授', '物理系', '13800000005')",
          "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id) VALUES ('数据结构', 'CS101', 4, 64, 1)",
          "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id) VALUES ('高等数学', 'MA101', 4, 72, 2)",
          "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id) VALUES ('计算机网络', 'CS201', 3, 48, 3)",
          "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id) VALUES ('大学英语', 'EN101', 3, 48, 4)",
          "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id) VALUES ('大学物理', 'PH101', 4, 64, 5)",
          "INSERT IGNORE INTO courses (name, code, credits, hours, teacher_id) VALUES ('数据库原理', 'CS301', 3, 48, 1)",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (1, 1, 85, '2026春季')",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (1, 2, 90, '2026春季')",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (1, 3, 78, '2026春季')",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (2, 1, 88, '2026春季')",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (2, 2, 92, '2026春季')",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (3, 1, 76, '2026春季')",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (3, 4, 85, '2026春季')",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (4, 1, 95, '2026春季')",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (4, 2, 88, '2026春季')",
          "INSERT IGNORE INTO scores (student_id, course_id, score, semester) VALUES (5, 5, 72, '2026春季')",
          "INSERT IGNORE INTO tasks (title, content, status, priority, assignee, due_date) VALUES ('完成学期报告', '撰写本学期工作总结', '待处理', '高', 'admin', '2026-03-15')",
          "INSERT IGNORE INTO tasks (title, content, status, priority, assignee, due_date) VALUES ('整理档案', '归档上学期学生档案', '进行中', '普通', 'teacher', '2026-03-20')",
          "INSERT IGNORE INTO tasks (title, content, status, priority, assignee, due_date) VALUES ('期中考试监考', '安排期中考试监考人员', '待处理', '高', 'admin', '2026-04-10')",
          "INSERT IGNORE INTO tasks (title, content, status, priority, assignee, due_date) VALUES ('教学检查', '检查教师教案和课件', '已完成', '普通', 'teacher', '2026-03-01')",
          "INSERT IGNORE INTO tasks (title, content, status, priority, assignee, due_date) VALUES ('运动会筹备', '组织校园运动会', '进行中', '高', 'admin', '2026-04-20')",
          "INSERT IGNORE INTO tasks (title, content, status, priority, assignee, due_date) VALUES ('图书采购', '采购新学期教材', '待处理', '普通', 'teacher', '2026-03-25')"
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
