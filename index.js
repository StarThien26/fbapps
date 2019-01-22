const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const server = require('http').Server(app)
const request = require('request')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/', (req, res) => {
    res.send('Anh Rat Chao Em^^');
})
app.get('/get-info', (req, res) => {
    (async () => {
        let ip_client = await getIpClient(req);
        let ip_server = await getIpServer();
        res.json({
            ip_client: ip,
            ip_server: ip_server
        })
    })();
})

app.post('/Reg-Acc-API', (req, res) => {
    reg_api_account(req.body, result => {
        res.json(result)
    })
})
app.post('/Change-Avatar-API', (req, res) => {
    change_avatar_batch(req.body, result => {
        res.send(result)
    })
})

app.post('/Change-Email-API', (req, res) => {
    change_api_email(req.body, result => {
        res.json(result)
    })
})
app.post('/Verify-Account-API', (req, res) => {
    verify_api_account(req.body, result => {
        res.json(result)
    })
})
app.post('/Add-Suggest-Friend-API', (req, res) => {
    getSuggestFriendList(req.body.access_token, _=> {
        add_friend_suggest_api(_, req.body.limit, __=> {
            res.json(__);
        })
    })
})
let port = process.env.PORT || 9098,
    ip = process.env.IP || '0.0.0.0';
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

