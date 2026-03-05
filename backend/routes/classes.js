const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT * FROM classes ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取班级列表失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { name, grade, teacher_id } = req.body;
  if (!name) return res.json({ success: false, message: '班级名称不能为空' });
  const connection = getConnection();
  const sql = 'INSERT INTO classes (name, grade, teacher_id) VALUES (?, ?, ?)';
  connection.query(sql, [name, grade, teacher_id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加班级失败' });
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, grade, teacher_id } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE classes SET name = ?, grade = ?, teacher_id = ? WHERE id = ?';
  connection.query(sql, [name, grade, teacher_id, id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '更新班级失败' });
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM classes WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除班级失败' });
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
