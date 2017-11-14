$(document).ready(function(){
	//查找
	$('#data .top .find input').keydown(function(e){
		if(e.keyCode==13){
			var moudle=document.getElementById("moudle").value;
			if(moudle=="null"){
				alert("请选择要查询的模块。。。");
			}else {
				var user = $(this).val();
				if (user == "") {
					alert("输入为空 。。。");
				}
				else {
					$.ajax({
						type: "post",
						url: "/api/mdatafind",
						dataType: "json",
						data: {coll: moudle, name: user},
						error: function () {
							alert("查找失败。。。");
						},
						success: function (result) {
							if(result.length==0){
								alert("没有查到您要的信息。。。");
							}
							else{
								var m=moudle.slice(0,1);
								$(".d-"+m+"-list").css("overflow","scroll")
						            	          .css("width","1220px")
							                      .css("height","377px");
								addDoc(result,moudle);
							}
						}
					});
				}
			}
		}
	});

	//找到标签2效果对应的三个标签，注册鼠标点击事件
	$("#tabsecond li").each(function(index){
		$("#whisper").css("display","block");
		$("#life").css("display","none");
		$("#road").css("display","none");
		$("#data").css("display","none");
		$(this).click(function(){
			$("#tabsecond li.tabin").removeClass("tabin");
			$(this).addClass("tabin");
			if (index == 0) {
				$("#whisper").css("display","block");
				$("#life").css("display","none");
				$("#road").css("display","none");
				$("#data").css("display","none");
			} else if (index == 1) {
				$("#whisper").css("display","none");
				$("#life").css("display","block");
				$("#road").css("display","none");
				$("#data").css("display","none");
			} else if (index == 2) {
				$("#whisper").css("display","none");
				$("#life").css("display","none");
				$("#road").css("display","block");
				$("#data").css("display","none");
			} else if (index == 3) {
				$("#whisper").css("display","none");
				$("#life").css("display","none");
				$("#road").css("display","none");
				$("#data").css("display","block");
			}
		});
	});
});

