/**
 * Created by hc on 2017/9/8.
 */
var code;
var flag=false;
//初始化验证码  登录  注册
function init(){
	var l_checkCode = document.getElementById("l_checkCode");
	var r_checkCode = document.getElementById("r_checkCode");
	code=createCode();
	l_checkCode.setAttribute("value",code);
	r_checkCode.setAttribute("value",code);
}

//生成验证码
function createCode() {
	code = "";
	var codeLength = 6; //验证码的长度
	var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
		'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //�?有�?��?�组成验证码的字符，当然也可以用中文�?
	for(var i = 0; i < codeLength; i++)
	{
		var charNum = Math.floor(Math.random() * 52);
		code += codeChars[charNum];
	}
	return code;
}

//登录检测
function login (){
	var inputCode = $(".ipt_vry").val();
	if (inputCode.length <= 0) {
		alert("请输入验证码");
	}
	else if (inputCode.toUpperCase() != code.toUpperCase()) {
		alert("验证码输入有误！");
		init();
	}else {
		var user = document.getElementById("user").value;
		var psd = document.getElementById("psd").value;
		var datajson = {name: user, password: psd};
		$.ajax({
			type: "post",
			url: "/api/index",
			dataType: "json",
			data: datajson,
			error: function () {
				alert("登陆失败。。。");
				init();
			},
			success: function (result) {
				if (result.statu=="success") {
					setCookie(user,psd,1,function(){
						alert("登陆成功。。。");
						$('.box2').hide();
						localUrlIndex();
					});
				}
				else {
					alert("登陆失败。。。");
					init();
				}
			}
		});
	}

}

//设置cookie
function setCookie(name,value,day,callback) {
	var d = new Date();
	d.setTime(d.getTime() + (day*24*60*60*1000));
	var expires = ";expires="+d.toUTCString();
	document.cookie = name + "=" + escape(value) + expires;
	callback();
}

//清除cookie
function clearCookie(name) {
	setCookie(name, "", -1,function(){
		if(flag){
			localUrlIndex();
			alert("亲爱的【" + name + "】管理员，您已安全退出！欢迎下次登录。。。");
		}else {
			localUrlIndex();
			alert("亲爱的【" + name + "】用户，您已安全退出！欢迎下次登录。。。");
		}
	});
}

//获取cookie
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';'); //把cookie分割成组
	for(var i=0;i < ca.length;i++) {
		var c = ca[i]; //取得字符
		while (c.charAt(0)==' ') { //判断字符串有没有前导空
			c = c.substring(1,c.length); //有的话，从第二位开始取
		}
		if (c.indexOf(nameEQ) == 0) { //如果含有我们要的name
			return unescape(c.substring(nameEQ.length,c.length)); //解码并截取我们要的内容
		}
	}
	return false;
}

//监听状态
function statu(){
	$.ajax({
		type: "post",
		url: "/api/statu",
		dataType: "json",
		error: function () {
		},
		success: function (result) {
			var head=document.getElementById("head");
			var count=0;
			for (var i in result) {
				if (result[i].password == getCookie(result[i].name)) {
					if (head.getAttribute('name') == "f") {
						if(result[i].flag==true){
							head.innerHTML += "<a href='../manger.html'>" +
								"管理页面</a> <button class='login'  onclick='exit(this)' name='" + result[i].name + "' >退出</button>";
							head.setAttribute('name', 't');
							flag=true;
						}else{
							head.innerHTML += "<a href='../index.html'>" +
								"您好！"+result[i].name+"</a><button class='login'  onclick='exit(this)' name='" + result[i].name + "' >退出</button>";
							head.setAttribute('name', 't');
						}
					}
				}
				else count++;
			}
			if(count==result.length){
				head.innerHTML += "<a href='../index.html'>您好！游客。请</a><button class='login' onclick='show()'>登陆</button>";
			}
		}
	});
}

//退出登录状态
function exit(obj){
	var head=document.getElementById("head");
	var name=obj.name;
	head.setAttribute('name', 'f');
	clearCookie(name);
}

function show(){
	var btn_login=document.getElementById("login");
	btn_login.style.display='block';
	init();
}
//找回密码
function getPassword(){

}
//进入注册页面
function userRegist(){
	var btn_login=document.getElementById("login");
	var btn_regist=document.getElementById("regist");
	btn_login.style.display='none';
	btn_regist.style.display='block';
}
//注册
function regist(){
	var inputCode = $(".regist5left1 .ipt_vry").val();
	if (inputCode.length <= 0) {
		alert("请输入验证码");
	}
	else if (inputCode.toUpperCase() != code.toUpperCase()) {
		alert("验证码输入有误！");
		init();
	}else {
		var user = document.getElementById("username").value;
		var psd = document.getElementById("password").value;
		var email = document.getElementById("email").value;
		var phone = document.getElementById("phone").value;
		var emailFormat=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
		var emailMate=emailFormat.test(email);
		var phoneFormat=/^1[34578]\d{9}$/;
		var phoneMate=phoneFormat.test(phone);
		if(user==""||psd==""||email==""||phone==""){
            alert("对不起!您的信息不完整。。。");
		} else if(!emailMate){
			alert("邮箱错误。。。");
		} else if(!phoneMate){
			alert("手机号错误。。。");
		}else{
			datajson={name:user,password:psd,email:email,phone:phone};
			$.ajax({
				type: "post",
				url: "/api/regist",
				dataType: "json",
				data: datajson,
				error: function () {
					alert("注册失败。。。");
					init();
				},
				success: function (result) {
					alert(result.res);
					$('.box2').hide();
				}
			});
		}
	}

}



