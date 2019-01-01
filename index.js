const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const server = require('http').Server(app)
const request = require('request')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/*', (req, res) => {
    res.send('Hello Bitch ^^')
})

app.post('/Reg-Acc-API', (req, res) => {
    reg_api_account(req.body, result => {
        res.json(result)
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
function getBetween(content,start,end){
    let r = content.split(start);
    if(r[1]){
        r = r[1].split(end);
        return r[0];
    }
    return 0;
}
