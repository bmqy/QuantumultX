/**
 * @fileoverview Template to compose HTTP reqeuest.
 * OpenAPI
 * https://github.com/Peng-YM/QuanX/tree/master/Tools/OpenAPI
 */
const $ = API("SMMOHelper", true);
const $REQUEST = $request;
const $RESPONSE = $response || null;
//$.log($RESPONSE)
//const player_id = 0;
//const player_id = 977368;
//const player_id = 1008190;

checkPlayerInfo();

// 获取玩家信息
function checkPlayerInfo(){
    //const url = `https://api.simple-mmo.com/v1/player/info/${player_id}`;
    const url = `https://api.simple-mmo.com/v1/player/me`;
    const headers = {};
    const body = `api_key=6fbvIExz62BYWGHEp2DL852tpELUpqjLZnkEXClGckrhcJRCpw0lbDMGDMcMbFsx4z1gL8liPd6nkoBu`;
    const options = {
        url: url,
        headers: headers,
        body: body
    };
    $.http.post(options).then(async (response) => {
        let res = JSON.parse(response.body);
        //$.log(res)
        //player_id = res.id;
        if($RESPONSE){
            if(res.level%10===0){
                //console.log('read1:'+$.read('level'))
                $.read('level')!=res.level && $.notify(`${$.name}`, `玩家：${res.name}`, `${formatPlayerData(res)}`, { "media-url": `https://simple-mmo.com${res.avatar}` });
                //await updatePlayerBio(res)
            }
            $.write(res.level, 'level')
            //console.log('read2:'+$.read('level'))
        }
        $.done();
    }).catch((err)=>{
        $.log(err)
        $.done();
    });
}
// 格式化玩家数据
function formatPlayerData(data){
    let map = {
        level: '等级',
        guild: '公会',
        steps: '步数',
        'current_location': '位置',
    }
    let arr = [];
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            let txt = '';
            if(map[key]){
                if(key === 'guild'){
                    txt = data[key]['name'];
                } else if(key === 'current_location'){
                    txt = data[key]['name'];
                } else {
                    txt = data[key];
                }
                arr.push(`${map[key]}：${txt}`);
            }
        }
    }
    return arr.join('\n');
}

// 更新玩家bio信息
async function updatePlayerBio(data){
    const url = `https://simple-mmo.com/user/character/${data.id}/bio/submit`;
    const method = `POST`;
    const headers = {
        'Accept' : `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
        'Origin' : `https://simple-mmo.com`,
        'Accept-Encoding' : `gzip, deflate, br`,
        //'Cookie' : `XSRF-TOKEN=eyJpdiI6Ikg5ejArR2lERDFkRWJTRzk0dEx4dmc9PSIsInZhbHVlIjoiL0t3RGx5K0JqYW9rTlhmNXk3Uk9uUVRuZUhQSjNxQWRBTklXRzNZN3RmT1cyTUczalk4aEo3ZHp3d2EwVXFtOTZyNGlrZDVWekNXUWppb3lxUnRxNmxySzRhSWxLZ1hDMHNhK2Fxb0phTkR6TVhPNndLbHozN2pzUk9zTVNxUjkiLCJtYWMiOiJkMGU5N2ZhNDg2ZmVjYWRlMmEwYmNiZGQ5NTk5MDBjYTMwYjAzYzFlYzI0YjE2ZjZhODM2MjYzY2NlYjc1ZGI3IiwidGFnIjoiIn0%3D; laravelsession=eyJpdiI6IlJ6S0l5YzhpOEswdnc5UGNIdCtPWlE9PSIsInZhbHVlIjoiNkRXako0MkNZdS9KdG15UjJ3L0NCSVJQSlJDVXZCdnduVHNZU2JTenYvbDE3TFQxMEZOYXFJOStCMWs4b0cxbzE1SE0wSHh2UzJXdGtJOUlzelpDOXdkU0xteWdyYjU0b1JIYUxkcWwvR2d0Qmc2a0JFb2oxSXBqbzhvR0kxcWMiLCJtYWMiOiJmNzIzNGE0OGMzNGMyOTNiZmI5NWY1ZTVjMDA3NmVhZTNkY2Y0MzE1ZWU0M2Y3MWYyOThmMGZkNzVkMjNhNzIzIiwidGFnIjoiIn0%3D; d_h=true; show_gren=true; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IlFSOUZDbVVkN3QxaFhvaUFFdjQ5N2c9PSIsInZhbHVlIjoiTENqM1JYK09KQ01EMkwyRzhpUU42WE1RMVpSb29XVmhBL3c4TUc4WktFRmlTMnZvSTgzUyt2VDlMOE42OTFuaitSSHF0eWZGU0U0VW9Nc0FJQzg5bWRZZ2FBU1FVZkxIL1lGSnBDeGMxYTVxdXN1RlVOeHpDa3ZFVGZucGRUVWlwWkRKbTI2YkI5VUtBUGtiUER3Wm9jbXlydFRLck5xQ3QrMHVMRzhKT3ZmNlZ6dXNHcngzM3VBRWRqV04zcjB6cDhLSmt2c0lhcERkQmRrLzVmdmsyNzh5NFhaWElzUXI5U0x0UkJnMHNFaz0iLCJtYWMiOiJlZGVkNjkyMjZmY2I2MGIwODNiYWFmZTZjMTQ0NzczZDYwZDUyNzM5NzZjMzE1MTYyZTliZjkwZmU3MDliYzNiIiwidGFnIjoiIn0%3D`,
        'Content-Type' : `application/x-www-form-urlencoded`,
        'Host' : `simple-mmo.com`,
        'Connection' : `keep-alive`,
        'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`,
        'Referer' : `https://simple-mmo.com/user/view/${data.id}/bio?new_page_refresh=true`,
        'Accept-Language' : `zh-CN,zh-Hans;q=0.9`
    };
    const body = `_token=cKJWLDImMV57W9Y1EifprXpDCT3J0Y4TbBhKdppv&content=This+is+the+game+that+you+can%27t+win.%0D%0A%0D%0A%0D%0A%5B%5BQueen+Eggo%5D%5D+测试测试+${data.level}`;

    const options = {
        url: url,
        method: method,
        headers: headers,
        body: body
    };

    await $.http.post(options).then((response) => {
        let res = JSON.parse(response.body);
        $.log(response.statusCode + "\n\n" + res);
    });
}

