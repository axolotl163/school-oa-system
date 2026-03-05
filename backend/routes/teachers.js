const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

function decodeHeader(str) {
  if (!str) return '';
  try { return decodeURIComponent(str); } catch { return str; }
}

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = `SELECT t.*, c.name as class_name 
               FROM teachers t 
               LEFT JOIN classes c ON t.class_id = c.id 
               ORDER BY t.id DESC`;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '获取教师列表失败' });
    }
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { name, gender, title, department, phone, class_id } = req.body;
  if (!name) {
    return res.json({ success: false, message: '姓名不能为空' });
  }
  const connection = getConnection();
  const sql = 'INSERT INTO teachers (name, gender, title, department, phone, class_id) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [name, gender, title, department, phone, class_id || null], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '添加教师失败' });
    }
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, gender, title, department, phone, class_id } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE teachers SET name = ?, gender = ?, title = ?, department = ?, phone = ?, class_id = ? WHERE id = ?';
  connection.query(sql, [name, gender, title, department, phone, class_id || null, id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '更新教师失败' });
    }
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  
  const getTeacherSql = 'SELECT name FROM teachers WHERE id = ?';
  connection.query(getTeacherSql, [id], (err, results) => {
    if (err || results.length === 0) {
      connection.end();
      return res.status(500).json({ success: false, message: '教师不存在' });
    }
    const teacherName = results[0].name;
    
    const deleteUserSql = 'DELETE FROM users WHERE username = ? AND role = "教师"';
    connection.query(deleteUserSql, [teacherName], (err) => {
      if (err) console.error('删除用户记录失败:', err);
    });
    
    const sql = 'DELETE FROM teachers WHERE id = ?';
    connection.query(sql, [id], (err, _results) => {
      connection.end();
      if (err) {
        return res.status(500).json({ success: false, message: '删除教师失败' });
      }
      res.json({ success: true, message: '删除成功' });
    });
  });
});

module.exports = router;
