var redisDB = {};
var redis = require('redis');
var config = require('../config/config').redisConfig;
var client = redis.createClient(config.port, config.host,{auth_pass:config.pass});

client.on("error", function (err) {
  console.log("Error :" , err);
});

client.on('connect', function(){
  console.log('Redis连接成功.');
})

/**
 * 添加string类型的数据
 * @param key 键
 * @params value 值
 * @params expire (过期时间,单位秒;可为空，为空表示不过期)
 * @param callBack(err,result)
 */
redisDB.set = function(key, value, expire, callback){

    client.set(key, value, function(err, result){
        if (err) {
            console.log(err);
            callback(err,null);
            return;
        }
    })
    if(expire){
        client.expire(key, expire);
    }
}

/**
 * 查询string类型的数据
 * @param key 键
 * @param callBack(err,result)
 */
redisDB.get = function(key, callback){

    client.get(key, function(err,result){
        if (err) {
            callback(err,null);
            return;
        }
        callback(null,result);
    });
}
/**
 * 删除key
 * @param key 键
 * @param callBack(err,result)
 */
redisDB.del = function(key, callback){

    client.del(key, function(err,result){
        if (err) {
            callback(err,null);
            return;
        }
        if(callback) callback(null,result);
    });
}

/**
 * 将键存储的值加上整数increment
 * @param key键
 * @param callBack(err,result)
 */
redisDB.incrby = function(key, increment, callback){
    client.incrby(key, increment, function(err,result){
        if (err) {
            callback(err,null);
            return;
        }
        if(callback) callback(null,result);
    });
}
/********************************队列操作*************************************/
/**
 * 弹出队列
 * @param queueName 队列名称
 * @parame time 等待时间
 * @param callback(err, result) 回调函数
 */
redisDB.blopQueue = function(queueName, time, callback){
	client.blpop(queueName, time, function(err,result){
		  if (err) { //执行错误
	          callback(err,null);
	          return;
	      }
		  callback(null,result); //返回输出
	});
}

redisDB.lpushQueue = function(queueName, value, callback){
    client.lpush(queueName, value, function(err,result){
          if (err) { //执行错误
              callback(err,null);
              return;
          }
          callback(null,result); //返回输出
    });
}
/********************************队列操作end*************************************/


/*****************************hash操作****************************************/
redisDB.hMset = function(key, obj, callback){
	client.hmset(key, obj, function(err,result){
		  if (err) { //执行错误
	          callback(err,null);
	          return;
	      }
	});
}
/*****************************hash操作end****************************************/

/****************************集合操作*****************************************/

/**
 *添加一个字段到有序集合
 */
redisDB.addElementToZset = function(key, score, value, callback) {
    client.zadd(key, score, value, function(err, result){
        if (err) { //执行错误
            callback(err,null);
            return;
        }
    });
}


/**
 *获取有序集合所有成员不包含分数
 */
redisDB.getAllZsetMember = function(key, callback) {
    client.zrange(key, 0, -1, function(err, result){
        if (err) { //执行错误
            callback(err,null);
            return;
        }
        callback(null, result);
    });
}

/**
 *获取有序集合所有成员包含分数
 */
redisDB.getAllZsetMemberWithScore = function(key, callback) {
    client.zrange(key, 0, -1, "withscores", function(err, result){
        if (err) { //执行错误
            callback(err,null);
            return;
        }
        callback(null, result);
    });
}

/**
 *获取一个有序集合中的成员数量
 */
redisDB.getZsetCount = function(key, callback) {
    client.zcard(key, function(err, result){
        if (err) { //执行错误
            callback(err,null);
            return;
        }
        callback(null, result);
    });
}

/**
 *获取一个有序集合中的成员分数
 */
redisDB.getSetMemberScore = function(key, member, callback) {
    client.zscore(key, member, function(err, result){
        if (err) { //执行错误
            callback(err,null);
            return;
        }
        callback(null, result);
    });
}

/**
 *获取一个有序集合中的分数区间的成员个数
 */
 redisDB.getMemberCountByScore = function(key, begin, end, callback) {
     client.zcount(key, begin, end, function(err, result){
         if (err) { //执行错误
             callback(err,null);
             return;
         }
         callback(null, result);
     });
 }


 /**
  *获取一个有序集合中的分数区间的成员信息
  */
  redisDB.getMemberInfoByScore = function(key, begin, end, callback) {
      client.zrangebyscore(key, begin, end, function(err, result){
          if (err) { //执行错误
              callback(err,null);
              return;
          }
          callback(null, result);
      });
  }


/**
 *增加某个有序集合成员的分数
 */
redisDB.incrMemberScore = function(key, score, member, callback) {
    client.zincrby(key, score, member, function(err, result){
        if (err) { //执行错误
            callback(err,null);
            return;
        }
        callback(null, result);
    });
}


/**
 *删除某个有序集合成员
 */
redisDB.deleteMember = function(key, member, callback) {
    client.zrem(key, member, function(err, result){
        if (err) { //执行错误
            callback(err,null);
            return;
        }
        callback(null, result);
    });
}
module.exports = redisDB;
