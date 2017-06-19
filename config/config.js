
//配置文件
var path = require('path');
var util = require('../libs/util');

var wechat_file = path.join(__dirname,'../wechat/access_token.txt');

module.exports={
  //mysql配置
	mysql:{
	  host: '47.93.119.101',
    user: 'webuser',
    password: 'MkiPR4gLC2',
    database: "DW",
    port: "3306"
	},
  //mongodb配置
	// mongodb:'mongodb://maintenance:Sinicnet123456@10.30.57.194:27021,10.30.248.106:27021,10.30.57.196:27021/super_maintenance',
  // mongodb:'mongodb://service:123456@10.0.0.39:27017/online_service',
	mongodb:'mongodb://service:123456@123.56.45.82:27017/online_service',
  //session配置
	sessionConfig:{
		cookie: {
       maxAge: 1800000
   	},
   	sessionStore: {
       host: "10.0.0.39",
       port: "6379",
       pass: "emicnet",
       ttl: 1800,
       logErrors: true
   		}
		},
  //token配置
  tokenConfig: {
    tokenStore: {
      host: "10.0.0.39",
      port: "6379",
      pass: "emicnet",
      ttl: 900
    },
    access_token: {
      maxAge: 900000
    },
    refresh_token: {
      maxAge: 1800000
    }
  },
  //redis配置
  redisConfig: {
      host: "10.0.0.39",
      port: "6379",
      pass: "emicnet"
    },
  //log配置
  logConfig: {
    log_path: '/var/pbx/tmp/Log/super_maintance/web/',
    timestamp: 'true',
    maxsize: 10485760,
    maxFiles: 10
  },
  //log4配置
  log4Config: {
    appenders: [{
      type: 'console',
      category: 'console'
    },
    {
    type: 'dateFile',
    absolute: true,
    maxLogSize: 1024,
    backups:3,
    filename: '/var/pbx/tmp/Log/super_maintenance/web/',
    pattern: 'yyyy-MM-dd.log',
    alwaysIncludePattern: true,
    category: '-'
   }],
   replaceConsole: true,
   levels:{
            console: 'DEBUG',
            normal: 'DEBUG',
          }
  },
  //短信配置，但是是在mongo数据库中取
  mdsmssend: {
    key: "MESSAGE",
    UMS_Signed : "米话",
    UMX_SEND_URL : "http://sdk2.entinfo.cn:8061/mdsmssend.ashx",
    UMS_SpCode : "DXX-MDQ-010-00063",
    UMS_LoginName : "DXX-MDQ-010-00063",
    UMS_Password : "[f31c8d-",
    timeSpan: 60000,
    deadline: 600000
  },

 	wechat:{
      appID:'wxaee573c03125bbc1', //wxa58995f69272a3e7
      // appID:'wxa58995f69272a3e7',
      // appSecret:'1670fa80c67a98abca0fcb8b6a530509',
      appSecret:'724050aa26b5970d293ba9e575ec60c6', //1670fa80c67a98abca0fcb8b6a530509
      token:'weixin',
      getAccessToken:function(){
        return util.readFileAsync(wechat_file);
      },
      saveAccessToken:function(data){
        return util.writeFileAsync(wechat_file,data);
		},
	}
}
