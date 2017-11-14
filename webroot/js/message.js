var pointNum=0;
statu();
document.onkeypress = showKeyPress;
//上一页  事件监听
function initPrewPage() {
    var prewname=document.getElementById("prew").getAttribute("name");
    var nextname=document.getElementById("next").getAttribute("name");
    var messagelist=document.getElementById("messagelist");
    $.ajax({
        type: "get",
        url:"/api/message.html",
        dataType:"json",
        success: function(result) {
            if (parseInt(prewname) > 1) {
                document.getElementById("messagelist").innerHTML = '';
                document.getElementById("prew").setAttribute("name", parseInt(prewname) - 6 + "");
                document.getElementById("next").setAttribute("name", parseInt(nextname) - 6 + "");
                for (var i = prewname - 6; i < prewname; i++) {
                    messagelist.innerHTML += "<li class='li_btn'  onclick='activePageButton(this)' id='" + parseInt(i) + "'>" + parseInt(i) + "</li>";
                }
                var data = result.reverse().slice(5 * (prewname - 7), 5 * (prewname - 7) + 5);
                addMessage(data);
            }
        }
    });
}
//下一页  事件监听
function initNextPage(){
    var datacount=0;
    var prewname=document.getElementById("prew").getAttribute("name");
    var nextname=document.getElementById("next").getAttribute("name");
    var messagelist=document.getElementById("messagelist");
    $.ajax({
        type: "get",
        url:"/api/message.html",
        dataType:"json",
        success: function(result) {
            datacount=result.length;
            var pagecount=Math.ceil(datacount/5);
            if(pagecount>parseInt(nextname)){
                document.getElementById("messagelist").innerHTML='';
                document.getElementById("prew").setAttribute("name",parseInt(prewname)+6+"");
                document.getElementById("next").setAttribute("name",parseInt(nextname)+6+"");
                for(var i=nextname;i<pagecount&&i<nextname+6;i++){
                    messagelist.innerHTML+="<li class='li_btn'  onclick='activePageButton(this)' id='"+(parseInt(i)+1)+"'>"+(parseInt(i)+1)+"</li>";}
                var data=result.reverse().slice(5*nextname,5*nextname+5);
                addMessage(data);
            }
        }
    });
}
//校验留言
function send(){
    if(user!=null){
         var msg = UE.getEditor('editor').getContent().slice(3,-4);
        if(msg==""){
            alert("内容不能为空。。。");
        }
        else {
            var data = {username: user, message: msg};
            sendmessage(data);
        }
    }
    else{
        alert("抱歉！您还没有登录。快去登录吧。。。");
        localUrlIndex();
     }
}
//提交留言并给前端传送数据
function sendmessage(data){
    $.ajax({
        type: "post",
        url:"/api/message",
        dataType:"json",
        data:data,
        error: function() {
            alert("抱歉！您本次留言失败。。。");
        },
        success: function(result) {
            addMessage(result.reverse().slice(0, 5));
            localUrlMessage();
        }
    });
};
//显示留言
function addMessage(result){
    var allmessage=document.getElementById("allmessage");
    var message=document.getElementById("message");
    allmessage.removeChild(message);
    $("#allmessage").append("<div class='visitors'"+ "id='message'> </div>");
    //result是一个集合,所以需要先遍历
    $.each(result,function(index,obj){
        var imgurl=parseInt(Math.random()*30+1);
        $("#message").append("<dl>"+//获得图片地址
            "<dt><img src='../message/s"+imgurl+".jpg'/></dt>"+
                //获得名字
            "<dd class='user'><a href='/' style='color: darkorange; font-size: 18px'>"+obj['username']+"</a> </dd>"+
                //获得留言
            "<dd>"+obj['message']+"</dd>"+
                //获得时间
            "<dd class='user'>发表于："+obj['time']+"</dd>"+
            "<div id='r"+obj['_id']+"' class='reply'></div>" +
            "<div class='act'><i class='fa fa-flag' aria-hidden='true'><a id='"+obj['_id']+"report' name='"+obj['_id']+"' onclick='act(this)'>举报【"+obj['report']+"】</a></i>" +
            "<i class='fa fa-comment-o fa-1x' aria-hidden='true'><a id='reply"+obj['_id']+"' name='"+obj['_id']+"' onclick='reply(this)'>回复</a></i>" +
            "<i class='fa fa-thumbs-o-down' aria-hidden='true'><a id='"+obj['_id']+"pit' name='"+obj['_id']+"' onclick='act(this)'>坑【"+obj['pit']+"】</a></i>" +
            "<i class='fa fa-thumbs-o-up ' aria-hidden='true'><a id='"+obj['_id']+"praise' name='"+obj['_id']+"' onclick='act(this)'>赞【"+obj['praise']+"】</a></i>" +
            "<i class='fa fa-comments' aria-hidden='true'><a id='open"+obj['_id']+"' name='"+obj['_id']+"'onclick='openRel(this)'>所有回复</a></i></div>" +
            "<div id='"+obj['_id']+"'></div>" +
            "</dl>");
    });
}
//操作  举报  赞  坑
function act(obj){
    if(pointNum<1) {
        var id = obj.name;
        var act = obj.id.substring(14);
        var reportJson = {_id: id, doc: act, coll: "blog"};
        $.ajax({
            type: "post",
            url: "/api/act",
            dataType: "json",
            data: reportJson,
            error: function () {
            },
            success: function (result) {
            }
        });
        var changeC = document.getElementById(obj.id);
        var num = changeC.innerHTML;
        if (act == "report") {
            var acount = parseInt(num.slice(3, -1)) + 1;
            changeC.innerHTML = "举报【" + acount + "】";
            changeC.style.color = "maroon";
            changeC.parentNode.style.color = "maroon";
        }
        if (act == "pit") {
            var acount = parseInt(num.slice(2, -1)) + 1;
            changeC.innerHTML = "坑【" + acount + "】";
            changeC.style.color = "maroon";
            changeC.parentNode.style.color = "maroon";
        }
        if (act == "praise") {
            var acount = parseInt(num.slice(2, -1)) + 1;
            changeC.innerHTML = "赞【" + acount + "】";
            changeC.style.color = "maroon";
            changeC.parentNode.style.color = "maroon";
        }
        pointNum+=1;
    }
    else{
        alert("只能评价一次哦。。。");
    }

}

