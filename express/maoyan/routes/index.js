var express = require('express');
var router = express.Router();
var fs = require('fs'); // 引入fs 文件读写模块
var exec = require('child_process').exec; // 执行python脚本
var iconv = require('iconv-lite');
var encoding = 'cp936';
var binaryEncoding = 'binary';

var DB_CONN_STR = 'mongodb://localhost:27017';
var mongo = require('mongodb').MongoClient;

/* 根据json 对象的某一个属性对其进行排序 */
function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

/*功能九： 电影推荐 */
var usertouser = function (db) {

  // 获得指定的集合
  var dbase = db.db('maoyan');
  var collection = dbase.collection("maoyanmovies");

  collection.find().sort({ "score": -1 }).toArray(function (err, result) {

    // 如果存在错误
    if (err) {
      console.log('Error:' + err);
      return;
    }

    
    var data = '';
    for (var i = 0; i < result.length; i++) {
      
      data += result[i]['name'] + '\t' + result[i]['type']+'\t'+result[i]['score']+'\n';
    }
    // console.log(data);

    fs.writeFile("./public/json/movie.txt",data,error=>{
      if(error)
        return console.log("写入文件失败，原因是" + error.message);
      console.log('寫入文件成功');
      });
   
  });

}


/* 判断json 中的某个键值是否包含一个字符串 
  num 表示数组包含的关键值，是location，或者是month
*/
function movieContains(arr, obj, num) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][num] == obj) {
      return i;
    }
  }

  return -1;
}

/* 查找obj 字符串是否在arr数组中,如果存在返回下标 */
function contains(arr, obj) {

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == obj) {
      return i;
    }
  }

  return -1;
}

/* 功能一：上映的电影类型分布，形成词云 */
var checkStyleCount = function (db, callback) {

  // 获得指定的集合
  var dbase = db.db('maoyan');
  var collection = dbase.collection("maoyanmovies");
  collection.find({}).toArray(function (err, result) {

    // 如果存在错误
    if (err) {
      console.log('Error:' + err);
      return;
    }

    var stylecount = [];
    var Chinese;
    var month;

    for (var i = 0; i < result.length; i++) {

      // 根据电影类型的分割符进行切分
      month = result[i]['type'].split(',');
      for (var j = 0; j < month.length; j++) {
        index = movieContains(stylecount, month[j], 'style');
        if (index != -1) {
          // 该类型已经存在数组里了,取出存储在该类型的电影数量加上这个电影的类型加1。

          var j = stylecount[index]['num'];
          j += 1;
          stylecount[index]['num'] = j;

        } else {
          // 如果该月份不存在数组，就添加进数组，并将该月份电影数量初始值为1
          Chinese = {};
          Chinese.style = month[j];
          Chinese.num = 1;
          stylecount.push(Chinese);// 将该地区添加到数组里

        }
      }



    }
    callback(stylecount);
  });

}

/* 功能二：最受欢迎的电影top10 */
var checkByPeople = function (db, callback) {

  // 获得指定的集合
  var dbase = db.db('maoyan');
  var collection = dbase.collection("maoyanmovies");
  collection.find().sort({ "people": -1 }).limit(10).toArray(function (err, result) {

    // 如果存在错误
    if (err) {
      console.log('Error:' + err);
      return;
    }

    var people = [];
    var data;
    for (var i = 0; i < result.length; i++) {
      data = {}; // 每一个行数据
      data.name = result[i]['name'];
      data.people = result[i]['people'];
      people.push(data);
    }

    // 调用传入的回调方法，将操作结果返回
    callback(people);
  });

}

/*功能三： 每个月上映电影数量 */
var checkmonthCount = function (db, callback) {

  // 获得指定的集合
  var dbase = db.db('maoyan');
  var collection = dbase.collection("maoyanmovies");
  collection.find({}, { "released": 1, "box_office": 1 }).sort({ 'released': -1 }).toArray(function (err, result) {

    // 如果存在错误
    if (err) {
      console.log('Error:' + err);
      return;
    }

    var month_count = [];
    var Chinese;
    var month;

    for (var i = 0; i < result.length; i++) {

      // 该电影上映的月份
      month = result[i]['released'].split('-')[1];
      month = parseInt(month, 10);

      var index = movieContains(month_count, month, 'month');
      if (index != -1) {
        // 该月份已经存在数组里了,取出存储在该月的票房加上这个电影的票房。

        var j = month_count[index]['num'];
        j += 1;
        month_count[index]['num'] = j;

      } else {
        // 如果该月份不存在数组，就添加进数组，并将该月份电影数量初始值为1
        Chinese = {};
        Chinese.month = month;
        Chinese.num = 1;
        month_count.push(Chinese);// 将该地区添加到数组里

      }
    }

    // 按照月份进行从小到大排序
    month_count.sort(compare("month"));


    callback(month_count);
  });

}

