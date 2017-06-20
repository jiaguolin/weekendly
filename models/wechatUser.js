'use strict';

var userModel = require('../database').models.wechatUser;

var create = function (data, callback) {
	var newUser = new userModel(data);
	newUser.save(callback);
};

var findByOpenId = function (openid) {
	return new Promise(function (resolve, reject) {
		userModel.find({ 'openid': openid }, function (err, result) {
			err ? reject(err) : resolve(result[0])
		})
	});
}

module.exports = {
	create,
	findByOpenId,
};
