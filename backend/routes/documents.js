const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT * FROM documents ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取公文列表失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { title, content, type, status, author } = req.body;
  if (!title) return res.json({ success: false, message: '标题不能为空' });
  const connection = getConnection();
  const sql = 'INSERT INTO documents (title, content, type, status, author) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [title, content, type, status || '待审批', author], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加公文失败' });
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, type, status, author } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE documents SET title = ?, content = ?, type = ?, status = ?, author = ? WHERE id = ?';
  connection.query(sql, [title, content, type, status, author, id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '更新公文失败' });
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM documents WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除公文失败' });
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