function ENV() { const e = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: "undefined" != typeof $task, isLoon: "undefined" != typeof $loon, isSurge: "undefined" != typeof $httpClient && "undefined" != typeof $utils, isBrowser: "undefined" != typeof document, isNode: "function" == typeof require && !e, isJSBox: e, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(e = { baseURL: "" }) { const { isQX: t, isLoon: s, isSurge: o, isScriptable: n, isNode: i, isBrowser: r } = ENV(), u = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/; const a = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(h => a[h.toLowerCase()] = (a => (function (a, h) { h = "string" == typeof h ? { url: h } : h; const d = e.baseURL; d && !u.test(h.url || "") && (h.url = d ? d + h.url : h.url), h.body && h.headers && !h.headers["Content-Type"] && (h.headers["Content-Type"] = "application/x-www-form-urlencoded"); const l = (h = { ...e, ...h }).timeout, c = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...h.events }; let f, p; if (c.onRequest(a, h), t) f = $task.fetch({ method: a, ...h }); else if (s || o || i) f = new Promise((e, t) => { (i ? require("request") : $httpClient)[a.toLowerCase()](h, (s, o, n) => { s ? t(s) : e({ statusCode: o.status || o.statusCode, headers: o.headers, body: n }) }) }); else if (n) { const e = new Request(h.url); e.method = a, e.headers = h.headers, e.body = h.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } else r && (f = new Promise((e, t) => { fetch(h.url, { method: a, headers: h.headers, body: h.body }).then(e => e.json()).then(t => e({ statusCode: t.status, headers: t.headers, body: t.data })).catch(t) })); const y = l ? new Promise((e, t) => { p = setTimeout(() => (c.onTimeout(), t(`${a} URL: ${h.url} exceeds the timeout ${l} ms`)), l) }) : null; return (y ? Promise.race([y, f]).then(e => (clearTimeout(p), e)) : f).then(e => c.onResponse(e)) })(h, a))), a } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: o, isSurge: n, isNode: i, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (i) { return { fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (e) { return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (o || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), i) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (o || n) && $persistentStore.write(e, this.name), i && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || o) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); i && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || o ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : i ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || o) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); i && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", a = "", h = {}) { const d = h["open-url"], l = h["media-url"]; if (s && $notify(e, t, a, h), n && $notification.post(e, t, a + `${l ? "\n多媒体:" + l : ""}`, { url: d }), o) { let s = {}; d && (s.openUrl = d), l && (s.mediaUrl = l), "{}" === JSON.stringify(s) ? $notification.post(e, t, a) : $notification.post(e, t, a, s) } if (i || u) { const s = a + (d ? `\n点击跳转: ${d}` : "") + (l ? `\n多媒体: ${l}` : ""); if (r) { require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { s || o || n ? $done(e) : i && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }
