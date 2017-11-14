
flushLife();

function flushLife(){
 	$.ajax({
		type: "get",
		url:"/api/life.html",
		dataType:"json",
		error: function(result) {
		},
		success: function(result) {
			addLife(result.reverse().slice(0,1));
		}
	});
}

function prewpage(){
	var prewid=document.getElementById("prew").getAttribute("name");
	var nextid=document.getElementById("next").getAttribute("name");
	jQuery.ajax({
		type: "get",
		url:"/api/life.html",
		dataType:"json",
		error: function(result) {
		},
		success: function(result) {
			if (parseInt(prewid) > 0) {
				document.getElementById("prew").setAttribute("name", parseInt(prewid) - 1 + "");
				document.getElementById("next").setAttribute("name", parseInt(nextid) - 1 + "");
				addLife(result.reverse().slice(parseInt(prewid)-1,parseInt(nextid)-1));
			}
		}
	});
}
function nextpage(){
	var prewid=document.getElementById("prew").getAttribute("name");
	var nextid=document.getElementById("next").getAttribute("name");
	jQuery.ajax({
		type: "get",
		url:"/api/life.html",
		dataType:"json",
		error: function(result) {
		},
		success: function(result) {
			if (parseInt(prewid) < result.length-1) {
				document.getElementById("prew").setAttribute("name", parseInt(prewid) + 1 + "");
				document.getElementById("next").setAttribute("name", parseInt(nextid) + 1 + "");
				addLife(result.reverse().slice(parseInt(prewid)+1,parseInt(nextid)+1));
			}
		}
	});
}

function addLife(life){
	var lifelist=document.getElementById("lifelist");
	var urlnum=parseInt(Math.random()*30)+1;
	lifelist.innerHTML="";
	for (var i in life){
		lifelist.innerHTML+="<div class='picture'> " +
			"<img src='../life/t"+urlnum+".jpg'></div>" +
			"<div class='content'>" +
			"<p>"+life[i].title+"</p>" +
			"<p> 作  者："+life[i].author+"</p>" +
			"<p> 发表于："+life[i].time+"</p>" +
			"<figcaption><h1>["+life[i].type+"篇]</h1>"+life[i].content+
			"</figcaption>";
	}
}