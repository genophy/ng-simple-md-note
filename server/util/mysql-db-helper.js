const config = require('../config/config');
const Client = require('mysql');

const dbExec = (sql) => {
  const connection = Client.createConnection(config.mysqldbConfig);
  return new Promise((resolve, reject) => {
    try {
      // const client = new Client(config.dbConfig);
      connection.connect(function(err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }

        console.log('connected as id ' + connection.threadId);
      });
      const query = connection.query(sql, (error, result, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
        connection.end();

      });

    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  dbExec,
};
