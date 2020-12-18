/*
天街微信小程序签到脚本

更新时间: 2020-12-18 11:57:44
脚本兼容: QuantumultX(其它自测)
电报频道: @tgbmqy

说明：
打开天街微信小程序->签到积分，如通知成功获取token, 则可以使用此续期脚本.
获取token后, 请将获取token禁用并移除主机名，以免产生不必要的MITM.

脚本将在每天10:11执行。 您可以修改执行时间。

************************
QuantumultX 本地脚本配置:
************************

[task_local]
# 天街微信小程序签到
11 10 * * * https://raw.githubusercontent.com/bmqy/QuantumultX/master/bmqy/tianjie/sign.js, tag=天街微信小程序, img-url=https://imgsrc.baidu.com/forum/pic/item/0bd162d9f2d3572cbd11c6e48613632762d0c313.jpg, enabled=true

[rewrite_local]
# 获取签到token
^https:\/\/c2-openapi\.longfor\.com\/riyuehu-miniapp-service-prod\/ryh\/sign\/calendar url script-request-header https://raw.githubusercontent.com/bmqy/QuantumultX/master/bmqy/tianjie/sign.js
# 获取签到项目信息
^https:\/\/c2-openapi\.longfor\.com\/riyuehu-miniapp-service-prod\/ryh\/sign\/today\/info\/query url script-request-body https://raw.githubusercontent.com/bmqy/QuantumultX/master/bmqy/tianjie/sign.js

[mitm] 
hostname= c2-openapi.longfor.com
*/

var ScriptTitle = '天街微信小程序签到';
var ScriptParamPrefix = 'tianjieSign';
var ScriptHeaderParam = {
    'X-Longfor-StoreId': 'StoreId',
    'token': 'token',
    'userkey': 'userkey',
    'X-Gaia-Api-Key': 'ApiKey',
  },
  ScriptBodyParam = {
    'projectId': 'projectId'
  };
var $nobyda = nobyda();
var date = new Date();
if ($nobyda.isRequest) {
  GetParameter();
} else {
  sign();
}

function sign() {
  var bonus = {
    url: 'https://c2-openapi.longfor.com/riyuehu-miniapp-service-prod/ryh/sign/submit',
    headers: {
      'Content-Type' : "application/json",
      'X-Longfor-StoreId' : $nobyda.read(ScriptHeaderParam['X-Longfor-StoreId']),
      'userkey': $nobyda.read(ScriptHeaderParam['userkey']),
      'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.18(0x17001231) NetType/WIFI Language/zh_CN",
      'X-Gaia-Api-Key' : $nobyda.read(ScriptHeaderParam['X-Gaia-Api-Key']),
      'token': $nobyda.read(ScriptHeaderParam['token']),
    },
    body: `{"data":{"projectId":"${$nobyda.read(ScriptBodyParam["projectId"])}"}}`
  };
  $nobyda.post(bonus, function(error, response, data) {
    console.log(JSON.stringify(bonus));
    console.log(data);
    if (error) {
      $nobyda.notify(ScriptTitle, "请求失败 ‼️‼️", error)
    } else {
      data = JSON.parse(data);
      if (data && data.code) {
        if(data.code == 10000){
          $nobyda.notify(ScriptTitle, "", date.getMonth() + 1 + "月" + date.getDate() + "日, 获得："+ data.rewardBonusTotal +" 积分 🎉")
        } else if(data.code == 30020){
          $nobyda.notify(ScriptTitle, "", data.msg +" ‼️")
        } else {           
          $nobyda.notify(ScriptTitle, "", "签到失败："+ data.msg +" ‼️‼️")
        }
      } else {
        $nobyda.notify(ScriptTitle, "", "脚本待更新 ‼️‼️")
      }
    }
  })
  $nobyda.done();
}


function GetParameter() {
  try {
    if ($request.headers && $request.url.match(/sign\/calendar/)) {
      var aParam = [];
      var reWrite = false;
      for(let k in ScriptHeaderParam){
        let reqHeaderParam = $request.headers[k];
        let ScriptHeaderParamKey = `${ScriptParamPrefix}-${ScriptHeaderParam[k]}`;
        if (reqHeaderParam && $nobyda.read(ScriptHeaderParamKey) != reqHeaderParam) {
          reWrite = true;
          console.log(`更新${ScriptHeaderParamKey}`);
          let writeResult = $nobyda.write(reqHeaderParam, ScriptHeaderParamKey);
          if (!writeResult) {
            aParam.push(ScriptHeaderParamKey);
          }
        }
      }
      
      if(reWrite){
        if(aParam.length == 0){
          $nobyda.notify("", "", "写入" + ScriptTitle + "token成功 🎉");
        } else {
          $nobyda.notify("", "", "写入" + ScriptTitle + "token失败："+ aParam.join('、') +" ‼️");
        }
      }
    }  
  } catch (eor) {
    $nobyda.notify(ScriptTitle + "写入token失败", "", "错误"+ JSON.stringify(eor) +" ‼️")
  }

  try {
    if ($request.body && $request.url.match(/sign\/today\/info\/query/)) {
      var reqBody = JSON.parse($request.body);
      if (reqBody && reqBody.data) {
        let projectId = reqBody.data.projectId;
        let projectKey = `${ScriptParamPrefix}-${ScriptBodyParam['projectId']}`;        
        if (projectId && $nobyda.read(projectKey) != projectId) {
          let writeResult = $nobyda.write(projectId, projectKey);
          if (!writeResult) {
            $nobyda.notify("", "", "写入" + ScriptTitle + "项目参数失败 ‼️");
          } else {
            $nobyda.notify("", "", "写入" + ScriptTitle + "项目参数成功 🎉");
          }
        }
      }
    }  
  } catch (eor) {
    $nobyda.notify(ScriptTitle + "写入项目参数失败", "", "错误"+ JSON.stringify(eor) +" ‼️")
  }
  $nobyda.done();
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
