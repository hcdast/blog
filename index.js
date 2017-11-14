/**
 * Created by hc on 2017/9/12.
 */
var restify = require('restify');
var handler = require('./handler');
var ueditor = require('ueditor');
var path = require('path');

var server = restify.createServer();


//get请求
//上传
server.get('api/road/ueditor/ue',ueditor(path.join(__dirname, 'webroot'), function (req, res, next) {
	     console.log("1");
	     console.log(req);

	// ueditor 客户发起上传图片请求
	if (req.query.action == 'uploadimage') {
		console.log("2");
		var foo = req.ueditor;
		//var date = new Date();
		//var imgname = foo.filename;
		var img_url = '/road/upImages';
		res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
		res.setHeader('Content-Type', 'text/html');
	}
}));

server.get('/api/index',handler.index);
server.get('/api/whisper.html',handler.flushWhisper);
server.get('/api/life.html',handler.flushLife);
//ontheroad
server.get('/api/ontheroad.html',handler.flushOntheroad);
server.get('/api/flushhot',handler.flushHot);
//message
server.get('/api/message.html',handler.messageGet);
//检测
server.get('/api/exit',handler.updatestatuF);

//post请求

//登录
server.post('/api/index',handler.index);
//注册
server.post('/api/regist',handler.postRegist);
//whisper
server.post('/api/mwhisper',handler.postWhisper);
//life
server.post('/api/mlife',handler.postLife);
//ontheroad
server.post('/api/roadhot',handler.roadHot);
server.post('/api/monroad',handler.postRoad);
//message
server.post('/api/message',handler.messagePost);
server.post('/api/reply',handler.replyPost);
server.post('/api/replylist',handler.replyList);
//登录状态
server.post('/api/statu',handler.statu);
//后台
server.post('/api/mdatamoudle',handler.mDataMoudle);
server.post('/api/mdatafind',handler.mDataFind);
//后台更新
server.post('/api/mdataupdate',handler.mDataUpdate);
//后台删除
server.post('/api/mdatadel',handler.mDataDel);
//操作  点赞  坑
server.post('/api/act',handler.act);
// 评论操作
server.post('/api/commentsAct',handler.commentsAct);
//roadpage 获取数据
server.post('/api/getRoadPageData',handler.getRoadPageData);
//roadpage 发送数据
server.post('/api/setRoadPageData',handler.setRoadPageData);
//roadpage 发送回复
server.post('/api/roadPageSendReply',handler.roadPageSendReply);



server.listen(4000,'127.0.0.1',function () {
	console.log("服务器已开启：127.0.0.1:4000正在监听。。。");
});
