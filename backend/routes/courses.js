const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = `SELECT c.*, t.name as teacher_name 
              FROM courses c 
              LEFT JOIN teachers t ON c.teacher_id = t.id 
              ORDER BY c.id DESC`;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '获取课程列表失败' });
    }
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { name, code, credits, hours, teacher_id } = req.body;
  if (!name) {
    return res.json({ success: false, message: '课程名称不能为空' });
  }
  const connection = getConnection();
  const sql = 'INSERT INTO courses (name, code, credits, hours, teacher_id) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [name, code, credits, hours, teacher_id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '添加课程失败' });
    }
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, code, credits, hours, teacher_id } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE courses SET name = ?, code = ?, credits = ?, hours = ?, teacher_id = ? WHERE id = ?';
  connection.query(sql, [name, code, credits, hours, teacher_id, id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '更新课程失败' });
    }
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM courses WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '删除课程失败' });
    }
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
