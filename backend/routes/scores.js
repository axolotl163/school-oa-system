const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = `SELECT s.id, s.student_id, s.course_id, s.score, s.semester,
              st.name as student_name, c.name as course_name
              FROM scores s
              LEFT JOIN students st ON s.student_id = st.id
              LEFT JOIN courses c ON s.course_id = c.id
              ORDER BY s.id DESC`;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '获取成绩列表失败' });
    }
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { student_id, course_id, score, semester } = req.body;
  if (!student_id || !course_id) {
    return res.json({ success: false, message: '学生和课程不能为空' });
  }
  const connection = getConnection();
  const sql = 'INSERT INTO scores (student_id, course_id, score, semester) VALUES (?, ?, ?, ?)';
  connection.query(sql, [student_id, course_id, score, semester], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '添加成绩失败' });
    }
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { student_id, course_id, score, semester } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE scores SET student_id = ?, course_id = ?, score = ?, semester = ? WHERE id = ?';
  connection.query(sql, [student_id, course_id, score, semester, id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '更新成绩失败' });
    }
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM scores WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '删除成绩失败' });
    }
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
