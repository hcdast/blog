/**
 * Created by hc on 2017/9/12.
 */
//分页
function pageData(db,pagenum,callback) {
	var collection = db.collection('blog');
	collection.find().limit(5).skip(5*(pagenum-1)).toArray(function(error,doc){
		callback(doc);
		db.close();
	});
}

// 1.查询数据
function findData(coll,db,callback) {
	var docarr=[];
	var collection = db.collection(coll);
	collection.find().sort({"_id":-1}).toArray(function(err,docs){
		if(err) {
			throw  err;
		}
		else{
			callback(docs.reverse());
			db.close();
		}
	});
}

//1.1条件查询
function findDataBy(coll, db,data,callback) {
	var collection = db.collection(coll);
	collection.find({name:data.name,password:data.password}).toArray(function(err,docs){
		if(err) {
			throw  err;
			callback(null);
		}
		else{
			callback(docs);
			db.close();
		}
	});
}
function findDataByName(coll, db,data,callback) {
	var collection = db.collection(coll);
	collection.find({name:data.name}).toArray(function(err,docs){
		if(err) {
			throw  err;
			callback(null);
		}
		else{
			callback(docs);
			db.close();
		}
	});
}
function findDataByid(coll, db,data,callback) {
	var collection = db.collection(coll);
	collection.find({_id:data.id}).toArray(function(err,docs){
		if(err) {
			throw  err;
			callback(null);
		}
		else{
			console.log(docs.length);
			callback(docs);
			db.close();
		}
	});
}
//多项查询
function findDataBysome(db,data,callback){
	var moudle=data.coll;
	var user=data.name;
	var collection = db.collection(moudle);
	if(moudle=="whisper"){
		collection.find({author:user}).toArray(function(err,docs){
			if(err) {
				throw  err;
				callback(null);
			}
			else{
				console.log(docs.length);
				callback(docs);
				db.close();
			}
		});
	}
	else if(moudle=="life"){
		collection.find({author:user}).toArray(function(err,docs){
			if(err) {
				throw  err;
				callback(null);
			}
			else{
				console.log(docs.length);
				callback(docs);
				db.close();
			}
		});
	}
	else if(moudle=="road"){
		collection.find({author:user}).toArray(function(err,docs){
			if(err) {
				throw  err;
				callback(null);
			}
			else{
				console.log(docs.length);
				callback(docs);
				db.close();
			}
		});
	}
	else if(moudle=="blog"){
		collection.find({username:user}).toArray(function(err,docs){
			if(err) {
				throw  err;
				callback(null);
			}
			else{
				console.log(docs.length);
				callback(docs);
				db.close();
			}
		});
	}
	else if(moudle=="user"){
		collection.find({name:user}).toArray(function(err,docs){
			if(err) {
				throw  err;
				callback(null);
			}
			else{
				console.log(docs.length);
				callback(docs);
				db.close();
			}
		});
	}


}
//clicknum排序
function flushHot(coll,db,callback){
	var collection = db.collection(coll);
	collection.find().sort({"clicknum":1}).toArray(function(err,docs){
		if(err) {
			throw  err;
		}
		else{
			console.log(docs.length);
			callback(docs);
			db.close();
		}
	});
}

// 2.添加数据
function addData(coll, db,data,callback) {
	var collection = db.collection(coll);
	collection.insertOne(data, function (error, result) {
		if (error) {
			callback("err");
			db.close();
		} else {
			console.log("add success");
			callback("success");
			db.close();
		}
	});
}
//添加生活
function addLife(coll, db,data,callback) {
	var collection = db.collection(coll);
	collection.insertOne(data, function (error, result) {
		if (error) {
			callback ("err");
			console.log('addError:' + error);
		} else {
			console.log("add success");
			callback ("success");
		}
		db.close();
	});
}
//添加悄悄话
function addWhisper(coll, db,data,callback) {
	var collection = db.collection(coll);
	collection.insertOne(data, function (error, result) {
		if (error) {
			callback ("err");
			console.log('addError:' + error);
		} else {
			console.log("add success");
			callback ("success");
		}
		db.close();
	});
}
//添加 在路上
function addRoad(coll, db,data,callback) {
	var collection = db.collection(coll);
	collection.insertOne(data, function (error, result) {
		if (error) {
			callback ("err");
			console.log('addError:' + error);
		} else {
			console.log("add success");
			callback ("success");
		}
		db.close();
	});
}



//3.更新数据
function updateData(coll, db,id,doc,callback) {
	var collection = db.collection(coll);
	var whereData = {"_id": id};
	if (doc=="clicknum")
	    var updateData = {$inc: {"clicknum": 1}}; //$inc  自动增加1
	else if(doc=="report")
		var updateData = {$inc: {"report": 1}}; //$inc  自动增加1
    else if(doc=="pit")
		var updateData = {$inc: {"pit": 1}}; //$inc  自动增加1
    else if(doc=="praise")
		var updateData = {$inc: {"praise": 1}}; //$inc  自动增加1

	collection.update(whereData, updateData, function (error) {
		if (error) {
			console.log('Error:' + error);
		} else {
			callback("success");
			console.log("updata success");
		}
		db.close();
	});
}
//更新状态
function updatestatuT(coll, db,name) {
	var collection = db.collection(coll);
	var whereData = {"name": name};
	var updateData = {$set: {"flag": true}};
	collection.update(whereData, updateData, function (error, result) {
		if (error) {
			console.log('Error:' + error);
		} else {
			console.log("updata success");
			return "success";
		}
		db.close();
	});
}
function updatestatuF(coll, db,name) {
	var collection = db.collection(coll);
	var whereData = {"name": name};
	var updateDat = {$set: {"flag": false}};
	collection.update(whereData, updateDat, function (error, result) {
		if (error) {
			console.log('Error:' + error);
		} else {
			console.log("updata success");
		}
		db.close();
	});
}
//更新blog添加回复
function updateBlog(coll, db,id,data) {
	var collection = db.collection(coll);
	var whereData = {"_id": id};
	var updateDat = {$push: {"reply":data}};
	collection.update(whereData, updateDat, function (error, result) {
		if (error) {
			console.log('Error:' + error);
		} else {
			console.log("updata success");
		}
		db.close();
	});
}

