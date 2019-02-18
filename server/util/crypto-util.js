const crypto = require('crypto');

const secret = '88888888';

const sha256Encode = function(str) {
  return crypto.createHmac('sha256', secret).update(str).digest('hex');
};

module.exports = {
  sha256Encode,
};
