/**
 * Created by hc on 2017/9/12.
 */
var exec = require("child_process").exec;//一个简单又实用的非阻塞操作模块
var fs = require("fs");
var path = require("path");
var querystring = require("querystring");
var faud=require("./db");
var foo=require("silly-datetime");
var Db =require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/blog';

function postWhisper(req,res,next) {
	console.log("转到postwhisper。。。");
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		var qs=querystring.parse(postdata);
		if(qs['author']==""||qs['content']=="")
		{   console.log("信息不能为空");
			res.end();
		}
		else{
			Db.connect(DB_CONN_STR,function (err, db) {
				var resultjson=[];
				if (!err) {
					console.log("connected success");
					var whisperid = foo.format(new Date, "YYYYMMDDHHmmss");
					var time = foo.format(new Date, "YYYY年MM月DD日 HH:mm");
					var whisperjson = querystring.parse(postdata);
					whisperjson["_id"]=whisperid;
					whisperjson["time"]=time;
					faud.addWhisper("whisper",db,whisperjson,function(result){
						resultjson=[{"result":result}];
						res.end(JSON.stringify(resultjson));
					});
				}else{
					res.end(JSON.stringify(resultjson));
					db.close();
					console.log(err);
				}
			});
		}
	});
	return next();
}

function postLife(req,res,next) {
	console.log("转到postlife。。。");
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		var qs=querystring.parse(postdata);
		if(qs['title']==""||qs['author']==""||qs['type']==""||qs['content']=="")
		{   console.log("信息不完整");
			res.end();
		}
		else{
			Db.connect(DB_CONN_STR,function (err, db) {
				var resultjson=[];
				if (!err) {
					var lifeid = foo.format(new Date, "YYYYMMDDHHmmss");
					var time = foo.format(new Date, "YYYY年MM月DD日 HH:mm");
					var lifejson = querystring.parse(postdata);
					lifejson["_id"]=lifeid;
					lifejson["time"]=time;
					faud.addLife("life",db,lifejson,function(result){
						resultjson=[{"result":result}];
						res.end(JSON.stringify(resultjson));
					});
				}else{
					res.end(JSON.stringify(resultjson));
					db.close();
					console.log(err);
				}
			});
		}
	});
	return next();
}

function postRoad(req,res,next) {
	console.log("转到postroad。。。");
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		var qs=querystring.parse(postdata);
		if(qs['title']==""||qs['author']==""||qs['type']==""||qs['content']=="")
		{   console.log("信息不完整");
			res.end();
		}
		else{
			Db.connect(DB_CONN_STR,function (err, db) {
				var resultjson=[];
				if (!err) {
					var roadid = foo.format(new Date, "YYYYMMDDHHmmss");
					var time = foo.format(new Date, "YYYY年MM月DD日 HH:mm");
					var roadjson = querystring.parse(postdata);
 					roadjson['_id']=roadid;
					roadjson['time']=time;
					roadjson['path']="road"+roadid+".html?id="+roadid;
					roadjson['clicknum']=0;
					roadjson['comments']=[];
					roadjson['praise']=0;
					console.log(roadjson['path']);
					faud.addRoad("road",db,roadjson,function(result){
						//创建文件
						//获取当前路径
						var filePath = path.dirname(__dirname)+"\\"+path.basename(__dirname)+"\\webroot\\roadpage\\";
 						var content="";
						//	读取
						fs.readFile(filePath+'model.html', function (err, data) {
							if (err) {
								return console.error(err);
							}
							else{
								content=data.toString();
								//写入
								fs.writeFile(filePath+'road'+roadid+'.html', content,  function(err) {
									if (err) {
										return console.error(err);
									}
									console.log("数据写入成功！");
								});
							}
 						});

						resultjson=[{"result":result}];
						res.end(JSON.stringify(resultjson));
					});
				}else{
					res.end(JSON.stringify(resultjson));
					db.close();
					console.log(err);
				}
			});
		}
	});
	return next();
}

function roadHot(req,res,next) {
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			var resultjson=[];
			if (!err) {
				console.log("connected success");
				var roadjson = querystring.parse(postdata);
				var id=roadjson._id;
				//改值
				faud.updataData("road",db,id,"clicknum",function(){
					res.end("success");
				});
			}else{
				res.end(JSON.stringify(resultjson));
				db.close();
				console.log(err);
			}
		});
	});
	return next();
}

function flushHot(req,res,next) {
	Db.connect(DB_CONN_STR,function (err, db) {
		if (!err) {
			faud.flushHot("road",db,function(result){
				res.end(JSON.stringify(result));
			});
		}else{
			db.close();
			console.log(err);
		}
	});
	return next();
}

