const config = require('../config/config');
const sqlHelper = require('../util/mysql-db-helper');
const dateUtil = require('../util/date-util');
const uuidV1 = require('uuid/v1');
const serviceCategory = {};

/**
 */
serviceCategory.queryAll = function() {
  return sqlHelper.dbExec(
    `select c.id, c.name, c.create_user_id, c.create_date, u.name as user_name from ${config.tables.T_CATEGORY} as c left join ${config.tables.T_USER} as u on c.create_user_id = u.id order by c.name`);
};

/**
 *
 */
serviceCategory.queryAllWithBlogCount = function() {
  return sqlHelper.dbExec(
    `select c.id, c.name, c.create_user_id, c.create_date, u.name as user_name, (select count(b.id) from t_blog b where b.category_id = c.id ) as blog_count from ${config.tables.T_CATEGORY} as c left join ${config.tables.T_USER} as u on c.create_user_id = u.id order by c.name`);

};

serviceCategory.queryByName = function(param) {
  param = param || {};

  const query = {
    sql    : `select id from ${config.tables.T_CATEGORY} where name = ?`,
    values : [param.name],
    timeout: 40000,
  };
  return sqlHelper.dbExec(query);
};

/**
 *
 * @param param : name
 */
serviceCategory.insert = function(param, currentUserId) {
  param = param || {};
  param.id = uuidV1();
  return new Promise((resolve, reject) => {
    serviceCategory.queryByName(param).then(categoryList => {

      if (categoryList && categoryList[0]) {
        reject('name exists');
      } else {
        const query = {
          sql    : `insert into ${config.tables.T_CATEGORY} set id = ?, name = ?, create_user_id = ? , create_date = ?`,
          values : [param.id, param.name, currentUserId, dateUtil.dateFormat(new Date())],
          timeout: 40000,
        };
        sqlHelper.dbExec(query).then(returnData => {
          resolve(returnData);
        }).catch(errorData => {
          reject(errorData);
        });
      }
    }).catch(errorData => {
      reject(errorData);
    });
  });

};

/**
 *
 * @param param : id
 */
serviceCategory.del = function(param) {
  const query = {
    sql    : `delete from ${config.tables.T_CATEGORY} where id = ?`,
    values : [param.id],
    timeout: 40000,
  };
  return sqlHelper.dbExec(query);
};

/**
 *
 * @param fn
 * @param param
 * @returns {*}
 */
serviceCategory.apiInject = function(fn, param, currentUserId) {
  return serviceCategory[fn](param, currentUserId);
};

module.exports = {
  apiInject: serviceCategory.apiInject,
};
