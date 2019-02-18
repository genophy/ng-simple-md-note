const uuidV1 = require('uuid/v1');
const tokens = [];
/**
 * token use uuid
 * @returns {*}
 */
const generateToken = function() {
  const t = uuidV1();
  tokens.push(t);
  return t;
};

const isTokenExist = function(token) {
  return -1 !== tokens.indexOf(token);
};

const delToken = function(token) {
  const idx = tokens.indexOf(token);
  if (-1 !== idx) {
    tokens.splice(idx, 1);
  }
};

module.exports = {
  isTokenExist, generateToken, delToken,
};
