var express = require('express');
var router = express.Router();
var index = require('../dao/index');
var kefu = require('../dao/kefu');
var user = require('../dao/user');

var wechat = require('../dao/wechat')

/* 路由拦截 */
router.use(function (req, res, next) {
  index.use(req, res, next);
})
//客服
/*登陆页面*/
router.get('/loadlogin', function(req, res, next) {
  res.render('login', {});
});
/*登陆*/
router.get('/login', function(req, res, next) {
  index.login(req, res, next)
});
/*客服主页*/
router.get('/', function(req, res, next) {
  index.index(req, res, next)
});
/*待回复列表*/
router.get('/loadWaitList', function(req, res, next) {
  index.loadWaitList(req, res, next)
});
/*会话窗口*/
router.get('/loadChatWindow', function(req, res, next) {
  index.loadChatWindow(req, res, next)
});
/*转接客服*/
router.get('/loadKefuTransfer', function(req, res, next) {
  index.loadKefuTransfer(req, res, next)
});
/*待接入*/
router.get('/loadWaitAccess', function(req, res, next) {
  index.loadWaitAccess(req, res, next)
});
/*待接入列表*/
router.get('/loadWaitAccessList', function(req, res, next) {
  index.loadWaitAccessList(req, res, next)
});
/*已过期列表*/
router.get('/loadExpiredList', function(req, res, next) {
  index.loadExpiredList(req, res, next)
});
/*留言列表*/
router.get('/loadLeaveWordList', function(req, res, next) {
  index.loadLeaveWordList(req, res, next)
});
/*留言详情*/
router.get('/loadWorddetails', function(req, res, next) {
  index.loadWorddetails(req, res, next)
});

//用户
/*用户主页*/
router.get('/user', function(req, res, next) {
  index.user(req, res, next)
});
/*聊天*/
router.get('/loadUserChat', function(req, res, next) {
  index.loadUserChat(req, res, next)
});
/*留言*/
router.get('/loadUserWord', function(req, res, next) {
  index.loadUserWord(req, res, next)
});














//客服
router.get('/kefu', function(req, res, next) {
  kefu.getCustomers(req, res, next);
});

router.get('/getmessages', function(req, res, next) {
  kefu.getmessages(req, res, next);
});

router.get('/getmessage', function(req, res, next) {
  kefu.getmessage(req, res, next);
});






//用户
router.get('/userlogin', function(req, res, next) {
  user.userlogin(req, res, next);
});
router.post('/submessage', function(req, res, next) {
  user.submessage(req, res, next);
});

router.get('/test', function(req, res, next) {
  user.change(req, res, next)
});
router.get('/gettest', function(req, res, next) {
  kefu.get(req, res, next)
});

// //wechat
// router.get('/getWechatMessage',function(req,res,next){
//   wechat.getWechatMessage(req,res,next);
// });

router.post('/sendMessageToWechatUser',function(req,res,next){
  wechat.customReply(req,res,next);   
});

module.exports = router;
