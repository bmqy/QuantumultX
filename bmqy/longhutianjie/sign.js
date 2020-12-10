/*
龙湖天街微信小程序签到脚本

更新时间: 2020.12.9 22:08
脚本兼容: QuantumultX(其它自测)
电报频道: @tgbmqy

说明：
打开龙湖天街微信小程序->签到积分，如通知成功获取token, 则可以使用此续期脚本.
获取token后, 请将获取token禁用并移除主机名，以免产生不必要的MITM.

脚本将在每天10点执行。 您可以修改执行时间。

************************
QuantumultX 本地脚本配置:
************************

[task_local]
# 小鸡模拟器存档续期
0 7 1,15 * * bmqy/longhutianjie/sign.js

[rewrite_local]
# 获取续期参数
^https?:\/\/c2-openapi\.longfor\.com url script-request-body bmqy/longhutianjie/sign.js

[mitm] 
hostname= c2-openapi.longfor.com
*/

var ScriptTitle = '龙湖天街微信小程序签到';
var TokenKey = 'TokenLongHuTianJieSign';
var $nobyda = nobyda();
var date = new Date();
if ($nobyda.isRequest) {
    GetToken();
} else {
sign();
}

function sign() {
var data = parseJsonstr2FormData($nobyda.read(TokenKey));

  var bonus = {
    url: 'https://c2-openapi.longfor.com/riyuehu-miniapp-service-prod/ryh/sign/submit',
    headers: {
      token: $nobyda.read(TokenKey),
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.18(0x17001231) NetType/WIFI Language/zh_CN',
      'Referer': `https://servicewechat.com/wx50282644351869da/201/page-frame.html`,
    },
    body: `{"data":{"projectId":"A0533837-3739-4A68-AB47-B160F7524502"}}`
  };
  $nobyda.post(bonus, function(error, response, data) {
    console.log(data, 'data');
    if (error) {
      $nobyda.notify(ScriptTitle, "请求失败 ‼️‼️", error)
    } else {
      data = JSON.parse(data);
      
      if (data && data.code) {
        $nobyda.notify(ScriptTitle, "", date.getMonth() + 1 + "月" + date.getDate() + "日, 成功 🎉")
      } else {
        $nobyda.notify(ScriptTitle, "", "脚本待更新 ‼️‼️")
      }
    }
    $nobyda.done();
  })
}


function GetToken() {
  try {
    if ($request.headers && $request.url.match(/c2-openapi\.longfor\.com/)) {
      var TokenValue = $request.headers['token'];
      if ($nobyda.read(TokenKey)) {
        if ($nobyda.read(TokenKey) != TokenValue) {
          var token = $nobyda.write(TokenValue, TokenKey);
          if (!token) {
            $nobyda.notify("", "", "更新" + ScriptTitle + "Token失败 ‼️");
          } else {
            $nobyda.notify("", "", "更新" + ScriptTitle + "Token成功 🎉");
          }
        }
      } else {
        var token = $nobyda.write(TokenValue, TokenKey);
        if (!token) {
          $nobyda.notify("", "", "首次写入" + ScriptTitle + "Token失败 ‼️");
        } else {
          $nobyda.notify("", "", "首次写入" + ScriptTitle + "Token成功 🎉");
        }
      }
    } else {
      $nobyda.notify(ScriptTitle + "写入参数失败", "", "请检查匹配URL或配置内脚本类型 ‼️");
    }
  } catch (eor) {
    $nobyda.notify(ScriptTitle + "写入参数失败", "", "未知错误 ‼️")
  }
  $nobyda.done();
}

function parseFormData2Json(str){
  var d = str.split('&');
  var o = {};
  d.forEach((e,i)=>{
    let a = e.split('=');
    o[a[0]] = a[1];
  });
  return o;
}

function parseJsonstr2FormData(str){
  var j = JSON.parse(str);
  var d = '';
  for(let k in j){
    if(d == ''){
      d += k +'='+ j[k];
    } else {
      d += '&'+ k +'='+ j[k];
    }
  }  
  return d;
}

function nobyda() {
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message)
    if (isSurge) $notification.post(title, subtitle, message)
  }
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key)
    if (isSurge) return $persistentStore.write(value, key)
  }
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key)
    if (isSurge) return $persistentStore.read(key)
  }
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status
      } else if (response.statusCode) {
        response["status"] = response.statusCode
      }
    }
    return response
  }
  const get = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "GET"
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) $httpClient.get(options, (error, response, body) => {
      callback(error, adapterStatus(response), body)
    })
  }
  const post = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "POST"
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) {
      $httpClient.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    
  }
  const done = (value = {}) => {
    if (isQuanX) isRequest ? $done(value) : null
    if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
    isRequest,
    notify,
    write,
    read,
    get,
    post,
    done
  }
};
