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

app.post('/share-to-group-android', (req, res) => {
    (async () => {
    	let source = req.body
		let ip_server = await getIpServer()
	    apiAndroid_shareToGroup(ip_server, source.accessToken, source.groupId, source.Message, source.pId, source.target_uId, source.uId, source.base64Id, (result) =>{
	    	console.log(result)
	    	res.json(result);
	    });
	})();
})
app.post('/share-to-group-graph', (req, res) => {
    (async () => {
    	let source = req.body
		let ip_server = await getIpServer()
	    apiGraph_shareToGroup(ip_server, source.accessToken, source.groupId, source.Message, source.link, (result) =>{
	    	console.log(result)
	    	res.json(result);
	    });
	})();
})

let port = process.env.PORT || 8080,
    ip = process.env.IP || '0.0.0.0';
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);



////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////
 function apiAndroid_shareToGroup(ip_server, accessToken, groupId, Message, pId, target_uId, uId, base64Id, callback){
 	let tracking = `"{\"mf_story_key\":\"${pId}\",\"top_level_post_id\":\"${pId}\",\"tl_objid\":\"${pId}\",\"content_owner_id_new\":\"${target_uId}\",\"throwback_story_fbid\":\"${pId}\",\"story_location\":4,\"profile_id\":\"${target_uId}\",\"profile_relationship_type\":2,\"actrs\":\"${target_uId}\"}","{\"image_loading_state\":0,\"radio_type\":\"wifi-none\"}"`
 	let json_tracking = JSON.stringify(tracking);
 	let data_share = `doc_id=1773807979346933&method=post&locale=vi_VN&pretty=false&format=json&variables={"max_reactors":15,"max_comment_replies":3,"enable_private_reply":"true","enable_ranked_replies":"true","enable_comment_replies_most_recent":"true","enable_comment_reactions_icons":"true","enable_comment_shares":"false","enable_comment_reactions":"true","93":"true","88":"false","85":"false","79":135,"78":203,"91":"false","77":100,"92":"false","83":"contain-fit","74":"image/x-auto","51":1280,"106":"false","34":"feed","59":"false","107":"false","37":60,"57":640,"39":"1.5","66":{"styles_id":"d1ced8b8cb4e7f092e49e53e97fa753f","pixel_ratio":1.5},"38":"false","include_comments_disabled_fields":"false","52":662,"53":1280,"73":60,"54":2048,"4":{"video_start_time_ms":0,"sponsor_relationship":null,"sponsor_id":null,"referenced_sticker_id":null,"place_attachment_setting":"SHOW_ATTACHMENT","composer_source_surface":"timeline","composer_session_events_log":{"number_of_keystrokes":2,"number_of_copy_pastes":0,"composition_duration":53},"reshare_original_post":"RESHARE_ORIGINAL_POST","client_mutation_id":"2121454998137106","composer_type":"share","source":"MOBILE","camera_post_context":{"source":"COMPOSER","platform":"FACEBOOK","deduplication_id":"737b7ba8-7b4e-444f-86d4-c31c33ed9d5b"},"attachments":[{"link":{"shared_from_post_id":"${base64Id}","internal_linkable_id":"${base64Id}"}}],"audience":{"to_id":"${groupId}"},"ads_animator_metadata":null,"composer_entry_picker":"shareButton","actor_id":"${uId}","connection_class":"EXCELLENT","action_timestamp":1543559979,"is_boost_intended":false,"nectar_module":"timeline_ufi","message":{"text":"${Message}","ranges":[]},"coordinates":{"timestamp":1543509528000,"longitude":105.7099217,"latitude":20.9794367,"accuracy":10},"logging":{"ref":"shareButton:TIMELINE","composer_session_id":"ee115e75-0e8b-4e3a-a652-717fa053bbd6"},"direct_share_status":null,"past_time":{"time_since_original_post":1},"idempotence_token":null,"tracking":[${json_tracking}],"is_tags_user_selected":false,"is_group_linking_post":false,"is_throwback_post":"NOT_THROWBACK_POST"},"70":3,"55":427,"50":2048,"63":"image/jpeg","56":2048,"36":720,"69":60}&fb_api_req_friendly_name=ComposerStoryCreateMutation&fb_api_caller_class=graphservice&fb_api_analytics_tags=["GraphServices"]`
	request({
        headers: {
            'X-FB-SIM-HNI': '45204',
            'X-FB-Net-HNI': '45204',
            'Authorization': 'OAuth ' + accessToken,
            'Host': 'graph.facebook.com',
            'X-FB-Connection-Type': 'WIFI',
            'User-Agent': '[FBAN/FB4A;FBAV/161.0.0.35.93;FBBV/94117327;FBDM/{density=1.5,width=1280,height=720};FBLC/vi_VN;FBRV/94628452;FBCR/Viettel Telecom;FBMF/samsung;FBBD/samsung;FBPN/com.facebook.katana;FBDV/GT-I9506;FBSV/4.4.2;FBOP/1;FBCA/x86:armeabi-v7a;]',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-FB-Friendly-Name': 'ComposerStoryCreateMutation',
            'X-FB-Connection-Quality': 'EXCELLENT',
            'X-FB-HTTP-Engine': 'Liger',
            'Connection': 'close',
        },
        uri: 'https://graph.facebook.com/graphql',
        body: data_share,
        method: 'POST'
    }, function(err, res, body) {
        if (err) return err.toString()
    	if (body.indexOf('errors') == -1) {
    		let url = getBetween(body,'"url":"','","display_time_block_info"')
    		url = url.replace(/\\/g, "")
    		callback({
    			error: 0,
    			url: url,
    			ip_server: ip_server,
    			message: 'Chia sẻ thành công'
    		})
    	} else {
    		callback({
    			error: 1,
    			ip_server: ip_server,
    			message: 'Không thể chia sẻ bài viết',
    		})
    	}
    })
}
function apiGraph_shareToGroup(ip_server, accessToken, groupId, Message, link, callback){
	request(`https://graph.facebook.com/${groupId}/feed?${['method=post', 'message=' + encodeURIComponent(Message), 'link=' + encodeURIComponent(link), 'pretty=0', 'sdk=joey', '_=' + Date.now(), 'access_token=' + accessToken].join('&')}`, (err, res, body) => {
        if (err) return err.toString()
        let json_data = JSON.parse(body)
    	if (typeof json_data == 'object') {
    		let url = 'https://www.facebook.com/' + json_data.id
    		callback({
    			error: 0,
    			url: url,
    			ip_server: ip_server,
    			message: 'Chia sẻ thành công'
    		})
    	} else {
    		callback({
    			error: 1,
    			ip_server: ip_server,
    			message: 'Không thể chia sẻ bài viết',
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
