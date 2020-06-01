/*
小鸡模拟器签到、存档续期脚本

更新时间: 2020.6.1 10:40
脚本兼容: QuantumultX(其它自测)
电报频道: @哇哈哈

说明：
打开小鸡模拟器->管理->存档管理，如通知成功获取续期参数, 则可以使用此续期脚本.
获取续期参数后, 请将续期脚本禁用并移除主机名，以免产生不必要的MITM.

脚本将在每月1号、15号7点执行。 您可以修改执行时间。

************************
QuantumultX 本地脚本配置:
************************

[task_local]
# 小鸡模拟器存档续期
0 7 1,15 * * bmqy/xjmnq/renew.js

[rewrite_local]
# 获取续期参数
^https?:\/\/client\.vgabc\.com\/clientapi\/ url script-request-body bmqy/xjmnq/renew.js

[mitm] 
hostname= client.vgabc.com
*/

var ScriptTitle = '小鸡模拟器存档续期';
var CookieKey = 'CookieXJMNQRenew';
var $nobyda = nobyda();
var date = new Date();
if ($nobyda.isRequest) {
    GetRenewParameter();
} else {
renew();
}

function renew() {
var data = parseJsonstr2FormData($nobyda.read(CookieKey));

  var bonus = {
    url: 'https://client.vgabc.com/clientapi/',
    body: data,
    headers:{
      Cookie: 'think_language=zh-Hans-CN',
      'User-Agent': 'Chick/1.5.8beta (iPhone; iOS 13.4.1; Scale/3.00)',
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept-Language': 'zh-Hans-CN;q=1'
    }
  };
  $nobyda.post(bonus, function(error, response, data) {
    if (error) {
      $nobyda.notify(ScriptTitle, "请求失败 ‼️‼️", error)
    } else {
      data = JSON.parse(data);
      if (data && data.status) {
        $nobyda.notify(ScriptTitle, "", date.getMonth() + 1 + "月" + date.getDate() + "日, 成功 🎉")
      } else {
        $nobyda.notify(ScriptTitle, "", "脚本待更新 ‼️‼️")
      }
    }
    $nobyda.done();
  })
}


function GetRenewParameter() {
  try {
    if ($request.body && $request.url.match(/client\.vgabc\.com/)) {
      var data = parseFormData2Json($request.body);
      if(data && data.ticket){
        var CookieValue = {
          action: 'archive_renew',
          'clientparams':'1.5.8beta|13.4.1|zh|iPhone9,2|414*736|ios1.1|webTB21',
          model: 'appstore',
          uid: data.uid,
          ticket: data.ticket,
        }
        if ($nobyda.read(CookieKey)) {
          if ($nobyda.read(CookieKey) != JSON.stringify(CookieValue)) {
            var cookie = $nobyda.write(JSON.stringify(CookieValue), CookieKey);
            if (!cookie) {
              $nobyda.notify("", "", "更新" + ScriptTitle + "参数失败 ‼️");
            } else {
              $nobyda.notify("", "", "更新" + ScriptTitle + "参数成功 🎉");
            }
          }
        } else {
          var cookie = $nobyda.write(JSON.stringify(CookieValue), CookieKey);
          if (!cookie) {
            $nobyda.notify("", "", "首次写入" + ScriptTitle + "参数失败 ‼️");
          } else {
            $nobyda.notify("", "", "首次写入" + ScriptTitle + "参数成功 🎉");
          }
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
