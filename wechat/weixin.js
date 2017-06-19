var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var wechatConfig = require('../config/config').wechat;
var util = require('./util');
var rawBody = require('raw-body');

var Wechat = require('./wechat');

router.use(function (req, res, next) {

    console.log('come here for weixin')
    var wechat = new Wechat(wechatConfig)  
    var token = wechatConfig.token
    var signature = req.query.signature
    var nonce = req.query.nonce
    var timestamp = req.query.timestamp
    var echostr = req.query.echostr
    var str = [token,timestamp,nonce].sort().join('')
    var sha = sha1(str)
        if(req.method === 'GET') {
            res.body = (sha === signature) ? echostr + '' : '签名验证不匹配';
            res.send(res.body);
          }else if(req.method === 'POST'){
            if(sha !== signature){
                this.body = '不是微信的消息';
                return false;
        }
    }

   /*
      收到微信粉丝的留言消息处理:
   */
    rawBody(req,{length:req.length,limit:'1mb',encoding:req.charset}).then(function(xml){
        console.log(xml)
        util.parseXMLAsync(xml).then(function(xmlConten){
            console.log(xmlConten)
            var message = util.formatMessage(xmlConten.xml);
            console.log(message)
            //todo: 先要查到是否有客服在线,确定是接入客服或者自动回复.
            wechat.replay(req,res,message); 

        })
    },function(reject){
        console.log(reject)
    })
})


module.exports = router;