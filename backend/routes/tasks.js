const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT * FROM tasks ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '获取任务列表失败' });
    }
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { title, content, status, priority, assignee, due_date } = req.body;
  if (!title) {
    return res.json({ success: false, message: '任务标题不能为空' });
  }
  const connection = getConnection();
  const sql = 'INSERT INTO tasks (title, content, status, priority, assignee, due_date) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [title, content, status || '待处理', priority || '普通', assignee, due_date], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '创建任务失败' });
    }
    res.json({ success: true, message: '创建成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, status, priority, assignee, due_date } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE tasks SET title = ?, content = ?, status = ?, priority = ?, assignee = ?, due_date = ? WHERE id = ?';
  connection.query(sql, [title, content, status, priority, assignee, due_date, id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '更新任务失败' });
    }
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM tasks WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '删除任务失败' });
    }
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
