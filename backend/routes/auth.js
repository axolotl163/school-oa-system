const express = require('express');
const router = express.Router();
const { logOperation, getConnection } = require('../middleware/auth');

function decodeHeader(str) {
  if (!str) return '';
  try { return decodeURIComponent(str); } catch { return str; }
}

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const connection = getConnection();
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      connection.end();
      return res.status(500).json({ success: false, message: '服务器错误' });
    }
    if (results.length > 0) {
      const user = results[0];
      let phone = '';
      
      // 根据角色查询对应的表获取手机号
      if (user.role === '学生') {
        const studentSql = 'SELECT phone FROM students WHERE name = ?';
        connection.query(studentSql, [user.username], (err, studentResults) => {
          if (err) console.error('查询学生手机号失败:', err);
          if (studentResults.length > 0) phone = studentResults[0].phone || '';
          
          logOperation(username, '用户登录', '用户登录成功');
          connection.end();
          res.json({ 
            success: true, 
            message: '登录成功',
            user: {
              username: user.username,
              role: user.role,
              class_id: user.class_id,
              phone: phone
            }
          });
        });
      } else if (user.role === '教师') {
        const teacherSql = 'SELECT phone FROM teachers WHERE name = ?';
        connection.query(teacherSql, [user.username], (err, teacherResults) => {
          if (err) console.error('查询教师手机号失败:', err);
          if (teacherResults.length > 0) phone = teacherResults[0].phone || '';
          
          logOperation(username, '用户登录', '用户登录成功');
          connection.end();
          res.json({ 
            success: true, 
            message: '登录成功',
            user: {
              username: user.username,
              role: user.role,
              class_id: user.class_id,
              phone: phone
            }
          });
        });
      } else {
        // 管理员角色
        // 直接使用从users表查询到的phone字段
        phone = user.phone || '';
        
        logOperation(username, '用户登录', '用户登录成功');
        connection.end();
        res.json({ 
          success: true, 
          message: '登录成功',
          user: {
            username: user.username,
            role: user.role,
            class_id: user.class_id,
            phone: phone
          }
        });
      }
    } else {
      connection.end();
      res.json({ success: false, message: '用户名或密码错误' });
    }
  });
});

router.post('/logout', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  if (username) logOperation(username, '用户退出', '用户退出登录');
  res.json({ success: true, message: '退出成功' });
});

router.get('/userinfo', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  if (!username) return res.status(401).json({ success: false, message: '未登录' });
  res.json({ success: true, user: { username, role } });
});

router.post('/register', (req, res) => {
  const { username, password, role, class_id } = req.body;
  if (!username || !password) return res.json({ success: false, message: '用户名和密码不能为空' });
  
  const connection = getConnection();
  const checkSql = 'SELECT id FROM users WHERE username = ?';
  connection.query(checkSql, [username], (err, results) => {
    if (err) { connection.end(); return res.status(500).json({ success: false, message: '服务器错误' }); }
    if (results.length > 0) { connection.end(); return res.json({ success: false, message: '用户名已存在' }); }
    
    const insertUserSql = 'INSERT INTO users (username, password, role, class_id) VALUES (?, ?, ?, ?)';
    connection.query(insertUserSql, [username, password, role || '学生', class_id || null], (err, userResult) => {
      if (err) { connection.end(); return res.status(500).json({ success: false, message: '注册失败' }); }
      
      const userId = userResult.insertId;
      
      if (role === '教师') {
        const insertTeacherSql = 'INSERT INTO teachers (name, gender, title, department, phone) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertTeacherSql, [username, '', '', '', ''], (err) => {
          if (err) console.error('创建教师记录失败:', err);
        });
      } else if (role === '学生' && class_id) {
        const insertStudentSql = 'INSERT INTO students (name, age, class_id, phone) VALUES (?, ?, ?, ?)';
        connection.query(insertStudentSql, [username, 18, class_id, ''], (err) => {
          if (err) console.error('创建学生记录失败:', err);
        });
      }
      
      logOperation(username, '用户注册', '新用户注册成功');
      connection.end();
      res.json({ success: true, message: '注册成功' });
    });
  });
});

module.exports = router;
