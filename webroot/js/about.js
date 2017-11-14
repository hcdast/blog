
//相册
function change(obj){
	var imgnum=1;
	var id=obj.id;
	if(id=="yn"){
		imgnum=parseInt(Math.random()*7)+1;
		document.getElementById(id).setAttribute("src","about/yn"+imgnum+".jpg");
	}else if(id=="hc"){
		imgnum=parseInt(Math.random()*8)+1;
		document.getElementById(id).setAttribute("src","about/hc"+imgnum+".jpg");
	}else if(id=="hy"){
		imgnum=parseInt(Math.random()*8)+1;
		document.getElementById(id).setAttribute("src","about/hy"+imgnum+".jpg");
	}
}