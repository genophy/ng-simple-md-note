const config = require('../config/config');
const redis = require('redis');
const client = redis.createClient(config.redisConfig.port, config.redisConfig.host, {auth_pass: config.redisConfig.pwd});

client.on('ready', function(res) {
  console.log('ready');
});

client.on('error', function(err) {
  console.log('Error: ' + err);
});

const setKey = function(key, value) {
  return new Promise((resolve, reject) => {
    client.set(key, value, 'EX', 7200, function(err, reply) {
      if (err) {
        reject(err);
      } else {
        resolve(reply && reply.toString());
      }
    });
  });

};

const getKey = function(key) {
  return new Promise((resolve, reject) => {
    client.get(key, function(err, reply) {
      if (err) {
        reject(err);
      } else {
        const v = reply && reply.toString();
        if (v) {
          setKey(key, reply.toString());
        }
        resolve(v);
      }
    });
  });
};

const delKey = function(key) {
  return new Promise((resolve, reject) => {
    client.del(key, function(err, reply) {
      if (err) {
        reject(err);
      } else {
        resolve(reply && reply.toString());
      }
    });
  });
};

module.exports = {
  setKey, getKey, delKey,
};

