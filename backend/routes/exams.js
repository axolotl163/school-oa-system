const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = `SELECT e.*, c.name as course_name 
              FROM exams e
              LEFT JOIN courses c ON e.course_id = c.id
              ORDER BY e.id DESC`;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取考试列表失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { course_id, exam_date, start_time, end_time, location, status } = req.body;
  if (!course_id || !exam_date) return res.json({ success: false, message: '课程和考试日期不能为空' });
  const connection = getConnection();
  const sql = 'INSERT INTO exams (course_id, exam_date, start_time, end_time, location, status) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [course_id, exam_date, start_time, end_time, location, status || '待发布'], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加考试失败' });
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { course_id, exam_date, start_time, end_time, location, status } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE exams SET course_id = ?, exam_date = ?, start_time = ?, end_time = ?, location = ?, status = ? WHERE id = ?';
  connection.query(sql, [course_id, exam_date, start_time, end_time, location, status, id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '更新考试失败' });
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM exams WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除考试失败' });
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