////////////////////////////////////////////////////////
function getIpClient(req) {
    return new Promise ((resolve, reject) => {
        resolve((req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress);
    })
}
/////////////////////////////////////////////////////////////
function reg_api_account(data, callback){
    let data_reg = data.params;
    request({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'b-api.facebook.com',
            'X-FB-Connection-Type': 'WIFI',
            'User-Agent': data.agent,
            'X-FB-Net-HNI': '45204',
            'X-FB-Connection-Quality': 'EXCELLENT',
            'X-FB-Friendly-Name': 'registerAccount',
            'X-FB-HTTP-Engine': 'Liger',
            'Connection': 'keep-alive',
            'Content-Length': data.params_lenght,
        },
        uri: data.url,
        body: data_reg,
        method: 'POST'
    }, function(err, res, body) {
        if (err) return err.toString()
        let json_data = JSON.parse(body)
        if (typeof json_data == 'object') {
            callback(json_data)
        } else {
            callback('error')
        }
    })
}
function change_api_email(data, callback){
    let data_change = data.params;
    request({
        headers: {
            'X-FB-Connection-Bandwidth': '3392868',
            'X-FB-SIM-HNI': '45204',
            'X-FB-Net-HNI': '45204',
            'Authorization': 'OAuth ' + data.access_token,
            'X-FB-Connection-Quality': 'EXCELLENT',
            'Host': 'api.facebook.com',
            'X-FB-Connection-Type': 'WIFI',
            'User-Agent': data.agent,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-FB-Friendly-Name':' editRegistrationContactpoint',
            'X-FB-HTTP-Engine': 'Liger',
            'Connection': 'keep-alive',
            'Content-Length': data.params_lenght,
        },
        uri: data.url,
        body: data_change,
        method: 'POST'
    }, function(err, res, body) {
        console.log('change '+body)
        if (err) return err.toString()
        if(body.indexOf("true") != -1) {
            callback({
                'success': 'true',
            })
        } else if(body.indexOf("checkpoint")){
            callback({
                'success': 'false',
                'e_msg' : 'Checkpoint!'
            })
        }
    })
}
function verify_api_account(data, callback){
    let verify = data.params;
    request({
        headers: {
            'X-FB-Connection-Bandwidth': '3392868',
            'X-FB-SIM-HNI': '45204',
            'X-FB-Net-HNI': '45204',
            'Authorization': 'OAuth ' + data.access_token,
            'X-FB-Connection-Quality': 'EXCELLENT',
            'Host': 'api.facebook.com',
            'X-FB-Connection-Type': 'WIFI',
            'User-Agent': data.agent,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-FB-Friendly-Name': 'confirmContactpoint',
            'X-FB-HTTP-Engine': 'Liger',
            'Connection': 'keep-alive',
            'Content-Length': data.params_lenght,
        },
        uri: data.url,
        body: verify,
        method: 'POST'
    }, function(err, res, body) {
        console.log('verify '+body)
        if (err) return err.toString()
        if(body.indexOf("true") != -1) {
            callback({
                'success': 'true',
            })
        } else if(body.indexOf("checkpoint")){
            callback({
                'success': 'false',
                'e_msg' : 'Checkpoint!'
            })
        }
    })
}
function upload_avatar(data, callback){
    request({
        headers: {
            'X-FB-Connection-Bandwidth': '1351493',
            'X-FB-SIM-HNI': '45204',
            'X-FB-Net-HNI': '45204',
            'Authorization': 'OAuth ' + data.access_token,
            'X-FB-Connection-Quality': 'GOOD',
            'Host': 'graph.facebook.com',
            'X-FB-Connection-Type': 'WIFI',
            'User-Agent': data.agent,
            'X-FB-Friendly-Name': 'upload-photo',
            'X-FB-HTTP-Engine': 'Liger',
            'Connection': 'keep-alive',
            'Content-Length': data.params_lenght,
        },
        uri: data.url,
        body: data.params,
        method: 'POST'
    }, function(err, res, body) {
        console.log('upload_avt '+body)
        if (err) return err.toString()
        if(body.indexOf("id") != -1) {
            let json_data = JSON.parse(body)
            callback(json_data)
        } else if(body.indexOf("checkpoint")){
            callback({
                'success': 'false',
                'e_msg' : 'Checkpoint!'
            })
        } else {
            callback({
                'success': 'false',
                'e_msg' : 'KXD'
            })
        }
    })
}
function change_avatar(data, c, callback){
    let param = 'batch=%5B%7B%22method%22%3A%22POST%22%2C%22body%22%3A%22qn%3Dde1c96ec-41ac-4c22-adcb-b47dd34284b4%26time_since_original_post%3D5%26scaled_crop_rect%3D%257B%2522y%2522%253A0%252C%2522height%2522%253A1%252C%2522width%2522%253A1%252C%2522x%2522%253A0%257D%26profile_pic_method%3Dcamera_roll%26has_umg%3Dfalse%26set_profile_photo_shield%3Dfalse%26locale%3Dvi_VN%26client_country_code%3DVN%26fb_api_req_friendly_name%3Dpublish-photo%22%2C%22name%22%3A%22publish%22%2C%22omit_response_on_success%22%3Afalse%2C%22relative_url%22%3A%22100021765070366%2Fpicture%2F'+c.id+'%22%7D%5D&fb_api_caller_class=com.facebook.photos.upload.protocol.PhotoPublisher&fb_api_req_friendly_name=single_photo_publish';
    request({
        headers: {
            'X-FB-SIM-HNI': '45204',
            'X-FB-Net-HNI': '45204',
            'Authorization': 'OAuth ' + data.access_token,
            'Host': 'graph.facebook.com',
            'X-FB-Connection-Type': 'WIFI',
            'User-Agent': data.agent,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-FB-HTTP-Engine': 'Liger',
            'Connection': 'keep-alive',
        },
        uri: data.url2,
        body: param,
        method: 'POST'
    }, function(err, res, body) {
        console.log('change '+body)
        if (err) return err.toString()
        if(body.indexOf("200") != -1) {
            callback(body)
        } else if(body.indexOf("checkpoint")){
            callback({
                'success': 'false',
                'e_msg' : 'Checkpoint!'
            })
        } else {
            callback({
                'success': 'false',
                'e_msg' : 'KXD'
            })
        }
    })
}
function change_avatar_batch(data, callback){
    let param = 'batch=[%7B%22name%22%3A%22photos%22%2C%22method%22%3A%22POST%22%2C%22relative_url%22%3A%22%2Fme%2Fphotos%22%2C%22omit_response_on_success%22%3Afalse%2C%22body%22%3A%22url%3D'+data.url_photo+'%26published%3D0%22%7D%2C%7B%22method%22%3A%22POST%22%2C%22relative_url%22%3A%22%2Fme%2Fpicture%2F%7Bresult%3Dphotos%3A%24.id%7D%22%2C+%22body%22%3A%22scaled_crop_rect%3D%257B%2522x%2522%253A0%252C%2522y%2522%253A0%252C%2522width%2522%253A1%252C%2522height%2522%253A1%257D%22%7D]&access_token='+data.access_token;
    request({
        headers: {
            'X-FB-SIM-HNI': '45204',
            'X-FB-Net-HNI': '45204',
            'Authorization': 'OAuth ' + data.access_token,
            'Host': 'graph.facebook.com',
            'X-FB-Connection-Type': 'WIFI',
            'User-Agent': data.agent,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-FB-HTTP-Engine': 'Liger',
            'Connection': 'keep-alive',
        },
        uri: data.url,
        body: param,
        method: 'POST'
    }, function(err, res, body) {
        console.log('change '+body)
        if (err) return err.toString()
        if(body.indexOf("id") != -1) {
            callback(body)
        } else if(body.indexOf("checkpoint")){
            callback({
                'success': 'false',
                'e_msg' : 'Checkpoint!'
            })
        } else {
            callback({
                'success': 'false',
                'e_msg' : 'KXD'
            })
        }
    })
}
function getSuggestFriendList(access_token, callback) {
        request(`https://graph.facebook.com/v2.8/graphql?access_token=${access_token}&query_id=10153105105551729&method=get&strip_nulls=true&limit=5&query_params=[]&fb_api_req_friendly_name=PeopleYouMayKnowQuery&fb_api_caller_class=com.facebook.friending.jewel.FriendRequestsFragment`, (err, res, body) => {
        if (err) return err.toString()
        let json_data = JSON.parse(body)
        if (typeof json_data == 'object') {
            callback(
                {
                    'uid': json_data.viewer.people_you_may_know.nodes.map(el => el.id),
                    'access_token': access_token,
                }
            )
        } else {
            callback('error')
        }
    })
}
function add_friend_suggest_api(data, limit, callback){
    var l = 0;
    if (data.uid.length == 0) {
        callback({
            'success': 'false',
            'e_msg': 'Không có bạn bè đề xuất',
        })
        return !1;
    }
    data.uid.forEach((uid) => {
        if(l >= limit) return 0;
           request(`https://graph.facebook.com/me/friends/${uid}?access_token=${data.access_token}&method=post`, (err, res, body) => {
               console.log(body)
               l++;
        })
    })
    callback({
        'success': 'true',
        'e_msg': 'Đã add '+limit,
    })
}
function getIpClient(req) {
    return new Promise ((resolve, reject) => {
        resolve((req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress);
    })
}
function getIpServer() {
    return new Promise ((resolve,reject) => {
        request('http://dynupdate.no-ip.com/ip.php', (err,res,body) => {
            if (err) return reject(err.toString())
            try {
                resolve(body)
            } catch (e) {
                reject(e.toString())
            }
        })
    })
}
function getBetween(content,start,end){
    let r = content.split(start);
    if(r[1]){
        r = r[1].split(end);
        return r[0];
    }
    return 0;
}
