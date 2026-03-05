const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = `SELECT e.*, s.name as student_name, c.name as course_name 
              FROM course_evaluations e
              LEFT JOIN students s ON e.student_id = s.id
              LEFT JOIN courses c ON e.course_id = c.id
              ORDER BY e.id DESC`;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取评价列表失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { student_id, course_id, rating, comment } = req.body;
  if (!student_id || !course_id) return res.json({ success: false, message: '学生和课程不能为空' });
  const connection = getConnection();
  const sql = 'INSERT INTO course_evaluations (student_id, course_id, rating, comment) VALUES (?, ?, ?, ?)';
  connection.query(sql, [student_id, course_id, rating, comment], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加评价失败' });
    res.json({ success: true, message: '添加成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM course_evaluations WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除评价失败' });
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
