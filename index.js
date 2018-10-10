const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const server = require('http').Server(app)
const request = require('request')
var log_access = []
var ip_client = ['116.110.9.87', '14.232.213.61', '125.212.220.148', '42.112.30.39']
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.get('/', (req, res) => {
    request.get('http://dynupdate.no-ip.com/ip.php','',function(err,res,body){
        console.log(body);
    });
})

function MaxVIPShare(MAXID, MAXTOKEN) {
    request('https://graph.facebook.com/' + MAXID + '/sharedposts?method=post&access_token=' + MAXTOKEN, (error, response, body) => {
        console.log(body)
    })
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
