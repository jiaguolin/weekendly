var db = require('../module/index');
var logs = require('./loger').logger;


var Wechat = require('../wechat/wechat');
var wechatConfig = require('../config/config').wechat;
var wechatApi = new Wechat(wechatConfig);

var WechatUser = require('../models/wechatUser');
var Message = require('../models/message');

module.exports={
  getWechatMessage: function(req, res, next){

		Message.findOne({'MsgId':'6431422739886494750'},function(err,message){
		if(err){
					res.json({code:50000,msg:'服务器内部错误'});
					res.end();
					console.log(err)
					console.log(message)
					return
			}else{
			res.json({code:200,wechatMessage:message});
			res.end();
			}
		})
			

    console.log('get wechat message!');
  },
  customReply: function(req,res,next){

		var touser = req.body['touser']
		var conten = req.body['content']
		wechatApi.customReply(touser,conten).then(function(data){
			res.json({code:200,info:'发送成功'});
			res.end();
		})
    console.log('reply message');
  }

	// curl -H "Content-Type: application/json" -X POST -d '{"content":"hi"}' https://jiaguolin.localtunnel.me/api/sendMessageToWechatUser
}