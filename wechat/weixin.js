var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var wechatConfig = require('../config/config').wechat;
var util = require('./util');
var rawBody = require('raw-body');

var Wechat = require('./wechat');

router.use(function (req, res, next) {
    var wechat = new Wechat(wechatConfig)  
    var token = wechatConfig.token
    var signature = req.query.signature
    var nonce = req.query.nonce
    var timestamp = req.query.timestamp
    var echostr = req.query.echostr
    console.log(req.query);
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

    rawBody(req,{length:req.length,limit:'1mb',encoding:req.charset}).then(function(xml){
        console.log(xml)
        util.parseXMLAsync(xml).then(function(xmlConten){
            console.log(xmlConten)
            var message = util.formatMessage(xmlConten.xml);
            console.log(message)
            wechat.replay(req,res,message); 

        })
    },function(reject){
        console.log(reject)
    })

    // then())

    // var data = yield rawBody(this.req,{length:this.length,limit:'1mb',encoding:this.charset});
    // var content =  util.parseXMLAsync(req.body) //xml数据解析成xml对象
    // // console.log(req.rawBody);
    // // var message = util.formatMessage(req.rawBody.xml);

    // console.log('content:' + content);
    // this.weixin = message;  //挂载消息

    // yield handler.call(this,next);   //转到外层逻辑

   
})


module.exports = router;