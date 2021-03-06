'use strict';

var messageModle = require('../database').models.message;


var create = function (data, callback) {
	var newMessage = new messageModle(data);
	newMessage.save(callback);
};

var findOne = function (data, callback) {
	messageModle.findOne(data, callback);
}

var findByGroup = function (callback) {
	//todo : get message group by
	messageModle.aggregate([{ $group: { _id: '$FromUserName', num_tutorial: { $sum: 1 } } }]).exec(callback)
	// messageModle.find(callback)
}

var findAll = function (callback) {
	messageModle.find(callback)
}

var findFromWechat = function (callback) {
	var criteria = { channel: 'wechat' }; // 查询条件
	messageModle.find(criteria, callback)
}

module.exports = {
	create,
	findOne,
	findByGroup,
	findAll,
	findFromWechat
};