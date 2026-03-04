const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT * FROM teachers ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '获取教师列表失败' });
    }
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { name, gender, title, department, phone } = req.body;
  if (!name) {
    return res.json({ success: false, message: '姓名不能为空' });
  }
  const connection = getConnection();
  const sql = 'INSERT INTO teachers (name, gender, title, department, phone) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [name, gender, title, department, phone], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '添加教师失败' });
    }
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, gender, title, department, phone } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE teachers SET name = ?, gender = ?, title = ?, department = ?, phone = ? WHERE id = ?';
  connection.query(sql, [name, gender, title, department, phone, id], (err, _results) => {
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
  const sql = 'DELETE FROM teachers WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '删除教师失败' });
    }
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
