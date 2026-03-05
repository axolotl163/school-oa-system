const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT * FROM labs ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取实验室列表失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { name, location, capacity, equipment_count, status } = req.body;
  if (!name) return res.json({ success: false, message: '实验室名称不能为空' });
  const connection = getConnection();
  const sql = 'INSERT INTO labs (name, location, capacity, equipment_count, status) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [name, location, capacity, equipment_count, status || '正常'], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加实验室失败' });
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, location, capacity, equipment_count, status } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE labs SET name = ?, location = ?, capacity = ?, equipment_count = ?, status = ? WHERE id = ?';
  connection.query(sql, [name, location, capacity, equipment_count, status, id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '更新实验室失败' });
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM labs WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除实验室失败' });
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
