const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

function decodeHeader(str) {
  if (!str) return '';
  try { return decodeURIComponent(str); } catch { return str; }
}

router.get('/', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const connection = getConnection();
  
  let sql = `SELECT s.*, c.name as class_name FROM students s LEFT JOIN classes c ON s.class_id = c.id`;
  let params = [];
  
  if (role === '教师') {
    const classSql = 'SELECT class_id FROM users WHERE username = ? AND role = "教师"';
    connection.query(classSql, [username], (err, results) => {
      if (err || results.length === 0 || !results[0].class_id) {
        connection.end();
        return res.json({ success: true, data: [] });
      }
      const teacherClassId = results[0].class_id;
      sql += ' WHERE s.class_id = ?';
      params.push(teacherClassId);
      sql += ' ORDER BY s.id DESC';
      connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '获取学生列表失败' });
        res.json({ success: true, data: results });
      });
    });
  } else {
    sql += ' ORDER BY s.id DESC';
    connection.query(sql, (err, results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '获取学生列表失败' });
      res.json({ success: true, data: results });
    });
  }
});

router.post('/', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { name, age, class_id, phone } = req.body;
  
  if (role === '学生') {
    return res.status(403).json({ success: false, message: '学生不能添加学生' });
  }
  
  if (role === '教师') {
    return res.status(403).json({ success: false, message: '教师不能添加学生' });
  }
  
  if (!name || !age || !phone) return res.json({ success: false, message: '姓名、年龄、手机号不能为空' });
  if (!class_id) return res.json({ success: false, message: '请选择班级' });
  
  const connection = getConnection();
  const sql = 'INSERT INTO students (name, age, class_id, phone) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, age, class_id, phone], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加学生失败' });
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { id } = req.params;
  const { name, age, class_id, phone } = req.body;
  
  if (role === '学生') {
    return res.status(403).json({ success: false, message: '学生不能修改学生信息' });
  }
  
  const connection = getConnection();
  
  if (role === '教师') {
    const classSql = 'SELECT class_id FROM users WHERE username = ? AND role = "教师"';
    connection.query(classSql, [username], (err, results) => {
      if (err || results.length === 0 || !results[0].class_id) {
        connection.end();
        return res.status(403).json({ success: false, message: '教师没有绑定班级' });
      }
      const teacherClassId = results[0].class_id;
      const checkSql = 'SELECT class_id FROM students WHERE id = ?';
      connection.query(checkSql, [id], (err, stuResults) => {
        if (err || stuResults.length === 0) {
          connection.end();
          return res.status(404).json({ success: false, message: '学生不存在' });
        }
        if (stuResults[0].class_id !== teacherClassId) {
          connection.end();
          return res.status(403).json({ success: false, message: '只能管理本班学生' });
        }
        if (class_id && class_id !== teacherClassId) {
          connection.end();
          return res.status(403).json({ success: false, message: '不能修改学生到其他班级' });
        }
        updateStudent(connection);
      });
    });
  } else {
    updateStudent(connection);
  }
  
  function updateStudent(connection) {
    const sql = 'UPDATE students SET name = ?, age = ?, class_id = ?, phone = ? WHERE id = ?';
    connection.query(sql, [name, age, class_id, phone, id], (err, _results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '更新学生失败' });
      res.json({ success: true, message: '更新成功' });
    });
  }
});

router.delete('/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { id } = req.params;
  const connection = getConnection();
  
  if (role === '学生') {
    connection.end();
    return res.status(403).json({ success: false, message: '学生不能删除学生' });
  }
  
  if (role === '教师') {
    const classSql = 'SELECT class_id FROM users WHERE username = ? AND role = "教师"';
    connection.query(classSql, [username], (err, results) => {
      if (err || results.length === 0 || !results[0].class_id) {
        connection.end();
        return res.status(403).json({ success: false, message: '教师没有绑定班级' });
      }
      const teacherClassId = results[0].class_id;
      const checkSql = 'SELECT class_id FROM students WHERE id = ?';
      connection.query(checkSql, [id], (err, stuResults) => {
        if (err || stuResults.length === 0) {
          connection.end();
          return res.status(404).json({ success: false, message: '学生不存在' });
        }
        if (stuResults[0].class_id !== teacherClassId) {
          connection.end();
          return res.status(403).json({ success: false, message: '只能管理本班学生' });
        }
        deleteStudent(connection);
      });
    });
  } else {
    deleteStudent(connection);
  }
  
  function deleteStudent(connection) {
    const getStudentSql = 'SELECT name FROM students WHERE id = ?';
    connection.query(getStudentSql, [id], (err, results) => {
      if (err || results.length === 0) {
        connection.end();
        return res.status(500).json({ success: false, message: '删除学生失败' });
      }
      const studentName = results[0].name;
      
      const deleteUserSql = 'DELETE FROM users WHERE username = ? AND role = "学生"';
      connection.query(deleteUserSql, [studentName], (err) => {
        if (err) console.error('删除用户记录失败:', err);
      });
      
      const sql = 'DELETE FROM students WHERE id = ?';
      connection.query(sql, [id], (err, _results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '删除学生失败' });
        res.json({ success: true, message: '删除成功' });
      });
    });
  }
});

module.exports = router;