/*功能四： 每个月电影票房 */
var checkmonthbox = function (db, callback) {

  // 获得指定的集合
  var dbase = db.db('maoyan');
  var collection = dbase.collection("maoyanmovies");
  collection.find({}, { "released": 1, "box_office": 1 }).sort({ 'released': -1 }).toArray(function (err, result) {

    // 如果存在错误
    if (err) {
      console.log('Error:' + err);
      return;
    }

    var month_box = [];
    var Chinese;
    var month;

    for (var i = 0; i < result.length; i++) {

      // 该电影上映的月份
      month = result[i]['released'].split('-')[1];
      month = parseInt(month, 10);

      var index = movieContains(month_box, month, 'month');
      if (index != -1) {
        // 该月份已经存在数组里了,取出存储在该月的票房加上这个电影的票房。

        var j = month_box[index]['box_office'];
        j += result[i]['box_office'];
        month_box[index]['box_office'] = j;

      } else {
        // 如果不存在就添加该地区，并将该地区电影数量初始值为1
        Chinese = {};
        Chinese.month = month;
        Chinese.box_office = result[i]['box_office'];
        month_box.push(Chinese);// 将该地区添加到数组里

      }
    }

    // 按照月份进行从小到大排序
    month_box.sort(compare("month"));

    var num;
    // 将每个月的电影票房转换成亿元
    for (var i = 0; i < month_box.length; i++) {
      num = month_box[i]['box_office'] * 1.0 / 100000000;
      // 保留3位小数
      month_box[i]['box_office'] = num.toFixed(3);

    }


    callback(month_box);
  });

}

/*功能六： 各个国家电影数量TOP10 */
var checkmovice_country = function (db, callback) {

  // 获得指定的集合
  var dbase = db.db('maoyan');
  var collection = dbase.collection("maoyanmovies");
  collection.find({}).toArray(function (err, result) {

    // 如果存在错误
    if (err) {
      console.log('Error:' + err);
      return;
    }

    var movie_count = [];
    var Chinese;
    var location;
    for (var i = 0; i < result.length; i++) {

      // 该电影地区
      location = result[i]['country'].split(',')[0];
      var index = movieContains(movie_count, location, 'location');
      if (index != -1) {
        // 该国家已经存在数组里了
        // 取出该国家的电影数，然后+1，再存储
        var j = movie_count[index]['num'];
        j = j + 1;
        movie_count[index]['num'] = j;

      } else {
        // 如果不存在就添加该地区，并将该地区电影数量初始值为1
        Chinese = {};
        Chinese.location = location;
        Chinese.num = 1;
        movie_count.push(Chinese);// 将该地区添加到数组里

      }
    }


    // 对数组进行排序，按照地区电影数量进行排序,并反序
    movie_count.sort(compare("num")).reverse();
    // 只保留Top10
    movie_count.splice(10, movie_count.length);

    callback(movie_count);
  });

}

/*功能七： 中外票房对比 */
var checkByCountry = function (db, callback) {

  // 获得指定的集合
  var dbase = db.db('maoyan');
  var collection = dbase.collection("maoyanmovies");
  collection.find({}).toArray(function (err, result) {

    // 如果存在错误
    if (err) {
      console.log('Error:' + err);
      return;
    }

    count = ['中国大陆', '中国香港', '中国台湾'];
    // console.log(result);
    // 调用传入的回调方法，将操作结果返回
    var boxfer = 0, boxZhong = 0;
    var Chinese = {};
    for (var i = 0; i < result.length; i++) {
      // var param = new Object();
      //result[i].
      var j = contains(count, result[i]['country'].split(',')[0]);
      if (j!=-1) {
        boxZhong += result[i]['box_office'];
      } else {
        boxfer += result[i]['box_office'];;
      }

    }
    boxZhong = boxZhong * 1.0 / 100000000;
    boxfer = boxfer * 1.0 / 100000000;
    Chinese.fer = boxfer.toFixed(3);
    Chinese.China = boxZhong.toFixed(3);

    // 返回中外票房对比（亿元）
    callback(Chinese);
  });

}

