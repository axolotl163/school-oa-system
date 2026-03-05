const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT * FROM meetings ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取会议列表失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { title, content, organizer, meeting_date, start_time, end_time, location, participants, status } = req.body;
  if (!title || !meeting_date) return res.json({ success: false, message: '标题和日期不能为空' });
  const connection = getConnection();
  const sql = 'INSERT INTO meetings (title, content, organizer, meeting_date, start_time, end_time, location, participants, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [title, content, organizer, meeting_date, start_time, end_time, location, participants, status || '待开始'], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加会议失败' });
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, organizer, meeting_date, start_time, end_time, location, participants, status } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE meetings SET title = ?, content = ?, organizer = ?, meeting_date = ?, start_time = ?, end_time = ?, location = ?, participants = ?, status = ? WHERE id = ?';
  connection.query(sql, [title, content, organizer, meeting_date, start_time, end_time, location, participants, status, id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '更新会议失败' });
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM meetings WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除会议失败' });
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
