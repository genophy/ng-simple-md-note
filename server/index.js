const bodyParser = require('body-parser');
const cryptoUtil = require('./util/crypto-util');
const express = require('express');
const fs = require('fs');
const gm = require('gm');
const imageMagick = gm.subClass({imageMagick: true});
const path = require('path');
const serviceAccount = require('./service/account.service');
const serviceBlog = require('./service/blog.service');
const serviceCategory = require('./service/category.service');
const serviceImage = require('./service/image.service');

const redisHelper = require('./util/redis-helper');
const formidable = require('formidable');

const app = express();
app.use(bodyParser.json()); // for parsing application/json

// all is not use token
const anonymousFns = ['accountInsert', 'queryByName', 'queryByNamePwd', 'queryAll', 'queryAllWithBlogCount', 'updateBlogWatched', 'login', 'logout'];
// do not remove token
const notRemoveTokenFns = ['logout'];

const serviceMap = {
  '/api/json/account' : serviceAccount,
  '/api/json/blog'    : serviceBlog,
  '/api/json/category': serviceCategory,
};
app.get('/', (req, resp) => resp.send('Hello World!'));
/**
 *
 */
const checkToken = (fn, token) => {
  return new Promise((resolve, reject) => {
    if (-1 === anonymousFns.indexOf(fn)) {
      if (token) {
        redisHelper.getKey(token).then(_currentUserId => {
          if (_currentUserId) {
            resolve(_currentUserId);
          } else {
            reject();
          }
        }).catch((e) => {
          console.error(e);
          reject();
        });
      } else {
        reject();
      }
    } else {

      resolve();
    }
  });

};

app.post('/api/json/*', (req, resp) => {
  const serviceName = req.url;
  const reqBody = req.body;
  let token = req.headers['token'];

  checkToken(reqBody['fn'], token).then(_currentUserId => {
    let data = reqBody['data'];
    if (_currentUserId) {
      post2(serviceName, reqBody['fn'], data, resp, _currentUserId);
    } else {
      post2(serviceName, reqBody['fn'], data, resp);
    }
  }).catch((e) => {
    resp.send({code: 0, msg: 'please login', data: e && e.toString()});
    throw e;
  });

});

const post2 = (serviceName, fn, data, resp, currentUserId = '') => {

  if (-1 === notRemoveTokenFns.indexOf(fn)) {
    data['token'] = undefined;
  }

  if (data && data.pwd) {
    data.pwd = cryptoUtil.sha256Encode(data.pwd);
  }

  serviceMap[serviceName].apiInject(fn, data, currentUserId).then(res => {
    resp.send({code: 1, msg: 'success', data: res});
  }).catch(e => {

    resp.send({code: -1, msg: 'fail', data: e && e.toString()});
    throw e;
  });
};

app.post('/api/img/upload', (req, resp) => {
  const reqBody = req.body;
  let token = req.headers['token'];

  checkToken(reqBody['fn'], token).then(_currentUserId => {
    let data = reqBody['data'];
    if (_currentUserId) {
      const form = new formidable.IncomingForm();
      //Formidable uploads to operating systems tmp dir by default
      form.uploadDir = 'img';       //set upload directory
      form.keepExtensions = true;     //keep file extension

      form.parse(req, function(err, fields, files) {
        console.log('file size: ' + JSON.stringify(files['file'].size));
        const filePath = JSON.stringify(files['file'].path);
        console.log('file path: ' + filePath);
        console.log('file name: ' + JSON.stringify(files['file'].name));
        const fileType = JSON.stringify(files['file'].type);
        console.log('file type: ' + fileType);
        console.log('astModifiedDate: ' + JSON.stringify(files['file'].lastModifiedDate));

        if (-1 === fileType.indexOf('image')) {
          resp.send({code: -1, msg: 'upload just img', data: ''});
          return;
        }

        let _width = 720;
        let _height = 720;
        // if (img.width() < _width) {
        //   _width = img.width;
        // }
        // if (img.height() < _height) {
        //   _height = img.height;
        // }
        const _newFilePath = files['file'].path.replace('upload_', 'upload_img_');
        imageMagick(path.join('./', files['file'].path))
        .size(function(err, size) {
          if (err) {
            console.error(err);
          }

          if (size.width < _width) {
            _width = size.width;
          }
          if (size.height < _height) {
            _height = size.height;
          }

          imageMagick(path.join('./', files['file'].path)).resize(_width, _height)
          .autoOrient()
          .write(path.join('./', _newFilePath), function(err) {
            if (err) {
              console.error(err);
            } else {
              fs.unlinkSync(files['file'].path);

              serviceImage.apiInject('insert', {path: _newFilePath}, _currentUserId).then(res => {
                if (res.id) {
                  resp.send({code: 1, msg: 'upload success', data: {id: res.id}});
                } else {
                  resp.send({code: -1, msg: 'upload fail', data: ''});
                }
              });

            }
          });

        });

      });
    }
  }).catch(() => {
    resp.send({code: 0, msg: 'please login', data: ''});
  });

});

app.get('/api/img/get', (req, resp) => {
  const reqQuery = req.query;
  const id = reqQuery['id'];

  serviceImage.apiInject('queryAll', {id}).then(res => {
    if (res && res[0]) {
      const file = fs.readFileSync(res[0]['path'], 'binary');

      resp.setHeader('Content-Length', file.length);
      resp.write(file, 'binary');
    } else {
      resp.send({code: -1, msg: 'get img fail', data: ''});
    }
  });

});

app.listen(5000, () => console.log('Example app listening on port 5000!'));