//更新数据byId
function updateById(coll,db,data,callback){
	var collection = db.collection(coll);
	var whereData = {"_id": data.id};
	delete data['id'];
	delete data["coll"];
	var updateData = {$set: data};
	collection.update(whereData, updateData, function (error) {
		if (error) {
			callback("error");
		} else {
			callback("success");
		}
		db.close();
	});
}

//roadpage 添加评论
function pushRoadPageData(coll,db,data,callback){
	var collection = db.collection(coll);
	var whereData = {"_id": data.id};
	delete data['id'];
	var updateData = {$push: {"comments":data}};
	collection.update(whereData, updateData, function (error) {
		if (error) {
			callback("error");
		} else {
			callback("success");
		}
		db.close();
	});
}
//roadpage 添加评论回复
function pushRoadPagereplyData(coll,db,data,callback){
	var collection = db.collection(coll);
	var whereData = {"_id": data.id};
	delete data['id'];
	delete data['coll'];
	var updateData = {$push: {"replys":data}};
	collection.update(whereData, updateData, function (error) {
		if (error) {
			callback("error");
		} else {
			callback("success");
		}
		db.close();
	});
}
//评论  act 更新
function updateCommentsACT(coll, db,rid,cid,act,callback) {
	var collection = db.collection(coll);
	var whereData = {"_id": rid,"comments.userId":cid};

	if(act==="praise"){
		var updateData = {$inc:{"comments.$.praise": 1}}; //$inc  自动增加1
	}
	if(act==="pit"){
		var updateData = {$inc:{"comments.$.pit": 1}}; //$inc  自动增加1
	}
	if(act==="report"){
		var updateData = {$inc:{"comments.$.report": 1}}; //$inc  自动增加1
	}
	console.log(rid);
	collection.update(whereData, updateData, function (error) {
		if (error) {
			console.log('Error:' + error);
		} else {
			callback("success");
			console.log("updata success");
		}
		db.close();
	});
}

//4.删除数据
function removeData(coll,db,id,callback) {
	var collection = db.collection(coll);
	var data = {"_id": id};
	collection.remove(data, function (error) {
		if (error) {
			 callback("error");
		} else {
			 callback("success");
		}
		db.close();
	});
}

//getRoadDataById
function getRoadDataById(coll, db,data,callback) {
	var collection = db.collection(coll);
	collection.find().toArray(function(err,docs){
		if(err) {
			throw  err;
			callback(null);
		}
		else{
			 var i;
			 for(var index in docs){
				 if(docs[index]._id==data.id){
					 i=index;
					 break;
				 }
			 }
			if(i==docs.length-1) {
				docs[i].uptitle = docs[i].title;
				docs[i].uppath = docs[i].path;
			} else{
				docs[i].uptitle = docs[parseInt(i)+1].title;
				docs[i].uppath = docs[parseInt(i)+1].path;
			}
			if(i==0){
				docs[i].downtitle = docs[i].title;
				docs[i].downpath = docs[i].path;
			} else{
				docs[i].downtitle = docs[i-1].title;
				docs[i].downpath = docs[i-1].path;
			}
			callback(docs[i]);
			db.close();
		}
	});
}

//getCommentsDataById
function getCommentsDataById(coll, db,id,callback) {
	var collection = db.collection(coll);
	collection.find({_id:id}).toArray(function(err,docs){
		if(err) {
			throw  err;
			callback(null);
		}
		else{
			callback(docs);
			db.close();
		}
	});
}

exports.pageData=pageData;//
exports.findData=findData;//查询所有
exports.findDataBy=findDataBy;//条件查询
exports.findDataByName=findDataByName;//条件查询
exports.findDataByid=findDataByid;//条件查询id
exports.findDataBysome=findDataBysome;//多项查询

exports.addData=addData;//添加数据
exports.addLife=addLife;//添加生活
exports.addWhisper=addWhisper;//添加生活
exports.addRoad=addRoad;//添加在路上
exports.flushHot=flushHot;//添加在路上
exports.updateBlog=updateBlog;//添加回复  更新blog
exports.updatestatuT=updatestatuT;//标记登录
exports.updatestatuF=updatestatuF;//标记退出

exports.updataData=updateData;//更新数据
exports.updateById=updateById;//更新数据byId
exports.updateCommentsACT=updateCommentsACT;//更新数据byId

exports.removeData=removeData;//删除数据
exports.getRoadDataById=getRoadDataById;//roadpage
exports.getCommentsDataById=getCommentsDataById;//roadpage
exports.pushRoadPageData=pushRoadPageData;//roadpage
exports.pushRoadPagereplyData=pushRoadPagereplyData;//roadpage



