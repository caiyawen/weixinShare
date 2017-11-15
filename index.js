const express = require('express');
const App = express();
const request = require('request');
const fs = require('fs');
const path = require('path');
const util = require('./util');
const sha1 = require('sha1');

// 1,获得appId和secret
const appId = 'wx4bb569b7a3617bdb';
const secret = 'c31964b1b63a7349167953f0147e17e7';
const host = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&';
const url = `${host}appid=${appId}&secret=${secret}`;
let data;
let timestamp;

App.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

App.get('/weixin', function(req, res) {
  // 2,判断是否生效，读取access_token
  if(util.judgeToken()) {
   request.get(url, function(req ,res) {
      data = JSON.parse(res.body);
      data.time = Math.floor(Date.now()/1000) + (data.expires_in - 100);

      util.writeFile(path.join(__dirname, './secret.json'), JSON.stringify(data));
    })
  };

  // 3,根据access_token获取ticket并写入
  let secretData = JSON.parse(util.readFile(path.join(__dirname, './secret.json')));
  let timestamp = secretData.time;
  let access_token = secretData.access_token;
  request.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`, function(req,res) {
    util.writeFile(path.join(__dirname, './ticket.json'), res.body);
  });

  //签名算法
  const jsapi_ticket = JSON.parse(util.readFile(path.join(__dirname, './ticket.json')));
  const signString = `jsapi_ticket=${jsapi_ticket.ticket}&noncestr=Wm3WZYTPz0wzccnW&timestamp=${timestamp}&url=http://96baacee.ngrok.io/`;
  console.log('signString', signString);
  const signature = sha1(signString);
  console.log('signature', signature);
  res.send({signature, appId, timestamp});
})


App.listen(8082);