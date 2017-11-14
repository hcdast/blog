/**
 * Created by hcdast on 2017/10/18.
 */
//获取或刷新 road 栏目
function flushNew() {
    $.ajax({
        type: "get",
        url: "/api/ontheroad.html",
        dataType: "json",
        success: function (result) {
            addNew(result.reverse().slice(0, 10));
        }
    });
}

//数据获取
function getData(){
        var dataId = getQueryString("id");
        if (dataId != null && dataId.toString().length > 1) {
            var id = dataId;
            var coll = "road";
            var roadpageJson = {id: id, coll: coll};
            $.ajax({
                type: "post",
                url: "/api/getRoadPageData",
                data: roadpageJson,
                dataType: "json",
                success: function (result) {
                    addPageData(result);
                }
            });
        }
        else
            alert("参数为空！查找不到相关数据。。。");

}

function addPageData(data){
    var commentsdata=data.comments;
    var replysdata=data.replys;
    var info=document.getElementById("info");
    var up=document.getElementById("up");
    var down=document.getElementById("down");
    info.innerHTML="<p class='time'>" +
        "<b>发布时间："+data.time+"&nbsp&nbsp&nbsp" +
        "作者：【"+data.author+"】&nbsp&nbsp&nbsp" +
        "分类："+data.type+"&nbsp&nbsp&nbsp" +
        "点击人数：【"+data.clicknum+"】</b></p>";
    up.innerHTML+="<a href='../roadpage/"+data.uppath+"'>"+data.uptitle+"</a>";
    down.innerHTML+="<a href='../roadpage/"+data.downpath+"'>"+data.downtitle+"</a>";
    addCommentsData(commentsdata.reverse(),replysdata);
 }

