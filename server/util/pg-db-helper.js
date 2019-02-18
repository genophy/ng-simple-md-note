const config = require('../config/config');
const {Client} = require('pg');


const dbExec = function(sql) {

  return new Promise((resolve, reject) => {
    try {
      const client = new Client(config.dbConfig)
      client.connect().then(() => {
        client.query(sql).then(res => {
          client.end();
          resolve(res.rows);
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  dbExec,
};
