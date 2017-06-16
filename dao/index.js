var db = require('../module/index');
var logs = require('./loger').logger;
var crypto = require('crypto');
var secret = 'abcdefg';
var MD5 = function(secret){
		return crypto.createHash('md5')
    .update(secret)
    .digest('hex');
}

module.exports={
    use:function(req, res, next){
		var url = req.url.split('?')[0];
		console.log(url)
		switch(url){
			case '/loadlogin': next();break;
			case '/login': next();break;
			case '/user': next();break;
			case '/loadUserChat': next();break;
			case '/loadUserWord': next();break;
			default: auth();break;
		}
		function auth() {
			if(req.session.user){
				return next();
			}else{
				res.redirect('/loadlogin');
				res.end();
				return
			}
		}
	},
	login:function(req, res, next){
	    if(!req.query['username']||!req.query['password']){
	      res.json({
	      	code:50002,
	      	msg:'缺少查询数据'
	      });
	      res.end();
				return
	    }
	    var username = req.query['username'];
	    var password = req.query['password'];
		var customer = db.customer;
	    customer.find({
	    	mobile:username
	    },function(err, docs) {
	        if(err){
	            res.json({
	            	code:50000,
	            	msg:'服务器内部错误'
	            });
	            res.end();
	            return
	        }else{
				if (docs.length === 0){
					res.json({
						code:51001,
						msg:'用户不存在'
					});
	        		res.end();
				} else{
					if(docs[0].password === MD5(password)){
						req.session.user={
							uid:docs[0]._id,
							username:req.query['username'],
							name:docs[0].name,
							type:1
						};
						res.json({
							code:200,
							msg:'登陆成功'
						});
		        		res.end();
					} else{
						res.json({
							code:51002,
							msg:'账号或密码错误'
						});
		        		res.end();
					}
				}
	        }
	    });
	},
	index:function(req, res, next){

		// res.render()
		//todo:  
		// wechat.getNewMessage
		res.render('index', {'number':3,'laterNumber':3});
	},
	loadWaitList:function(req, res, next){

		//nuer 

		res.render('waitlist', {});
	},
	loadChatWindow:function(req, res, next){
		res.render('chatwindow', {});
	},
	loadKefuTransfer:function(req, res, next){
		res.render('kefutransfer', {});
	},
	loadWaitAccess:function(req, res, next){

		res.render('waitaccess', {});
	},
	loadWaitAccessList:function(req, res, next){


		res.render('waitaccesslist', {});
	},
	loadExpiredList:function(req, res, next){
		res.render('expiredlist', {});
	},
	loadLeaveWordList:function(req, res, next){
		res.render('leavewordlist', {});
	},
	loadWorddetails:function(req, res, next){
		res.render('worddetails', {});
	},
	/*用户*/
	user:function(req, res, next){
		res.render('user', {});
	},
	loadUserChat:function(req, res, next){
		res.render('userchat', {});
	},
	loadUserWord:function(req, res, next){
		res.render('userword', {});
	}
}
