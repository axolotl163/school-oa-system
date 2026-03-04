const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT * FROM operation_logs ORDER BY id DESC LIMIT 100';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '获取日志失败' });
    }
    res.json({ success: true, data: results });
  });
});

module.exports = router;
