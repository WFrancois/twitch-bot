const config = require('config');
const request = require('request');

module.exports.isOnline = function(channelName) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.twitch.tv/helix/streams?user_login=' + channelName,
            headers: {
                'Client-ID': config.get('twitch.client_id')
            },
            json: true
        }, function(error, response, body) {
            if(error) {
                return reject(error);
            }

            resolve(!!body.data[0]);
        });
    });
};
