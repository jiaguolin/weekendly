
'use strict'
var fs = require('fs');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util = require('./util');
var wechatConfig = require('../config/config').wechat;

var WechatUser = require('../models/wechatUser');
var Message = require('../models/message');

var base = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    	accessToken:base +'token?grant_type=client_credential',
        user:{
            getUserInfo:base +'user/info?',
            batchGetUserInfo:base +'user/info/batchget?',  //access_token=ACCESS_TOKEN，POST请求
		    getUserOpenIds:base +'user/get?',  //access_token=ACCESS_TOKEN&next_openid=NEXT_OPENID，GET请求
        },
		//https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN
		customReply:base + 'message/custom/send?'
}

function Wechat(opts){     //构造函数
	var that = this;
	console.log(opts)
	this.appID = opts.appID;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;
	this.fetchAccessToken();
}

Wechat.prototype.replay = function(req,res,message){
	var wechat = new Wechat(wechatConfig)  
	var reply = '您好';
	console.log('reply')
	console.log(message)
	
	if(message.MsgType === 'event'){
		if(message.Event === 'subscribe'){
			if(message.EventKey) {
				console.log('扫描二维码关注：'+ message.EventKey +' '+ message.ticket);
			}
			reply = '欢迎关注';
		}else if(message.Event === 'unsubscribe'){
			this.body = '';
			reply = ''
			console.log(message.FromUserName + ' 取消关注');
		}
	}

	else if(message.MsgType === 'text'){ //处理文本消息
		Message.create(message, function(err, newMessage){
			if(err) throw err;{
				console.log('存入消息成功:' + message.MsgId);
			}
		});

		var content = message.Content;
		if(content === '1'){
			// Message.
			// this.fetchUserInfo(message.FromUserName).then(function(data1){
			// 	console.log('获取用户信息----------');
			// 	console.log(JSON.stringify(data1));

			// 	var tmp = {'nickename':data1.nickname, 'openid':data1.openid, 'province':data1.province, 'city':data1.city };
			// 	console.log(tmp);
			// 	WechatUser.create(tmp, function(err, newUser){
			// 		if(err) throw err;
			// 		console.log('存入微信用户成功!!');
			// 	});
			// 	//	批量获取首先要取到所有的openid.
			// 	this.fetchUserInfo([message.FromUserName]).then(function(data2){
			// 		console.log(JSON.stringify(data2));
			// 	}); 
				
			// });
		}
        else if (content === '2'){
            // console.log('获取所有用户openid ---------\n');
            // this.getUserOpenIds().then(function(data1){
			// 	console.log(JSON.stringify(data1));
			// });
			

			// console.log('获取所有用户信息 ---------\n');
			// var allUsers = yield wechatApi.fetchUserInfo(data1.data.openid);
			// console.log(JSON.stringify(allUsers));

			// console.log('获取当前用户openid ---------\n');
			// var data2 = yield wechatApi.getUserOpenIds(message.FromUserName);
			// console.log(JSON.stringify(data2));

			// TODO: 对于用户信息和用户的openid 存入moogo 数据库
        }
		else if (content === '3'){
			console.log('异步回复消息');
			reply = '客服正在接入:请稍后...';
			console.log('用户id:' + message.FromUserName);
			var oneSecond = 1000 * 3; // one second = 1000 x 1 ms
			this.customReply(message.FromUserName,'请问有什么需要帮助您?');
			setTimeout(function() {
				// this.customReply(message.FromUserName,'请问有什么需要帮助您?');
			}, oneSecond);
		}
	}
	var xml = util.tpl(reply,message); //拼接xml
	res.status = 200;
	res.type = 'application/xml';
	res.body = xml;
	console.log(xml)
	res.json(xml)
}

Wechat.prototype.fetchAccessToken = function(){
	var that = this;

	// 如果this上已经存在有效的access_token，直接返回this对象
	if(this.access_token && this.expires_in){
		if(this.isvalidAccessToken(this)){
			return Promise.resolve(this);
		}
	}

	this.getAccessToken().then(function(data){
		try{
			data = JSON.parse(data);
		}catch(e){
            console.log('从本地文件获取token失败,需要从微信api重新获取')
			return that.updateAccessToken();
		}
		if(that.isvalidAccessToken(data)){
            console.log('sucess !! 从本地文件取出可用的token')
			return Promise.resolve(data);
		}else{
			console.log('access_token 过期,需要去微信api重新获取');
			return that.updateAccessToken();
		}
	}).then(function(data){
		that.access_token = data.access_token;
		that.expires_in = data.expires_in;
		that.saveAccessToken(JSON.stringify(data));
		return Promise.resolve(data);
	});
}

Wechat.prototype.isvalidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in) return false;
	var access_token = data.access_token;
	var expires_in = data.expires_in;
	var now = new Date().getTime();
	return (now < expires_in) ? true : false;
}

// 获取最新的aceess_token
Wechat.prototype.updateAccessToken = function(){
	var appID = this.appID;
	var appSecret = this.appSecret;
	var url = api.accessToken + '&appid='+ appID +'&secret='+ appSecret;
	console.log(url);
	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(response){
			var data = response[0].body;
			var now = new Date().getTime();
			var expires_in = now + (data.expires_in - 20) * 1000;   //考虑到网络延迟、服务器计算时间,故提前20秒发起请求
			data.expires_in = expires_in;
			resolve(data);
		});
	});
}

//获取单个或一批用户信息
Wechat.prototype.fetchUserInfo = function(open_id,lang){
	var that = this;
	var lang = lang || 'zh_CN';
	var url = '';
	var opts = {}
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){

			if(open_id && !Array.isArray(open_id)){   //单个获取
				url = api.user.getUserInfo + 'access_token=' + data.access_token +'&openid='+ open_id +'&lang=' +lang;
				opts = {
					url:url,
					json:true
				}
			}else if(open_id && Array.isArray(open_id)){
				url = api.user.batchGetUserInfo + 'access_token=' + data.access_token;
				var user_list = [];
				for(var i=0;i<open_id.length;i++){
					user_list.push({
						openid:open_id[i],
						lang:lang
					});
				}
				opts = {
					method:'POST',
					url:url,
					body:{
						user_list:user_list
					},
					json:true
				}
			}
			request(opts).then(function(response){
				var _data = response.body;
				if(!_data.errcode){
					resolve(_data);
				}else{
					throw new Error('fetch user info failed: ' + _data.errmsg);
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}

Wechat.prototype.getUserOpenIds = function(next_openid){
	var that = this;
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){
			var url = api.user.getUserOpenIds + 'access_token=' + data.access_token;
			if(next_openid) url += '&next_openid=' + next_openid;
			request({url:url,json:true}).then(function(response){
				var _data = response.body;
				if(!_data.errcode){
					resolve(_data);
				}else{
					throw new Error('get user openIds failed: ' + _data.errmsg);
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}

Wechat.prototype.customReply = function(touser,text){
	var that = this;
	return new Promise(function(resolve,reject){

		that.fetchAccessToken().then(function(data){
			var url = api.customReply + 'access_token=' + data.access_token;
			var opts = {
				method:'POST',
				url:url,
				body:{
					"touser":touser,
					"msgtype":"text",
					"text":
					{
						"content":text
					}
				},
				json:true
			}
			request(opts).then(function(response){
				var _data = response.body;

					resolve(_data);
				// }else{
				// 	throw new Error('customReply message failed: ' + _data.errmsg);
				// }
			}).catch(function(err){
					reject(err);
				});
		})
	
	})

}


module.exports = Wechat;