function index(req,res,next) {
	console.log("转到index。。。");
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR, function (err, db) {
			if (!err) {
				var jsondata = querystring.parse(postdata);
				faud.findDataBy("user",db,jsondata,function(message){
					if(message.length){
						res.end(JSON.stringify({statu:"success"}));
					}
				});
			} else {
				db.close();
				console.log(err);
			}
		});
	});
	return next();
}

function flushLife(req,res,next){
	Db.connect(DB_CONN_STR,function (err, db) {
		if (!err) {
			console.log("connected success");
			faud.findData("life",db,function(message){
				console.log(JSON.stringify(message));
				res.end(JSON.stringify(message));
			});
		}else{
			db.close();
			console.log(err);
		}
	});
	return next();
}

function flushWhisper(req,res,next){
	Db.connect(DB_CONN_STR,function (err, db) {
		if (!err) {
			faud.findData("whisper",db,function(message){
				console.log(JSON.stringify(message));
				res.end(JSON.stringify(message));
			});
		}else{
			db.close();
			console.log(err);
		}
	});
	return next();
}

function flushOntheroad(req,res,next){
	Db.connect(DB_CONN_STR,function (err, db) {
		if (!err) {
			console.log("connected success");
			faud.findData("road",db,function(message){
				console.log(JSON.stringify(message));
				res.end(JSON.stringify(message));
			});
		}else{
			db.close();
			console.log(err);
		}
	});
	return next();
}
//message   刷新
function messageGet(req,res,next){
	Db.connect(DB_CONN_STR,function (err, db) {
		if (!err) {
			faud.findData("blog",db,function(message){
				res.end(JSON.stringify(message));
			});
		}else{
			db.close();
			console.log(err);
		}
	});
	return next();
}

//message   留言
function messagePost(req,res,next) {
	console.log("转到message。。。");
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
			Db.connect(DB_CONN_STR,function (err, db) {
				if (!err) {
					if(postdata!="") {
						var userid = foo.format(new Date, "YYYYMMDDHHmmss");
						var time = foo.format(new Date, "YYYY年MM月DD日 HH:mm");
						var jsondata = querystring.parse(postdata);
                        jsondata["_id"]=userid;
						jsondata["time"]=time;
						jsondata["report"]=0;
						jsondata["pit"]=0;
						jsondata["praise"]=0;
						faud.addData("blog",db,jsondata,function(res){
						});
						faud.findData("blog", db, function (message) {
							res.end(JSON.stringify(message));
						});

					}else{
						faud.findData("blog",db,function(message){
							res.end(JSON.stringify(message));
						});
					}
				}else{
					db.close();
					console.log(err);
				}
			});

	});
	return next();
}

function replyPost(req,res,next) {
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var jsondata = querystring.parse(postdata);
				var id=jsondata._id;
				var data=querystring.parse("time="+jsondata.time+"&content="+jsondata.content+"&user="+jsondata.user);
				faud.updateBlog("blog",db,id,data);
				res.end("success");
			}else{
				db.close();
				console.log(err);
			}
		});

	});
	return next();
}

function replyList(req,res,next) {
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var jsondata = querystring.parse(postdata);
				var data=querystring.parse("id="+jsondata.id);
				faud.findDataByid("blog",db,data,function(reply){
					res.end(JSON.stringify(reply));
				});
			}else{
				db.close();
				console.log(err);
			}
		});
	});
	return next();
}

function statu(req,res,next) {
	Db.connect(DB_CONN_STR,function (err, db) {
		if (!err) {
			faud.findData("user",db,function(result){
				res.end(JSON.stringify(result));
			});
		}else{
			db.close();
			console.log(err);
			res.end();
		}
	});
	return next();
}

function updatestatuF(req,res,next) {
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR, function (err, db) {
			if (!err) {
				var name=querystring.parse(postdata).name;
				faud.updatestatuF("user", db,name);
				res.end();
			} else {
				db.close();
				console.log(err);
			}
		});
	});
	return next();
}

function postRegist(req,res,next){
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var userid = foo.format(new Date, "YYYYMMDDHHmmss");
				var jsondata = querystring.parse(postdata);
				jsondata._id=userid;
				jsondata.flag=false;
				console.log(jsondata);
				faud.findDataByName("user",db,jsondata,function(rel){

					if(rel.length>0){
						res.end(JSON.stringify({res:"您已经注册过了。。。"}));
					}else{
						faud.addData("user",db,jsondata,function(reply){
							if(reply=="success"){
								res.end(JSON.stringify({res:"注册成功。。。"}));

							}
 						});
					}
				});
			}else{
				db.close();
				console.log(err);
			}
		});
	});
	return next();
}

