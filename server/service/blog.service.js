const config = require('../config/config');
const sqlHelper = require('../util/mysql-db-helper');
const dateUtil = require('../util/date-util');
const uuidV1 = require('uuid/v1');
const serviceBlog = {};

/**
 *
 * @param param : pageNum,  pageSize
 */
serviceBlog.queryAll = function(param) {
  param = param || {};

  const appendSettingArr = [];
  const paramValueArr = [];
  for (const p in param) {
    if (p && undefined !== param[p]) {
      if (-1 === 'pageSize|pageNum|user_name|content'.indexOf(p)) {
        appendSettingArr.push(`b.${p} = ?`);
        paramValueArr.push(param[p]);
      } else if ('user_name' === p) {
        appendSettingArr.push('u.name like ?');
        paramValueArr.push(`%${param[p]}%`);
      } else if ('content' === p) {
        appendSettingArr.push('b.content like ?');
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
    sql    : `select b.* , u.name as user_name, u.gender as user_gender, u.image_id as user_image_id, u.create_date as user_create_date ,u.image_id as user_image_id , c.name as category_name , (select count(b2.id) from ${config.tables.T_BLOG} as b2 where b2.create_user_id = u.id ) as user_blog_count from ${config.tables.T_BLOG} as b left join ${config.tables.T_USER} as u  on b.create_user_id = u.id left join ${config.tables.T_CATEGORY} as c on b.category_id = c.id  ${appendSettingStr}  order by b.update_date desc ${limitQL} `,
    values : paramValueArr,
    timeout: 40000,
  };

  return sqlHelper.dbExec(query);

};

/**
 *
 * @param param
 */
serviceBlog.insert = function(param, currentUserId) {
  param = param || {};
  param.id = uuidV1();
  const query = {
    sql    : `insert into  ${config.tables.T_BLOG} set id = ?, create_user_id = ?,title = ?, content = ?,category_id = ?,key_word_ids = ?, watched = ? , create_date = ? ,update_date = ?`,
    values : [param.id, currentUserId, param.title, param.content, param.category_id, param.key_word_ids, 0, dateUtil.dateFormat(new Date()), dateUtil.dateFormat(new Date())],
    timeout: 40000,
  };
  return sqlHelper.dbExec(query);
};

/**
 *
 * @param param:id, name, pwd, image_id
 */
serviceBlog.update = function(param, currentUserId) {
  param = param || {};

  if (!param.id) {
    return;
  }
  if (param.title) {
    param.update_date = dateUtil.dateFormat(new Date());
  }
  const appendSettingArr = [];
  const paramValueArr = [];
  for (const p in param) {
    if (p && undefined !== param[p]) {
      appendSettingArr.push(`${p} = ?`);
      paramValueArr.push(param[p]);
    }
  }

  //
  paramValueArr.push(param.id);
  let appendSettingStr = '';
  if (appendSettingArr[0]) {
    appendSettingStr = 'set ' + appendSettingArr.join(' , ');
  }
  const query = {
    sql    : `update ${config.tables.T_BLOG} ${appendSettingStr} where id = ?`,
    values : paramValueArr,
    timeout: 40000,
  };

  return sqlHelper.dbExec(query);

};

/**
 *
 * @param param
 * @param currentUserId
 */
serviceBlog.updateBlogWatched = function(param, currentUserId) {
  param = param || {};

  if (!param.id) {
    return;
  }
  if (param.title) {
    param.update_date = dateUtil.dateFormat(new Date());
  }
  const appendSettingArr = [];
  const paramValueArr = [];
  for (const p in param) {
    if (p && 'watched' === p && undefined !== param[p]) {
      appendSettingArr.push(`${p} = ?`);
      paramValueArr.push(param[p]);
    }
  }

  //
  paramValueArr.push(param.id);
  let appendSettingStr = '';
  if (appendSettingArr[0]) {
    appendSettingStr = 'set ' + appendSettingArr.join(' , ');
  }
  const query = {
    sql    : `update ${config.tables.T_BLOG} ${appendSettingStr} where id = ?`,
    values : paramValueArr,
    timeout: 40000,
  };

  return sqlHelper.dbExec(query);

};

/**
 *
 * @param param : id
 */
serviceBlog.del = function(param, currentUserId) {

  param = param || {};

  const query = {
    sql    : `delete from ${config.tables.T_BLOG} where id = ?`,
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
serviceBlog.apiInject = function(fn, param, currentUserId) {
  return serviceBlog[fn](param, currentUserId);
};

module.exports = {
  apiInject: serviceBlog.apiInject,
};
