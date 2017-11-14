    var acount=0;
	function flushRoad() {
		$.ajax({
			type: "get",
			url: "/api/ontheroad.html",
			dataType: "json",
			success: function (result) {
				addRoad( result.reverse().slice(0, 5));
				addNew(result.slice(0, 10));
			}
		});
	}

	function flushHot(){
		$.ajax({
			type: "get",
			url: "/api/flushhot",
			dataType: "json",
			success: function (result) {
				var res = result.reverse().slice(0, 10);
				addHot(res);
			}
		});
	}

	function moreRoad() {
		var num = parseInt(document.getElementById("list").getAttribute("name"));
		$.ajax({
			type: "get",
			url: "/api/ontheroad.html",
			dataType: "json",
			success: function (result) {
				if (num < result.length) {
					var res = result.reverse().slice(num, num + 5);
					document.getElementById('list').setAttribute('name', num + 5 + "");
					addRoad(res);
				}
				else {
					alert("没有更多啦。。。");
				}
			}
		});

	}

	function addRoad(result){
		var list=document.getElementById("list");
		for(var i in result) {
			var imgurl=parseInt(Math.random()*20)+1;
			list.innerHTML +="<div class='message'><ul>" +
				"<p class='title'><b>"+result[i]['title']+"</b></p>" +
				"<p class='time'><b>发布时间："+result[i]['time']+"&nbsp&nbsp&nbsp作者：【"+result[i]['author']+"】&nbsp&nbsp&nbsp分类："+result[i]['type']+"&nbsp&nbsp&nbsp点击人数：【"+result[i]['clicknum']+"】</b></p>" +
				"<div class='img'>  <img src='../road/m"+imgurl+".jpg'/></div>" +
				"<div class='wd'><p class='word'>"+result[i]['content']+"</p>" +
				"<a href='roadpage/"+result[i]['path'] +"' name='"+result[i]['_id']+"' onclick='clickCount(this)'><<阅读全文>></a>" +
				"</div><div class='act'>" +
				"<i class='fa fa-comment-o' aria-hidden='true'><a href='roadpage/"+result[i]['path']+"'>评论("+result[i]['comments'].length+")</a></i>" +
				"<i class='fa fa-eye' aria-hidden='true'><a  href='roadpage/"+result[i]['path']+"' >浏览("+result[i]['clicknum']+")</a></i>" +
				"<i class='fa fa-thumbs-o-up' aria-hidden='true'><a id='"+result[i]['_id']+"' name='praise' onclick='act(this)'>赞("+result[i]['praise']+")</a></i></div>" +
				"<div class='abount'></div></ul></div>";
		}
	}
	//点赞
	function act (obj){
		if(acount<1) {
			var id = obj.id;
			var doc = obj.name;
			var actJson = {_id: id, doc: doc, coll: "road"};
			$.ajax({
				type: "post",
				url: "/api/act",
				dataType: "json",
				data: actJson,
				success: function (result) {

				}
			});
            var changeC=document.getElementById(id);
            var num = parseInt(changeC.innerHTML.slice(2, -1)) + 1;
            changeC.innerHTML = "赞(" + num + ")";
            changeC.style.color = "orangered";
            changeC.parentNode.style.color = "orangered";
            acount+=1;

		}else{
			alert("不能重复点击哦。。。");
		}

	}


	function clickCount(obj){
		var id=obj.name;
		$.ajax({
			type: "post",
			url: "/api/roadhot",
			dataType: "json",
			data:{_id:id},
			success: function (result) {
			}
		});
	}

	function addHot(res){
		var hotlist=document.getElementById("hotlist");
		hotlist.innerHTML="";
		for(var i in res){
			var x=parseInt(i)+1;
			if(i==0){
				hotlist.innerHTML+="<li class='first'><a href='../roadpage/"+res[i]['path']+"'>"+x+"&nbsp"+res[i]['title']+"</a></li>";
			}else if(i==1){
				hotlist.innerHTML+="<li class='seconed'><a href='../roadpage/"+res[i]['path']+"'>"+x+"&nbsp"+res[i]['title']+"</a></li>";

			}else if(i==2){
				hotlist.innerHTML+="<li class='third'><a href='../roadpage/"+res[i]['path']+"'>"+x+"&nbsp"+res[i]['title']+"</a></li>";

			}else{
				hotlist.innerHTML+="<li><a href='../roadpage/"+res[i]['path']+"' name='"+res[i]['_id']+"' onclick='clickCount(this)'>"+x+"&nbsp"+res[i]['title']+"</a></li>";

			}
		}
	}

	function addNew(res){
		var newlist=document.getElementById("newlist");
		newlist.innerHTML="";
		for(var i in res){
			var x=parseInt(i)+1;
			if(i==0){
				newlist.innerHTML+="<li class='first'><a href='../roadpage/"+res[i]['path']+"'>"+x+"&nbsp"+res[i]['title']+"</a></li>";
			}else if(i==1){
				newlist.innerHTML+="<li class='seconed'><a href='../roadpage/"+res[i]['path']+"'>"+x+"&nbsp"+res[i]['title']+"</a></li>";

			}else if(i==2){
				newlist.innerHTML+="<li class='third'><a href='../roadpage/"+res[i]['path']+"'>"+x+"&nbsp"+res[i]['title']+"</a></li>";

			}else{
				newlist.innerHTML+="<li><a href='../roadpage/"+res[i]['path']+"' name='"+res[i]['_id']+"' onclick='clickCount(this)'>"+x+"&nbsp"+res[i]['title']+" </a></li>";

			}
		}
	}


