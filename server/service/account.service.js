const config = require('../config/config');
const sqlHelper = require('../util/mysql-db-helper');
const dateUtil = require('../util/date-util');
const authHelper = require('../util/auth-helper');
const redisHelper = require('../util/redis-helper');
const uuidV1 = require('uuid/v1');
const serviceAccount = {};
/**
 *
 * @param param : pageNum,  pageSize
 */
serviceAccount.queryAll = function(param) {
  param = param || {};
  let limitQL = 'limit 0,10';
  if (param.pageNum && param.pageSize) {
    limitQL = `limit ${param.pageNum - 1} , ${param.pageSize}`;
  }

  return sqlHelper.dbExec(`select id,name,create_date,image_id from ${config.tables.T_USER} ${limitQL}`);
};

/**
 *
 * @param param : name,pwd
 */
serviceAccount.queryByNamePwd = function(param) {
  param = param || {};
  const query = {
    sql    : `select id,name,gender,is_admin,create_date,image_id from ${config.tables.T_USER} where name = ? and pwd = ?`,
    values : [param.name, param.pwd],
    timeout: 40000,
  };
  return sqlHelper.dbExec(query);
};

/**
 *
 *  @param param : name,pwd
 */
serviceAccount.login = function(param) {
  return serviceAccount.queryByNamePwd(param).then(data => {
    if (data && data[0]) {

      const _token = authHelper.generateToken();

      console.log('----------> ', _token);

      // set redis token
      redisHelper.setKey(_token, data[0]['id']);
      const res = data[0];
      res['token'] = _token;
      return res;
    }
    return {token: null};

  });
};

/**
 *
 * @param params:token
 */
serviceAccount.logout = function(params) {

  return new Promise((resolve, reject) => {
    params = params || {};
    if (params.token) {
      redisHelper.delKey(params.token).then(() => {
        resolve();
      }).catch((e) => {
        reject(e);
      });
    }

  });

};

/**
 *
 * @param param : name
 */
serviceAccount.queryByName = function(param) {
  param = param || {};
  const query = {
    sql    : `select id,name,create_date,image_id from ${config.tables.T_USER} where name = ?`,
    values : [param.name],
    timeout: 40000,
  };
  return sqlHelper.dbExec(query);
};

/**
 *
 * @param param :  name, pwd, image_id
 */
serviceAccount.accountInsert = function(param) {
  param = param || {};
  param.id = uuidV1();
  const query = {
    sql    : `insert into  ${config.tables.T_USER} set id = ?, name = ?, pwd = ?, image_id = ? , create_date = ? , is_admin = ?`,
    values : [param.id, param.name, param.pwd, param.image_id, dateUtil.dateFormat(new Date()), 0],
    timeout: 40000,
    // rowMode: 'map',
  };
  return sqlHelper.dbExec(query);
};

/**
 *
 * @param param:id, name, pwd, image_id
 */
serviceAccount.update = function(param, currentUserId) {
  param = param || {};
  if (!param['id']) {
    param['id'] = currentUserId;
  }
  const appendSettingArr = [];
  const paramValueArr = [];
  for (const p in param) {
    if (p && undefined !== param[p]) {
      appendSettingArr.push(`${p} = ?`);
      paramValueArr.push(param[p]);
    }
  }
  paramValueArr.push(param.id);
  let appendSettingStr = '';
  if (appendSettingArr[0]) {
    appendSettingStr = 'set ' + appendSettingArr.join(' , ');
  }
  const query = {
    sql    : `update ${config.tables.T_USER} ${appendSettingStr} where id = ?`,
    values : paramValueArr,
    timeout: 40000,
    // rowMode: 'map',
  };
  return sqlHelper.dbExec(query);

};
/**
 *
 * @param param : id
 */
serviceAccount.del = function(param, currentUserId) {

  param = param || {};
  if (!param['id']) {
    param['id'] = currentUserId;
  }

  const query = {
    sql    : `delete from ${config.tables.T_USER} where id = ?`,
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
serviceAccount.apiInject = function(fn, param, currentUserId) {
  return serviceAccount[fn](param, currentUserId);
};

module.exports = {
  apiInject: serviceAccount.apiInject,
};
