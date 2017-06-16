var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
var config = require('../config/config').mongodb;
var opts = { replSet: {readPreference: 'ReadPreference.NEAREST'} };
var db = mongoose.connect(config, opts);//；连接数据库，只需连接一次
db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log(config)
});

//企业model
var applicant = mongoose.model('o_applicant',{
              name : String,
              position : String,
              members : Number
						},'o_applicant');
//用户model
var customer = mongoose.model('o_customer',{
						  name : String,
						  mobile : String,
						  appid : {type: mongoose.Schema.Types.ObjectId, ref: 'o_applicant'},
						  password : String,
						},'o_customer');
var message = mongoose.model('o_message',{
              from : String,
              to : String,
              name : String,
              mobile : String,
              email : String,
              wechat : String,
              message : String,
              time : String
						},'o_message');
module.exports={
	applicant : applicant,
  customer : customer,
  message : message
}
