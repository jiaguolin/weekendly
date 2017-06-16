var db = require('../module/index');
var logs = require('./loger').logger;

module.exports={
  test: {
    a:123,
    b:234
  },
  change: function(req, res, next){
    console.log(module.exports)
    module.exports.test.b +=1;
    res.json({test: module.exports.test})
  },
  userlogin: function(req, res, next){
    var name = '用户';
    var uid = Date.now();
    var type = '0';
    res.json({code:200,msg:{name:name,uid:uid,type:type}});
    res.end();
  },
  submessage:function(req, res, next){
    var message = new db.message({
      from : req.body['from'],
      to : '',
      name : req.body['name'],
      mobile : req.body['mobile'],
      email : req.body['email'],
      wechat : req.body['wechat'],
      message : req.body['message'],
      time : Date.now()
    })
    message.save(function(err){
      if(err){
          // logs.error(req.url+' | 服务器内部错误,err: '+err);
          res.json({code:50000,msg:'服务器内部错误'});
          res.end();
          return
       }else{
          res.json({code:200,msg:'提交成功'});
          res.end();
      }
    })
  }
}
