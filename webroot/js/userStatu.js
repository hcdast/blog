/**
 * Created by hcdast on 2017/10/21.
 */
var user=null;
//����״̬
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
                    if(result[i].name=="����"||result[i].name=="����"){
                        user= "����";
                    }
                    else{
                        user= result[i].name;
                    }
                }
            }
        }
    });
}
//��ȡcookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';'); //��cookie�ָ����
    for(var i=0;i < ca.length;i++) {
        var c = ca[i]; //ȡ���ַ���
        while (c.charAt(0)==' ') { //�ж�һ���ַ�����û��ǰ���ո�
            c = c.substring(1,c.length); //�еĻ����ӵڶ�λ��ʼȡ
        }
        if (c.indexOf(nameEQ) == 0) { //�����������Ҫ��name
            return unescape(c.substring(nameEQ.length,c.length)); //���벢��ȡ����Ҫֵ
        }
    }
    return false;
}
//���cookie
function clearCookie(name) {
    setCookie(name, "", -1);
}