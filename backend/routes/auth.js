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
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '服务器错误' });
    if (results.length > 0) {
      logOperation(username, '用户登录', '用户登录成功');
      res.json({ 
        success: true, 
        message: '登录成功',
        user: {
          username: results[0].username,
          role: results[0].role,
          class_id: results[0].class_id
        }
      });
    } else {
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
