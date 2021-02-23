/*
七牛云CDN实时消费金额通知脚本

更新时间: 2021-01-18 14:21:44
脚本兼容: QuantumultX(其它自测)
电报频道: @tgbmqy

说明：
打开七牛云管理后台→费用→实施费用，提示获取cookie成功后，可正常使用任务脚本。

脚本将在每6小时执行一次。 您可以修改执行时间。

************************
QuantumultX 本地脚本配置:
************************

[task_local]
# 七牛云实时消费金额
0 0-23/6 * * * https://raw.githubusercontent.com/bmqy/QuantumultX/master/Script/qiniu/cost.js, tag=七牛云实时消费金额, img-url=http://tvax2.sinaimg.cn/crop.455.455.1137.1137.1024/9e0444ddly8fnqcc0bp58j21kw1kwq54.jpg, enabled=true

[rewrite_local]
# 获取七牛云cookie
^https:\/\/portal\.qiniu\.com\/api\/gaea\/financial\/costoverview url script-request-header https://raw.githubusercontent.com/bmqy/QuantumultX/master/Script/qiniu/cost.js

[mitm] 
hostname= portal.qiniu.com
*/
const ScriptTitle = '七牛云实时消费金额';
const Url = `https://portal.qiniu.com/api/gaea/financial/costoverview`;
const CookieKey = 'qiniuCost';
const $ = API('qiniu'); // 打开debug环境，打开所有log输出
if($.env.isRequest){
    getCookies();
} else {
    getCost()
}


/**
 * 获取实时消费金额数据
 *
 */
function getCost(){
    $.http.get({
        url: Url,
        headers: {
            'Cookie' : `${$.read(CookieKey)}`,
            'Referer' : `https://portal.qiniu.com/cdn/overview`,
            'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1`,
        }
    }).then(resp => {
        let res = JSON.parse(resp.body);
        let data = res.data;
        let content = [
            `实时消费：${formatMoney(data.cost)} ⏰`
            ,`可用额度：${formatMoney(data.balance)} 💵`
            ,`现金余额：${formatMoney(data.cash_reserve)} 💰`
        ];
        $.notify(`🥺${ScriptTitle}🥺`, '', content.join('\n'));
        $.done();
    }).catch(err => {
        $.done();
    });
}


/**
 * 获取七牛云cookie
 *
 */
function getCookies(){
    try {
        if ($request.headers && $request.url.indexOf('costoverview')!=-1) {
            console.log(JSON.stringify($request.headers), 'headers');
            let reqCookie = $request.headers['Cookie'];
            if (reqCookie && $.read(CookieKey) != reqCookie) {
                $.write(reqCookie, CookieKey);
                $.notify("", "", "写入" + ScriptTitle + "cookie成功 🎉");
            }        
        }  
    } catch (err) {
        $.notify(ScriptTitle + "写入cookie失败", "", "错误"+ JSON.stringify(err) +" ‼️")
    }
}

/**
 * 格式化钱数
 *
 * @param {Number} number 钱数
 * @return {String} ￥1.00 
 */
function formatMoney(num){
    return `￥${(parseInt(num) / 10000).toFixed(2)}`;
}

/* OpenApi */
/*********************************** API *************************************/
function ENV(){const e="undefined"!=typeof $task,t="undefined"!=typeof $loon,s="undefined"!=typeof $httpClient&&!t,o="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:e,isLoon:t,isSurge:s,isNode:"function"==typeof require&&!o,isJSBox:o,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule}}function HTTP(e={baseURL:""}){const{isQX:t,isLoon:s,isSurge:o,isScriptable:i,isNode:n}=ENV(),r=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;const u={};return["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"].forEach(l=>u[l.toLowerCase()]=(u=>(function(u,l){l="string"==typeof l?{url:l}:l;const a=e.baseURL;a&&!r.test(l.url||"")&&(l.url=a?a+l.url:l.url);const h=(l={...e,...l}).timeout,c={onRequest:()=>{},onResponse:e=>e,onTimeout:()=>{},...l.events};let f,d;if(c.onRequest(u,l),t)f=$task.fetch({method:u,...l});else if(s||o||n)f=new Promise((e,t)=>{(n?require("request"):$httpClient)[u.toLowerCase()](l,(s,o,i)=>{s?t(s):e({statusCode:o.status||o.statusCode,headers:o.headers,body:i})})});else if(i){const e=new Request(l.url);e.method=u,e.headers=l.headers,e.body=l.body,f=new Promise((t,s)=>{e.loadString().then(s=>{t({statusCode:e.response.statusCode,headers:e.response.headers,body:s})}).catch(e=>s(e))})}const $=h?new Promise((e,t)=>{d=setTimeout(()=>(c.onTimeout(),t(`${u} URL: ${l.url} exceeds the timeout ${h} ms`)),h)}):null;return($?Promise.race([$,f]).then(e=>(clearTimeout(d),e)):f).then(e=>c.onResponse(e))})(l,u))),u}function API(e="untitled",t=!1){const{isQX:s,isLoon:o,isSurge:i,isNode:n,isJSBox:r,isScriptable:u}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.node=(()=>{if(n){return{fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)}))(e,t)})}}initCache(){if(s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(o||i)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),n){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache,null,2);s&&$prefs.setValueForKey(e,this.name),(o||i)&&$persistentStore.write(e,this.name),n&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root,null,2),{flag:"w"},e=>console.log(e)))}write(e,t){if(this.log(`SET ${t}`),-1!==t.indexOf("#")){if(t=t.substr(1),i||o)return $persistentStore.write(e,t);if(s)return $prefs.setValueForKey(e,t);n&&(this.root[t]=e)}else this.cache[t]=e;this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),i||o?$persistentStore.read(e):s?$prefs.valueForKey(e):n?this.root[e]:void 0)}delete(e){if(this.log(`DELETE ${e}`),-1!==e.indexOf("#")){if(e=e.substr(1),i||o)return $persistentStore.write(null,e);if(s)return $prefs.removeValueForKey(e);n&&delete this.root[e]}else delete this.cache[e];this.persistCache()}notify(e,t="",l="",a={}){const h=a["open-url"],c=a["media-url"];if(s&&$notify(e,t,l,a),i&&$notification.post(e,t,l+`${c?"\n多媒体:"+c:""}`,{url:h}),o){let s={};h&&(s.openUrl=h),c&&(s.mediaUrl=c),"{}"===JSON.stringify(s)?$notification.post(e,t,l):$notification.post(e,t,l,s)}if(n||u){const s=l+(h?`\n点击跳转: ${h}`:"")+(c?`\n多媒体: ${c}`:"");if(r){require("push").schedule({title:e,body:(t?t+"\n":"")+s})}else console.log(`${e}\n${t}\n${s}\n\n`)}}log(e){this.debug&&console.log(`[${this.name}] LOG: ${e}`)}info(e){console.log(`[${this.name}] INFO: ${e}`)}error(e){console.log(`[${this.name}] ERROR: ${e}`)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){s||o||i?$done(e):n&&!r&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}}(e,t)}