//返回码定义
codeinfo = {
	common:{ //通用返回码
		code:200, msg:"请求成功",
		code:50000, msg:"服务器内部错误",
		code:50001, msg:"session过期",
		code:50002, msg:"缺少查询数据",
		code:50003, msg:"验证码错误",
		code:50004, msg:"验证码过期",
		code:50005, msg:"验证码请求频繁，请稍后再试",
	},
	user:{ //用户返回码
		code:51000, msg:"创建用户失败",
		code:51001, msg:"用户不存在",
		code:51002, msg:"账号或密码错误",
		code:51003, msg:"用户已存在",
		code:51004, msg:"账号无权限",

	},
	customer:{},
	contract:{
	},
	business_data:{
		code:53000, msg:"提成和不等于100%",
	},
	queue:{ //队列返回码
		code:54000, msg:"添加队列失败",
	}
}
