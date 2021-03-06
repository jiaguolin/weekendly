$(function () {
	waitReply.loadWaitList()
	$(".tab_item").click(function () {
		$(".tab_item").removeClass("active");
		$(this).addClass("active")
	})
	$("#loadWaitList").click(function () {
		waitReply.loadWaitList()
	})
	$("#loadWaitAccess").click(function () {
		waitReply.loadWaitAccess()
	})
	$("#loadLeaveWordList").click(function () {
		waitReply.loadLeaveWordList()
	})
})
var waitReply = {
	/*待回复列表*/
	loadWaitList: function () {
		$.ajax({
			url: "/loadWaitList",
			data: {

			},
			success: function (h) {
				$(".content_wrapper").html(h)
				waitReply.bindWaitList()
			}
		})
	},
	bindWaitList: function () {
		waitReply.loadChatWindow()
		$(".conversation").click(function () {
			waitReply.loadChatWindow()
		})
	},
	/*会话窗口*/
	loadChatWindow: function () {
		$.ajax({
			url: "/loadChatWindow",
			data: {

			},
			success: function (h) {
				$(".chat_window").html(h)
				waitReply.bindChatWindow()
				$('#chatScroll').scrollTop($('#chatScroll').find('.scroll-content').height())
			}
		})
	},
	bindChatWindow: function () {
		$(".transfer").click(function () {
			waitReply.loadKefuTransfer()
		})

		//绑定输入框，这里只能 是ID
		$("#enterKey").keydown(function (event) {
			event = document.all ? window.event : event;
			if ((event.keyCode || event.which) == 13) {
				var that = this.value
				$.ajax({
					url: "/sendMessageToWechatUser",
					type: 'POST',
					data: {
						'touser': 'oyrpDv1_AeyU-Fd89VRKFJa-WehM',
						'content': that
					},
					success: function (h) {
						waitReply.loadChatWindow()
						// $("body").append(h)
						// waitReply.bindKefuTransfer()
					}
				})
			}
		})
	},
	/*转接客服*/
	loadKefuTransfer: function () {
		$.ajax({
			url: "/loadKefuTransfer",
			data: {

			},
			success: function (h) {
				$("body").append(h)
				waitReply.bindKefuTransfer()
			}
		})
	},
	bindKefuTransfer: function () {
		$(".transfer_close,#TransferClose").click(function () {
			$("#TransferModal").remove()
		})
	},
	/*待接入*/
	loadWaitAccess: function () {
		$.ajax({
			url: "/loadWaitAccess",
			data: {

			},
			success: function (h) {
				$(".content_wrapper").html(h)
				waitReply.bindWaitAccess()
				waitReply.loadWaitAccessList()
			}
		})
	},
	bindWaitAccess: function () {
		$(".wait_waited").click(function () {
			$(".wait_waited").removeClass("w_a_active")
			$(this).addClass("w_a_active")
		})
		$(".wait-access").click(function () {
			waitReply.loadWaitAccessList()
		})
		$(".waited-access").click(function () {
			waitReply.loadExpiredList()
		})
	},
	/*待接入列表*/
	loadWaitAccessList: function () {
		$.ajax({
			url: "/loadWaitAccessList",
			data: {

			},
			success: function (h) {
				$(".table-wrapper").html(h)
				waitReply.bindWaitAccessList()
			}
		})
	},
	bindWaitAccessList: function () {
		$(".btn-access").click(function () {
			waitReply.loadWaitList()
		})
	},
	/*已过期列表*/
	loadExpiredList: function () {
		$.ajax({
			url: "/loadExpiredList",
			data: {

			},
			success: function (h) {
				$(".table-wrapper").html(h)
				waitReply.bindExpiredList()
			}
		})
	},
	bindExpiredList: function () {

	},
	/*留言*/
	loadLeaveWordList: function () {
		$.ajax({
			url: "/loadLeaveWordList",
			data: {

			},
			success: function (h) {
				$(".content_wrapper").html(h)
				waitReply.bindLeaveWordList()
			}
		})
	},
	bindLeaveWordList: function () {
		$(".lookdetails").click(function () {
			waitReply.loadWorddetails()
		})
	},
	/*留言详情*/
	loadWorddetails: function () {
		$.ajax({
			url: "/loadWorddetails",
			data: {

			},
			success: function (h) {
				$("body").append(h)
				waitReply.bindWorddetails()
			}
		})
	},
	bindWorddetails: function () {
		$("#WordDetailsSave,.word_details_close").click(function () {
			$("#WordDetailsModal").remove()
		})
	}
}