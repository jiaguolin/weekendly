var db = require('../module/index');
var logs = require('./loger').logger;
var test = require('./user').test;

module.exports={
	get: function(req, res, next){
		res.json({test: test})
		res.end()
	},
    //所有用户信息
	getCustomers:function(req, res, next){
		var customer = db.customer;
    customer.find({}).populate('appid').exec(function(err, docs) {
        if(err){
            res.json({code:50000,msg:'服务器内部错误'});
            res.end();
            return
        }else{
        res.json({code:200,msg:docs});
        res.end();
        }
    });
	},
	//所有留言
getmessages:function(req, res, next){
	var message = db.message;
	message.find({},'_id from time',{sort: {time:1}},function(err, docs) {
			if(err){
					res.json({code:50000,msg:'服务器内部错误'});
					res.end();
					return
			}else{
			res.json({code:200,msg:docs});
			res.end();
			}
	});
},
getmessage:function(req, res, next){
	var message = db.message;
	message.find({_id:req.query['id']},function(err, docs) {
			if(err){
					res.json({code:50000,msg:'服务器内部错误'});
					res.end();
					return
			}else{
			res.json({code:200,msg:docs[0]});
			res.end();
			}
	});
},
}