//打开 回复框
function reply(obj){
    var rel=document.getElementById("reply"+obj.name);
    rel.setAttribute("onclick","reset(this)");
    rel.innerHTML="撤销回复";
    var addtbl= document.getElementById(obj.name);
    //回复框
    addtbl.innerHTML+="<div class='table' id='tb"+obj.name+"'>" +
        "<textarea name='rpl' id='rpl"+obj.name+"' placeholder='"+"既然来了，就说几句吧"+"'></textarea></div>" +
        "<div class='btn'><button name='btn"+obj.name+"' onclick='submit(this)'>尽情畅言</button></div>";
    //设置回复显示
    //document.getElementById('tb'+obj.name).style.display='block';
    //将回复留言的ID传给table的name属性
    //document.getElementById("tb"+obj.name).setAttribute("name",obj.name);

}
//关闭 回复框
function reset(obj){
    var rel=document.getElementById("reply"+obj.name);
    rel.setAttribute("onclick","reply(this)");
    rel.innerHTML="回复";
    //设置回复隐藏
    //document.getElementById('tb'+obj.name).style.display='none';
    //删除回复框
    var addtbl= document.getElementById(obj.name);
    //回复框
    addtbl.innerHTML="";
}
//提交回复
function submit(obj) {
    if (user!=null) {
        var relid=obj.name.slice(3);
        var rplcontnent = document.getElementById('rpl'+relid);
        if (rplcontnent.value == "") {
            alert("不能为空哦。。。");
        }
        else {
            var date = new Date();
            var time = date.getFullYear() + "年" + date.getMonth() + "月" + date.getDate() + "日 " + date.getHours() + ":" + date.getMinutes();
            var rpljson = {_id: relid,user:user, time: time, content: rplcontnent.value};
            $.ajax({
                type: "post",
                url: "/api/reply",
                dataType: "json",
                data: rpljson,
                error: function () {
                },
                success: function (result) {
                }
            });
            var obj={name:relid};
            openRel(obj);
            rplcontnent.value='';
        }
    }
    else {
        alert("抱歉！您还没有登录。快去登录吧。。。");
        localUrlIndex();
    }
}

//打开留言回复列表
function openRel(obj){
    var change=document.getElementById("open"+obj.name);
    change.innerHTML="收起回复";
    change.setAttribute("onclick","closeRel(this)");
    var jsondata={id:obj.name};
    $.ajax({
        type: "post",
        url: "/api/replylist",
        dataType: "json",
        data:jsondata,
        timeout: 3000,
        error: function () {
        },
        success: function (result) {
            var rpl= document.getElementById("r"+obj.name);
            for (var i in result[0].reply.reverse()) {
                rpl.innerHTML += "<dl> "+
                    " <dt><img src='../message/r1.jpg'></dt>" +
                    "<p class='user'>"+result[0].reply[i].user+"</p>" +
                    "<dd>" + result[0].reply[i].content + "</dd>" +
                    "<p class='time'>回复于：" + result[0].reply[i].time + "</p></dl>";
            }
        }
    });
}
//关闭留言回复列表
function closeRel(obj){
    var change=document.getElementById("open"+obj.name);
    change.innerHTML="查看回复";
    change.setAttribute("onclick","openRel(this)");
    var addrpl= document.getElementById("r"+obj.name).innerHTML="";
}
//监听按键  编码
function showKeyPress(evt) {
    evt = (evt) ? evt : window.event;
    return checkSpecificKey(evt.keyCode);
}
//匹配禁止编码
function checkSpecificKey(keyCode) {
    var specialKey = "<>'/$&#";
    var realkey = String.fromCharCode(keyCode);
    var flg = false;
    flg = (specialKey.indexOf(realkey) >= 0);
    if (flg) {
        alert('请勿输入特殊字符: ' + realkey);
        return false;
    }else{
        return true;
    }
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
             for (var i in result) {
                if (result[i].password == getCookie(result[i].name)) {
                       user= result[i].name;
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