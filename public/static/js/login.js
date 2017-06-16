$(function(){
	$("#btn_login").click(function(){
		var username=$("input[name='username']").val();
		var password=$("input[name='password']").val();
		$.get("/login",{username:username,password:password},function(res){
			if(res.code==200){
				setTimeout(function(){
					location.href = "../"
				},1000)
			}
		})
	})
})