$.ajax({
	type: "post",
	url: "/api/statu",
	dataType: "json",
	error: function () {
	},
	success: function (result) {
		var num=0;
		for(var i in result){
			if(result[i].password==getCookie(result[i].name)&&result[i].flag==true){
			} else num++;
		}
		if(num==result.length) {
			 localUrlIndex();
		}
	}
});
//获取cookie
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';'); //把cookie分割成组
	for(var i=0;i < ca.length;i++) {
		var c = ca[i]; //取得字符串
		while (c.charAt(0)==' ') { //判断一下字符串有没有前导空格
			c = c.substring(1,c.length); //有的话，从第二位开始取
		}
		if (c.indexOf(nameEQ) == 0) { //如果含有我们要的name
			return unescape(c.substring(nameEQ.length,c.length)); //解码并截取我们要值
		}
	}
	return false;
}
//    whisper
function postWhisper() {
	var author = "";
	var content = document.getElementById("w_content").value;
	if (document.getElementById("w_hc").checked == true) author = "hc";
	if (document.getElementById("w_yn").checked == true) author = "yn";
	var jsonwhisper = {author: author, content: content};
	$.ajax({
		type: "post",
		url: "/api/mwhisper",
		dataType: "json",
		data: jsonwhisper,
		success: function (result) {
			if (result[0].result == "success") {
				alert("发表成功。。。");
				 localUrlWhisper();
			}
			else {
				alert("发表失败。。。");
				localUrlManger();
 			}

		}
	});
}
//life
function postLife () {
	var title = document.getElementById("l_title").value;
	var author="";
	if(document.getElementById("l_hc").checked==true) author="hc";
	if(document.getElementById("l_yn").checked==true) author="yn";
	var type = document.getElementById("l_type").value;
	var content = document.getElementById("l_content").value;
	var jsonlife={title:title,author:author,type:type,content:content};
	$.ajax({
		type: "post",
		url:"/api/mlife",
		dataType:"json",
		data:jsonlife,
		error: function() {
			alert("发表失败。。。");
		},
		success: function(result) {

			if (result[0].result == "success") {
				alert("发表成功。。。");
				localUrlLife();
 			}
			else {
				alert("发表失败。。。");
				localUrlManger();
 			}
		}
	});

}
//    road
function runRoad () {
	var date=new Date();
	var title = document.getElementById("r_title").value;
	var author="";
	if(document.getElementById("r_hc").checked==true) author="hc";
	if(document.getElementById("r_yn").checked==true) author="yn";
	var type = document.getElementById("r_type").value;
	var content = document.getElementById("r_content").value;
	var jsonroad={title:title,author:author,type:type,content:content};
	$.ajax({
		type: "post",
		url:"/api/monroad",
		dataType:"json",
		data:jsonroad,
		error: function() {
			alert("发表失败。。。");
		},
		success: function(result) {
			if (result[0].result == "success") {
				alert("发表成功。。。");
				localUrlOnroad();
 			}
			else {
				alert("发表失败。。。");
				localUrlManger();
			}
		}
	});

}
//  data
function req(moudle,callback){
	$.ajax({
		type: "post",
		url: "/api/mdatamoudle",
		dataType: "json",
		data: {coll:moudle},
		error: function () {
			alert("数据加载失败。。。");
		},
		success: function (result) {
			callback(result);
		}
	});
}
//选择模块
function showMoudle(val,sort){
	$("#data .d-whisper").css("display","none");
	$("#data .d-life").css("display","none");
	$("#data .d-road").css("display","none");
	$("#data .d-blog").css("display","none");
	$("#data .d-user").css("display","none");
	var moudle=val;
	$("#data .d-"+val).css("display","block");
	req(moudle,function(res){
		if(sort=="up")
		addDoc(res.reverse().slice(0,5),moudle);
		else
			addDoc(res.slice(0,5),moudle);
	});
}
//排序
function showSort(val){
	var moudle=document.getElementById("moudle").value;
	if(moudle=="null"){
		alert("请选择要查询的模块。。。");
	}else{
		showMoudle(moudle,val);
	}
}
//上一页
function pre(obj){
	var val=document.getElementById("moudle").value;
	if(val!="null"){
	var pre=document.getElementById(obj.id);
	var net=document.getElementById(obj.id).nextElementSibling;
	req(val,function(data){
		if(parseInt(pre.id)>0){
			pre.setAttribute("id",parseInt(pre.id)-5);
			net.setAttribute("id",parseInt(net.id)-5);
			addDoc(data.reverse().slice(parseInt(pre.id),parseInt(net.id)),val);
		}else{
			alert("已经是第一页啦。。。");
		}
	});
	}
	else{
		alert("请先选择模块。。。");
	}
}
//下一页
function next(obj){
	var val=document.getElementById("moudle").value;
	if(val!="null") {
		var pre = document.getElementById(obj.id).previousElementSibling;
		var net = document.getElementById(obj.id);
		req(val, function (data) {
			if (parseInt(net.id) < data.length) {
				pre.setAttribute("id", parseInt(pre.id) + 5);
				net.setAttribute("id", parseInt(net.id) + 5);
				addDoc(data.reverse().slice(parseInt(pre.id), parseInt(net.id)), val);
			} else {
				alert("已经是最后一页啦。。。");
			}
		});
	}else {
		alert("请先选择模块。。。");
	}
}

//刷新
function refresh(){
	var moudle=document.getElementById("moudle").value;
	if(moudle=="null"){
        alert("请先选择模块。。。");
	} else {
		req(moudle, function (res) {
			addDoc(res.reverse().slice(0, 5), moudle);
		});
	}
}

