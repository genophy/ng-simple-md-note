const config = require('../config/config');
const sqlHelper = require('../util/mysql-db-helper');
const dateUtil = require('../util/date-util');
const uuidV1 = require('uuid/v1');
const serviceImage = {};

/**
 */
serviceImage.queryAll = function(param) {
  param = param || {};

  const appendSettingArr = [];
  const paramValueArr = [];
  for (const p in param) {
    if (p && undefined !== param[p]) {
      if (-1 === 'pageSize|pageNum|user_name'.indexOf(p)) {
        appendSettingArr.push(`i.${p} = ?`);
        paramValueArr.push(param[p]);
      } else if ('user_name' === p) {
        appendSettingArr.push('u.name like ?');
        paramValueArr.push(`%${param[p]}%`);
      }
    }

  }
  let limitQL = 'limit 0,10';
  if (param.pageNum && param.pageSize) {
    limitQL = `limit ${param.pageNum - 1} , ${param.pageSize}`;
  }

  let appendSettingStr = '';
  if (appendSettingArr[0]) {
    appendSettingStr = 'where ' + appendSettingArr.join(' and ');
  }
  const query = {
    sql    : `select i.* , u.name as user_name from ${config.tables.T_IMAGES} as i left join ${config.tables.T_USER} as u  on i.create_user_id = u.id ${appendSettingStr}  order by i.create_date desc ${limitQL} `,
    values : paramValueArr,
    timeout: 40000,
  };

  return sqlHelper.dbExec(query);
};

/**
 *
 * @param param : path
 */
serviceImage.insert = function(param, currentUserId) {
  param = param || {};
  param.id = id = uuidV1();
  const query = {
    sql    : `insert into ${config.tables.T_IMAGES} set id = ?, path = ?, create_user_id = ? , create_date = ?`,
    values : [param.id, param.path, currentUserId, dateUtil.dateFormat(new Date())],
    timeout: 40000,
  };
  return sqlHelper.dbExec(query).then(rows => {
    return {rows, id, path: param.path};
  });
};

/**
 *
 * @param param : id
 */
serviceImage.del = function(param) {
  const query = {
    sql    : `delete from ${config.tables.T_IMAGES} where id = ?`,
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
serviceImage.apiInject = function(fn, param, currentUserId) {
  return serviceImage[fn](param, currentUserId);
};

module.exports = {
  apiInject: serviceImage.apiInject,
};