function mDataMoudle(req,res,next){
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var moudle=querystring.parse(postdata).coll;
				faud.findData(moudle,db,function(doc){
					console.log(doc);
					res.end(JSON.stringify(doc));
				});
			}else{
				db.close();
				console.log(err);
				res.end(false);
			}
		});
	});
	return next();
}

function mDataFind(req,res,next){
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				data=querystring.parse(postdata);
				faud.findDataBysome(db,data,function(doc){
					console.log(doc);
					res.end(JSON.stringify(doc));
				});
			}else{
				db.close();
				console.log(err);
				res.end(false);
			}
		});
	});
	return next();
}

//后台更新
function mDataUpdate(req,res,next){
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var data=querystring.parse(postdata);
				var coll=data.moudle;
				delete data["moudle"];
				console.log(data.moudle);
 				faud.updateById(coll,db,data,function(doc){
					res.end(JSON.stringify(doc));
				});
			}else{
				db.close();
				res.end("error");
			}
		});
	});
	return next();
}
//后台删除
function mDataDel(req,res,next) {
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var id = querystring.parse(postdata).id;
				var coll = querystring.parse(postdata).moudle;
				faud.removeData(coll,db,id,function (doc){
					if(coll=="road"){
						var filePath = path.dirname(__dirname)+"\\"+path.basename(__dirname)+"\\webroot\\roadpage\\";
						fs.unlink(filePath+'\\road'+id+".html", function(err) {
							if (err) {
								return console.error(err);
							}
							console.log("文件删除成功！");
						});
					}
					res.end(JSON.stringify(doc));
				});
			}
			else{
				db.close();
				res.end("error");
			}
		});
	});
}

//上传
function upLoad(req,res,next) {

}

//操作
function act(req,res,next){
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var data=querystring.parse(postdata);
				var id=data._id;
				var coll=data.coll;
				var doc=data.doc;
				//改值
				faud.updataData(coll,db,id,doc,function (rel){
					res.end(rel);
				});
			}else{
				db.close();
				console.log(err);
				res.end("error");
			}
		});
	});
	return next();
}
//评论操作
function commentsAct(req,res,next){
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var data=querystring.parse(postdata);
				var coll=data.coll;
				var rid=data.roadid;
				var cid=data.commentsid;
				var act=data.act;
				//改值
				faud.updateCommentsACT(coll,db,rid,cid,act,function (rel){
					res.end(rel);
				});
			}else{
				db.close();
				console.log(err);
				res.end("error");
			}
		});
	});
	return next();
}


//roadpage 获取数据
function getRoadPageData(req,res,next){
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var jsondata = querystring.parse(postdata);
				var coll=jsondata.coll;
				faud.getRoadDataById(coll, db,jsondata,function(rel){
					res.end(JSON.stringify(rel));
				})
			}
		});

	});
}

//roadpage 发送数据
function setRoadPageData(req,res,next){
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var jsondata = querystring.parse(postdata);
				var coll=jsondata.coll;
				var id=jsondata.id;
				jsondata.pit=0;
				jsondata.praise=0;
				jsondata.report=0;
				faud.pushRoadPageData(coll, db,jsondata,function(rel){
					faud.getCommentsDataById(coll, db,id,function(rel){
						res.end(JSON.stringify(rel));
					});
				})
			}
		});

	});
}

//roadpage 发送回复
function roadPageSendReply(req,res,next){
	var postdata='';
	req.setEncoding("utf8");
	req.addListener("data", function(postDataChunk) {
		postdata += postDataChunk;
	});
	req.addListener("end", function() {
		Db.connect(DB_CONN_STR,function (err, db) {
			if (!err) {
				var jsondata = querystring.parse(postdata);
				var coll=jsondata.coll;
				faud.pushRoadPagereplyData(coll,db,jsondata,function(rel){
					res.end(JSON.stringify(rel));
				});
			}
			});
		});
}


exports.index = index;
exports.postRegist = postRegist;
exports.messagePost = messagePost;
exports.messageGet = messageGet;

exports.replyPost = replyPost;
exports.replyList = replyList;

exports.postLife =postLife;
exports.postWhisper =postWhisper;
exports.postRoad =postRoad;
exports.roadHot =roadHot;
exports.flushHot =flushHot;

exports.flushLife =flushLife;
exports.flushWhisper =flushWhisper;
exports.flushOntheroad =flushOntheroad;
exports.statu =statu;
exports.updatestatuF =updatestatuF;
exports.mDataMoudle =mDataMoudle;
exports.mDataFind =mDataFind;
exports.mDataUpdate =mDataUpdate;
exports.mDataDel =mDataDel;

exports.upLoad =upLoad;
exports.act =act;
exports.commentsAct =commentsAct;
exports.getRoadPageData =getRoadPageData;
exports.setRoadPageData =setRoadPageData;
exports.roadPageSendReply =roadPageSendReply;