//添加显示
function addDoc(res,moudle) {
	switch (moudle){
		case "whisper":
			var m=moudle.slice(0,1);
			var list=document.getElementById("d-"+m+"-list").innerHTML="";
			for (var i in res) {
				$("#d-"+moudle+" .d-"+m+"-list").append("<div class='d-"+m+"-doc'>"+
					"<div class='d-"+m+"-doc_i'>"+res[i]['_id']+"</div>"+
					"<div class='d-"+m+"-doc_u'>"+res[i]['author']+"</div>"+
					"<div class='d-"+m+"-doc_c' title='"+res[i]['_id']+"' id='"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['content']+"</div>"+
					"<div class='d-"+m+"-doc_t'>"+res[i]['time']+"</div>"+
					"<div class='d-"+m+"-doc_e'> <button name='"+res[i]['_id']+"' onclick='update(this)'>修改</button>"+
					"<button name='"+res[i]['_id']+"' onclick='del(this)'>删除</button> </div> </div>");
			}
			break;
		case "life":
			var m=moudle.slice(0,1);
			var list=document.getElementById("d-"+m+"-list").innerHTML="";
			for (var i in res) {
				$("#d-"+moudle+" .d-"+m+"-list").append("<div class='d-"+m+"-doc'>"+
					"<div class='d-"+m+"-doc_i'>"+res[i]['_id']+"</div>"+
					"<div class='d-"+m+"-doc_tl' title='t"+res[i]['_id']+"' id='t"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['title']+"</div>"+
					"<div class='d-"+m+"-doc_u'>"+res[i]['author']+"</div>"+
					"<div class='d-"+m+"-doc_ty'>"+res[i]['type']+"</div>"+
					"<div class='d-"+m+"-doc_c' title='"+res[i]['_id']+"' id='"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['content']+"</div>"+
					"<div class='d-"+m+"-doc_t'>"+res[i]['time']+"</div>"+
					"<div class='d-"+m+"-doc_e'> <button name='"+res[i]['_id']+"'onclick='update(this)'>修改</button>"+
					"<button name='"+res[i]['_id']+"' onclick='del(this)'>删除</button> </div> </div>");
			}
			break;
		case "road":
			var m=moudle.slice(0,1);
			var list=document.getElementById("d-"+m+"-list").innerHTML="";
			for (var i in res) {
				$("#d-"+moudle+" .d-"+m+"-list").append("<div class='d-"+m+"-doc'>"+
					"<div class='d-"+m+"-doc_i'>"+res[i]['_id']+"</div>"+
					"<div class='d-"+m+"-doc_tl' title='t"+res[i]['_id']+"' id='t"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['title']+"</div>"+
					"<div class='d-"+m+"-doc_u'>"+res[i]['author']+"</div>"+
					"<div class='d-"+m+"-doc_ty'>"+res[i]['type']+"</div>"+
					"<div class='d-"+m+"-doc_c' title='"+res[i]['_id']+"' id='"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['content']+"</div>"+
					"<div class='d-"+m+"-doc_t'>"+res[i]['time']+"</div>"+
					"<div class='d-"+m+"-doc_e'> <button name='"+res[i]['_id']+"'onclick='update(this)'>修改</button>"+
					"<button name='"+res[i]['_id']+"' onclick='del(this)'>删除</button> </div> </div>");
			}
			break;
		case "blog":
			var m=moudle.slice(0,1);
			var list=document.getElementById("d-"+m+"-list").innerHTML="";
			for (var i in res) {
				$("#d-"+moudle+" .d-"+m+"-list").append("<div class='d-"+m+"-doc'>"+
					"<div class='d-"+m+"-doc_i'>"+res[i]['_id']+"</div>"+
					"<div class='d-"+m+"-doc_u'>"+res[i]['username']+"</div>"+
					"<div class='d-"+m+"-doc_c' title='"+res[i]['_id']+"' id='"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['message']+"</div>"+
					"<div class='d-"+m+"-doc_t'>"+res[i]['time']+"</div>"+
					"<div class='d-"+m+"-doc_e'> <button name='"+res[i]['_id']+"'onclick='update(this)'>修改</button>"+
					"<button name='"+res[i]['_id']+"' onclick='del(this)'>删除</button> </div> </div>");
			}
			break;
		case "user":
			var m=moudle.slice(0,1);
			var list=document.getElementById("d-"+m+"-list").innerHTML="";
			for (var i in res) {
				var time=res[i]['_id'].slice(0,4)+"年"+res[i]['_id'].slice(4,6)+"月"+res[i]['_id'].slice(6,8)+"日"+res[i]['_id'].slice(8,10)+"时"
					+res[i]['_id'].slice(10,12)+"分"+res[i]['_id'].slice(12,14)+"秒";
				$("#d-"+moudle+" .d-"+m+"-list").append("<div class='d-"+m+"-doc'>"+
					"<div class='d-"+m+"-doc_i'>"+res[i]['_id']+"</div>"+
					"<div class='d-"+m+"-doc_u' title='u"+res[i]['_id']+"' id='u"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['name']+"</div>"+
					"<div class='d-"+m+"-doc_p' title='p"+res[i]['_id']+"' id='p"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['password']+"</div>"+
					"<div class='d-"+m+"-doc_e' title='e"+res[i]['_id']+"' id='e"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['email']+"</div>"+
					"<div class='d-"+m+"-doc_ph' title='ph"+res[i]['_id']+"' id='ph"+res[i]['_id']+"' ondblclick='edit(this)'>"+res[i]['phone']+"</div>"+
					"<div class='d-"+m+"-doc_t'>"+time+"</div>"+
					"<div class='d-"+m+"-doc_f'>"+res[i]['flag']+"</div>"+
					"<div class='d-"+m+"-doc_a'> <button name='"+res[i]['_id']+"'onclick='update(this)'>修改</button>"+
					"<button name='"+res[i]['_id']+"' onclick='del(this)'>删除</button> </div> </div>");
			}
			break;
		default :break;
	}
}
//双击编辑
function edit(obj){
	var con=document.getElementById(obj.title);
	var last=con.innerHTML.toString();
	con.innerHTML="<textarea>"+last+"</textarea>";
	con.setAttribute("ondblclick","save(this)");

}
//保存
function save(obj){
	var con=document.getElementById(obj.title);
	var least=$("#"+obj.title+" textarea").val();
	con.innerHTML=least;
	con.setAttribute("ondblclick","edit(this)");
}
//修改
function update(obj){
	var moudle=document.getElementById("moudle").value;
	var id=obj.name;
	var data=newData(moudle,id);
 	$.ajax({
		type: "post",
		url: "/api/mdataupdate",
		dataType: "json",
		data: data,
		error: function () {
			alert("操作失败。。。");
		},
		success: function (result) {
			if(result=="success"){
				req(moudle,function(){
					alert("更新成功。。。");
				});
			}
			else {
				req(moudle, function () {
					alert("更新失败。。。");
				});
			}
		}
	});
}
//删除
function del(obj){
	var moudle=document.getElementById("moudle").value;
    var id=obj.name;
	$.ajax({
		type: "post",
		url: "/api/mdatadel",
		dataType: "json",
		data: {moudle:moudle,id:id},
		error: function () {
			alert("操作失败。。。");
		},
		success: function (result) {
			if(result=="success"){
				req(moudle,function(){
					alert("删除成功。。。");
				});
			}
			else{
				req(moudle,function(){
					alert("删除失败。。。");
				});
			}
		}
	});
}
//数据整理
function newData(moudle,id){
	if(moudle=="whisper"){
		if($("#"+id).find('textarea').length == 0) {
			var content = document.getElementById(id).innerHTML;
			return {moudle: moudle, id: id, content: content}
		}else{
			alert("请先双击输入框进行保存。。。");
		}

	}else if(moudle=="life"){
		if($("#"+id).find('textarea').length == 0&&$("#t"+id).find('textarea').length == 0) {
			var title= document.getElementById("t"+id).innerHTML;
			var content= document.getElementById(id).innerHTML;
			return {moudle: moudle, id: id, title: title, content: content}
		}else{
			alert("请先双击输入框进行保存。。。");
		}
	}else if(moudle=="road"){
		if($("#"+id).find('textarea').length == 0 && $("#t"+id).find('textarea').length == 0) {
			var title= document.getElementById("t"+id).innerHTML;
			var content= document.getElementById(id).innerHTML;
			return {moudle: moudle, id: id, title: title, content: content}
		}else{
			alert("请先双击输入框进行保存。。。");
		}
	}else if(moudle=="blog"){
			if($("#"+id).find('textarea').length == 0) {
				var content = document.getElementById(id).innerHTML;
				return {moudle: moudle, id: id, message: content}
			}else{
				alert("请先双击输入框进行保存。。。");
			}
	}else if(moudle=="user"){
		if($("#"+id).find('textarea').length == 0) {
			var user = document.getElementById("u"+id).innerHTML;
			var password = document.getElementById("p"+id).innerHTML;
			var email = document.getElementById("e"+id).innerHTML;
			var phone = document.getElementById("ph"+id).innerHTML;
			return {moudle: moudle, id: id, name: user,password:password,email:email,phone:phone}
		}else{
			alert("请先双击输入框进行保存。。。");
		}
	}
}

//创建时间字符串
//function createStringTime(time){
//	var year=time.getFullYear()+"";
//	var mounth=time.getMonth()+1;
//	if(mounth<10) mounth="0"+mounth;
//	var date=time.getDate();
//	if(date<10) date="0"+date;
//	var hour=time.getHours()+00+"";
//	if(hour<10) hour="0"+hour;
//	var minutes=time.getMinutes();
//	if(minutes<10) minutes="0"+minutes;
//	var seconds=time.getSeconds();
//	if(seconds<10) seconds="0"+seconds;
//	return year+mounth+""+date+""+hour+""+minutes+""+seconds+"";
//}