function addCommentsData(commentsdata,replysdata){
    var userlist=document.getElementById("user-list");
    userlist.innerHTML="";
    //评论
    for(var i in commentsdata){
        userlist.innerHTML+=" <dl>"+
            "<dt class='img'><img src='../message/s1.jpg'/></dt>"+
            "<dd class='user'>"+
            "<a href=''>"+commentsdata[i].user+"</a>"+
            "</dd>"+
            "<dd class='time'><p>"+commentsdata[i].time+"</p></dd>"+
            "<dd class='review'><p>"+commentsdata[i].content+"</p></dd>"+
            "<div class='reply-list' id='reply"+commentsdata[i].userId+"list'>"+
            "</div>"+
            "<div class='act'>"+
            "<i class='fa fa-flag' aria-hidden='true'>"+
            "<a id='report"+commentsdata[i].userId+"' name='"+commentsdata[i].userId+"' onclick='commentsAct(this)'>举报【"+commentsdata[i].report+"】</a></i>"+
            "<i class='fa fa-comment-o fa-1x' aria-hidden='true'>"+
            "<a id='reply"+commentsdata[i].userId+"' name='"+commentsdata[i].userId+"' onclick='reply(this)'>回复</a></i>"+
            "<i class='fa fa-thumbs-o-down' aria-hidden='true'>"+
            "<a id='pit"+commentsdata[i].userId+"' name='"+commentsdata[i].userId+"' onclick='commentsAct(this)'>坑【"+commentsdata[i].pit+"】</a></i>"+
            "<i class='fa fa-thumbs-o-up' aria-hidden='true'>"+
            "<a id='praise"+commentsdata[i].userId+"' name='"+commentsdata[i].userId+"' onclick='commentsAct(this)'>赞【"+commentsdata[i].praise+"】</a></i>"+
            "</div>"+
            "<div class='comments-input' id='reply"+commentsdata[i].userId+"input'>"+
            "</div>"+
            "</dl>";

        for(var x in replysdata) {
            if (replysdata[x].replyuserid==commentsdata[i].userId) {
                addReplysData(replysdata[x]);
            }
        }
    }

}
function addReplysData(replydata){
    var replylist=document.getElementById("reply"+replydata.replyuserid+"list");
    //回复
    replylist.innerHTML+=" <div class='u-reply'>"+
                        "<dt class='r-img'><img src='../message/s1.jpg'/></dt>"+
                        "<dd class='r-user'><a href=''>"+replydata.user+"</a></dd>"+
                        "<dd class='r-time'><p>"+replydata.time+"</p></dd>"+
                        "<dd class='r-review'><p>"+replydata.replyuserdata+"</p></dd>"+
                        "</div>";
}
//发表评论
function publish(){
    if(user!=null) {
        var dataId=getQueryString("id");
        if(dataId !=null && dataId.toString().length>1)
        {   var date=new Date();
            var id=dataId;
            var userid=setUserId(user);
            var coll="road";
            var data=document.getElementById("comCon").value;
            var time = date.getFullYear() + "年" + (date.getMonth()+1)+"月" + date.getDate() + "日 " + date.getHours() + ":" + date.getMinutes();
            var roadpageJson={id:id,coll:coll,user:user,userId:userid,content:data,time:time};
            $.ajax({
                type: "post",
                url: "/api/setRoadPageData",
                data:roadpageJson,
                dataType:"json",
                success: function (result) {
                    addCommentsData(result[0].comments.reverse(),result[0].replys);
                    document.getElementById("comCon").value = '';
                }
            });
        }
        else {
            alert("参数为空！查找不到相关数据。。。");
        }
    }else{
        alert("您还没登录！快去登录吧。。");
        localUrlIndex();
    }
}
//打开回复
function reply(obj){
    if(user!=null) {
        var replyUserId=obj.name;
        var replyinput=document.getElementById("reply"+replyUserId+"input");
        var changeRrply=document.getElementById("reply"+replyUserId);
        changeRrply.innerHTML="撤销回复";
        changeRrply.setAttribute("onclick","reset(this)");
        changeRrply.parentNode.style.color="orangered";
        replyinput.innerHTML="<textarea id='"+replyUserId+"' placeholder='快对他（她）进行评价吧。。。'></textarea>"+
                             "<button name='"+replyUserId+"' onclick='sendReply(this)'>畅言一下</button>";
    }else{
        alert("您还没登录！快去登录吧。。");
        localUrlIndex();
    }

}
//提交回复
function sendReply(obj){
    var date=new Date();
    var replyUserId=obj.name;
    var time = date.getFullYear() + "年" + (date.getMonth()+1)+"月" + date.getDate() + "日 " + date.getHours() + ":" + date.getMinutes();
    var replyUserData=document.getElementById(replyUserId).value;
    var coll="road";
    var id=getQueryString("id");
    var sendData={id:id,coll:coll,replyuserid:replyUserId,user:user,time:time,replyuserdata:replyUserData}
    $.ajax({
        type: "post",
        url: "/api/roadPageSendReply",
        data:sendData,
        dataType:"json",
        success: function (result) {
            addReplysData(sendData);
            document.getElementById(replyUserId).value="";
        }
    });

}
//关闭回复
function reset(obj){
    var replyUserId=obj.name;
    var replyinput=document.getElementById("reply"+replyUserId+"input");
    var changeRrply=document.getElementById("reply"+replyUserId);
    changeRrply.innerHTML="回复";
    changeRrply.setAttribute("onclick","reply(this)");
    changeRrply.parentNode.style.color="#5d5d5d";
    replyinput.innerHTML="";
}

//获取地址栏参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    else
        return null;
}
//随机生成用户id
function setUserId(user){
    var userId=user;
    for(var i=0;i<6;i++)
    {
        userId+=Math.floor(Math.random()*10);
    }
    return userId;
}

function commentsAct (obj){
    if(acount<1) {
        var roadid=getQueryString('id');
        var id = obj.id;
        var commentsid = obj.name;
        var act=id.replace(commentsid,"");
        var actJson = {roadid: roadid,commentsid:commentsid,act: act, coll: "road"};
        $.ajax({
            type: "post",
            url: "/api/commentsAct",
            dataType: "json",
            data: actJson,
            success: function (result) {
            }
        });
        var changeC=document.getElementById(id);

        if(act=="praise"){
            var num = parseInt(changeC.innerHTML.slice(2, -1)) + 1;
            changeC.innerHTML = "赞【" + num + "】";
        } else if(act=="pit"){
            var num = parseInt(changeC.innerHTML.slice(2, -1)) + 1;
            changeC.innerHTML = "坑【" + num + "】";
        } else if(act=="report"){
            var num = parseInt(changeC.innerHTML.slice(3, -1)) + 1;
            changeC.innerHTML = "举报【" + num + "】";
        }
        changeC.style.color = "orangered";
        changeC.parentNode.style.color = "orangered";
        acount+=1;
    }else{
        alert("不能重复点击哦。。。");
    }

}