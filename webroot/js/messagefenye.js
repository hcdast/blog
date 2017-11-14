//初始化分页

flushmessage();
function flushmessage(){
	var datacount=0;
	var pagecount=0;
	var dataarr=[];
	$.ajax({
		type: "get",
		url:"/api/message.html",
		dataType:"json",
		error: function(request) {
			alert("加载失败");
		},
		success: function(result) {
			dataarr=result;
			datacount=result.length;
			pagecount=Math.ceil(datacount/5);
			for(var i=0;i<pagecount&&i<6;i++){
				$(".dv_btns_box").append("<li class='li_btn'  onclick='activePageButton(this)' id='"+(i+1)+"'>"+(i+1)+"</li>");
			}
			var data=result.reverse().slice(0,5);
			addMessage(data);
 		}
	});
}


//页号监听
function activePageButton(obj){
 		var id=obj.id;
	$.ajax({
		type: "get",
		url:"/api/message.html",
		dataType:"json",
		error: function(request) {
			alert("加载失败");
		},
		success: function(result) {
			var data=result.reverse().slice((id-1)*5,(id-1)*5+5);
			addMessage(data);
		}
	});

}







