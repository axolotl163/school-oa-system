module.exports = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '121296',
  database: process.env.DB_NAME || 'school_db',
  port: process.env.DB_PORT || 3306
};
