const redisConfig = {
  host: 'localhost',
  port: 1234,
  pwd : '1234',
};

const mysqldbConfig = {
  connectionLimit: 10,
  host           : 'localhost',
  user           : '1234',
  password       : '1234',
  database       : 'db_ng_blog',
};

/**
 */
const tables = {
  T_USER    : 't_user',
  T_BLOG    : 't_blog',
  T_CATEGORY: 't_category',
  T_Key_WORD: 't_key_word',
  T_IMAGES  : 't_images',
};

module.exports = {
  redisConfig,
  mysqldbConfig,
  tables,
};
