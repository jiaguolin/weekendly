'use strict';

var messageModle = require('../database').models.message;

var create = function (data, callback){
	var newMessage = new messageModle(data);
	newMessage.save(callback);
};

var findByOpenId = function (MsgId, callback){
	// messageModle.findById(MsgId, callback);
	messageModle.find(callback)
}

var findOne = function (data, callback){
	messageModle.findOne(data, callback);
}


module.exports = { 
	create, 
	findByOpenId, 
	findOne
};