$(function(){
	User.loadUserChat()
	$(".tab_item").click(function(){
		$(".tab_item").removeClass("active");
		$(this).addClass("active")
	})
	$("#loadUserChat").click(function(){
		User.loadUserChat()
	})
	$("#loadUserWord").click(function(){
		User.loadUserWord()
	})
})

var User={
	/*聊天*/
	loadUserChat:function(){
		$.ajax({
			url:"/loadUserChat",
			data:{

			},
			success:function(h){
				$(".content_wrapper").html(h)
				User.bindUserChat()
			}
		})
	},
	bindUserChat:function(){
	    
	},
	loadUserWord:function(){
		$.ajax({
			url:"/loadUserWord",
			data:{

			},
			success:function(h){
				$(".content_wrapper").html(h)
				User.bindUserWord()
			}
		})
	},
	bindUserWord:function(){
		
	}
}