const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const server = require('http').Server(app)
const request = require('request')
var log_access = []
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/', (req, res) => {
    getipserver((body)=>{
        res.send("IP Client: " + getClientAddress(req) + " - IP Server: " + body + " - Developed by _Neiht")
    })
})

app.post('/Bot-React', (req, res) => {
    var arr_type_react = req.body.arr_type_react
    for (var i = 0; i < req.body.arr_pid.length; i++) {
        ! function(i, arr_type_react) {
            setTimeout(function() {
                CReact(arr_type_react, req.body.arr_pid[i], req.body.access_token, req.body.user)
            }, i * req.body.time_delay)
        }
        (i, arr_type_react)
    }
    res.json({
        status: 200,
        type: 'Bot React',
        type_reaction: req.body.arr_type_react,
        post_id: req.body.arr_pid,
        total_post_id: req.body.arr_pid.length,
        time_delay: req.body.time_delay,
        developer: '_Neiht'
    })
})

app.post('/Bot-Exchange-React', (req, res) => {
    var arr_type_react = req.body.arr_type_react
    for (var i = 0; i < req.body.arr_pid.length; i++) {
        ! function(i, arr_type_react) {
            setTimeout(function() {
                CReact(arr_type_react[i], req.body.arr_pid[i], req.body.access_token, req.body.user)
            }, i * req.body.time_delay)
        }
        (i, arr_type_react)
    }
    res.json({
        status: 200,
        type: 'Bot React',
        type_reaction: req.body.arr_type_react,
        post_id: req.body.arr_pid,
        total_post_id: req.body.arr_pid.length,
        time_delay: req.body.time_delay,
        developer: '_Neiht'
    })
})
app.post('/Bot-Cmt', (req, res) => {
    var arr_param = req.body.arr_param
    for (var i = 0; i < req.body.arr_pid.length; i++) {
        ! function(i, arr_cmt) {
            setTimeout(function() {
                BComment(req.body.arr_param[i], req.body.arr_pid[i], req.body.access_token, req.body.user)
            }, i * req.body.time_delay)
        }
        (i)
    }
    res.json({
        status: 200,
        type: 'Bot Comment',
        type_reaction: req.body.arr_type_react,
        post_id: req.body.arr_pid,
        total_post_id: req.body.arr_pid.length,
        time_delay: req.body.time_delay,
        developer: '_Neiht'
    })
})

function CReact(arr_type_react, pid, access_token, user) {
    var type_react = arr_type_react[Math.floor(Math.random() * arr_type_react.length)]
    var data = 'debug=all&format=json&method=post&pretty=0&suppress_http_code=1&type=' + type_react
    request({
        headers: {
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://developers.facebook.com',
            'referer': 'https://developers.facebook.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
            'content-length': data.length,
        },
        uri: 'https://graph.facebook.com/v3.1/' + pid + '/reactions?access_token=' + access_token,
        body: data,
        method: 'POST'
    }, function(err, res, body) {
        var obj = JSON.parse(body)
        if (obj.success != undefined) {
            console.log(user['uid'] + ' => ' + type_react + ' => ' + pid)
        } else {
            console.log(user['uid'] + ' => ' + obj.error.message + ' | ' + pid);
        }
    });
}
function BComment(param, pid, access_token, user) {
    var data = 'debug=all&format=json&method=post&pretty=0&suppress_http_code=1' + encodeURI(param)
    request({
        headers: {
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://developers.facebook.com',
            'referer': 'https://developers.facebook.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
            'content-length': data.length,
        },
        uri: 'https://graph.facebook.com/v3.1/' + pid + '/comments?access_token=' + access_token,
        body: data,
        method: 'POST'
    }, function(err, res, body) {
        var obj = JSON.parse(body)
        if (obj.id != undefined) {
            console.log(user['uid'] + ' => ' + obj.id + ' => ' + pid + ' | ' + param)
        } else {
            console.log(user['uid'] + ' => ' + obj.error.message + ' | ' + pid);
        }
    });
}

function React_Android(my_uid, target_uid, token, post_id, camxuc) {
    var buff = new Buffer('feedback:'+post_id);
    var feedback_id = buff.toString('base64');
    var tracking = '{\"top_level_post_id\":\"' + post_id + '\",\"tl_objid\":\"' + post_id + '\",\"throwback_story_fbid\":\"' + post_id + '\",\"profile_id\":\"' + target_uid + '\",\"profile_relationship_type\":2,\"actrs\":\"' + target_uid + '\"}","{\"image_loading_state\":3,\"time_since_fetched\":'+new Date().getTime()+',\"radio_type\":\"wifi-none\",\"client_viewstate_position\":0}';
    var json = JSON.stringify(tracking);
    var data = 'doc_id=1664629946906286&method=post&locale=vi_VN&pretty=false&format=json&variables={"0":{"tracking":['+json+'],"feedback_source":"native_timeline","feedback_reaction":' + camxuc + ',"client_mutation_id":"ce52e651-5e23-4068-8367-696b8e3f045f","nectar_module":"timeline_ufi","actor_id":"' + my_uid + '","feedback_id":"' + feedback_id + '","action_timestamp":'+new Date().getTime()+'}}&fb_api_req_friendly_name=ViewerReactionsMutation&fb_api_caller_class=graphservice';
    request({
        headers: {
            'X-FB-SIM-HNI': '45204',
            'X-FB-Net-HNI': '45204',
            'Authorization': 'OAuth ' + token,
            'Host': 'graph.facebook.com',
            'X-FB-Connection-Type': 'WIFI',
            'User-Agent': '[FBAN/FB4A;FBAV/161.0.0.35.93;FBBV/94117327;FBDM/{density=1.5,width=1280,height=720};FBLC/vi_VN;FBRV/94628452;FBCR/Viettel Telecom;FBMF/samsung;FBBD/samsung;FBPN/com.facebook.katana;FBDV/GT-I9506;FBSV/4.4.2;FBOP/1;FBCA/x86:armeabi-v7a;]',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-FB-Friendly-Name': 'ViewerReactionsMutation',
            'X-FB-HTTP-Engine': 'Liger',
            'Connection': 'close',
        },
        uri: 'https://graph.facebook.com/graphql',
        body: data,
        method: 'POST'
    }, function(err, res, body) {
        console.log(body);
    });
}

function getipserver(callback){
    request('http://dynupdate.no-ip.com/ip.php',(err,res,body) => {
        callback(body)
    })
}

function in_array(needle, haystack) {
    return haystack.indexOf(needle) !== -1;
}
getClientAddress = function(req) {
    return (req.headers['x-forwarded-for'] || '').split(',')[0] ||
        req.connection.remoteAddress;
}
var port = process.env.PORT || 8080,
    ip = process.env.IP || '0.0.0.0';
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
