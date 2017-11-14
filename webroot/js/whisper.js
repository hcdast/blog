
function flushWhisper(){
    $.ajax({
        type: "get",
        url:"/api/whisper.html",
        dataType:"json",
        success: function(result) {
            var res=result.reverse().slice(0,5);
            addWhisper(res);
        }
    });
}

function moreWhisper() {
    var listnum=parseInt(document.getElementById('allwsp').getAttribute('name'));
    $.ajax({
        type: "get",
        url:"/api/whisper.html",
        dataType:"json",
        success: function(result) {
            if(listnum<result.length) {
                var res = result.reverse().slice(listnum, listnum + 5);
                document.getElementById('allwsp').setAttribute('name', listnum + 5 + "");
                addWhisper(res);
            }
            else{
                alert("没有更多啦。。。");
            }
        }
    });
}

function addWhisper(result){
    var allwhisper=document.getElementById("allwsp");
    for(var i in result) {
        if (result[i]['author'] == "hc") {
            allwhisper.innerHTML += "<div class='about_boy'><span><a href='/'><img src='../whisper/boy.jpg'></a></span>" +
                "<p style='font-size: 16px'>" + result[i]['content'] + "<a href='#'  class='about-time' style='color: darkgreen;font-size: 12px'>[" +
                result[i]['time'] + "]</a></p>";
        } else if (result[i]['author'] == "yn") {
            allwhisper.innerHTML += "<div class='about_girl'><span><a href='/'><img src='../whisper/girl.jpg'></a></span>" +
                "<p style='font-size: 16px'>" + result[i]['content'] + "<a href='#' class='about-time' style='color: darkgreen;font-size: 12px'>[" +
                result[i]['time'] + "]</a></p>";
        }
    }
}