/* 功能八：根据票房获取电影Top10 */
var checkByBox = function (db, callback) {

  // 获得指定的集合
  var dbase = db.db('maoyan');
  var collection = dbase.collection("maoyanmovies");
  collection.find().sort({ "box_office": -1 }).limit(10).toArray(function (err, result) {

    // 如果存在错误
    if (err) {
      console.log('Error:' + err);
      return;
    }

    var Box = [];
    var data;
    for (var i = 0; i < result.length; i++) {
      data = {}; // 每一个行数据
      data.name = result[i]['name'];
      var box_money = result[i]['box_office'] * 1.0 / 100000000;
      data.box_office = box_money.toFixed(3);
      Box.push(data);
    }

    // 调用传入的回调方法，将操作结果返回
    callback(Box);
  });

}

/*功能九： 根据评分获取电影Top10 */
var checkByscord = function (db, callback) {

  // 获得指定的集合
  var dbase = db.db('maoyan');
  var collection = dbase.collection("maoyanmovies");

  collection.find().sort({ "score": -1 }).limit(10).toArray(function (err, result) {

    // 如果存在错误
    if (err) {
      console.log('Error:' + err);
      return;
    }

    var scored = [];
    var data;
    for (var i = 0; i < result.length; i++) {
      data = {}; // 每一个行数据
      data.name = result[i]['name'];
      data.score = result[i]['score'];
      scored.push(data);
    }

    // 调用传入的回调方法，将操作结果返回
    callback(scored);
  });

}

// mongodb 查询获得的数据，所有的数据
var data = {};
// 保存每一次查询结果，并添加到数组里.

// 链接数据库
mongo.connect(DB_CONN_STR, function (err, db) {
  console.log("mongodb链接成功");

  usertouser(db); // 进行电影推荐
  // 调用函数，电影类型
  checkStyleCount(db, function (result) {
    // 获得结果
    data.style_count = result;
   
  });

  // 电影票房TOP10
  checkByBox(db, function (result) {
    // 获得结果
    data.box = result;
    

  });

  // 中外电影对比
  checkByCountry(db, function (result) {
    // 获得结果
    data.style_country = result;
   
  });

  // 评价最好的电影TOP10

  checkByPeople(db, function (result) {
    // 获得结果

    data.people = result;
   

  });

 

  // 电影评分Top10
  checkByscord(db, function (result) {
    // 获得结果
    data.score = result;
    
  });

  // 每个月电影上映数量
  checkmonthCount(db, function (result) {
    // 获得结果
    data.monthCount = result;
    
  });

  // 每个月电影票房
  checkmonthbox(db, function (result) {
    // 获得结果
    data.monthbox = result;
    
  });

  //  各个国家电影数量TOP10
  checkmovice_country(db, function (result) {
    // 获得结果
    data.movice_country = result;
    
    db.close();
  });


});


console.log("服务器已经启动.......");
/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index');
});

/* post 请求进行响应 */
router.post('/ajax', function (req, res, next) {
  //console.log(data);
  res.send(data);
  
});

router.post('/process',function(req,res,next){
  var movieReturn={};
  var name = req.body.movie_name;
  exec('python ./public/python/KNN/run_predict.py ' + name,{encoding:binaryEncoding},function(error,stdout,stderr){
    if(stdout.length >1){
      stdout = iconv.decode(new Buffer(stdout, binaryEncoding), encoding);
      movieReturn.movietime=stdout.split("#")[0];
      movieReturn.suggestion = stdout.split("#")[1];
      movieReturn.desc = stdout.split("#")[2].split(":")[0];
      movieReturn.contect = stdout.split("#")[2].split(":")[1];
      res.send(movieReturn);
    }else{
      console.log('you don\'t offer args');
    }
    if(error){
      stderr = iconv.decode(new Buffer(stderr, binaryEncoding), encoding);
      console.info('stderr:' + stderr);
    }
  });

  
});

module.exports = router;
