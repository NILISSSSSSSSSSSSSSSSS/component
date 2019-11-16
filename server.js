const express = require('express');
const session = require("express-session");
const app = express();
var qs = require('qs');
//必须与测试号所填写的Token相同
// var TOKEN = '123456';
var https = require('https'); // node 端 请求别的服务的模块
var sign = require('./sign.js');
var config = require('./config.js');
app.use(express.static('www'));

//引入中间件
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false ,maxAge:2*3600,}//设置为false;
}));

// 用于微信验证token
app.get("/wx.do", (request, response) => {
  console.log(response.query);
  var query = require('url').parse(request.url).query;
  var params = qs.parse(query);
  console.log(params);

  if (!checkSignature(params, config.TOKEN)) {
    //如果签名不对，结束请求并返回
    response.end('signature fail');
  }
  if (request.method == "GET") {
    //如果请求是GET，返回echostr用于通过服务器有效校验
    response.end(params.echostr);
  } else {
    //否则是微信给开发者服务器的POST请求
    var postdata = '';
    request.addListener("data", function (postchunk) {
      postdata += postchunk;
    });
    //获取到了POST数据
    request.addListener("end", function () {
      console.log(postdata);
      response.end('success ');
    });
  }

})

//微信登录,获取用户信息
app.get("/wxlogin", (request, response) => {
  var query = require('url').parse(request.url).query;
  var params = qs.parse(query);

  let cc={"access_token":"27_-XLw-wgIwRWBNitSsIXsJFQhxErF2O-x0SZBt2ptZaxQUAoa8Irpzg6HOiDyYuTM5OD4bahz0Mbge3A09dpF2YavBlCyzevF4zW_oMO3-s8","expires_in":7200,"refresh_token":"27_uPkFfLtql5yLaQ9Msu6JO6zAajzqZDirfTVnyMn7ftBlbP8htCybUBHTgnCu0mphfHRnW_PB8WhhRkBI4bwFxInP0uUz005SCtopqtX5JtY","openid":"o-kzeweM8jS0IoDWvptzcfuwGp7U","scope":"snsapi_userinfo"};
  getUerInfo(cc)
    //  获取accetoken：
    // https.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.APPID}&secret=${config.appsecret}&code=${params.code}&grant_type=authorization_code`, function (res) {
    //   var datas = [];
    //   var size = 0;
    //   res.on('data', function (data) {
    //     datas.push(data);
    //     size += data.length;
    //   });
    //   res.on("end", function () {
    //     console.log(datas);
    //     var buff = Buffer.concat(datas, size);
    //     var result = buff.toString();
    //     // 缓存acctToken
    //     console.log("accetoken：sss" + result);//这里的accetoken不能重复调用，需要用中控服务器去刷新
    //     // 获取用户信息
    //     getUerInfo(result);
    //   });

    // }).on('error', function (e) {
    //   console.log("Got error: " + e.message);
    // });


  //获取用户信息
  function getUerInfo(param) {
    https.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${param.access_token}&openid=${param.openid}&lang=zh_CN`, function (res) {
      var datas = [];
      var size = 0;
      res.on('data', function (data) {
        datas.push(data);
        size += data.length;
      });
      res.on("end", function () {
        console.log(datas);
        var buff = Buffer.concat(datas, size);
        var result = buff.toString();
        response.send(result)
        console.log("用户信息：" + result);
      });

    }).on('error', function (e) {
      console.log("Got error: " + e.message);
    });
  }

})

app.get("/getSignature", (req, res) => {
  Res = res;
  https.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.APPID + "&secret=" + config.appsecret, function (res) {
    var datas = [];
    var size = 0;
    res.on('data', function (data) {
      datas.push(data);
      size += data.length;
    });
    res.on("end", function () {
      console.log(datas);
      var buff = Buffer.concat(datas, size);
      var result = buff.toString();
      //console.log(JSON.parse(result).access_token);
      // 获取 jsapi_ticket 
      https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + JSON.parse(result).access_token + '&type=jsapi', function (res) {
        var datas = [];
        var size = 0;
        res.on('data', function (data) {
          datas.push(data);
          size += data.length;
        });
        res.on('end', function () {
          var buff = Buffer.concat(datas, size);
          var rlt = buff.toString();
          // jsapi_ticket: JSON.parse(rlt).ticket,
          let result = sign(JSON.parse(rlt).ticket, config.url);
          result.appId = config.APPID;
          console.log('签名结果' + JSON.stringify(result));
          Res.send(result)

        });

      }).on('error', function (e) {
        console.log("Got error: " + e.message);
      })


    });

  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });

})

app.listen(80, () => {
  console.log('Server is running at http://localhost:80')
})

// 验证token
function checkSignature(params, token) {
  var key = [token, params.timestamp, params.nonce].sort().join('');
  //将token （自己设置的） 、timestamp（时间戳）、nonce（随机数）三个参数进行字典排序
  var sha1 = require('crypto').createHash('sha1');
  //将上面三个字符串拼接成一个字符串再进行sha1加密
  sha1.update(key);
  return sha1.digest('hex') == params.signature;
  //将加密后的字符串与signature进行对比，若成功，返回echostr
}


