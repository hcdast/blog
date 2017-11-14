/**
 * Created by hcdast on 2017/10/21.
 */
var user=null;
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
            for (var i in result) {
                if (result[i].password == getCookie(result[i].name)) {
                    if(result[i].name=="胡陈"||result[i].name=="杨宁"){
                        user= "博主";
                    }
                    else{
                        user= result[i].name;
                    }
                }
            }
        }
    });
}
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
//清除cookie
function clearCookie(name) {
    setCookie(name, "", -1);
}