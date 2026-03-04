const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT * FROM notices ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '获取公告失败' });
    }
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.json({ success: false, message: '标题和内容不能为空' });
  }
  const connection = getConnection();
  const sql = 'INSERT INTO notices (title, content, time) VALUES (?, ?, ?)';
  const time = new Date().toISOString().split('T')[0];
  connection.query(sql, [title, content, time], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '发布公告失败' });
    }
    res.json({ success: true, message: '发布成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM notices WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '删除公告失败' });
    }
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
